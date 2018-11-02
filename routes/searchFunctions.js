const { Pool, Client } = require('pg');

var dbURL = process.env.DATABASE_URL || "postgres://postgres:thegreatpass@localhost:5432/sot"; //Change According to Database Requirements


const pgpool = new Pool({
    connectionString: dbURL,
});

/* Changed Functions -Homy Oct 30, 2018*/
var getSearchData = (searchQuery, searchType) => {
    return new Promise((resolve, reject) => {
        
        //Regex to ensure no special characters
        var searchRegex = /^[a-zA-Z0-9]+$/;
        
        if(searchRegex.test(searchQuery) || searchQuery == ''){
            console.log("Search Regex Passed");
            var searchText = searchQuery + '%';
            pgpool.query('SELECT * FROM customer INNER JOIN vehicle ON customer.cust_id = vehicle.cust_id WHERE $1 LIKE $2', [searchQuery, searchText] , (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    console.log(res.rows);
                    resolve({status: "success", data: res.rows});
                }
            })
        }else{
            console.log("Search Regex Failed");
            reject({status: "fail"});
        }
    	
    })
}

module.exports = {
	getSearchData,
}