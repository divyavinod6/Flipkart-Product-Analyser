const config = require('./config/config');
const Helper = require('./utils/helper');
class ReviewScrapper {
  static getreviewdata = async () => {
    console.log('inside getreviewdata function');
    let [page, browser] = await Helper.createpage();
    page = await Helper.openurl(page, config.SCRAPE.flipkart.review_url); // calling openurl

    console.log('before wait 5s');
    await page.waitForTimeout(5000);
    console.log('after wait 5s');

    console.log('Scrapping data..');
    // General details
    let review_gendata = await Helper.getReviewGen(page, config); // call getReviewGen
    console.log('Review data: General :', review_gendata);

    // Loop details
    try {
      // await page.click(config.SCRAPE.flipkart.review_filter);
      await page.select(config.SCRAPE.flipkart.review_filter, 'NEGATIVE_FIRST');
      console.log('Before wait of 5s');
      await page.waitForTimeout(5000);
      console.log('After wait');
    } catch (error) {
      console.log(error);
    }
    let flag = true;
    let page_count = 0;
    let review_array = [];
    let review_metadata;
    while (flag) {
      page_count++;
      console.log('PAGE NUMBER:', page_count);
      // let data_array=[];
      [review_metadata, page] = await Helper.getReviewLoop(page, config); // call  getReviewLoop return one page data(10 obj)
      // console.log("data length ",review_metadata.length);
      console.log('Review metadata: ', review_metadata[9]);
      review_array.push(review_metadata);
      console.log('==========================');
      // console.log("Review data: General :", review_array);

      if (page_count > 1) {
        flag = false;
      } else {
        console.log('next page..');
      }
    }
    console.log('Review data: General :', review_array);
  };
}
module.exports = ReviewScrapper;
