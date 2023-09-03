const puppeteer = require('puppeteer');
const Helper = require('../utils/helper');
const config = require('../config/config');
const bConfig = require('../config/browserConfig');
const UserAgent = require('../UserAgents.json');
const Res = require('../Res.json');

// domain = flipkart 
// url = https://www.flipkart.com/
let keyword = 'shoes';
searchKey(keyword)

async function searchKey (keyword){
    let url = config.SCRAPE.flipkart.Url;
    const configDomain = "flipkart";

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
        await page.goto(url)
        await page.waitForNavigation(40000);
    } catch (error) {
        console.log(error);
        
    }

    console.log("before login popup")   
    await page.click(config.SCRAPE.flipkart.loginCross);
    await page.waitForTimeout(2000);
    console.log("after login popup")    
    
    await page.type(config.SCRAPE.flipkart.searchBar, keyword , {delay: 100});  // enter keyword input        
    await page.click(config.SCRAPE.flipkart.searchBtn)
    await page.waitForTimeout(2000);

    // let ResVal = await Helper.getRandomInt(0, Res.length)
    // await page.setViewport(Res[ResVal]); // res  { width: 1600, height: 900 }
    // let tabs = await browser.pages();
    // if (tabs.length > 1) {
    //     tabs[0].close()
    // }
// Scraping url
    // try {
    //     console.log("Scraping URL : ", url);
    //     console.log("Scraping configDomain : ", config.SCRAPE[configDomain].product_name);
    //     // console.log("PAGE", page);
        
    //     await Helper.getMeta(configDomain);
    //     // console.log(data)
    // } catch (e) {
    //     console.log(e);
    // }





    // let userAgentVal = await Helper.getRandomInt(0, UserAgent.length)
    // console.log("Random useragent: ",UserAgent[userAgentVal])
    // console.log("res lenght:", Res.length)
    // let ResVal = await Helper.getRandomInt(0, Res.length)
    // console.log("Random res: ",Res[ResVal])
    
};






    
    
    




