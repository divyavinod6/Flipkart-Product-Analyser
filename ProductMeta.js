const config = require('./config/config');
const Helper = require('./utils/helper');
 class ProductMeta{
    static getproductdata = async () => {
        console.log("inside getKeydata function")
        let [page,browser] = await Helper.createpage(); 
        page = await Helper.openurl(page, config.SCRAPE.flipkart.product_urlspec)  // calling openurl

        console.log('before wait 5s');
        await page.waitForTimeout(5000)
        console.log('after wait 5s')

        console.log("Scrapping data..");
        let product_data = await Helper.getProductmeta(page, config); // calling function getProductmeta
        console.log("PRODUCT DATA :", product_data)
        // await Helper.getSeller(page, config);
        console.log('before wait 5s');
        await page.waitForTimeout(5000)
        console.log('after wait 5s')
        /* OTHER SELLER DETAILS */
        let seller_data = await Helper.getSeller(page, config); // calling function
        console.log("done seller_data :", seller_data)
        }
 }
 module.exports = ProductMeta;
