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
    const user_id = req.user.user_id;  // JWT에서 user_id 가져오기
    const {clothes_id} = req.body;

    if (!clothes_id) {
      return res.status(400).json({error: 'Clothes ID is required.'});
    }

    // 위시리스트에 이미 등록되었는지 확인
    const existed_item = await Wishlist.findOne({
      where: {user_id, clothes_id},
    });

    if (existed_item) {
      return res.status(400).json({error: 'Item is already in the wishlist.'});
    }

    // 위시리스트에 추가
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
    const user_id = req.user.user_id;  // JWT에서 user_id 가져오기

    // 위시리스트 조회
    const wishlist = await Wishlist.findAll({
      where: {user_id},
      include: [
        {
          model: Clothes,
          as: 'Clothes', // 별칭 사용
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

    // Cloth 디렉토리 경로 설정
    const cloth_dir = path.join(__dirname, '../sam/results/cloth');

    // clothes 배열을 순회하며 이미지 및 데이터를 포함한 새로운 구조 생성
    const wishlist_clothes_with_images =
        wishlist
            .map((item) => {
              const clothes = item.Clothes;  // item.Clothe로 접근
              if (!clothes) {
                console.warn(`Missing Clothes data for wishlist item: ${item}`);
                return null;  // Clothes 데이터가 없는 항목은 무시
              }

              const image_path =
                  path.join(cloth_dir, `${clothes.image_name}.jpg`);
              let base64_image = null;

              // 이미지가 존재할 경우 base64 변환
              if (fs.existsSync(image_path)) {
                base64_image = ImageToBase64(image_path);
              } else {
                console.warn(`Image file not found: ${clothes.image_name}`);
              }

              // 새로운 객체 생성
              return {
                clothes_id: clothes.clothes_id,
                image_name: clothes.image_name,
                base64_image,  // base64 변환된 이미지 추가
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
            .filter(Boolean);  // null 값을 제거하여 유효한 항목만 반환

    return res.status(200).json({clothes: wishlist_clothes_with_images});
  } catch (error) {
    console.error('[GET WISHLIST ERROR]', error);
    return res.status(500).json({error: 'Failed to retrieve wishlist.'});
  }
};