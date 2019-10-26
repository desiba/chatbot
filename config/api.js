var apiai = require('apiai');
var uuidv1 = require('uuid/v1');

// read the api.ai docs : https://api.ai/docs/

//Enter your API Key
var app = apiai(process.env.API_AI_KEY);


// Function which returns speech from api.ai
var getRes = function(query) {
  var request = app.textRequest(query, {
      sessionId: uuidv1()
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
getRes('hello').then(function(res){console.log(res)});
getRes('why user is banned').then(function(res){console.log(res)});


module.exports = {getRes}
