const express = require('express');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const User = require('../models/User'); 
const router = express.Router();
const { saveUserSession } = require('../utils/sessionHelper');

// Google
router.get('/google/url', (req, res) => {
  const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    prompt: 'consent',
  });
  res.json({ url: `${googleAuthUrl}?${params.toString()}` });
});

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect(`${process.env.FRONTEND_URL}/`);

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    const { access_token } = await tokenResponse.json();
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const googleUser = await userResponse.json();

    const userId = "go_" + (googleUser.email ? googleUser.email.split('@')[0] : googleUser.id);

    let user = await User.findOne({ id: userId });

    if (!user) {
      user = await User.create({
        id: userId,
        email: googleUser.email,
        name: googleUser.name,
        platform: 'google',
        profileImage: "",
        introduce: "",
        uuid: uuidv4().replace(/-/g, ''),
      });
    }

    await saveUserSession(req, user);
    res.redirect(`${process.env.FRONTEND_URL}/`);

  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/`);
  }
});

// Naver 
router.get('/naver/url', (req, res) => {
  const naverAuthUrl = 'https://nid.naver.com/oauth2.0/authorize';
  const state = Math.random().toString(36).substring(7);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.NAVER_CLIENT_ID,
    redirect_uri: process.env.NAVER_REDIRECT_URI,
    state,
  });

  res.json({ url: `${naverAuthUrl}?${params.toString()}` });
});

router.get('/naver/callback', async (req, res) => {
  const { code, state } = req.query;
  if (!code) return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);

  try {
    const tokenUrl = 'https://nid.naver.com/oauth2.0/token';
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.NAVER_CLIENT_ID,
      client_secret: process.env.NAVER_CLIENT_SECRET,
      code,
      state,
    });

    const tokenResponse = await fetch(`${tokenUrl}?${tokenParams.toString()}`);
    const { access_token } = await tokenResponse.json();

    const userResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const naverUser = (await userResponse.json()).response;

    const userId = "na_" + (naverUser.email ? naverUser.email.split('@')[0] : naverUser.id);

    let user = await User.findOne({ id: userId });

    if (!user) {
      user = await User.create({
        id: userId,
        email: naverUser.email,
        name: naverUser.name || naverUser.nickname,
        platform: 'naver',
        profileImage: naverUser.profile_image || "",
        introduce: "",
        uuid: uuidv4().replace(/-/g, ''),
      });
    }

   await saveUserSession(req, user);
    res.redirect(`${process.env.FRONTEND_URL}/`);

  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
});

//  Discord
router.get('/discord/url', (req, res) => {
  const discordAuthUrl = 'https://discord.com/api/oauth2/authorize';
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify email',
  });
  res.json({ url: `${discordAuthUrl}?${params.toString()}` });
});

router.get('/discord/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }),
    });
    const { access_token } = await tokenResponse.json();

    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const discordUser = await userResponse.json();

    const userId = `dc_${discordUser.email ? discordUser.email.split('@')[0] : discordUser.id}`;

    let user = await User.findOne({ id: userId });

    if (!user) {
      user = await User.create({
        id: userId,
        email: discordUser.email || `${discordUser.id}@discord.user`,
        name: discordUser.global_name || discordUser.username,
        platform: 'discord',
        profileImage: "",
        introduce: "",
        uuid: uuidv4().replace(/-/g, ''),
      });
    }

   await saveUserSession(req, user);
    res.redirect(`${process.env.FRONTEND_URL}/`);

  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
});

//  Kakao
router.get('/kakao/url', (req, res) => {
  const kakaoAuthUrl = 'https://kauth.kakao.com/oauth/authorize';
  const params = new URLSearchParams({
    client_id: process.env.KAKAO_REST_API_KEY,
    redirect_uri: process.env.KAKAO_REDIRECT_URI,
    response_type: 'code',
  });
  res.json({ url: `${kakaoAuthUrl}?${params.toString()}` });
});

router.get('/kakao/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);

  try {
    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        code,
      }),
    });
    const { access_token } = await tokenResponse.json();

    const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const userData = await userResponse.json();

    const kakaoAccount = userData.kakao_account || {};
    const profile = kakaoAccount.profile || {};
    const email = kakaoAccount.email || `${userData.id}@kakao.user`;
    const userId = `ka_${email.split('@')[0]}`;

    let user = await User.findOne({ id: userId });

    if (!user) {
      user = await User.create({
        id: userId,
        email,
        name: profile.nickname || '카카오 사용자',
        platform: 'kakao',
        profileImage: "",
        introduce: "",
        uuid: uuidv4().replace(/-/g, ''),
      });
    }
   await saveUserSession(req, user);
    res.redirect(`${process.env.FRONTEND_URL}/`);

  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
});

module.exports = router;
