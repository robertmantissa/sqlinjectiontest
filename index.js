var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var db = new sqlite3.Database(':memory:');
var url = require('url');
var port = 8080;
var app = express();

//Fill sqlite with mock data
db.serialize(function () {
    db.run("CREATE TABLE User(Username, Password)");
    var stmt = db.prepare("INSERT INTO User VALUES ('Admin','CorrectHorseBatteryStaple')");
    stmt.run();
    stmt.finalize();
});


app.get('/', function (req, res) {
    res.sendfile('index_form.html')
});

app.get('/login', function (req, res) {
    console.log(req.query.password);
    GetAllUsers(req.query.username, req.query.password, function (isAuthenticated, query) {

        if (isAuthenticated) {
            res.sendfile('loggedIn.html')
            console.log('Im in ' + req.connection.remoteAddress );
        }
        else if (query) {
            res.send("ERROR! could not execute sqlite query: " + query)
              console.log('Error '  + req.connection.remoteAddress );
        }
        else {
            res.redirect('/?WrongPassword=1');
            console.log('WrongPassword '  + req.connection.remoteAddress );
        }

    })
});

app.listen(port, () => console.log('Vulnerable app started on port '  + port));


function GetAllUsers(username, password, authenticated) {
    var result;
    var query = "SELECT * FROM User WHERE Username = '" + username + "' AND Password = '" + password + "'"; //This is where things go bad! _Never ever_ concatenate sql strings!
    console.log(query);
    db.all(query, function (err, row) {
        if (err)
            authenticated(false, query)
        else if (row.length > 0)
            authenticated(true);
        else
            authenticated(false);
    });
}