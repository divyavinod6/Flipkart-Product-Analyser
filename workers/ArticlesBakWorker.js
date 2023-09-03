const pool = require("./database")

const TABLE = 'articles_bak'

class ArticlesBakWorker {
    


    static async insertUrlsBulk(mainArr) {
        let status = false;
        try {
            if(mainArr.length > 0){
                const query = `INSERT IGNORE INTO ${TABLE}(id,article_id,pubId,url,title,subtitle,author,body,category,img,pub_date,crawl_status,insert_date,is_uploaded,domain) VALUES ?;`;
                await pool.query(query,[mainArr]);
                status = true;
            }
            
        } catch (error) {
            console.log(error.stack);
            
        }
        return status;
    }


}

module.exports = ArticlesBakWorker;