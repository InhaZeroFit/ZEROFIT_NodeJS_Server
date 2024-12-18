/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-18
 */

const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');
const {User} = require('../models');
dotenv.config();

// Verifying Environmental Variables
if (!process.env.FLASK_SAM_HOST || !process.env.FLASK_SAM_PORT) {
  throw new Error('FLASK_SAM_HOST or FLASK_SAM_PORT is missing in .env file.');
}
if (!process.env.FLASK_KOLORS_HOST || !process.env.FLASK_KOLORS_PORT) {
  throw new Error(
      'FLASK_KOLORS_HOST or FLASK_KOLORS_PORT is missing in .env file.');
}

// Set Flask Server URL
const flask_sam_url = `http://${process.env.FLASK_SAM_HOST}:${
    process.env.FLASK_SAM_PORT}/preprocess`;
const flask_kolors_url = `http://${process.env.FLASK_KOLORS_HOST}:${
    process.env.FLASK_KOLORS_PORT}/kolors`;

// Storage Directory Settings
const base_sam_dir = path.join(__dirname, '../sam/results');
const base_kolors_dir = path.join(__dirname, '../kolors');
const sam_dirs = {
  cloth_dir: path.join(base_sam_dir, 'cloth'),
  image_dir: path.join(base_sam_dir, 'image'),
};
const kolors_dirs = {
  results_dir: path.join(base_kolors_dir, 'results'),
};

// directory generation function
function CreateDirectories(input_dir) {
  try {
    Object.values(input_dir).forEach((dir) => {
      fs.ensureDirSync(dir);
    });
  } catch (error) {
    console.error(`Error creating directories: ${error.message}`);
    throw error;
  }
}

// Functions that store response data
function SaveResponseData(response_data, directories, base_name) {
  for (const [key, base64_data] of Object.entries(response_data)) {
    try {
      const img_buffer = Buffer.from(base64_data, 'base64');
      let save_path;

      switch (key) {
        case 'cloth':
          save_path = path.join(directories.cloth_dir, `${base_name}.jpg`);
          break;
        default:
          continue;
      }
      fs.writeFileSync(save_path, img_buffer);
    } catch (error) {
      console.error(
          `Failed to save file for key: ${key}. Error: ${error.message}`);
    }
  }
}

// Communicate with Flask servers and handle responses
exports.send_preprocess_image_request =
    async (base64Image, input_point, base_name) => {
  try {
    CreateDirectories(base_sam_dir);

    if (!base64Image || !input_point || !base_name) {
      return res.status(400).json({
        error:
            'Missing required fields: base64Image or input_point or user_id.',
      });
    }

    const json_payload = {
      image: base64Image,
      input_point,
    };

    const response = await axios.post(flask_sam_url, json_payload, {
      headers: {'Content-Type': 'application/json'},
    });

    if (response.status === 200) {
      const response_data = response.data;

      // Save Response Data
      SaveResponseData(response_data, sam_dirs, base_name);

      console.log('[upload_image] Flask preprocessing successful!');
      return response.data;  // Returns response data if successful
    } else {
      throw new Error(
          `Flask server error: ${response.status} ${response.data}`);
    }
  } catch (error) {
    console.error('Error processing image:', error.message);
    throw error;  // Pass exception to call function
  }
};

exports.send_virtual_fitting = async (json_payload, user_id) => {
  try {
    CreateDirectories(kolors_dirs);
    // Send a request to the Flask server
    const response = await axios.post(flask_kolors_url, json_payload, {
      headers: {'Content-Type': 'application/json'},
    });

    if (response.status === 200) {
      const response_data = response.data;

      // Check if there is a 'result' key
      if ('result' in response_data) {
        const base64_result = response_data.result;

        // Base64 Decoding
        const image_buffer = Buffer.from(base64_result, 'base64');

        // Set virtual fitting image result storage path
        const save_dir = path.join(__dirname, '../kolors/results');
        const output_name = `${Date.now()}-${user_id}`;
        const output_path = path.join(save_dir, `${output_name}.jpg`);
        // Verifying the existence of a stored directory
        if (!fs.existsSync(save_dir)) {
          fs.mkdirSync(save_dir, {recursive: true});
        }
        // Save result image
        fs.writeFileSync(output_path, image_buffer);
        console.log(
            `[virtual_fitting] Saved virtual fitting result to ${output_path}`);

        return response_data;  // Returns response data if successful
      } else {
        throw new Error('Error: \'result\' key not found in the response.');
      }
    } else {
      throw new Error(
          `KOLORS server error: ${response.status} ${response.data}`);
    }
  } catch (error) {
    console.error('Error during virtual fitting:', error.message);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
    throw error;
  }
};