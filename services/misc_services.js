const sequelize = require('sequelize');
const axios = require('axios');
const db = require('../models/index');



module.exports = {

    payment_payload : async function(tag, req, res){


        axios.get(`https://adminreadonly.aellacredit.com/api/v1/analytics-summary?tag=${tag}`)
            .then(function (response) {

                const {users, maleUsers,
                     femaleUsers, 
                     customers, 
                     maleCustomers, femaleCustomers, eligibilityTests, declinedEligibilityTests, allLoans, allLoansApproved, allLoansDeclined, allLoansDisbursed, allLoansRunning, allLoansPartiallyRepaid, allLoansCompletelyRepaid, nonPerformingLoans, defaulters, customersWithTwoLoans, customersWithThreeLoans, customersWithFourOrMoreLoans} = response.data.count;
                const {loanBook} = response.data.amount;
                
                let analytic_response = {
                    fulfillmentText: `
                                        Count Based Analytic Summary for ${tag}
                                        Users : ${users} 
                                        Male-Users : ${maleUsers} 
                                        Female-Users : ${femaleUsers}
                                        Customers : ${customers}
                                        Male-Customers : ${maleCustomers}
                                        Female-Customers : ${femaleCustomers} 
                                        Eligibility Tests : ${eligibilityTests}
                                        Eligibility Declined : ${declinedEligibilityTests} 
                                        All Loans : ${allLoans}
                                        All Loans Approved : ${allLoansApproved} 
                                        All Loans Declined : ${allLoansDeclined} 
                                        All Loans Disbursed : ${allLoansDisbursed}
                                        All Loans Running : ${allLoansRunning} 
                                        All Partially Repaid Loans : ${allLoansPartiallyRepaid} 
                                        All Loans Completely Repaid : ${allLoansCompletelyRepaid} 
                                        Non Performing Loans : ${nonPerformingLoans} 
                                        Numbers of Defaulters : ${defaulters}
                                        Customers with two Loans : ${customersWithTwoLoans}
                                        Customers with three Loans  : ${customersWithThreeLoans}
                                        Customers with four or more Loans : ${customersWithFourOrMoreLoans}
                                        
                                     `
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
            axios.get(`https://adminreadonly.aellacredit.com/api/v1/loanrequests/charge-hundred-percent/loan/${data[0].id}`)
            .then(function (response) {

                let auto_charge_response = {
                    fulfillmentText: response.data.message,
                }
                res.json(auto_charge_response);

            })
            .catch(function (error) {
               
                let auto_charge_error_response = {
                    fulfillmentText: JSON.stringify(error.response.data.message),
                }
                res.json(auto_charge_error_response);

            });

        })
        .catch(err => {
            throw err;
            console.log(err);

        });


        
       
    }

}