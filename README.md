# NextMessenger

ReactMessenger 프로젝트의 확장 버전으로, 
기존 기능을 개선하고 실시간 채팅과 온라인 상태 처리를 강화한 프로젝트입니다.
WebSocket과 Kafka를 사용해 실시간 통신과 메시지 처리를 구현했으며, 
쇼핑 및 결제 시스템을 도입하여 분산 시스템과 결제 흐름 설계에 중점을 두었습니다.

## 프로젝트 구조
```
프론트 : NextMessenger\MessengerFrontend\
백엔드 : NextMessenger\MessengerBackend\
결제백엔드 : NextMessenger\pay-ment-backend\
메인 기능은 각 프로젝트의 src 파일 안에 있습니다.
```

## 문서
- [보고서 보기](https://docs.google.com/document/d/1M_G3FHIk6NpHwyYIl82IZdLAtDYcBi279za9k6WdcBY/edit?usp=sharing)
- [보고서 다운로드 (PDF)](https://docs.google.com/document/d/1M_G3FHIk6NpHwyYIl82IZdLAtDYcBi279za9k6WdcBY/export?format=pdf)
- [전체 아키텍쳐 (링크속 draw.io로 열기를 눌러주세요)](https://drive.google.com/file/d/1n_Rc_uEXv_IbFuX16B06a6ol-zMJnWhB/view?usp=sharing)
- [데이터베이스 ERD](https://dbdiagram.io/d/6956305a39fa3db27be84719)

## 이전 프로젝트의 기능들 
- SMTP 이메일을 이용한 로그인
- OAuth2를 이용한 소셜로그인
- 게시글 및 사진 CRUD
- 게시물의 범위 설정
- 댓글 CRUD
- 친구 시스템
- http방식의 친구와의 채팅

## + 추가
- Websocket을 이용한 실시간 채팅시스템
- 쇼핑 페이지
- 장바구니 시스템
- 결제 시스템
- kafka를 이용한 분산
- 디자인 수정

## 사용한 기술스택

### 프론트엔드
- HTML
- CSS
- JavaScript
- TypeScript
- Next.js

### 백엔드
- Express.js
- Next.js
- JWT
- OAuth2
- WebSocket
- Kafka
- express-session

### 데이터베이스
- MongoDB
- PostgreSQL
- Redis

### 인프라 / 배포
- Docker