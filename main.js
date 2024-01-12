/**
 *
 *  main.js
 *  Back-end server
 *
 *  Created: 2024-01-12
 *  Last modified: -
 *
 */

const express = require("express");
const axios = require("axios");
const dotenv = require('dotenv');
const { sql, poolPromise } = require('./config/server');
const { SqlConnector } = require('./db');

const app = express();
const PORT = 3000;

dotenv.config();
let sqlConn;

// Enable CORS for all routes
app.use(async (_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get('/test', async (req, res) => {
  sqlConn.setUser('nsun527@cau.ac.kr');
  const result = await sqlConn.getFollowings();
  res.send(JSON.stringify(result));
});


//루트 페이지
//로그인 버튼을 누르면 GET /login으로 이동
app.get("/", (req, res) => {
  res.send(`<a href="/auth">Log in</a>
  <a href="/signup">Sign up</a>`);
});

// 로그인 버튼을 누르면 도착하는 목적지 라우터
// 모든 로직을 처리한 뒤 구글 인증서버인 https://accounts.google.com/o/oauth2/v2/auth
// 으로 redirect 되는데, 이 url에 첨부할 몇가지 QueryString들이 필요
app.get("/auth", (req, res) => {
  let url = "https://accounts.google.com/o/oauth2/v2/auth";
  url += `?client_id=${process.env.GOOGLE_CLIENT_ID}`;
  url += `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}`;
  url += "&response_type=code";
  url += "&scope=email profile";

  res.redirect(url);
});

app.get("/auth/google", async (req, res) => {
  const { code } = req.query;
  console.log(`code: ${code}`);

  const resp = await axios.post(process.env.GOOGLE_TOKEN_URL, {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  });

  const resp2 = await axios.get(process.env.GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${resp.data.access_token}`,
    },
  });
  res.json(resp2.data);
});

app.get("/signup", (req, res) => {
  let url = "https://accounts.google.com/o/oauth2/v2/auth";
  url += `?client_id=${process.env.GOOGLE_CLIENT_ID}`;
  url += `&redirect_uri=${process.env.GOOGLE_SIGNUP_REDIRECT_URI}`;
  url += "&response_type=code";
  url += "&scope=email profile";
  res.redirect(url);
});

app.get("/signup/google", async (req, res) => {
  const { code } = req.query;
  console.log(`code: ${code}`);

  const resp = await axios.post(process.env.GOOGLE_TOKEN_URL, {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_SIGNUP_REDIRECT_URI,
    grant_type: "authorization_code",
  });

  const resp2 = await axios.get(process.env.GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${resp.data.access_token}`,
    },
  });
  res.json(resp2.data);
});

// Run server
app.listen(PORT, async () => {
  sqlConn = new SqlConnector(await poolPromise);
  console.log("Connected to TastyNav database.");
  console.log(`Listening to port ${PORT}...`);
});
