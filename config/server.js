/**
 * 
 *  server.js
 *  SQL server configuration
 * 
 *  Created: 2024-01-12
 *  Last modified: -
 * 
 */

const sql = require('mssql');
const { sqlConfig } = require('./config.js');

const poolPromise = new sql.ConnectionPool(sqlConfig)
	.connect()
	.then(pool => {
		console.log('DB에 연결되었습니다.');
		return pool;
	})
	.catch(err => console.log('DB 연결에 실패하였습니다: ', err))

module.exports = {
	sql, poolPromise
}