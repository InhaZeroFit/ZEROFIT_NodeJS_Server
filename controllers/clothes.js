const fs = require('fs');
const path = require('path');
const {User, Clothes} = require('../models');
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
    console.log('[upload_image] Sending image to Flask for preprocessing...');
    const response_data = await send_preprocess_image_request(
        base64Image, input_point, base_name);

    if (!response_data) {
      throw new Error('Flask preprocessing failed.');
    }

    console.log(
        '[upload_image] Flask preprocessing successful. Saving to DB...');

    // Flask 전처리가 성공하면 Clothes 테이블에 데이터 저장
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

    // Flutter로 결과 전송
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

// 가상 피팅 컨트롤러
exports.virtual_fitting = async (req, res, next) => {
  try {
    // JWT 디코드된 정보에서 id 사용
    const user_id = req.user.user_id;

    // 요청에서 데이터 가져오기
    const {cloth_image_name, person_base64_image} = req.body;

    if (!cloth_image_name) {
      return res.status(400).json({
        error: 'Missing required fields: clothImageName.',
      });
    }

    // cloth, image 디렉터리 설정
    const load_dir = path.join(__dirname, '../sam/results');
    let person_image_path;

    // 이미지 처음 등록시 또는 변경시
    if (person_base64_image) {
      // 피팅 전 이미지 저장 (Base64 디코딩)
      // Base64 디코딩
      const image_buffer = Buffer.from(person_base64_image, 'base64');

      // 기본 이미지 저장 경로 설정
      const save_dir = path.join(__dirname, '../sam/results/image');
      const output_name = `user-${user_id}`;
      const output_path = path.join(save_dir, `${output_name}.jpg`);

      // 저장 디렉터리 존재 여부 검증
      if (!fs.existsSync(save_dir)) {
        fs.mkdirSync(save_dir, {recursive: true});
      }
      // 결과 이미지 저장
      fs.writeFileSync(output_path, image_buffer);
      console.log(`[virtual_fitting] Saved new person image to ${
          output_path} before fitting`);

      // 사용자 person image 업데이트
      await User.update(
          {person_image: output_name},  // profile_photo에 상대 경로 저장
          {where: {user_id}}            // 조건: user_id가 일치하는 사용자
      );
      console.log(
          `[virtual_fitting] Updated person_image for user_id ${user_id}`);

    } else {  // 기존 이미지 사용시
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

    // base64Image로 변환
    const base64_image_person = (person_base64_image) ?
        person_base64_image :
        ImageToBase64(person_image_path);
    const base64_image_cloth = ImageToBase64(cloth_image_path);

    if (!base64_image_person || !base64_image_cloth) {
      return res.status(500).json({
        error: 'Failed to process base64 images for virtual fitting.',
      });
    }

    // jsonPayload 작성
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

    // 가상피팅된 base64 이미지를 저장
    const base64_image = response_data.result;

    // Flutter로 결과 전송
    return res.status(200).json({
      message: 'Virtual fitting completed successfully!',
      base64_image,
    });
  } catch (error) {
    console.error('[VIRTUAL FITTING ERROR]', error);
    return res.status(500).json({
      error: 'Virtual fitting failed.',
      details: error.message,
    });
  }
};

// GET /clothes/info API 구현
exports.images_info = async (req, res, next) => {
  try {
    // JWT에서 user_id 가져오기
    const user_id = req.user.user_id;

    // DB에서 user_id와 일치하는 clothes 조회
    const clothes = await Clothes.findAll({
      where: {user_id},
      attributes: [
        'image_name', 'clothes_name', 'rating', 'clothes_type', 'clothes_style',
        'memo'
      ],  // 필요한 컬럼만 가져오기
    });

    if (!clothes || clothes.length === 0) {
      return res.status(404).json({
        error: 'No clothing information found for the user.',
      });
    }

    // Cloth 디렉토리 경로 설정
    const cloth_dir = path.join(__dirname, '../sam/results/cloth');

    // clothes 배열을 순회하며 이미지 및 데이터를 포함한 새로운 구조 생성
    const clothes_with_images = clothes.map((item) => {
      const image_path = path.join(cloth_dir, `${item.image_name}.jpg`);
      let base64_image = null;

      // 이미지가 존재할 경우 base64 변환
      if (fs.existsSync(image_path)) {
        base64_image = ImageToBase64(image_path);
      } else {
        console.warn(`Image file not found: ${item.image_name}`);
      }

      // 새로운 객체 생성
      return {
        image_name: item.image_name,
        base64_image,  // base64 변환된 이미지 추가
        clothes_name: item.clothes_name,
        rating: item.rating,
        clothes_type: item.clothes_type,
        clothes_style: item.clothes_style,
        memo: item.memo,
      };
    });

    // DB에서 user_id와 일치하는 사용자 정보 조회
    const user = await User.findOne({
      where: {user_id},
      attributes: ['person_image'],  // person_image만 가져오기
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found.',
      });
    }
    // person_image 경로 처리
    const person_image = user.person_image;
    let person_base64_image = null;

    if (person_image && person_image != 'default_image') {
      // DB에 등록된 사용자 이미지가 있는 경우
      const person_image_path =
          path.join(__dirname, `../sam/results/image/${person_image}.jpg`);

      if (fs.existsSync(person_image_path)) {
        person_base64_image =
            ImageToBase64(person_image_path);  // Base64로 변환
        console.log(
            '[images_info] User is using the saved person image from MySQL.');
      } else {
        console.log(
            `[images_info] Person image file not found: ${person_image_path}`);
      }
    } else {
      // 기본 이미지일 경우 base64_image는 null
      console.info('[images_info] User is using the default image.');
    }
    // 최종 결과 반환
    return res.status(200).json({
      clothes: clothes_with_images,  // 이미지와 데이터를 포함한 배열
      person_base64_image: person_base64_image,  // 기본 이미지인 경우 null
    });

  } catch (error) {
    console.error('[IMAGES INFO ERROR]', error);
    return res.status(500).json({
      error: 'Failed to retrieve clothing information.',
      details: error.message,
    });
  }
};