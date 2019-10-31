var dbConn = require('../config/dbConn');
const thousands = require('thousands');


module.exports = {

    total_users : function(req, res){

        dbConn.query("SELECT COUNT(*) AS totalusers FROM users",  (error, data) => {
            if (error) throw error;

              let res_total_users = data[0].totalusers;

                console.log(JSON.stringify(data));
           
                let total_users_response = {
                  fulfillmentText: thousands(res_total_users),
                }
                res.json(total_users_response);
                        
            });

    }
}