// let review_metadata = [
//   {
//     review_text: 'Best chocolate A1 delivery',
//     review_rate: '1',
//     profile_name: 'Shubham Kumar',
//     review_date: '10 days ago',
//     certified_place: 'Certified Buyer, Teghra',
//   },
//   {
//     review_text: 'Very bad product',
//     review_rate: '5',
//     profile_name: 'Riya Dey',
//     review_date: '22 days ago',
//     certified_place: 'Certified Buyer, Amlagora',
//   },
//   {
//     review_text: 'Good',
//     review_rate: '5',
//     profile_name: 'Flipkart Customer',
//     review_date: '23 days ago',
//     certified_place: 'Certified Buyer, Bermo',
//   },
//   {
//     review_text: 'Nice product ...everyone liked it..thank you flipcart',
//     review_rate: '5',
//     profile_name: 'Manasa Bisoi',
//     review_date: '1 month ago',
//     certified_place: 'Certified Buyer, Srikakulam District',
//   },
//   {
//     review_text: 'Good',
//     review_rate: '2',
//     profile_name: 'Vipin Jaiswal',
//     review_date: '1 month ago',
//     certified_place: 'Certified Buyer, Mehnagar',
//   },
//   {
//     review_text: 'Bad',
//     review_rate: '5',
//     profile_name: 'Deepak Chandra',
//     review_date: '1 month ago',
//     certified_place: 'Certified Buyer, New Delhi',
//   },
//   {
//     review_text: 'Nice',
//     review_rate: '5',
//     profile_name: 'Puneet Yadav',
//     review_date: '1 month ago',
//     certified_place: 'Certified Buyer, Ghazipur',
//   },
//   {
//     review_text: 'Super',
//     review_rate: '5',
//     profile_name: 'Dipanshu kumar',
//     review_date: '2 months ago',
//     certified_place: 'Certified Buyer, Mirganj',
//   },
//   {
//     review_text: 'Best',
//     review_rate: '5',
//     profile_name: 'Varjin Talukdar',
//     review_date: '2 months ago',
//     certified_place: 'Certified Buyer, Nalbari',
//   },
//   {
//     review_text: 'Arsh love Priya',
//     review_rate: 'undefined',
//     profile_name: 'Arsh Jii',
//     review_date: '2 months ago',
//     certified_place: 'Certified Buyer, Nalanda District',
//   },
// ];
// console.log(review_metadata.length);
// let final_review = '';
// // final string
// for (let i = 0; i < review_metadata.length; i++) {
//   final_review = final_review + review_metadata[i].review_text + ' ';
// }
// console.log('final_review:', final_review);

// Use a regular expression to remove emojis
// let final_review =
//   " Best chocolate A1 delivery Very bad product Good Nice product ...everyone liked it..thank you flipcart Good Bad Nice Super Best Arsh love Priya Melting chocolate 🍫 Love it Delicious. Will order again Wow Good Price high Ilove it Best Nice Good Good product Goog Good nice Thank you Good 👍 Nice Super iteam Good Yummy 😋 Good 👍 Wow ❤️❤️❤️ Waste product Please don't buy this product Good products Worth it ❣️ Good Good Really awesome product Yummmmmy I like it Very good good super Best Just wow ❤️😍 Bad quality Thank you 💖 Very good quality and the taste is awesome. Love to order it again Average Nice Good Good Leakage Yummy 😋 Good I love it Happy with silk purchase. I got this in best condition Seller gives this choclate with ice pack for better condition of chocolates Good very good Good geniune, long Expiry date. Nice Thats a multipurpose chocklet.";
// Use a regular expression to extract words and numbers (alphanumeric characters and spaces)
// const extractedWordsAndNumbers = final_review.match(/[\w\s]+/g).join(' ');

// console.log(extractedWordsAndNumbers);

// async function query(data) {
//   const response = await fetch(
//     'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest',
//     {
//       headers: {
//         Authorization: 'Bearer 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',
//       },
//       method: 'POST',
//       body: JSON.stringify(data),
//     }
//   );
//   const result = await response.json();
//   return result;
// }
// let final_review =
//   'Best chocolate A1 delivery Very bad product Good Nice product  everyone liked it thank you flipcart Good Bad Nice Super Best Arsh love Priya Melting chocolate   Love it Delicious  Will order again Please don t buy this product Good products Worth it   Good Good Really awesome product Yummmmmy I like it Very good good Nice Super iteam Good Yummy   Good   Wow   Waste product super Best Just wow   Bad quality Thank you   Very good quality and the taste is awesome  Love to order it again';
// query({
//   inputs: final_review,
// }).then((response) => {
//   console.log(JSON.stringify(response));
//   console.log('response: ', response);
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

// async function query(data) {
//   const response = await fetch(
//     'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
//     {
//       headers: {
//         Authorization: 'Bearer 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',
//       },
//       method: 'POST',
//       body: JSON.stringify(data),
//     }
//   );
//   const result = await response.json();
//   return result;
// }

// query({
//   inputs:
//     'Best chocolate A1 delivery Very bad product Good Nice product  everyone liked it thank you flipcart Good Bad Nice Super Best Arsh love Priya Melting chocolate   Love it Delicious  Will order again Wow Good Price high Ilove it Best Nice Good Good product Goog Good nice Thank you Good   Nice Super iteam Good Yummy   Good   Wow   Waste product Please don t buy this product Good products Worth it   Good Good Really awesome product Yummmmmy I like it Very good good super Best Just wow   Bad quality Thank you   Very good quality and the taste is awesome  Love to order it again Average Nice Good Good Leakage Yummy   Good I love it Happy with silk purchase  I got this in best condition Seller gives this choclate with ice pack for better condition of chocolates Good very good Good geniune  long Expiry date  Nice Thats a multipurpose chocklet',
// }).then((response) => {
//   console.log(JSON.stringify(response));
// });

// let response = [
//   [
//     { label: 'positive', score: 0.948103666305542 },
//     { label: 'neutral', score: 0.03827410191297531 },
//     { label: 'negative', score: 0.013622265309095383 },
//   ],
// ];
// let res_arr = [];
// res_arr = response[0];
// console.log('res_arr', res_arr);

// let response = [
//   {
//     summary_text:
//       'Best chocolate A1 delivery Very bad product Good Nice product  everyone liked it thank you flipcart Good Bad Nice Super Best Arsh love Priya Melting chocolate   Love it Delicious  Will order again Wow Good Price high Ilove it Best Nice Good Good product Goog Good nice Thank you Good   Nice Super iteam Good Yummy   Good Good Really awesome product Yummmmmy I like it Very good good super Best Just wow   Bad quality',
//   },
// ];

// let rev_summary = '';
// rev_summary = response[0].summary_text;
// console.log('rev_summary', rev_summary);
