const express = require('express');
const router = express.Router();
const redisClient = require('../utils/redisClient');
const captchaCategories = {
  traffic_light: {
    name: '신호등',
    images: [
      'https://images.unsplash.com/photo-1533988902751-0fad628013cb?w=200',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=200',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200',
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200',
      'https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?w=200',
      'https://images.unsplash.com/photo-1541411532-87ad198ae3d8?w=200',
      'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?w=200',
      'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=200',
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=200',
    ],
    correctIndices: [0, 3, 5] // 신호등이 있는 이미지 인덱스
  },
  car: {
    name: '자동차',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=200',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200',
      'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=200',
      'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?w=200',
    ],
    correctIndices: [0, 3, 6, 7] // 자동차가 있는 이미지 인덱스
  },
  bus: {
    name: '버스',
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=200',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=200',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200',
      'https://images.unsplash.com/photo-1581262177000-8c085fc5e2a1?w=200',
      'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=200',
      'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?w=200',
    ],
    correctIndices: [0, 3, 6] // 버스가 있는 이미지 인덱스
  }
};

// 캡차 생성
router.get('/generate/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // 랜덤 카테고리 선택
    const categoryKeys = Object.keys(captchaCategories);
    const randomCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const categoryData = captchaCategories[randomCategory];
    
    // 캡차 ID 생성
    const captchaId = `captcha:${userId}:${Date.now()}`;
    
    // Redis에 정답 저장 (5분 TTL)
    await redisClient.setEx(
      captchaId,
      300, // 5분
      JSON.stringify({
        category: randomCategory,
        correctIndices: categoryData.correctIndices,
        userId
      })
    );
    
    res.json({
      captchaId,
      category: randomCategory,
      categoryName: categoryData.name,
      images: categoryData.images,
      gridSize: 9 // 3x3 그리드
    });
  } catch (error) {
    res.status(500).json({ message: '캡차 생성 실패' });
  }
});

// 캡차 검증
router.post('/verify', async (req, res) => {
  try {
    const { captchaId, selectedIndices } = req.body;
    
    // Redis에서 정답 가져오기
    const captchaData = await redisClient.get(captchaId);
    
    if (!captchaData) {
      return res.status(400).json({ 
        success: false, 
        message: '캡차가 만료되었거나 존재하지 않습니다.' 
      });
    }
    
    const { correctIndices, userId } = JSON.parse(captchaData);
    
    // 정답 확인 (순서 상관없이 배열 비교)
    const isCorrect = 
      selectedIndices.length === correctIndices.length &&
      selectedIndices.every(idx => correctIndices.includes(idx)) &&
      correctIndices.every(idx => selectedIndices.includes(idx));
    
    if (isCorrect) {
      // 캡차 성공 - 인증 토큰 생성
      const verifiedToken = `verified:${userId}:${Date.now()}`;
      
      // 인증된 토큰을 Redis에 저장 (5분간 유효, 로그인 시 사용)
      await redisClient.setEx(`captcha_verified:${verifiedToken}`, 300, 'true');
      
      // 기존 캡차 삭제
      await redisClient.del(captchaId);
      
      res.json({ 
        success: true, 
        message: '캡차 인증 성공',
        verifiedToken // 로그인 요청 시 함께 전송
      });
    } else {
      res.json({ 
        success: false, 
        message: '선택이 올바르지 않습니다. 다시 시도해주세요.' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: '캡차 검증 실패' 
    });
  }
});

module.exports = router;