const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { Clothes } = require("../models");

// 업로드 디렉토리 절대 경로 설정
const upload_dir = path.resolve(__dirname, "../public/uploads/clothes");

// 디렉토리가 존재하지 않으면 생성
if (!fs.existsSync(upload_dir)) {
    fs.mkdirSync(upload_dir, { recursive: true });
}

// Multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, upload_dir); // 업로드 폴더
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // 파일 이름
    },
});

// 이미지 업로드 컨트롤러
exports.upload_image = async (req, res, next) => {
    try {
        // JWT에서 유저 정보 가져오기
        const user_id = req.user.user_id; // JWT 디코드된 정보에서 id 사용

        // 요청에서 데이터 가져오기
        const { base64Image, clothingName, clothingType, rating, clothingStyle, imageMemo } = req.body;
        
        // Base64 데이터 디코딩
        const base64_data = base64Image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64_data, "base64");

        // 파일 이름과 경로 생성
        const filename = `${Date.now()}-${user_id}.jpg`; // 기본 확장자를 .jpg로 설정
        const file_path = path.join(upload_dir, filename);

        // 파일 저장
        fs.writeFileSync(file_path, buffer);

        // Clothes 테이블에 데이터 저장
        await Clothes.create(
            {
                image_url : `/uploads/clothes/${filename}`,
                name : clothingName,
                score : rating,
                clothes_type : clothingType,
                style : clothingStyle,
                memo : imageMemo,
                user_id,
            },
        );

        res.status(200).json({
            message : "Image uploaded successfully!",
        });
    } catch (error) {
        console.error("[UPLOAD ERROR]", error);
        next(error);
    }
};