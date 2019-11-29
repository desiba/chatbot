const sequelize = require('sequelize');
const axios = require('axios');
const db = require('../models/index');



module.exports = {

    payment_payload : async function(tag, req, res){

        axios.get(`http://amoneyadminlivedashboard.eu-west-3.elasticbeanstalk.com/api/v1/analytics-summary?tag=${tag}`)
            .then(function (response) {

                console.log(response.data.count);

                let count = response.data.count;
                let amount = response.data.amount;

                const {users, maleUsers} = count;
                const {loanBook} = amount;
                
                let analytic_response = {
                    fulfillmentText: JSON.stringify(response.data.count), 
                }
                res.json(analytic_response);
                
                

            })
            .catch(function (error) {
                
                console.log(error);
            });
        
    },


    auto_charge_user : async function(user_id, req, res){

            console.log(user_id)

        await db.sequelize.query(`select l.id from loan_requests l left join users u on u.id = l.user_id where (email = '${user_id}' or u.id = '${user_id}') order by l.created_at desc limit 1`,  { type: sequelize.QueryTypes.SELECT})
        .then(function(data){

            console.log(data);

            console.log(`https://adminreadonly.aellacredit.com/api/v1/loanrequests/charge-hundred-percent/loan/${data[0].id}`);

            axios.get(`https://adminreadonly.aellacredit.com/api/v1/loanrequests/charge-hundred-percent/loan/${data[0].id}`)
            .then(function (response) {

                console.log(response.data.message);

                

                let result_auto_charge = response.data.message
            
                let auto_charge_response = {
                    fulfillmentText: result_auto_charge,
                }
                res.json(auto_charge_response);

            })
            .catch(function (error) {
                //error response

                let error_auto_charge = 'message '+error.response.statusText +'\n data '+ error.response.data;
            
                let auto_charge_error_response = {
                    fulfillmentText: error_auto_charge,
                }
                res.json(auto_charge_error_response);
                console.log('error logging');
                console.log(error.response.status);
                console.log(error.response.statusText);
                console.log(error.response.data);

            });

        })
        .catch(err => {
            throw err;
            console.log(err);

        });


        
       
    }

}