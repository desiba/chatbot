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

    },

    user_banned_reasons : async function(userid, email, req, res){

    if(userid != undefined || userid == null){
      await  dbConn.query(`select ban_starts, ban_ends, active, note from user_bans where user_id = ${userid} ORDER BY ban_ends DESC LIMIT 1`,  (error, data) => {
            
            if (error) throw error;
            if (!data.length){
                let user_ban_details = {
                  fulfillmentText: 'i cant retrieve details with userid supplied' + userid,
                }
                res.json(user_ban_details);
            }else{
            
            

              let ban_start = data[0].ban_starts;
              let ban_ends = data[0].ban_ends;
              let active = data[0].active;
              let note = data[0].note;

              active = (active == 1) ? 'banned' : 'banned lifted';


              
              let user_ban_details = {
                fulfillmentText:  "Ban Starts: " +ban_start + 
                                  "\nBan Ends: " +ban_ends +
                                  "\nStatus: " + active +
                                  "\nReason: "+ note,
              }
              res.json(user_ban_details);

            

            }

          });
          

        }else{
            //if userid isnt used check for email of the user
            let user_ban_details = {
                fulfillmentText:  "search with email",
                                  
              }
              res.json(user_ban_details);

        }
    }
}