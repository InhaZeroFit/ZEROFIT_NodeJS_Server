# API 사용 가이드
이 문서는 우리 ZEROFIT_NodeJS_Server의 API 사용 방법에 대해 다룹니다.

## API 명세서

|기능                |method     |url                    |설명                                       |
|-------------------|:---------:|:----------------------|:-----------------------------------------|
|신규 사용자 계정 생성        |POST| /auth/join               | 새로운 사용자를 위한 계정을 생성하고 기본 정보를 입력합니다. |
|기존 계정으로 시스템 접속     |POST| /auth/login              | 기존 회원이 시스템에 접속하기 위한 인증을 수행합니다. |
|옷 등록(이미지 전처리)       |POST| /clothes/upload_image    | 사용자가 소유한 옷 정보를 등록하고 관리합니다. |
|등록된 나의 옷장 보기        |POST| /clothes/info            | 사용자가 등록한 옷 정보를 안전하게 불러옵니다. |
|AI 피팅                  |POST| /clothes/virtual_fitting | 등록된 옷을 활용하여 AI 기반의 가상 피팅을 제공합니다. |
|의류장터 구현(스와이프로 구현) |POST| /market/info             | 의류 장터의 스와이프 기능을 통해 의류 정보를 탐색합니다. |
|옷 판매 게시글 작성         |POST| /market/sale             | 다른 사용자에게 판매할 옷의 게시글을 작성합니다. |
|옷 구매 요청               |POST| /market/purchase         | 다른 사용자의 판매 게시글에 대해 구매 요청을 보냅니다. |
|의류장터(위시리스트 등록)     |POST| /wishlist/add            | 의류 장터에서 마음에 드는 옷을 위시리스트에 등록합니다. |
|의류장터(위시리스트 불러오기)  |POST| /wishlist/info          | 위시리스트에 등록된 옷 목록을 불러옵니다. |

### **Auth API**
유저 인증을 제공하는 API입니다.

1. **Endpoint: POST /auth/join**
	- Request
	```bash
	{
    	"name": "test",
    	"email": "test@test.com",
    	"password": "12341234",
    	"address": "South Korea"
	}
	```
	- Response (200 OK)
	```bash
	{
    	"message": "회원가입이 정상적으로 성공했습니다.",
    	"user": {
        	"id": 1,
        	"name": "test",
        	"email": "test@test.com",
        	"address": "South Korea"
    	}
	}
	```

2. **Endpoint: POST /auth/login**
	- Request
	```bash
	{
    	"email": "test@test.com",
    	"password": "12341234"
	}
	```
	- Response (200 OK)
	```bash
	{
		"token": "jwt-token",
		"message": "로그인 성공."
	}
	```

### **Clothes API**
나의 옷장과 가상 피팅을 제공하는 API입니다.

1. **Endpoint: POST /clothes/upload_image**
	- Request
	```bash
	{
    	"userId": 1,
    	"base64Image": "base64-string",
    	"clothingName": "test-clothes",
    	"rating": 4,
    	"clothingType": ["상의"],
    	"clothingStyle": ["포멀"],
    	"imageMemo": "no-memo",
    	"includePoint": {"x": 196.0, "y": 264.0},
    	"excludePoint": {"x": 190.3333282470703, "y": 197.66665649414062}
	}
	```
	- Response (200 OK)
	```bash
	{
    	"message": "이미지 전처리 및 옷 등록 성공적으로 되었습니다.",
    	"response": {
        	"agnostic": "base64-string",
        	"agnostic_mask": "base64-string",
        	"cloth": "base64-string",
        	"cloth_mask": "base64-string",
        	"densepose": "base64-string",
        	"image": "base64-string",
    	},
    	"base_name": "1735372787595-1"
	}
	```
2. **Endpoint: POST /clothes/info**
	- Request
	```bash
	{
    "userId": 1,
	}
	```
	- Response (200 OK)
	```bash
	{
    	"message": "나의 옷장을 성공적으로 불러왔습니다.",
    	"clothes": [
        	{
            	"image_name": "1735372787595-1",
            	"base64_image": "base64-string",
            	"clothes_name": "test-clothes",
            	"rating": "4",
            	"clothes_type": [
                	"상의"
            	],
            	"clothes_style": [
                	"포멀"
            	],
            	"memo": "no-memo",
            	"clothes_id": 1
        	}
    	],
    	"person_base64_image": null
	}
	```
3. **Endpoint: POST /clothes/virtual_fitting**
	- Request
	```bash
	{
		"cloth_image_name": "1735372787595-1",
		"person_base64_image": "base64-string",
		"userId": 2
	}
	```
	- Response (200 OK)
	```bash
	{
    	"message": "가상 피팅이 성공적으로 되었습니다.",
    	"base64_image": “base64-string”
	}
	```

### **Market API**
의류장터 기능을 제공하는 API입니다.

1. **Endpoint: POST /market/info**
	- Request
	```bash
	{
		"userId": 2
	}
	```
	- Response (200 OK)
	```bash
	{
		"message": "의류장터를 성공적으로 불러왔습니다.",
		"clothes": [
			{
				"image_name": "1735372787595-1",
				"base64_image": "base64-string",
				"clothes_name": "test-clothes",
				"rating": "4",
				"clothes_type": [
					"상의"
				],
				"clothes_style": [
					"포멀"
				],
				"memo": "no-memo",
				"size": null,
				"price": 5000,
				"post_name": "급처분 합니다.",
				"sale_type": [
					"직거래"
				],
				"clothes_id": 1
			}
		]
	}
	```
2. **Endpoint: POST /market/sale**
	- Request
	```bash
	{
		"userId": 1,
		"clothes_id": 1,
		"post_name": "급처분 합니다.",
		"sale_type": ["직거래"],
		"price": 5000,
		"bank_account": "111-222-3333"
	}
	```
	- Response (200 OK)
	```bash
	{
		"message": "의류장터에 옷 등록을 성공하였습니다."
	}
	```
3. **Endpoint: POST /market/purchase**
	- Request
	```bash
	{
		"userId": 2,
		"clothes_id": 1
	}
	```
	- Response (200 OK)
	```bash
	{
		"message": "옷 구매를 성공하였습니다.",
		"purchasedClothes": {
			"clothes_id": 1,
			"clothes_name": "test-clothes",
			"price": 5000,
			"sold_to": 2
		}
	}
	```

### **Wishlist API**
의류장터 위시리스트 기능을 제공하는 API입니다.

1. **Endpoint: POST /wishlist/add**
	- Request
	```bash
	{
		"userId": 2,
		"clothes_id": 1
	}
	```
	- Response (200 OK)
	```bash
	{
		"message": "위시리스트 등록이 완료되었습니다."
	}
	```
2. **Endpoint: POST /wishlist/info**
	- Request
	```bash
	{
		"userId": 2
	}
	```
	- Response (200 OK)
	```bash
	{
		"message": "위시리스트 불러오기를 성공하였습니다.",
		"clothes": [
			{
				"clothes_id": 1,
				"image_name": "1735372787595-1",
				"base64_image": "base64-string",
				"clothes_name": "test-clothes",
				"rating": "4",
				"clothes_type": [
					"상의"
				],
				"clothes_style": [
					"포멀"
				],
				"memo": "no-memo",
				"size": null,
				"price": 5000,
				"post_name": "급처분 합니다.",
				"sale_type": [
					"직거래"
				]
			}
		]
	}
	```