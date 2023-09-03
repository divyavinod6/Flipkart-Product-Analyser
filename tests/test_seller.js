// const puppeteer = require('puppeteer');
// const Helper = require('../utils/helper');
// const config = require('../config/config');
// const bConfig = require('../config/browserConfig');
// const UserAgent = require('../UserAgents.json');
// const Res = require('../Res.json');


// (async () => {
//     let configDomain = 'flipkart';
//     let url = config.SCRAPE.flipkart.product_urlsel; 
    
//     let executablePath =bConfig.executablePath;
    
//     let browser = await Helper.getProfiledBrowser(executablePath)  
//     const page = await browser.newPage();

//     let userAgentVal = await Helper.getRandomInt(0, UserAgent.length)
//     await page.setUserAgent(UserAgent[userAgentVal])

//     let ResVal = await Helper.getRandomInt(0, Res.length)
//     await page.setViewport(Res[ResVal]); // res  { width: 1600, height: 900 }
//     let tabs = await browser.pages();
//     if (tabs.length > 1) {
//         tabs[0].close()
//     }

//     try {
//         await page.goto(url)
//         await page.waitForNavigation()
//     } catch (error) { // console.log(""); 
//     }

//     // }
//     console.log("Scrapping data..");
//     // let data = await Helper.getProductmeta(page, config);
//     // console.log("DATA :", data)
//     try {
//         let data = await page.evaluate(async (config) => {
//             let product_details;



//         },config)
//     }catch (error) {}
    

// })();