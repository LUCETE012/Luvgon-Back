/**
 * 
 *  app.js
 *  Back-end server
 * 
 *  Created: 2024-01-03
 *  Last modified: -
 * 
 */


// Import required modules
const express = require('express');
const { sql, poolPromise } = require('./config/server');
const { pool } = require('mssql');

// Server and Port settings
const app = express();
const PORT = 8080;

let connPool;
 
// Enable CORS for all routes
app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Run server
app.listen(PORT, async () => {
    connPool = await poolPromise;
    console.log('Connected to TastyNav database.');
    console.log(`Listening to port ${PORT}...`);
})

app.get('/', async (_, res) => {
    const result = await connPool.request()
        .query('SELECT * FROM Goals');
    res.send(result.recordset);
})