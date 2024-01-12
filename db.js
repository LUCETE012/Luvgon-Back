const { sql, poolPromise } = require("./config/server");

class SqlError extends Error {
    constructor(message) {
      super(message);
      this.name = "SqlError";
    }
}

class SqlConnector {
    constructor() {
        this.connPool = (async () => await poolPromise)();

        this.user = null;

    }

    /**
     * 사용자 이메일을 등록하는 함수
     * OAuth 연결 이후 바로 실행 요망
     * @param {String} email 사용자 이메일
     */
    setUser(email) {
        this.user = email;
    }

    /**
     * 사용자의 팔로잉 목록을 가져오는 함수
     * @returns {String[]} 팔로잉 목록
     */
    async getFollowings() {
        if (this.user == null)
            throw new SqlError('SqlConnector.user is empty.');

//         const connPool = await poolPromise;
        const result = await this.connPool.request()
            .input('user', sql.VarChar, this.user)
            .query('SELECT following FROM Following WHERE [user] = @user;');

        return result.recordset;
    }

    /**
     * 특정 사용자의 목표 목록을 받아오는 함수
     * @param {String} user 사용자 이메일
     * @param {Number} month 월
     * @returns 
     */
    async getGoals(user, month) {
        return [];
    }

    
    /**
     * 현재 사용자의 목표 목록을 받아오는 함수
     * @param {Number} month 월
     */
    async getGoals(month) {
        if (this.user == null)
            throw new SqlError('SqlConnector.user is empty.');

        return getGoals(this.user, month);
    }
}

module.exports = {
    SqlConnector
}