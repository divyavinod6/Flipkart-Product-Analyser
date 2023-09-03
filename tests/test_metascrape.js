const puppeteer = require('puppeteer');
const Helper = require('../utils/helper');
const config = require('../config/config');
const bConfig = require('../config/browserConfig');
const UserAgent = require('../UserAgents.json');
const Res = require('../Res.json');

(async () => {
    let url = config.SCRAPE.flipkart.test_url;
    const configDomain = "flipkart";

    // let executablePath =bConfig.executablePath;
    
    // let browser = await Helper.getProfiledBrowser(executablePath)  
    // const page = await browser.newPage();

    // let userAgentVal = await Helper.getRandomInt(0, UserAgent.length)
    // await page.setUserAgent(UserAgent[userAgentVal])

    // // let ResVal = await Helper.getRandomInt(0, Res.length)
    // // await page.setViewport(Res[ResVal]); // res  { width: 1600, height: 900 }
    // // let tabs = await browser.pages();
    // // if (tabs.length > 1) { // page = 
    // //     tabs[0].close()
    // // }

    // try {
    //     await page.goto(url)
    //     await page.waitForNavigation()
    // } catch (error) { 
    //     console.log(error); 
    // }

    // }
    console.log("Scrapping data..")
    let flag = true;
    let page_count = 0;
    let data_array=[];
    // LOOPS THROUGH PAGES
    while (flag) {
        page_count++;
        console.log("PAGE NUMBER:", page_count);
        // let data_array=[];
        let metadata = await Helper.getmetaData(page, config);
        // console.log("DATA: ",data.length);
        console.log("DATA: ",metadata);
        data_array.push(metadata);
        console.log("==========================");
        
        if(page_count > 1){
            flag = false;
        }
        else{
            console.log("next page..");
            console.log(config.SCRAPE.flipkart.nextbtn);            
            
            try {
                //page = await page.click(config.SCRAPE.flipkart.nextbtn);
                //await page.waitForNavigation();                
                await page.click(config.SCRAPE.flipkart.nextbtn);
                console.log('Before wait')
                await page.waitForTimeout(8000)
                console.log('After wait')
                
            } catch (error) {
                console.log(error);
            }

        }          
    }
    console.log("final :" + data_array + "length: "+ data_array.length)  //added
            

            
})();
