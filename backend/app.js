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

// === GET All Available Products ===
router.get('/products', function(req, res) {
    connection.query(`SELECT * FROM Products`, function (error, results, fields) {
        if (error) throw error;

        res.json(results);
    });
});


// === GET Specific Order ===
router.get('/specificOrder/:order_id', function(req, res) {
    connection.query(`SELECT OP.OrderID, P.* FROM Products P LEFT JOIN Orders_Products OP ON(P.ProductID = OP.ProductID) WHERE OP.OrderID = ${req.params.order_id}`, function (error, results, fields) {
        //{req.params.id}
        //Order ID used to test in Postman - 165
        if (error) throw error;

        res.json(results);
    });
});


// === POST Submit Order ===
router.post('/submitOrder', function(req, res) {

    let insertQuery = `INSERT INTO Orders (OrderStatus)
    VALUES ('Pending')`;

    let insertProductsQuery = `INSERT INTO Orders_Products (OrderID, ProductID)
    VALUES `;

    let products = req.body.products;
    console.log(products);

    connection.query(insertQuery, (error, results, fields) => {

        if (error) throw error;
        console.log(results.insertId);

        products.forEach((productID, key) => {
            if (key != 0) {
                insertProductsQuery += `, `;
            }

            insertProductsQuery += `(${results.insertId}, ${productID})`
        });

        connection.query(insertProductsQuery, function (error, results, fields) {
            
            res.json({message: "Success"});
        });
    });
});

// === PUT Update Order ===

router.put('/updateOrder/:order_id', function(req, res) {

    let deleteProductsQuery = `DELETE FROM Orders_Products WHERE OrderID = ${req.params.order_id}`;

    let insertNewProductsQuery = `INSERT INTO Orders_Products (OrderID, ProductID)
    VALUES `;

    let products = req.body.products;
    console.log(products);

    connection.query(deleteProductsQuery, (error, results, fields) => {
        if (error) throw error;
        
        console.log(req.params.order_id);

        products.forEach((productID, key) => {
            if (key != 0) {
                insertNewProductsQuery += `, `;
            }

            insertNewProductsQuery += `(${req.params.order_id}, ${productID})`
        });

        connection.query(insertNewProductsQuery, function (error, results, fields) {
            
            
            res.json({message: "Order Updated"});
        });
    });

});

// === DELETE Delete Order ===
router.delete('/orders/:order_id', function(req, res) {

    let deleteQuery = `UPDATE Orders SET OrderStatus = 'Canceled' WHERE OrderID = ${req.params.order_id}`;
//{req.params.id}
//Order ID used to test in Postman - 156

    connection.query(deleteQuery, (error, results, fields) => {

        if (error) throw error;

            res.json({message: "Order Canceled"});
    });
});

// Solution to the CORS error
app.use(function(req, res, next) {
  res.header("access-Control-Allow-Origin", "*");
  res.header("access-Control-Allow-Headers", "rigin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use('/', router);

app.listen(port);
console.log('Running on port ' + port);
