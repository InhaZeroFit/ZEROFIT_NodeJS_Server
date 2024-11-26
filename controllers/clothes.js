const { Clothes } = require("../models");
const { send_image_to_flask } = require("./user");

// 이미지 업로드 컨트롤러
exports.upload_image = async (req, res, next) => {
    try {
        // JWT에서 유저 정보 가져오기
        const user_id = req.user.user_id; // JWT 디코드된 정보에서 id 사용

        // 요청에서 데이터 가져오기
        const { base64Image, clothingName, rating, clothingType, clothingStyle, imageMemo, includePoint, excludePoint } = req.body;
    
        // 파일 이름과 경로 생성
        const base_name = `${Date.now()}-${user_id}`;

        // Flask 서버로 이미지 전송
        console.log("Sending image to Flask for preprocessing...");
        const flask_response = await send_image_to_flask(base64Image, includePoint, excludePoint, base_name);

        if (!flask_response) {
            throw new Error("Flask preprocessing failed.");
        }

        console.log("Flask preprocessing successful. Saving to DB...");

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
            message: "Image uploaded and processed successfully!",
            flask_response,
            saved_clothes,
        });
    } catch (error) {
        console.error("[UPLOAD ERROR]", error);
        return res.status(500).json({
            error: "Image upload and processing failed.",
            details: error.message,
        });
    }
};