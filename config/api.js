var apiai = require('apiai');

// read the api.ai docs : https://api.ai/docs/

//Enter your API Key
var app = apiai(process.env.CLIENT_ACCESS_TOKEN);
//var app = apiai("843e044bf18b430cbce8dbf2c8181cb4");


// Function which returns speech from api.ai
var getRes = function(query) {
  var request = app.textRequest(query, {
      sessionId: process.env.DEVELOPER_ACCESS_TOKEN
  });
const responseFromAPI = new Promise(
        function (resolve, reject) {
            request.on('error', function(error) {
            reject(error);
});

  request.on('response', function(response) {
      resolve(response.result.fulfillment.speech);
  });

  request.on('error', function(error) {
    console.log(error);
  });

});
request.end();
  return responseFromAPI;
};


//getRes('who linked this card 539941 9993 03/20').then(function(res){console.log(res)});
//getRes('why user was banned 24497').then(function(res){console.log(res)});
//getRes('why user was banned sanchiogo@gmail.com').then(function(res){console.log(res)});
//getRes('total loans disbursed today').then(function(res){console.log(res)});
//getRes('loan disbursed for this week').then(function(res){console.log(res)});
//getRes('loan disbursed for this month').then(function(res){console.log(res)});
//getRes('who linked this card 536613 9939 11/2020').then(function(res){console.log(res)});
//getRes('537010 0547  05/2022').then(function(res){console.log(res)});




module.exports = {getRes}
