const ReviewScrapperT = require('./ReviewSrapperT');
const Helper = require('./utils/helper');
const config = require('./config/config');

// main
(async () => {
  let rev_output = '';
  let rev_summary = '';
  let rev_sentiment = [];
  let prod_data = [];

  // passing url to crawler
  [prod_data, rev_output] = await ReviewScrapperT.getreviewdata(
    config.SCRAPE.flipkart.product_urlspec
  );

  console.log('prod_data: ', prod_data);
  console.log('rev_output: ', rev_output);

  // pass review_output to text summarisation model
  await Helper.text_summary_api({
    inputs: rev_output,
  }).then((response) => {
    // console.log('JSON.stringify(response)', JSON.stringify(response));
    rev_summary = response[0].summary_text;
    console.log('rev_summary: ', rev_summary);
  });
  // .then((rev_summary) => {
  //   console.log('rev_summary: ', rev_summary);
  // });

  // pass review_output to sentiment analysis model
  await Helper.sentiment_api({
    inputs: rev_summary,
  }).then((response) => {
    // console.log('JSON.stringify(response)', JSON.stringify(response));
    // console.log('response: ', response);
    rev_sentiment = response[0];
    console.log('rev_sentiment', rev_sentiment);
  });
  // .then((rev_sentiment) => {
  //   console.log('rev_sentiment', rev_sentiment);
  // });
  /*
  [[{"label":"positive","score":0.9162765741348267},{"label":"neutral","score":0.06376732885837555},{"label":"negative","score":0.019956080242991447}]]
  response:  [
    [
      { label: 'positive', score: 0.9162765741348267 },
      { label: 'neutral', score: 0.06376732885837555 },
      { label: 'negative', score: 0.019956080242991447 }
    ]
]
 */
})();
