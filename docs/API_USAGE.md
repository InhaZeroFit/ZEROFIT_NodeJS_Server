# API 사용 가이드
이 문서는 우리 프로젝트의 API 사용 방법에 대해 다룹니다.

## API 명세서

|기능                |method     |url                    |설명                                       |
|-------------------|:---------:|:----------------------|:-----------------------------------------|
|신규 사용자 계정 생성        |POST| /auth/join               | 새로운 사용자를 위한 계정 생성 및 기본 정보 입력 절차|
|기존 계정으로 시스템 접속     |POST| /auth/login              | 기존 회원이 시스템에 접속하기 위한 인증 절차       |
|옷 등록(이미지 전처리)       |POST| /clothes/upload_image    | 사용자가 소유한 옷에 대한 정보를 등록하여 관리     |
|등록된 나의 옷장 보기        |POST| /clothes/info            | 사용자가 등록한 옷 정보를 안전하게 저장하고 관리    |
|AI 피팅                  |POST| /clothes/virtual_fitting | 옷장 내 옷을 활용한 AI 기반 시뮬레이션 기능       |
|의류장터 구현(스와이프로 구현) |POST| /market/info             | 의류 장터의 스와이프 기능 구현                  | 
|옷 판매 게시글 작성         |POST| /market/sale             | 다른 사용자에게 옷을 판매할 수 있는 기능           |
|의류장터(위시리스트 등록)     |POST| /wishlist/add            | 의류장터에 올라온 옷을 위시리스트로 등록           |
|의류장터(위시리스트 불러오기)  | POST| /wishlist/info          | 위시리스트로 등록된 옷들을 불러오기               |
|옷 구매 요청               |POST| /market/purchase         | 다른 사용자의 판매 게시글을 보고 구매 요청         |

### **전처리 요청 (Preprocess)**

1. **Endpoint: POST /clothes/upload_image**
   ```bash
    { 
	    base64Image, 
	    clothingName, 
	    rating, 
	    clothingType, 
	    clothingStyle, 
	    imageMemo, 
	    includePoint, 
	    excludePoint,
	    userId,
    }
   ```
   
### **가상피팅 요청 (Virtual fitting)**

1. **Endpoint: POST /clothes/virtual_fitting**
   설명: 사용자의 이미지를 가상으로 피팅한 결과를 반환합니다.
   ```bash
    {
	    cloth_image_name 
	    person_base64_image, //base64_image
	    userId
    }
   ```
   ```bash
    {
	    cloth_image_name // 옷 이미지 파일명
	    user_id,
    }
   ```
