var dbConn = require('../config/dbConn');
const thousands = require('thousands');


module.exports = {

    total_loan_disbursed_range : function(range, req, res){
        let {start, end} = range;
        dbConn.query(`SELECT SUM(amount) AS total_loan_disbursed FROM loan_requests WHERE approval_status IN (1,3,7,9) AND loan_starts BETWEEN ${start} AND ${end} `,  (error, data) => {
            if (error) throw error;
  
                console.log(data);
  
                let result_total_disbursment = data[0].total_loan_disbursed
                
                let total_loan_response = {
                  fulfillmentText: thousands(result_total_disbursment),
                }
                res.json(total_loan_response);
                        
            });


    },

     total_loans_date : function(date, req, res){
        dbConn.query(`SELECT SUM(amount) AS total_loan_disbursed FROM loan_requests WHERE approval_status IN (1,3,7,9) AND loan_starts = ${date}`,  (error, data) => {
          if (error) throw error;

              console.log(data);

              let result_total_disbursment = data[0].total_loan_disbursed
              
              let total_loan_response = {
                fulfillmentText: thousands(result_total_disbursment),
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