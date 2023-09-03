const config = require('./config/config');
const Helper = require('./utils/helper');
class ReviewScrapper {
  static getreviewdata = async (url) => {
    console.log('inside getreviewdata function');
    let [page, browser] = await Helper.createpage();
    page = await Helper.openurl(page, url); // calling openurl config.SCRAPE.flipkart.product_urlspec

    console.log('before wait 5s');
    await page.waitForTimeout(5000);
    console.log('after wait 5s');

    // click on review link
    console.log('clicking review url...');
    try {
      await page.click(config.SCRAPE.flipkart.review_link);
      await page.waitForTimeout(2000);
    } catch (error) {
      console.log(error);
    }

    console.log('Scrapping data..');
    // General details
    let review_gendata;
    try {
      review_gendata = await Helper.getReviewGen(page, config); // call getReviewGen
      console.log('Review data: Statistics :', review_gendata);
    } catch (e) {
      console.log('error in review_gendata ', e);
    }

    // Loop details
    try {
      // scrapping MOST_RECENT reviews
      await page.select(config.SCRAPE.flipkart.review_filter, 'MOST_RECENT');
      console.log('Before wait of 5s after MOST_RECENT');
      await page.waitForTimeout(5000);
      console.log('After wait');
    } catch (error) {
      console.log(error);
    }
    let flag = true;
    let page_count = 0;
    let review_array = [];
    let review_metadata;

    // scraping product name and image link
    let detail;
    let index;
    let img;
    let prod_name;
    let prod_data = [];
    let final_review = '';

    try {
      prod_data = await page.evaluate(async (config) => {
        console.log('details class', config.SCRAPE.flipkart.detail[0].img);
        detail = document.getElementsByClassName(
          config.SCRAPE.flipkart.detail[0].img
        ); // specification
        if (detail.length != 0) {
          index = 0;
        } else {
          index = 1;
        }
        // if index=0: its specification, else its product

        try {
          prod_name = document.getElementsByClassName(
            config.SCRAPE.flipkart.detail[index].prod_name
          );
        } catch (error) {
          console.log(error);
        }
        if (prod_name.length == 0) {
          try {
            prod_name = document.getElementsByClassName('_2WkVRV');
          } catch (e) {
            console.log(e);
          }
        }
        try {
          img = document.getElementsByClassName(
            config.SCRAPE.flipkart.detail[index].img
          );
        } catch (error) {
          console.log(error);
        }
        console.log('img.length: ', img.length);

        let product_name = prod_name[0].textContent;
        let img_href = img[0].src;

        console.log('product_name: ', product_name);
        console.log('img_href: ', img_href);

        return [product_name, img_href];
      }, config);
    } catch (e) {
      console.log(e);
    }
    // printing prod_data = prod_name, img_href
    console.log('prod_data: ', prod_data);

    // scrapping reviews for 2 pages in MOST RECENT
    while (flag) {
      page_count++;
      console.log('PAGE NUMBER:', page_count);
      // let data_array=[];
      [review_metadata, page] = await Helper.getReviewLoop(page, config); // call  getReviewLoop return one page data(10 obj)
      // console.log("data length ",review_metadata.length);
      console.log('Review metadata: ', review_metadata[9]);

      // Review string concatination
      for (let i = 0; i < review_metadata.length; i++) {
        final_review = final_review + review_metadata[i].review_text + ' ';
      }

      review_array.push(review_metadata);
      console.log('==========================');
      // console.log("Review data: General :", review_array);

      // loops for 5 pages
      if (page_count > 4) {
        flag = false;
      } else {
        console.log('next page..');
      }
    }
    console.log('Review data: General :', review_array);
    // closing browser
    await browser.close();

    // final review_string
    // console.log('final_review with emojis:', final_review);

    // remove emojis from review
    final_review = final_review.match(/[\w\s]+/g).join(' ');

    // console.log('final_review without emojis: ', final_review);
    return [prod_data, final_review];
    /*
      test summary output :-  Best chocolate A1 delivery Very bad product Good Nice product  everyone liked it thank you flipcart Good Bad Nice Super Best Arsh love Priya Melting chocolate   Love it Delicious  Will order again Please don t buy this product Good products Worth it   Good Good Really awesome product Yummmmmy I like it Very good good Nice Super iteam Good Yummy   Good   Wow   Waste product super Best Just wow   Bad quality Thank you   Very good quality and the taste is awesome  Love to order it again
     */
  };
}
module.exports = ReviewScrapper;
