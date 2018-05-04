const express = require('express');
const app = express();
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get("/", (req,res) => {
    fetch("https://api.wmata.com/NextBusService.svc/json/jPredictions?StopID=1001195", {
        method: "GET",
        mode: 'cors',
        headers: { 'api_key': 'f991b2d63e364fddbf62d9cbb9525417' },
    })
        .then((response) => { return response.json() })
        .then((response) => {
            res.render('main.ejs', {busData : response});
            console.log(response);
        });
});

app.post("/", (req,res) => {
    let latitude = req.body.lat;
    let longitude = req.body.lon;
    console.log(latitude, longitude);
    let url = `https://api.wmata.com/Bus.svc/json/jStops?Lat= ${latitude}&Lon=${longitude}&Radius=500`;
   
    fetch(url, {
        method: "GET",
        mode: 'cors',
        headers: { 'api_key': 'f991b2d63e364fddbf62d9cbb9525417' },
    })
        .then((response) => { return response.json() })
        .then((response) => {
        });
});

app.listen(3000, function() {
    console.log("Server running.");
});