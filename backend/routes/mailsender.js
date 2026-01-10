const express = require('express');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const EmailVerification = require('../models/EmailVerification');
const bcrypt = require('bcryptjs');
const router = express.Router();


router.post('/sendcode', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: '이메일이 전달되지 않았습니다.',
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '올바른 이메일 형식이 아닙니다.',
      });
    }
    const existingEmail = await User.findOne({
      email: email,
      platform: 'Messenger',
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: '이미 가입된 이메일입니다.',
      });
    }
    const result = await sendVerificationCore(email);

    return res.status(result.status).json(result);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '이메일 발송 중 문제가 발생했습니다.',
    });
  }
});


router.post('/sendcode/findid', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "이메일이 전달되지 않았습니다."
      });
    }
    const user = await User.findOne({ email:email, platform: 'Messenger' });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "해당 이메일로 가입된 계정이 없습니다."
      });
    }
    const result = await sendVerificationCore(email);
    return res.status(result.status).json(result);

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "이메일 발송 중 문제가 발생했습니다."
    });
  }
});


router.post('/verifycode', async (req, res) => {
  try {
    const { email, code } = req.body;

    const result = await verifyEmailCode(email, code);

    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.json({
      success: true,
      message: '이메일 인증이 완료되었습니다.'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

router.post('/verifycode/findid', async (req, res) => {
  try {
    const { email, code } = req.body;

    const result = await verifyEmailCode(email, code);

    if (!result.success) {
      return res.status(400).json(result);
    }
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '해당 이메일로 등록된 사용자를 찾을 수 없습니다.'
      });
    }
    return res.json({
      success: true,
      message: '인증 완료',
      userId: user.id
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

router.post('/sendcode/password', async (req, res) => {
  const { id, email } = req.body;
    try{
    const user = await User.findOne({ id: id, email:email });
    if (!user) return res.status(404).json({ success: false, message: '사용자나 이메일을 찾을 수 없습니다.' });
    const result = await sendVerificationCore(email);
      return res.status(result.status).json(result);

    } 
    catch (error) {
      return res.status(500).json({
        success: false,
        message: "이메일 발송 서버 문제가 발생했습니다."
      });
    }

});


// 2. verifycode/password
router.post('/verifycode/password', async (req, res) => {
  const { id, email, code } = req.body;
  try{
  const user = await User.findOne({ id: id, email });
  if (!user) return res.status(404).json({ success: false, message: '사용자나 이메일을 찾을 수 없습니다.' });
  const result = await verifyEmailCode(email, code);

    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.json({
      success: true,
      message: '이메일 인증이 완료되었습니다.'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});


router.post('/reset/password', async (req, res) => {
  try {
    const { id, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: '비밀번호 불일치' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const updatedUser = await User.findOneAndUpdate(
      { id: id, platform: 'Messenger' },
      { password: hashedPassword },
    );
    if (!updatedUser) {
      return res.status(400).json({ success: false, message: '존재하지 않는 사용자입니다.' });
    }
    res.json({ success: true, message: '비밀번호 변경 완료' });
  } catch (error) {
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});



async function verifyEmailCode(email, code) {
  if (!email || !code) {
    return { success: false, message: '이메일과 인증 코드를 모두 입력하세요.' };
  }
  const verification = await EmailVerification.findOne({
    email,
    code,
    verified: false
  });

  if (!verification) {
    return { success: false, message: '유효하지 않은 인증 코드입니다.' };
  }
  if (new Date() > verification.expiresAt) {
    await EmailVerification.findByIdAndDelete(verification._id);
    return { success: false, message: '인증 코드가 만료되었습니다. 다시 요청해주세요.' };
  }
  await EmailVerification.findByIdAndUpdate(verification._id, {
    verified: true,
    verifiedAt: new Date(),
  });

  return { success: true };
}



async function sendVerificationCore(email) {
  // 인증 코드 생성
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  // 메일러 설정
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 메일 내용
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "이메일 인증 코드",
    html: `
      <h2>이메일 인증</h2>
      <p>인증 코드: <strong>${verificationCode}</strong></p>
      <p>유효기간: 5분</p>
    `
  };

  // 메일 발송
  await transporter.sendMail(mailOptions);

  // 기존 코드 제거 → 새 코드 저장
  await EmailVerification.deleteMany({ email });

  await EmailVerification.create({
    email,
    code: verificationCode,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    verified: false
  });

  return {
    success: true,
    status: 200,
    message: "인증 코드가 이메일로 전송되었습니다."
  };
}

module.exports = router;