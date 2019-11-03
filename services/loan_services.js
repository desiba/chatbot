var dbConn = require('../config/dbConn');
const thousands = require('thousands');
const moment = require('moment');

let now = moment();


module.exports = {

    total_loan_disbursed_range :  async function(qryText, req, res){
        
        let req_match_month = /\bMONTH|\bthis month|\bmonth/g.test(qryText);
       // let req_match_week = /\bWEEK|\bthis week|\bweek/g.test(qryText);
        
        let period = (req_match_month) ? 'isomonth' : 'isoweek';
            console.log(period);
            
        const start = now.startOf(period).format("YYYY-MM-DD"),
         end = now.endOf(period).format("YYYY-MM-DD");


         console.log(start +' '+end);

               

         await dbConn.query(`SELECT SUM(amount) AS total_loan_date_range FROM loan_requests WHERE approval_status IN (1,3,7,9) AND loan_starts BETWEEN '${start}' AND '${end}' `,  (error, data) => {
            if (error) throw error;
  
                console.log(data);
  
                let result_total_disbursment = data[0].total_loan_date_range
                
                let total_loan_response = {
                  fulfillmentText: thousands(result_total_disbursment),
                }
                res.json(total_loan_response);
                        
            });


    },

     total_loans_date :  function(req, res){
        
        const today_date = JSON.stringify(now.format("YYYY-MM-DD"));
        
         dbConn.query(`SELECT SUM(amount) AS total_loan_today FROM loan_requests WHERE approval_status IN (1,3,7,9) AND loan_starts = ${today_date}`,  (error, data) => {
            
            //debug('today date', today_date);

            if (error) throw error;
          
           
             

              let result_total_disbursment_today = data[0].total_loan_today
              
              let total_loan_response = {
                fulfillmentText: thousands(result_total_disbursment_today),
              }
              res.json(total_loan_response);
                      
          });

    },

    total_loans : function(req, res){
        //2019-03-31
        //year, last year, 20 july 2019, today, week, this year, 2013, 2030.
            let sql = "select sum(amount) from loan_requests where approval_status in (1,3,7,9) and " ;
                // sql.append("  loan_starts between ‘2019-10-01’ and ‘2019-10-31’")
        switch('date'){

            case 'today':
                let today_date = moment().format("YYYY-MM-DD");
                sql.append("loan_starts = "+ today_date);

            break;

            default:


        }
    }
}