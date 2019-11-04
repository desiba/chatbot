var dbConn = require('../config/dbConn');
const thousands = require('thousands');


module.exports = {

  total_loans_today :  function(req, res){
        
    const today_date = moment().format("YYYY-MM-DD");
    console.log(today_date);

     dbConn.query(`SELECT count(id) AS total_loan_today FROM loan_requests WHERE approval_status IN (1,3,7,9) AND loan_starts = '${today_date}'`,  (error, data) => {
        console.log(data);

        if (error) throw error;
      
          let result_total_disbursment_today = data[0].total_loan_today
          
          let total_loan_response = {
            fulfillmentText: thousands(result_total_disbursment_today),
          }
          res.json(total_loan_response);
                  
      });

    },

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

    user_banned_reasons : function(id, req, res){


    if(id != undefined || id != null){
        dbConn.query(`SELECT b.ban_starts, b.ban_ends, active, note 
                            FROM users u left 
                            JOIN user_bans b ON u.id = b.user_id 
                            WHERE (email = '${id}' or u.id = '${id}')`,  (error, data) => {
            
            if (error) throw error;
            if (!data.length){

                let user_ban_details = {
                  fulfillmentText: 'I can\'t retrieve details with id supplied ' + id,
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
                fulfillmentText:  "missing id (email, phonenumber or userid)",
                                  
              }
              res.json(user_ban_details);

        }
    }
}