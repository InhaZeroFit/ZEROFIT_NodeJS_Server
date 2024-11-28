const fs = require('fs');
const path = require('path');
const {Clothes} = require('../models');
const {send_preprocess_image_request, send_virtual_fitting} =
    require('./flask');

function ImageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);      // 파일 읽기
    return Buffer.from(imageBuffer).toString('base64');  // Base64 인코딩
  } catch (error) {
    console.error(`Error reading file at ${imagePath}:`, error.message);
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

    // 파일 이름과 경로 생성
    const base_name = `${Date.now()}-${user_id}`;

    // Flask 서버로 이미지 전송
    console.log('Sending image to Flask for preprocessing...');
    const flask_response = await send_preprocess_image_request(
        base64Image, includePoint, excludePoint, base_name);

    if (!flask_response) {
      throw new Error('Flask preprocessing failed.');
    }

    console.log('Flask preprocessing successful. Saving to DB...');

    // Flask 전처리가 성공하면 Clothes 테이블에 데이터 저장
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

    // Flutter로 결과 전송
    return res.status(200).json({
      message: 'Image uploaded and processed successfully!',
      flask_response,
      saved_clothes,
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
      person_image_name = '1732787905886-1';
      cloth_image_name = '1732787873561-1';
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
    }

                         console.log(
                             'Sending virtual fitting request to Flask...');
    const response_data = await send_virtual_fitting(json_payload, output_path);

    if (!response_data) {
      throw new Error('Virtual fitting request failed.');
    }
    console.log('Virtual fitting successful. Returning response to Flutter...');

    // 결과를 Flutter로 전송
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
  try {
  } catch (error) {
    console.error(error);
    return res.status(404).json({
      error,
      message: 'images info error!',
    });
  }
};