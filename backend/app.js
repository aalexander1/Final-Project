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

/* GET products listing. */
router.get('/products', function(req, res) {
    connection.query(`SELECT * FROM Products`, function (error, results, fields) {
        if (error) throw error;

        res.json(results);
        //console.log('The solution is: ', results[0].solution);
    });
});

router.post('/', function(req, res) {
    let orders = req.body.orders;
    connection.query('INSERT INTO Orders SET ?', {OrderStatus: 'pending'}, function (error, results, fields) {
        if (error) throw error;
        orders.forEach( productID => {
            connection.query('INSERT INTO Orders_Products SET ?', {OrderID: results.insertId, ProductID: productID}, function (error, results, fields) {
                 if (error) throw error;
            });
        });
        res.json({message: "Success"});
    });
    // connection.query('SELECT * FROM `Products`', function (error, results, fields) {
    //     if (error) throw error;

    //     res.json(results);
    //     //console.log('The solution is: ', results[0].solution);
    // });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('index', { title: 'Express' });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json('respond with a resource');
});

app.use(function(req, res, next) {
  res.header("access-Control-Allow-Origin", "*");
  res.header("access-Control-Allow-Headers", "rigin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use('/', router);

app.listen(port);
console.log('Running on port ' + port);
