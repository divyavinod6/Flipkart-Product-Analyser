const express = require('express');
const bodyParser = require('body-parser');
const ReviewScrapperT = require('./ReviewSrapperT'); // Import your existing code module
const Helper = require('./utils/helper'); // Import your existing code module
const config = require('./config/config'); // Import your existing code module

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Replace 'index.html' with your HTML file's name
});

// Handle the product URL submission
app.post('/process-url', async (req, res) => {
  try {
    let { my_url } = req.body;

    let rev_output = '';
    let rev_summary = '';
    let rev_sentiment = [];
    let prod_data = [];

    // Call your existing code with the provided URL
    [prod_data, rev_output] = await ReviewScrapperT.getreviewdata(my_url);

    // Pass review_output to text summarization model
    let textSummaryResponse = await Helper.text_summary_api({
      inputs: rev_output,
    });
    rev_summary = textSummaryResponse[0].summary_text;

    // Pass review_output to sentiment analysis model
    let sentimentResponse = await Helper.sentiment_api({
      inputs: rev_summary,
    });
    rev_sentiment = sentimentResponse[0];

    console.log('response ready in app.js');
    // Send the response back to the client
    res.json({ prod_data, rev_summary, rev_sentiment });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
