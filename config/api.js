var apiai = require('apiai');

// read the api.ai docs : https://api.ai/docs/

//Enter your API Key
var app = apiai(process.env.CLIENT_ACCESS_TOKEN);

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






//getRes('payment summary today').then(function(res){console.log(res)});



getRes('who linked card 485474 5484 11/2020').then(function(res){console.log(res)});

//getRes('total loans disbursed on 20-04-2019').then(function(res){console.log(res)});

//getRes('total amount of loans disbursed yesterday').then(function(res){console.log(res)});

//getRes('total loans disbursed').then(function(res){console.log(res)});

module.exports = {getRes}
