const puppeteer = require('puppeteer');
const Helper = require('../utils/helper');
const config = require('../config/config');
const bConfig = require('../config/browserConfig');
const UserAgent = require('../UserAgents.json');
const Res = require('../Res.json');

(async () => {
    let configDomain = 'flipkart';
    let url = config.SCRAPE.flipkart.review_url; 
    
    let executablePath =bConfig.executablePath;
    
    let browser = await Helper.getProfiledBrowser(executablePath)  
    let page = await browser.newPage();

    let userAgentVal = await Helper.getRandomInt(0, UserAgent.length)
    await page.setUserAgent(UserAgent[userAgentVal])

    let ResVal = await Helper.getRandomInt(0, Res.length)
    await page.setViewport(Res[ResVal]); // res  { width: 1600, height: 900 }
    let tabs = await browser.pages();
    if (tabs.length > 1) {
        tabs[0].close()
    }

    try {
        await page.goto(url)
        await page.waitForNavigation()
    } catch (error) {
        console.log(error)
    }

    
    console.log("Scrapping data.."); // in helper
    let review_gendata = await Helper.getReviewGen(page, config);  // call getReviewGen
    console.log("Review data: General :", review_gendata)
    
    // let review_metadata = await Helper.getReviewLoop(page, config);
    
    let flag = true;
    let page_count = 0;
    let review_array=[];
    let review_metadata;
    try {
            // await page.click(config.SCRAPE.flipkart.review_filter);
            await page.select(config.SCRAPE.flipkart.review_filter, 'NEGATIVE_FIRST');
            console.log('Before wait of 5s')
            await page.waitForTimeout(5000)
            console.log('After wait')
                        
        } catch (error) {
            console.log(error)
        }
    while (flag) {
        page_count++;
        console.log("PAGE NUMBER:", page_count);
        // let data_array=[];
        [review_metadata,page] = await Helper.getReviewLoop(page, config); // call  getReviewLoop return one page data(10 obj) 
        // console.log("data length ",review_metadata.length); 
        console.log("Review metadata: ",review_metadata[9]); 
        review_array.push(review_metadata);
        console.log("==========================");
        // console.log("Review data: General :", review_array);

        if(page_count > 1){
            flag = false;
        }
        else{
            console.log("next page..");            
            


        }
    }
    console.log("Review data: General :", review_array);

    
    
    

})();