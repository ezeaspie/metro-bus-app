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
            res.render('main.ejs', {busData : [response]});
        });
});

app.post("/search", (req,res) => {
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
            console.log(response.Stops.length);
            if(response.Stops.length > 0){
                res.render('search.ejs', {stopData : response});
            }
            else{
                res.render('searcherror.ejs');
            }
        });
});

app.post("/", (req, res) => {
    let stopArray = JSON.parse(req.body.userStopArray);
    let dataArray = [];
    fetch(`https://api.wmata.com/NextBusService.svc/json/jPredictions?StopID=${stopArray[0]}`, {
            method: "GET",
            mode: 'cors',
            headers: { 'api_key': 'f991b2d63e364fddbf62d9cbb9525417' },
    })
        .then((response) => { return response.json() })
        .then((response) => {
            dataArray.push(response);
            if (stopArray[1] != undefined) {
                fetch(`https://api.wmata.com/NextBusService.svc/json/jPredictions?StopID=${stopArray[1]}`, {
                    method: "GET",
                    mode: 'cors',
                    headers: { 'api_key': 'f991b2d63e364fddbf62d9cbb9525417' },
                })
                .then((response) => { return response.json() })
                .then((response) => {
                    dataArray.push(response);
                        res.render("home.ejs", { busData: dataArray });
                        
                });
            }
            else {
                res.render("home.ejs", { busData: dataArray });
            }
        });
});

app.post("/usersearch", (req, res) => {
    let searchTerm = req.body.searchTerm;

    console.log(searchTerm);
    fetch("https://api.wmata.com/Bus.svc/json/jStops", {
        method: "GET",
        mode: 'cors',
        headers: { 'api_key': 'f991b2d63e364fddbf62d9cbb9525417' },
    })
        .then((response) => { return response.json() })
        .then((response) => {
            let searchResults = [];
            let includesAND = searchTerm.includes("+");
            
            if(includesAND){
                let searchTermItems = searchTerm.split(' + ');
                let results = response.Stops.filter((stop)=>{
                    return stop.Name.includes(searchTermItems[0]) && stop.Name.includes(searchTermItems[1])
                })
                searchResults = results;
            }
            else{
                let results = response.Stops.filter((stop)=>{
                    return stop.Name.includes(searchTerm) || stop.StopID === searchTerm;
                })
                searchResults = results;
            }

            if(searchResults.length > 0 ){  
                res.render('search.ejs', { stopData: {Stops : searchResults} });
            }
            else{
                res.render('searcherror.ejs', {searchTerm});
            }
        });
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server running.");
});