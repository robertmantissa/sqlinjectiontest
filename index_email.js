var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var db = new sqlite3.Database(':memory:');
var url = require('url');

var app = express();

//Fill sqlite with mock data
db.serialize(function () {
    db.run("CREATE TABLE User(Username, Password)");
    var stmt = db.prepare("INSERT INTO User VALUES ('Admin','CorrectHorseBatteryStaple')");
    stmt.run();
    stmt.finalize();
});


app.get('/', function (req, res) {
    res.sendfile('index_email.html')
});

app.get('/send', function (req, res) {
    console.log(req.query.email);
    if (req.query.email === 'nisse@hacker.se')
    {
            res.sendfile('win.html')
    }
    else if (req.query.email.includes('.edu'))
    {
    	  res.sendfile('sent.html')
    }
    else
    {
		res.redirect('/?NotValidEmail=1');
    }

    
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));