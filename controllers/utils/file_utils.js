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

exports.ImageToBase64 = (image_path) => {
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
};

exports.CreateDirectories = (input_dir) => {
  try {
    Object.values(input_dir).forEach((dir) => {
      fs.ensureDirSync(dir);
    });
  } catch (error) {
    console.error(`Error creating directories: ${error.message}`);
    throw error;
  }
};

exports.SaveResponseData = (response_data, directories, base_name) => {
  for (const [key, base64_data] of Object.entries(response_data)) {
    try {
      const img_buffer = Buffer.from(base64_data, 'base64');
      let save_path;
      if (key == 'cloth') {
        save_path = path.join(directories.cloth_dir, `${base_name}.jpg`);
      } else {
        continue;
      }
      fs.writeFileSync(save_path, img_buffer);
    } catch (error) {
      console.error(
          `Failed to save file for key: ${key}. Error: ${error.message}`);
    }
  }
};