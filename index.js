var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var db = new sqlite3.Database(':memory:');
var url = require('url');

var app = express();

//Fill sqlite with mock data
db.serialize(function() {
  db.run("CREATE TABLE User(Username, Password)");
  var stmt = db.prepare("INSERT INTO User VALUES ('Admin','CorrectHorseBatteryStaple')");
  stmt.run();
  stmt.finalize();
  var stmt = db.prepare("INSERT INTO User VALUES ('Nisse','Sommar2019')");
  stmt.run();
  stmt.finalize();
});
 

app.get('/',function(req,res) {
    res.sendfile('index.html')
});

app.get('/login', function(req,res) {
    console.log(req.query.password);
        GetAllUsers(req.query.username, req.query.password, function(isAuthenticated, query) {
    
        if (isAuthenticated)
        {
                res.sendfile('loggedIn.html')    
        }
        else if (query)
        {
            res.send("ERROR! could not execute: "+ query)
        }
        else
        {
            res.redirect('/?WrongPassword=1');
        }

        })
    });

app.listen(8080, () => console.log('Example app listening on port 8080!'));


function GetAllUsers(username, password, authenticated)
{
    var result;
    var query = "SELECT * FROM User WHERE Username = '" + username + "' and Password = '" + password +"'";
    console.log(query);
    db.all(query, function(err, row) 
    {
        if (err) 
            authenticated(false, query)
        else if (row.length>0)
            authenticated(true) ;
        else
            authenticated(false) ;
    } );
}