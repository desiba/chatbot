const thousands = require('thousands');
const db = require('../models/index');
const sequelize = require('sequelize');


module.exports = {

  total_users_joined_today : async function(req, res){
    let today_date = moment().format("YYYY-MM-DD");

    db.sequelize.query(`SELECT count(id) as total_users_today FROM users WHERE created_at LIKE '${today_date} %'`, { type: sequelize.QueryTypes.SELECT})
    .then(function(total_users_joined_today) {
        let users_joined_today = total_users_joined_today[0].total_users_today;
        let total_users_today = {
          fulfillmentText: users_joined_today,
        }
        res.json(total_users_today);
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
  },

  total_users_today :  function(req, res){
        
    //let today_date = moment().format("YYYY-MM-DD");

      db.sequelize.query(`SELECT count(id) AS total_users_today FROM loan_requests WHERE approval_status IN (1,3,7,9) AND loan_starts = '${loandate}'`,  { type: sequelize.QueryTypes.SELECT})
      .then(function(data){

          let result_total_disbursment_today = data[0].total_loan_today;
          
          let total_loan_response = {
            fulfillmentText: thousands(result_total_disbursment_today),
          }
          res.json(total_loan_response);
                  
      })
      .catch(err => {
        throw err;
        console.log(err);
    });

    },

    total_users : function(req, res){

      db.sequelize.query(`SELECT COUNT(*) AS totalusers FROM users`,  { type: sequelize.QueryTypes.SELECT})
        .then(function(data){
          let res_total_users = data[0].totalusers;
          let total_users_response = {
            fulfillmentText: thousands(res_total_users),
          }
          res.json(total_users_response);
        })
        .catch(err => {
          throw err;
          console.log(err);

      });

        
    },

    user_banned_reasons : function(id, req, res){


    if(id != undefined || id != null){

      db.sequelize.query(`SELECT b.ban_starts, b.ban_ends, active, type_text, note , b.created_at
                          FROM users u left 
                          JOIN user_bans b ON u.id = b.user_id 
                          WHERE (b.active = '1' AND email = '${id}' or u.id = '${id}') 
                          ORDER BY created_at DESC LIMIT 1`,  
                          { type: sequelize.QueryTypes.SELECT})
        .then(function(data){

          if (!data.length){

            let user_ban_details = {
              fulfillmentText: 'please try again with the user\'s' + id,
            }
            res.json(user_ban_details);
            
          }else{
      
            let ban_start = data[0].ban_starts;
            let ban_ends = data[0].ban_ends;
            let active =  (data[0].active == 1) ? 'banned' : 'ban lifted';
            let note = (data[0].note != null) ? data[0].note : data[0].type_text;

            let user_ban_details = {
              fulfillmentText:  "Ban Starts: " +ban_start + 
                                "\nBan Ends: " +ban_ends +
                                "\nStatus: " + active +
                                "\nReason: "+ note,
            }
            res.json(user_ban_details);
          }
          
        })
        .catch(err => {
          throw err;
          console.log(err);

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