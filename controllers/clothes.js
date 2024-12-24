/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-24
 */

const fs = require('fs');
const path = require('path');
const {User, Clothes} = require('../models');
const {send_preprocess_image_request, send_virtual_fitting} =
    require('./flask');
const {ImageToBase64} = require('./utils/file_utils')

// Image Upload Controller
exports.upload_image = async (req, res, next) => {
  try {
    // Get User Information from JWT
    const user_id = req.user.user_id;  // Using id in JWT Decoded Information

    // Load datas from request body
    const {
      base64Image,
      clothingName,
      rating,
      clothingType,
      clothingStyle,
      imageMemo,
      includePoint,
      excludePoint
    } = req.body;

    if (!base64Image || !clothingName || !rating || !clothingType ||
        !clothingStyle || !includePoint || !excludePoint) {
      return res.status(400).json({
        error:
            'Missing required fields: base64Image, clothingName, rating, clothingType, clothingStyle, imageMemo, includePoint, excludePoint.'
      });
    }

    const input_point = [
      [includePoint['x'], includePoint['y']],
      [excludePoint['x'], excludePoint['y']]
    ];

    // Image Name Settings
    const base_name = `${Date.now()}-${user_id}`;

    // Send an image to a Flask server
    console.log('[upload_image] Sending image to Flask for preprocessing...');
    const response_data = await send_preprocess_image_request(
        base64Image, input_point, base_name);

    if (!response_data) {
      throw new Error('Flask preprocessing failed.');
    }

    console.log(
        '[upload_image] Flask preprocessing successful. Saving to DB...');

    // Store data in Clothes table if Flask preprocessing is successful
    try {
      await Clothes.create({
        image_name: `${base_name}`,
        clothes_name: clothingName,
        rating: rating,
        clothes_type: clothingType,
        clothes_style: clothingStyle,
        memo: imageMemo,
        include_point: includePoint,
        exclude_point: excludePoint,
        user_id,
      });
      console.log('[upload_image] MySQL successfully saved clothes.');
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json(
            {error: 'Invalid data', details: error.errors});
      }
      throw error;
    }

    // Send results to Flutter
    return res.status(200).json({
      message: 'Image uploaded and processed successfully!',
      response: response_data,
    });
  } catch (error) {
    console.error('[UPLOAD ERROR]', error);
    return res.status(500).json({
      error: 'Image upload and processing failed.',
      details: error.message,
    });
  }
};

// Virtual Fitting Controller
exports.virtual_fitting = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;

    const {cloth_image_name, person_base64_image} = req.body;

    if (!cloth_image_name) {
      return res.status(400).json({
        error: 'Missing required fields: clothImageName.',
      });
    }

    // cloth, image directory settings
    const load_dir = path.join(__dirname, '../sam/results');
    let person_image_path;

    // When you first register or change an image
    if (person_base64_image) {
      // Save images before fitting (Base64 decoding)
      // Base64 Decoding
      const image_buffer = Buffer.from(person_base64_image, 'base64');

      // Set the default image storage path
      const save_dir = path.join(__dirname, '../sam/results/image');
      const output_name = `user-${user_id}`;
      const output_path = path.join(save_dir, `${output_name}.jpg`);

      // Verifying the existence of a stored directory
      if (!fs.existsSync(save_dir)) {
        fs.mkdirSync(save_dir, {recursive: true});
      }

      // Save result image
      fs.writeFileSync(output_path, image_buffer);
      console.log(`[virtual_fitting] Saved new person image to ${
          output_path} before fitting`);

      // Update user person image
      await User.update(
          {person_image: output_name},  // Save relative path to profile_photo
          {where: {user_id}}            // Condition: user_id matches
      );
      console.log(
          `[virtual_fitting] Updated person_image for user_id ${user_id}`);

    } else {  // When using an existing image
      const user = await User.findOne({
        where: {user_id},
        attributes: ['person_image'],
      });
      if (!user || !user.person_image) {
        return res.status(404).json({
          error: 'The upper body image is not registered for the user.',
        });
      }
      person_image_path = path.join(load_dir, `image/${user.person_image}.jpg`);
    }

    const cloth_image_path =
        path.join(load_dir, `cloth/${cloth_image_name}.jpg`);

    // Converting to base64Image
    const base64_image_person = (person_base64_image) ?
        person_base64_image :
        ImageToBase64(person_image_path);
    const base64_image_cloth = ImageToBase64(cloth_image_path);

    if (!base64_image_person || !base64_image_cloth) {
      return res.status(500).json({
        error: 'Failed to process base64 images for virtual fitting.',
      });
    }

    // Create jsonPayload
    const json_payload = {
      person: base64_image_person,
      cloth: base64_image_cloth,
    };

    console.log(
        '[virtual_fitting] Sending virtual fitting request to Flask...');
    const response_data = await send_virtual_fitting(json_payload, user_id);

    if (!response_data) {
      throw new Error('Virtual fitting request failed.');
    }
    console.log(
        '[virtual_fitting] Virtual fitting successful. Returning response to Flutter...');

    // Save the virtualized base64 image
    const base64_image = response_data.result;

    // Send results to Flutter
    return res.status(200).json({
      message: 'Virtual fitting completed successfully!',
      base64_image,
    });
  } catch (error) {
    console.error('[virtual_fitting_error]', error);
    return res.status(500).json({
      error: 'Virtual fitting failed.',
      details: error.message,
    });
  }
};

