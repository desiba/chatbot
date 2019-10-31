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

// test the command :
getRes('hi').then(function(res){console.log(res)});
getRes('hello').then(function(res){console.log(res)});
getRes('total number of users').then(function(res){console.log(res)});
getRes('total loan disbursed').then(function(res){console.log(res)});
getRes('total disbursment for today').then(function(res){console.log(res)});
getRes('who linked this card 4847 384743').then(function(res){console.log(res)});

getRes('who linked this card 418742 9594').then(function(res){console.log(res)});
getRes('why user was banned 24497').then(function(res){console.log(res)});
getRes('why user was banned 4747489').then(function(res){console.log(res)});



module.exports = {getRes}
