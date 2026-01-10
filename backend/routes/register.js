const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const EmailVerification = require('../models/EmailVerification'); 

const router = express.Router();

router.post('/registerSubmit', async (req, res) => {
  try {
    const { id, password, confirmPassword, email, name } = req.body;

    // 1. 필수 필드 존재 여부 검증
    if (!id || id.trim() === '') {
      return res.status(422).json({ message: '아이디를 입력하세요.' });
    }

    if (!password || password.trim() === '') {
      return res.status(422).json({ message: '비밀번호를 입력하세요.' });
    }

    if (!confirmPassword || confirmPassword.trim() === '') {
      return res.status(422).json({ message: '비밀번호 확인을 입력하세요.' });
    }

    if (!name || name.trim() === '') {
      return res.status(422).json({ message: '닉네임을 입력하세요.' });
    }

    if (!email || email.trim() === '') {
      return res.status(422).json({ message: '이메일을 입력하세요.' });
    }

    // 2. 비밀번호 길이 검증
    if (password.length < 2) {
      return res.status(422).json({ message: '비밀번호는 최소 2자 이상이어야 합니다.' });
    }

    // 3. 비밀번호 일치 여부 검증
    if (password !== confirmPassword) {
      return res.status(422).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // 4. 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(422).json({ message: '올바른 이메일 형식이 아닙니다.' });
    }

    // 5. 아이디 중복 확인
    const existingUser = await User.findOne({ id: id });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
    }

    // 이메일 중복 확인 
    const existingEmail = await User.findOne({ email: email, platform: 'Messenger' });
    if (existingEmail) {
      return res.status(400).json({ message: '이미 가입한 이메일입니다.' });
    }

    // 7. 이메일 인증 확인
    const verification = await EmailVerification.findOne({ 
      email: email, 
      verified: true 
    });

    if (!verification) {
      return res.status(400).json({ message: '이메일 인증을 완료해주세요.' });
    }

    // 8. 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 12);

    // 9. 사용자 생성
    const newUser = await User.create({ 
      id: id.trim(), 
      password: hashedPassword,
      name: name.trim(),
      email: email.trim(),
      platform: "Messenger",
      profileImage: "",
      introduce: "",
      uuid: uuidv4().replace(/-/g, '')
    });

    // 10. 인증 완료된 이메일 인증 데이터 삭제
    await EmailVerification.deleteOne({ email: email });

    res.status(201).json({ 
      message: '회원가입 성공', 
      id: newUser._id
    });

  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});


// 아이디 중복 확인
router.post('/idcheck', async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: '아이디가 전달되지 않았습니다.' });
    }
    const existingUser = await User.findOne({ id });

    if (existingUser) {
      return res.json({ isDuplicate: true, message: '이미 존재하는 사용자입니다.' });
    }

    return res.json({ isDuplicate: false, message: '사용 가능한 아이디입니다.' });
  } catch (error) {
    res.status(500).json({ message: '서버 오류', isDuplicate: null });
  }
});

module.exports = router;