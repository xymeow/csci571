const express = require('express');
const router = express.Router();
const logger = require('morgan');
var request = require('request');
const axios = require('axios');

var form = null;
var result = {};

const key = "AIzaSyBXJZOfWGzQ9I31v3liRqb4RumMPeC2Tbo";

router.get('/', (req, res, next) => {
    res.send('test');
});

async function searchHandler(req, res) {
    let response;
    let form = req.body;
    let location = form.location;
    
    if (form.isUserInput) {
        let url = "https://maps.googleapis.com/maps/api/geocode/json?key="+key+"&address="
    + location;
        try {
            response = await axios.get(url);
        } catch (err) {
            console.log(err);
        }
        let geoJson = response.data.results[0].geometry.location;
        console.log(geoJson);
        form.geoJson = geoJson;
    }
    let rad = form.distance * 1609.344;
    let url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
        form.geoJson.lat + "," + form.geoJson.lng + "&radius=" + rad + "&type=" + form.category +
        "&keyword=" + form.keyword + "&key="+key;
    console.log(url);
    try {
        response = await axios.get(url);
    } catch (err) {
        console.log(err);
    }
    let result = response.data;
    console.log(result);
    res.send(result);
    
}

router.post('/api/search', (req, res) => {
    searchHandler(req, res);
});

router.get('/api/nextpage', (req, res) => {
    return;
});

module.exports = router;