// GET /clothes/info API 구현
exports.images_info = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;

    // Look up clotes matching user_id in DB
    const clothes = await Clothes.findAll({
      where: {user_id},
      attributes: [
        'image_name', 'clothes_name', 'rating', 'clothes_type', 'clothes_style',
        'memo', 'clothes_id'
      ],  // Import only required columns
    });

    if (!clothes || clothes.length === 0) {
      return res.status(404).json({
        error: 'No clothing information found for the user.',
      });
    }

    // Set the Cloth directory path
    const cloth_dir = path.join(__dirname, '../sam/results/cloth');

    // Create new structures, including images and data, while traversing the
    // clotes array
    const clothes_with_images = clothes.map((item) => {
      const image_path = path.join(cloth_dir, `${item.image_name}.jpg`);
      let base64_image = null;

      // base64 conversion if the image exists
      if (fs.existsSync(image_path)) {
        base64_image = ImageToBase64(image_path);
      } else {
        console.warn(`Image file not found: ${item.image_name}`);
      }

      // Create a new object
      return {
        image_name: item.image_name,
        base64_image,  // Add base64 Converted Image
        clothes_name: item.clothes_name,
        rating: item.rating,
        clothes_type: item.clothes_type,
        clothes_style: item.clothes_style,
        memo: item.memo,
        clothes_id: item.clothes_id
      };
    });

    // Look up user information that matches user_id in DB
    const user = await User.findOne({
      where: {user_id},
      attributes: ['person_image'],  // Import only person_image
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found.',
      });
    }
    // person_image path processing
    const person_image = user.person_image;
    let person_base64_image = null;  // base64_image is null for default image

    if (person_image && person_image != 'default_image') {
      // If you have a registered user image in the DB
      const person_image_path =
          path.join(__dirname, `../sam/results/image/${person_image}.jpg`);
      // User is using the saved person image from MySQL.
      if (fs.existsSync(person_image_path)) {
        person_base64_image = ImageToBase64(person_image_path);
      }
      // else : Person image file not found: ${person_image_path}`
    }

    // Return clothes and person_base64_image
    return res.status(200).json({
      clothes: clothes_with_images,  // Array containing images and data
      person_base64_image: person_base64_image,  // Null for default image
    });

  } catch (error) {
    console.error('[IMAGES INFO ERROR]', error);
    return res.status(500).json({
      error: 'Failed to retrieve clothing information.',
      details: error.message,
    });
  }
};