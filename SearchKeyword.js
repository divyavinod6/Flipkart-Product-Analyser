const config = require('./config/config');
const Helper = require('./utils/helper');
 class SearchKeyword{
    static getKeydata = async (keyword) => {
        console.log("inside getKeydata function")
        let [page,browser] = await Helper.createpage(); 
        page = await Helper.openurl(page, config.SCRAPE.flipkart.Url)  // calling openurl
        // try {                       
        //     await page.goto(url)
        //     await page.waitForNavigation(40000);
        // } catch (error) {
        //     console.log(error);
            
        // }
        
        // await page.goto(config.SCRAPE.flipkart.test_url); 
        console.log('before wait 5s');
        await page.waitForTimeout(5000)
        console.log('after wait 5s')
        // closing login popup
        console.log("before login popup")   
        await page.click(config.SCRAPE.flipkart.loginCross);
        await page.waitForTimeout(2000);
        console.log("after login popup")    

        // Enter keyword input
        await page.type(config.SCRAPE.flipkart.searchBar, keyword , {delay: 100});  
        try {
            await page.click(config.SCRAPE.flipkart.searchBtn) 
            await page.waitForTimeout(2000);
        } catch (error) {
            console.log(error)
        }       
        
        // Get Result data
        console.log("Scrapping data..")
        let flag = true;
        let page_count = 0;
        let data_array=[];
        // LOOPS THROUGH PAGES
        while (flag) {
            page_count++;
            console.log("PAGE NUMBER:", page_count);
            // calling getmetaData 
            let metadata = await Helper.getmetaData(page, config);
            // console.log("DATA: ",data.length);
            console.log("DATA OF PAGE: "+ page_count +" "+ metadata);
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
        console.log("final :" + data_array)  //added
    }
    
}
module.exports = SearchKeyword;