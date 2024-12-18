/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-18
 */

const fs = require('fs');
const path = require('path');
const {User, Clothes} = require('../models');
const {Op} = require('sequelize');

function ImageToBase64(imagePath) {
  try {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`File not found: ${imagePath}`);
    }
    const imageBuffer = fs.readFileSync(imagePath);
    return Buffer.from(imageBuffer).toString('base64');
  } catch (error) {
    console.error(`Error processing file at ${imagePath}:`, error.message);
    throw error;
  }
}

exports.register_clothes = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;

    const {clothes_id, post_name, sale_type, price, bank_account} = req.body;

    if (!user_id || !clothes_id || !post_name || !sale_type || !price ||
        !bank_account) {
      return res.status(400).json({
        error:
            'Missing required fields: clothes_id, post_name, sale_type, price, or bank_account.',
      });
    }

    // Update Clothes Information
    const [updatedClothesCount] = await Clothes.update(
        {
          is_sale: true,
          post_name: post_name,
          sale_type: sale_type,
          price: price,
        },
        {
          where: {clothes_id},  // Update based on clothes_id
        });

    // Check update results
    if (updatedClothesCount === 0) {
      return res.status(404).json({
        error: 'Clothes not found or no changes made.',
      });
    }

    // Update Account Information
    const [updatedUserCount] =
        await User.update({bank_account: bank_account}, {where: {user_id}});

    // Check update results
    if (updatedUserCount === 0) {
      return res.status(404).json({
        error: 'User not found or no changes made.',
      });
    }

    // Successful Response
    return res.status(200).json({
      message:
          'Clothes registered for sale and bank account updated successfully.',
    });
  } catch (error) {
    console.error('[SALES ERROR]', error);
    return res.status(500).json({
      error: 'Sales failed.',
      details: error.message,
    });
  }
};

exports.market_info = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const clothes = await Clothes.findAll({
      where: {
        user_id: {[Op.ne]: user_id},  // 자신이 등록한 옷은 제외
        is_sale: true,
      },
      attributes: [
        'image_name',
        'clothes_name',
        'rating',
        'clothes_type',
        'clothes_style',
        'memo',
        'size',
        'price',
        'post_name',
        'sale_type',
        'clothes_id',
      ],
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
        size: item.size,
        price: item.price,
        post_name: item.post_name,
        sale_type: item.sale_type,
        clothes_id: item.clothes_id,
      };
    });

    // Return Final Results
    return res.status(200).json({
      clothes: clothes_with_images,  // Array containing images and data
    });

  } catch (error) {
    console.error('[MARKET INFO ERROR]', error);
    return res.status(500).json({
      error: 'Failed to load market info.',
      details: error.message,
    });
  }
};
exports.purchase_clothes = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;
    const {clothes_id} = req.body;

    if (!user_id || !clothes_id) {
      return res.status(400).json({
        error: 'Missing required fields: userId or clothes_id.',
      });
    }

    // 1. Check clothing information to purchase
    const clothes = await Clothes.findOne({
      where: {clothes_id, is_sale: true, is_sold: false},  // Check Sales Status
    });

    // Clothes do not exist or have already been sold
    if (!clothes) {
      return res.status(404).json({
        error: 'Clothes not found, already sold, or not available for sale.',
      });
    }

    // 2. Update Sales Status (is_old = true)
    const [updatedCount] = await Clothes.update(
        {
          is_sold: true,
          is_sale: false,
          sold_to: user_id
        },  // Change to sold status
        {where: {clothes_id}});

    if (updatedCount === 0) {
      return res.status(500).json({
        error: 'Failed to update clothes status.',
      });
    }

    // 3. Return Purchase Success Response
    return res.status(200).json({
      message: 'Clothes purchased successfully.',
      purchasedClothes: {
        clothes_id: clothes.clothes_id,
        clothes_name: clothes.clothes_name,
        price: clothes.price,
        sold_to: user_id,
      },
    });
  } catch (error) {
    console.error('[MARKET PURCHASE ERROR]', error);
    return res.status(500).json({
      error: 'Failed to purchase clothes.',
      details: error.message,
    });
  }
};