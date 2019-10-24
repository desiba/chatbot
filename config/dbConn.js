var mysql = require('mysql');
// connection configurations

const dbConn = mysql.createPool({
    connectionLimit : 100, 
    host     : process.env.DB_HOST,
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    debug    :  false
});
// connect to database
//dbConn.connect();

//console.log(dbConn);

module.exports = dbConn;