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
const {Wishlist, Clothes} = require('../models');

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

exports.add_to_wishlist = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const {clothes_id} = req.body;

    if (!clothes_id) {
      return res.status(400).json({error: 'Clothes ID is required.'});
    }

    const existed_item = await Wishlist.findOne({
      where: {user_id, clothes_id},
    });

    if (existed_item) {
      return res.status(400).json({error: 'Item is already in the wishlist.'});
    }

    // Add to wish list
    const add_wishlist = await Wishlist.create({user_id, clothes_id});
    if (!add_wishlist || add_wishlist.length == 0) {
      return res.status(404).json({
        error: 'Failed to create wishlist',
      })
    }

    return res.status(200).json({message: 'Item added to wishlist.'});
  } catch (error) {
    console.error('[ADD TO WISHLIST ERROR]', error);
    return res.status(500).json({error: 'Failed to add item to wishlist.'});
  }
};
exports.get_wishlist = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const wishlist = await Wishlist.findAll({
      where: {user_id},
      include: [
        {
          model: Clothes,
          as: 'Clothes', 
          attributes: [
            'clothes_id',
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
          ],
        },
      ],
    });

    if (!wishlist || wishlist.length === 0) {
      return res.status(404).json({error: 'Your wishlist is empty.'});
    }

    // Set the Cloth directory path
    const cloth_dir = path.join(__dirname, '../sam/results/cloth');

    // Create new structures, including images and data, while traversing the
    // clotes array
    const wishlist_clothes_with_images =
        wishlist
            .map((item) => {
              const clothes = item.Clothes;  // Access item.Clothe
              if (!clothes) {
                console.warn(`Missing Clothes data for wishlist item: ${item}`);
                return null;  // Ignore items without Clothes data
              }

              const image_path =
                  path.join(cloth_dir, `${clothes.image_name}.jpg`);
              let base64_image = null;

              // base64 conversion if the image exists
              if (fs.existsSync(image_path)) {
                base64_image = ImageToBase64(image_path);
              } else {
                console.warn(`Image file not found: ${clothes.image_name}`);
              }
              // Create a new object
              return {
                clothes_id: clothes.clothes_id,
                image_name: clothes.image_name,
                base64_image,  // Add base64 Converted Image
                clothes_name: clothes.clothes_name,
                rating: clothes.rating,
                clothes_type: clothes.clothes_type,
                clothes_style: clothes.clothes_style,
                memo: clothes.memo,
                size: clothes.size,
                price: clothes.price,
                post_name: clothes.post_name,
                sale_type: clothes.sale_type,
              };
            })
            .filter(Boolean);  // Remove null value to return only valid entries

    return res.status(200).json({clothes: wishlist_clothes_with_images});
  } catch (error) {
    console.error('[GET WISHLIST ERROR]', error);
    return res.status(500).json({error: 'Failed to retrieve wishlist.'});
  }
};