var express = require('express');
var router = express.Router();
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Units = require('../models/Units.js');
var Expenses = require('../models/Expenses.js');

var port = '4000';

server.listen(port, () => {
    console.log('Server listening on Port ' + port);
  })

// socket io
io.on('connection', function (socket) {
    console.log("A user is connected");
    socket.on('newdata', function (data) {
        io.emit('new-data', { data: data });
    });
    socket.on('updatedata', function (data) {
      io.emit('update-data', { data: data });
    });
});

// list data
router.get('/', function(req, res) {
    Units.find(function (err, units) {
        if (err) return next(err);
        res.json(units);
    });
});

// get data by id
router.get('/:id', function(req, res, next) {
    Units.findById(req.params.id, function (err, units) {
        if (err) return next(err);
        res.json(units);
    });
});

// get data by unitCode
router.get('/unitCode/:unitCode', function(req, res, next) {
    Units.find({ unitCode: req.params.unitCode }, function (err, units) {
        if (err) return next(err);
        res.json(units);
    });
});
  
// post data
router.post('/', function(req, res, next) {
    Units.create(req.body, function (err, sales) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(sales);
    });
});
  
// put data
router.put('/:id', function(req, res, next) {
    Units.findByIdAndUpdate(req.params.id, req.body, function (err, units) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(units);
    });
});
  
// delete data by id
router.delete('/:id', function(req, res, next) {
    Units.findByIdAndRemove(req.params.id, req.body, function (err, units) {
        if (err) return next(err);
        res.json(units);
    });
});

router.get('/expenses/:unitCode', function(req, res) {
    Expenses.find({ unitCode: req.params.unitCode }, function (err, expenses) {
        if (err) return next(err);
        res.json(expenses);
    });
});

router.get('/expenses/id/:id', function(req, res) {
    Expenses.findById(req.params.id, function (err, expenses) {
        if (err) return next(err);
        res.json(expenses);
    });
});

router.post('/expenses', function(req, res, next) {
    Expenses.create(req.body, function (err, expenses) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(expenses);
    });
});

router.put('/expenses/:id', function(req, res, next) {
    Expenses.findByIdAndUpdate(req.params.id, req.body, function (err, expenses) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.json(expenses);
    });
});

router.delete('/expenses/:id', function(req, res, next) {
    Expenses.findByIdAndRemove(req.params.id, req.body, function (err, expenses) {
        if (err) return next(err);
        res.json(expenses);
    });
});

module.exports = router ;