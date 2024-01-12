/**
 *
 *  main.js
 *  Back-end server
 *
 *  Created: 2024-01-12
 *  Last modified: -
 *
 */

const express = require('express');
const axios = require('axios');
const { authConfig } = require('./config/config');
const { sql, poolPromise } = require('./config/server');
const { SqlConnector } = require('./db');

const app = express();
const PORT = 3000;

/**
 * @type {SqlConnector}
 */
let sqlConn;

// Enable CORS for all routes
app.use(async (_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Run server
app.listen(PORT, async () => {
    sqlConn = new SqlConnector(await poolPromise);
    console.log('Connected to TastyNav database.');
    console.log(`Listening to port ${PORT}...`);
});

app.get('/test', async (req, res) => {
    sqlConn.setUser('nsun527@cau.ac.kr');
    const result = await sqlConn.getFollowings();
    res.send(result);
});

//루트 페이지
//로그인 버튼을 누르면 GET /login으로 이동
app.get('/', (_, res) => {
    res.send(`<a href="/auth">Log in</a>
  <a href="/signup">Sign up</a>`);
});

// 로그인 버튼을 누르면 도착하는 목적지 라우터
// 모든 로직을 처리한 뒤 구글 인증서버인 https://accounts.google.com/o/oauth2/v2/auth
// 으로 redirect 되는데, 이 url에 첨부할 몇가지 QueryString들이 필요
app.get('/auth', (_, res) => {
    let url = 'https://accounts.google.com/o/oauth2/v2/auth';
    url += `?client_id=${authConfig.clientID}`;
    url += `&redirect_uri=${authConfig.redirectUri}`;
    url += '&response_type=code';
    url += '&scope=email profile';
    res.redirect(url);
});

app.get('/auth/google', async (req, res) => {
    const { code } = req.query;
    console.log(`code: ${code}`);

    const resp = await axios.post(authConfig.tokenUrl, {
        code,
        client_id: authConfig.clientID,
        client_secret: authConfig.clientSecret,
        redirect_uri: authConfig.redirectUri,
        grant_type: 'authorization_code',
    });

    const resp2 = await axios.get(authConfig.userinfoUrl, {
        headers: { Authorization: `Bearer ${resp.data.access_token}` },
    });
    res.json(resp2.data['email']);
});

app.get('/signup', (req, res) => {
    let url = 'https://accounts.google.com/o/oauth2/v2/auth';
    url += `?client_id=${authConfig.clientID}`;
    url += `&redirect_uri=${authConfig.signupUri}`;
    url += '&response_type=code';
    url += '&scope=email profile';
    res.redirect(url);
});

// 회원가입
app.get('/signup/google', async (req, res) => {
    const { code } = req.query;
    console.log(`code: ${code}`);

    const resp = await axios.post(authConfig.tokenUrl, {
        code,
        client_id: authConfig.clientID,
        client_secret: authConfig.clientSecret,
        redirect_uri: authConfig.signupUri,
        grant_type: 'authorization_code',
    });

    const resp2 = await axios.get(authConfig.userinfoUrl, {
        headers: {
            Authorization: `Bearer ${resp.data.access_token}`,
        },
    });
    res.json(resp2.data);
});

//목록에 추가
app.post('/addgoal', async (req, res) => {
    const add_info = req.body;

    sqlConn.addGoal(add_info.month, add_info.id, add_info.goal);
});

//목록 수정
app.post('/editgoal', async (req, res) => {
    const edit_info = req.body;

    sqlConn.modifyGoal(edit_info.month, edit_info.id, edit_info.newGoal);
});

//목록 삭제
app.post('/deletegoal', async (req, res) => {
    const delete_info = req.body;

    sqlConn.deleteGoal(delet_info.month, delete_info.id);
});

//목록 읽기
app.post('/getgoal', async (req, res) => {
    const get_info = req.body;

    res.json(sqlConn.getGoals(get_info.month));
});
