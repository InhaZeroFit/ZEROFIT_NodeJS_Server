const fs = require('fs');
const path = require('path');
const {Clothes} = require('../models');
const {send_preprocess_image_request, send_virtual_fitting} =
    require('./flask');

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

// 이미지 업로드 컨트롤러
exports.upload_image = async (req, res, next) => {
  try {
    // JWT에서 유저 정보 가져오기
    const user_id = req.user.user_id;  // JWT 디코드된 정보에서 id 사용

    // 요청에서 데이터 가져오기
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

    // 이미지 이름 설정
    const base_name = `${Date.now()}-${user_id}`;

    // Flask 서버로 이미지 전송
    console.log('Sending image to Flask for preprocessing...');
    const response = await send_preprocess_image_request(
        base64Image, input_point, base_name);

    if (!response) {
      throw new Error('Flask preprocessing failed.');
    }

    console.log('Flask preprocessing successful. Saving to DB...');

    // Flask 전처리가 성공하면 Clothes 테이블에 데이터 저장
    try {
      const saved_clothes = await Clothes.create({
        image_name: `${base_name}`,
        name: clothingName,
        score: rating,
        clothes_type: clothingType,
        clothes_style: clothingStyle,
        memo: imageMemo,
        include_point: includePoint,
        exclude_point: excludePoint,
        user_id,
      });
      console.log('MySQL successfully saved clothes.');
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json(
            {error: 'Invalid data', details: error.errors});
      }
      throw error;
    }

    // Flutter로 결과 전송
    return res.status(200).json({
      message: 'Image uploaded and processed successfully!',
      response,
    });
  } catch (error) {
    console.error('[UPLOAD ERROR]', error);
    return res.status(500).json({
      error: 'Image upload and processing failed.',
      details: error.message,
    });
  }
};

// 가상 피팅 컨트롤러
exports.virtual_fitting = async (req, res, next) => {
  try {
    // 요청에서 데이터 가져오기
    let {person_image_name, cloth_image_name} = req.body;

    if (!person_image_name || !cloth_image_name) {
      person_image_name = '1732888439660-1';
      cloth_image_name = '1732888491515-1';
      // return res.status(400).json({
      //     error: "Missing required fields: personImageName, clothImageName.",
      // });
    }

    // 이미지 경로 설정
    const load_dir = path.join(__dirname, '../sam/results');
    const person_image_path =
        path.join(load_dir, `image/${person_image_name}.jpg`);
    const cloth_image_path =
        path.join(load_dir, `cloth/${cloth_image_name}.jpg`);

    const save_dir = path.join(__dirname, '../viton/results');
    const output_path =
        path.join(save_dir, `${person_image_name}_${cloth_image_name}.jpg`);

    // base64Image로 변환
    const base64_image_person = ImageToBase64(person_image_path);
    const base64_image_cloth = ImageToBase64(cloth_image_path);

    // jsonPayload 작성
    const json_payload = {
      person: base64_image_person,
      cloth: base64_image_cloth,
    };

    console.log('Sending virtual fitting request to Flask...');
    const response_data = await send_virtual_fitting(json_payload, output_path);

    if (!response_data) {
      throw new Error('Virtual fitting request failed.');
    }
    console.log('Virtual fitting successful. Returning response to Flutter...');

    // 가상피팅된 base64 이미지를 저장
    const base64_result = response_data.result;

    // Flutter로 결과 전송
    return res.status(200).json({
      message: 'Virtual fitting completed successfully!',
      base64_result,
    });
  } catch (error) {
    console.error('[VIRTUAL FITTING ERROR]', error);
    return res.status(500).json({
      error: 'Virtual fitting failed.',
      details: error.message,
    });
  }
};

exports.images_info = async (req, res, next) => {
  res.status(501).json({error: 'Not implemented yet'});
};