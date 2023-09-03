const puppeteer = require('puppeteer');
const Helper = require('../utils/helper');
const config = require('../config/config');
const bConfig = require('../config/browserConfig');
const UserAgent = require('../UserAgents.json');
const Res = require('../Res.json');


(async () => {
    let configDomain = 'flipkart';
    let url = config.SCRAPE.flipkart.product_urlsel; 
    
    let executablePath =bConfig.executablePath;
    
    let browser = await Helper.getProfiledBrowser(executablePath)  
    const page = await browser.newPage();

    let userAgentVal = await Helper.getRandomInt(0, UserAgent.length)
    await page.setUserAgent(UserAgent[userAgentVal])

    let ResVal = await Helper.getRandomInt(0, Res.length)
    await page.setViewport(Res[ResVal]); // res  { width: 1600, height: 900 }
    let tabs = await browser.pages();
    if (tabs.length > 1) {
        tabs[0].close()
    }

    try {
        await page.goto(url); // product page
        await page.waitForTimeout(10000);
        // await page.waitForNavigation()
    } catch (error) { // console.log(""); 
    }

    // }
    console.log("Scrapping data..");
    let data = await Helper.getProductmeta(page, config); // calling function getProductmeta
    console.log("DATA :", data)
    // await Helper.getSeller(page, config);
    /* OTHER SELLER DETAILS */
    let seller_data = await Helper.getSeller(page, config); // calling function
    console.log("done seller_data :", seller_data)
    // try {
    //     let data = await page.evaluate(async (config) => {
    //         let product_details;
    //         // let descript;
    //         // let base_price;
    //         // let discount_price;
    //         let img_link;
    //         let rate_score;
    //         let rate_review;
    //         let seller;
    //         let seller_rate;
    //         let review_link;
    //         let specification;
    //         let manufacturer_arr = [];
    //         let generic_details;
    //         let manufact_details;
    //         // let assured;
    //         try{
    //             img_link = document.getElementsByClassName(config.SCRAPE.flipkart.img_link); //array of 7
    //             console.log("image :", img_link);
    //         }catch(error){}
    //         try{
    //             rate_score = document.getElementsByClassName(config.SCRAPE.flipkart.rate_score);
    //         }catch(error){
    //             console.log(error);
    //         }
    //         try{
    //             rate_review = document.getElementsByClassName(config.SCRAPE.flipkart.rate_review);
    //         }catch(error){
    //             console.log(error);
    //         }
    //         try{
    //             seller = document.querySelectorAll(config.SCRAPE.flipkart.seller); 
    //         }catch(error){
    //             console.log(error);
    //         }
    //         try{
    //             seller_rate = document.getElementsByClassName(config.SCRAPE.flipkart.seller_rate);
    //         }catch(error){
    //             console.log(error);
    //         }
    //         try{
    //             review_link = document.querySelectorAll(config.SCRAPE.flipkart.review_link);
    //         }catch(error){
    //             console.log("not more than 3 reviews")
    //         }
    //         try {
    //             specification = document.getElementsByClassName(config.SCRAPE.flipkart.specification);                
    //         } catch (error) {
    //             console.log('specification selector not found')
    //         }
    //         try{
    //             product_details = document.getElementsByClassName(config.SCRAPE.flipkart.product_details);
    //         }catch(e){
    //             console.log('prod selector not found');
    //         }
    //         try{
    //             generic_details = document.getElementsByClassName(config.SCRAPE.flipkart.generic_details);
    //         }catch(e){
    //             console.log(error);
    //         }
    //         try{
    //             manufact_details = document.getElementsByClassName(config.SCRAPE.flipkart.manufact_details);
    //         }catch(e){
    //             console.log(error);
    //         }
    //         console.log("SELETORS FOUND")


    //         // // try {
    //         //     assured = document.querySelectorAll(config.SCRAPE.flipkart.assured);        
    //         // } catch (error) {assured = false}

            
    //         let image_arr = [];
    //         for (let i=0; i < img_link.length; i++){
    //             image_arr.push(img_link[i].src);
    //         }
    //         console.log("image :", image_arr);
    //         let rating = rate_score[0].textContent;
    //         console.log("rate_score :", rating);
    //         let rate_rev = rate_review[0].textContent;
    //         console.log("rate_review :", rate_rev);
    //         let sel_nm = seller[0].textContent;
    //         console.log("selnm :", sel_nm);
    //         let sel_rate = seller_rate[0].textContent;
    //         console.log("sel rate: ",sel_rate);
    //         let rlink = review_link[0].href;
    //         console.log("rev link: ", rlink);
    //         /*specifiaction*/
    //         specific_det = [];
    //         try {
    //             // specific_det = [];
    //             for(let i= 0 ; i< specification.length ;i++){
    //                 let detail = specification[i].innerText;
    //                 specific_det.push(detail);
    //             }
    //             console.log(specific_det);
    //             // specif_manucfacturer = document.getElementsByClassName(config.SCRAPE.flipkart.specif_manucfacturer);
    //             // specif_manucfacturer[0].click();
    //         } catch (error) {
    //             specific_det = 'undefined';
    //         }
    //         console.log("specific_det", specific_det);
    //         /*product details*/
    //         let prod_det;
    //         try {
    //             prod_det = product_details[0].innerText;
    //             // click manufact,product,import info
    //             product_manufacturer = document.querySelectorAll(config.SCRAPE.flipkart.product_manufacturer);
    //             product_manufacturer[0].click();
                
    //         } catch (error) {
    //             prod_det = 'undefined';
    //         }
    //         console.log("prod_details", prod_det );
            
    //         // click manufact,product,import info
    //         let specif_manucfacturer;
    //         try{
    //             specif_manucfacturer = document.getElementsByClassName(config.SCRAPE.flipkart.specif_manucfacturer);
    //             console.log("click selector:", specif_manucfacturer);
    //             specif_manucfacturer[0].click();
    //         }catch(e){
    //             console.log(e);
    //         }
            
    //         let generic_det = generic_details[0].innerText;
    //         let manufact_det = manufact_details[0].innerText;
    //         manufacturer_arr.push(generic_det,manufact_det);


            
    //         console.log("entering obj..")
    //         let obj= {
    //             // description : des,
    //             // baseprice : base_p,
    //             // salesprice : des_p,
    //             images : image_arr,
    //             ratings : rating,
    //             reviews : rate_rev,
    //             seller_name: sel_nm,
    //             seller_rating: sel_rate,
    //             review_url: rlink,
    //             specification: specific_det,
    //             product_details : prod_det,
    //             Manufacturing_info : manufacturer_arr,

    //         }
    //         console.log("out of obj..")
    //         console.log("object: ",obj);
    //         // let manufact;
    //         // try{
    //         //     manufact = document.querySelectorAll(config.SCRAPE.flipkart.manufacturer);
    //         //     manufact[0].click();
    //         // }catch(e){}
            
    //         return obj;  


    //     },config)
    //     console.log("DATA :", data)  // return data;
    // } catch (error) {}
    


})();
