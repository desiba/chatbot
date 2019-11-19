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


getRes('loans on 2018-02-10').then(function(res){console.log(res)});



module.exports = {getRes}
