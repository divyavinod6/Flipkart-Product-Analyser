const pool = require("./database")

const TABLE = 're_crawl'

class RecrawlWorker {

    static async getUrlsByStatus(status) {
        try {
            const query = `SELECT id,url,type FROM ${TABLE} WHERE status = ?`;
            const result = await pool.query(query, [status]);
            return result;
        } catch (error) {
            console.log(error.stack);
            throw error;
        } 
    } 

    static async getUrlsByStatusAndInterval(status,interval) {
        try {
            //const query = `SELECT id,url,type FROM ${TABLE} WHERE status = ? limit 2`;
            const query = `SELECT count(*) as count FROM ${TABLE} WHERE status = ? AND Date_SUB(Now(),INTERVAL ${interval}) > last_crawled;`
            const result = await pool.query(query, [status]);
            return result[0];
        } catch (error) {
            console.log(error.stack);
            throw error;
        } 
    } 

    static async insertUrlsBulk(urls) {
        let status = true;
        try {
            let size = urls.length;
            let count=1;
            let mainArr = []
            for(let i=0;i<size;i++){
                mainArr.push(Object.values(urls[i]))
                //console.log(JSON.stringify(urls[i]))
                if(count%2000 == 0){
                    const query = `INSERT IGNORE INTO ${TABLE}(url) VALUES ?;`;
                    const result = await pool.query(query,[mainArr]);
                    //console.log(mainArr)
                    mainArr = []  
                }
                count++;
            }
            if(mainArr.length > 0){
                const query = `INSERT IGNORE INTO ${TABLE}(url) VALUES ?;`;
                    const result = await pool.query(query,[mainArr]);
            }
        } catch (error) {
            console.log(error.stack);
            status = false;
        } 
    }

    static async updateStatusByIds(status,ids){
        try {
            const query = `UPDATE ${TABLE} SET status= ?,last_crawled = NOW() WHERE id IN ('${ids}');`;
            const result = await pool.query(query,[status]);
            return result;
        } catch (error) {
            console.log(error.stack);
            throw error;
        }
    }

    static async resetLastCrawled(interval){
        try {
            const query = `UPDATE ${TABLE} SET status='A';`;
            const result = await pool.query(query);
            return result;
        } catch (error) {
            console.log(error.stack);
            throw error;
        }
    }


}

module.exports = RecrawlWorker;