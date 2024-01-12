/**
 * 
 *  config.js
 *  SQL server configuration
 * 
 *  Created: 2024-01-12
 *  Last modified: -
 * 
 */

const dotenv = require('dotenv');

dotenv.config();

const sqlConfig = {
    server: 	process.env.DB_DEV_SERVER,
	datebase: 	process.env.DB_DEV_DATEBASE,
	user: 		process.env.DB_DEV_USERNAME,
	password: 	process.env.DB_DEV_PASSOWRD,
	options: {
        encrypt: true,
		database: process.env.DB_DEV_DATEBASE,
    },
}

const authConfig = {
	clientID: 		process.env.GOOGLE_CLIENT_ID,
	clientSecret: 	process.env.GOOGLE_CLIENT_SECRET,
	redirectUri: 	process.env.GOOGLE_REDIRECT_URI,
	signupUri: 		process.env.GOOGLE_SIGNUP_REDIRECT_URI,
	tokenUrl:		process.env.GOOGLE_TOKEN_URL,
	userinfoUrl:	process.env.GOOGLE_USERINFO_URL,
}

module.exports = {
	sqlConfig,
	authConfig,
}