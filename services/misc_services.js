const sequelize = require('sequelize');
const axios = require('axios');
const db = require('../models/index');



module.exports = {



    auto_charge_user : async function(user_id, req, res){


        await db.sequelize.query(`select l.id from loan_requests l left join users u on u.id = l.user_id where (email = '${user_id}' or u.id = '${user_id}') order by l.created_at desc limit 1`,  { type: sequelize.QueryTypes.SELECT})
        .then(function(data){

            //console.log(data)

            axios.get(`http://amoneyadminlivedashboard.eu-west-3.elasticbeanstalk.com/api/v1/loanrequests/charge-hundred-percent/loan/${data[0].id}`)
            .then(function (response) {

                console.log(response);


               

            })
            .catch(function (error) {
                // handle error

                console.log(error);
            });

        })
        .catch(err => {
            throw err;
            console.log(err);

        });


        
       
    }

}