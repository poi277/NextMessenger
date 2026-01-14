# ReactMessenger

React와 Java Spring을 이용한  
Messenger 프로젝트의 **초기 버전**입니다.  

최신 버전은 **NextMessenger 리포지토리**를 확인해주세요.  
https://github.com/poi277/NextMessenger

## 프로젝트 구조
```
프론트 : MessengerFrontEnd\src\component
백엔드 : MessengerBackEnd\src\main\java\com\Messenger\Messenger
```

## 기능

- SMTP 이메일을 이용한 로그인
- OAuth2를 이용한 소셜로그인
- 게시글 및 사진 CRUD
- 게시물의 범위 설정
- 댓글 CRUD
- 친구 시스템
- 친구와의 채팅

## 사용한 기술스택

### 프론트
- HTML
- CSS
- JavaScript
- React.js

### 백엔드
- Spring Boot
- Spring Security
- JPA
- JWT
- OAuth2
- HttpSession

### DB
- MySQL
- Redis

### 인프라 / 배포
- Docker
- AWS EC2
- AWS S3
- AWS CloudFront
- AWS RDS
- AWS Route 53
- SSL 인증서
