const pool = require("./database")

const TABLE = 'articles'

class ArticlesWorker {
    
    static async getUrlsByStatus(status) {
        try {
            const query = `SELECT id,url FROM ${TABLE} WHERE crawl_status = ? order by id desc limit 6`;
            //const query = `SELECT id,url FROM ${TABLE} WHERE crawl_status = ? group by domain`;
            const result = await pool.query(query, [status]);
            return result;
        } catch (error) {
            console.log(error.stack);
            throw error;
        } 
    } 

    static async getArticles() {
        try {
            const query = `SELECT id,pubId,title,subtitle,author,pub_date,body,category,img,article_id,url FROM ${TABLE} WHERE crawl_status = 'C' and is_uploaded = 0 and pub_date is not null order by id desc limit 50`;
            //console.log('query ',query)
            const result = await pool.query(query);
            //console.log('result ',result)
            return result;
        } catch (error) {
            console.log(error.stack);
            throw error;
        } 
    } 

    static async getArticlesbyDate(lastDate) {
        try {
            const query = `SELECT * FROM ${TABLE} WHERE insert_date <=? and crawl_status!='I' order by id asc limit 250`;
            //const query = `SELECT * FROM ${TABLE} order by id asc limit 50`;
            console.log('query: ',query)
            const result = await pool.query(query,[lastDate]);
            //const result = await pool.query(query,[lastDate]);
            return result;
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
                    const query = `INSERT IGNORE INTO ${TABLE}(url,article_id,domain) VALUES ?;`;
                    const result = await pool.query(query,[mainArr]);
                    //console.log(mainArr)
                    mainArr = []  
                }
                count++;
            }
            if(mainArr.length > 0){
                const query = `INSERT IGNORE INTO ${TABLE}(url,article_id,domain) VALUES ?;`;
                    const result = await pool.query(query,[mainArr]);
            }
        } catch (error) {
            console.log(error.stack);
            status = false;
        } 
    }

    static async updateStatusByIds(status,ids){
        try {
            const query = `UPDATE ${TABLE} SET crawl_status= ? WHERE id IN ('${ids}');`;
            const result = await pool.query(query,[status]);
            return result;
        } catch (error) {
            console.log(error.stack);
            throw error;
        }
    }

    static async updateisUploadedAndStatus(status,ids,pids){
        try {
            const query = `UPDATE ${TABLE} SET crawl_status= ?,is_uploaded=1 WHERE id IN ('${ids}') and pubId IN (${pids});`;
            console.log('query: ',query)
            const result = await pool.query(query,[status]);
            return result;
        } catch (error) {
            console.log(error.stack);
            throw error;
        }
    }

    static async deletebyIds(ids){
        try {
            const query = `DELETE from ${TABLE} WHERE id IN (${ids});`;
            const result = await pool.query(query,[ids]);
            return result;
        } catch (error) {
            console.log(error.stack);
            throw error;
        }
    }
    static async updateStatusDByIds(status,ids){
        try {
            const query = `UPDATE ${TABLE} SET crawl_status= ? WHERE id IN (${ids});`;
            const result = await pool.query(query,[status]);
            return result;
        } catch (error) {
            console.log(error.stack);
            throw error;
        }
    }

    static async updateArticleData(id,payload){
        try {
            const query = `UPDATE IGNORE ${TABLE} SET pubId=?,title=?,subtitle=?,author=?,body=?,category=?,img=?,pub_date=?,insert_date=Now(),crawl_status='C' WHERE id=?`;
            const result = await pool.query(query,[payload.pubId,payload.title,payload.subtitle,payload.author,payload.body,payload.category,payload.image,payload.pubDate,id]);
            return result;
        } catch (error) {
            console.log(error.stack);
            throw error;
        }
    }

}

module.exports = ArticlesWorker;