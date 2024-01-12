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

const config = {
    server: process.env.DB_DEV_SERVER,
	datebase: 'Luvgon',//process.env.DB_DEV_DATEBASE,
	user: process.env.DB_DEV_USERNAME,
	password: process.env.DB_DEV_PASSOWRD,
	options: {
        encrypt: true,
		database: 'Luvgon'
    },
}

module.exports = {
	config
}