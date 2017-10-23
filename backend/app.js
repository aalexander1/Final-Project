var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var port = process.env.PORT || 8080;

var app = express();
var router = express.Router();
var connection = mysql.createConnection({
  host     : 'localhost',
  port     : 8889,
  user     : 'root',
  password : 'root',
  database : 'FidgetSpinners'
});

connection.connect();

// === GET all available products ===
router.get('/products', function(req, res) {
    connection.query(`SELECT * FROM Products`, function (error, results, fields) {
        if (error) throw error;

        res.json(results);
        //console.log('The solution is: ', results[0].solution);
    });
});


// === GET specific Order ===

















router.post('/submitOrder', function(req, res) {

    let insertQuery = `INSERT INTO Orders (OrderStatus)
    VALUES ('Pending')`;

    let productsQuery = `INSERT INTO Orders_Products (OrderID, ProductID)
    VALUES `;

    let orders = req.body.orders;
    console.log(orders);

    connection.query(insertQuery, (error, results, fields) => {

        if (error) throw error;
        console.log(results.insertId)

        orders.forEach((productID, key) => {
            if (key != 0) {
                productsQuery += `, `;
            }

            productsQuery += `(${results.insertId}, ${productID})`
        });

        connection.query(productsQuery, function (error, results, fields) {
            
            res.json({message: "Success"});
        });
    });
    // connection.query('SELECT * FROM `Products`', function (error, results, fields) {
    //     if (error) throw error;

    //     res.json(results);
    //     //console.log('The solution is: ', results[0].solution);
    // });
});

/* GET home page. */


app.use(function(req, res, next) {
  res.header("access-Control-Allow-Origin", "*");
  res.header("access-Control-Allow-Headers", "rigin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use('/', router);

app.listen(port);
console.log('Running on port ' + port);
