const express = require("express");
const router = express.Router();
const logger = require("morgan");
const axios = require("axios");
const yelp = require("yelp-fusion");

var form = null;
var result = {};

const key = "AIzaSyBXJZOfWGzQ9I31v3liRqb4RumMPeC2Tbo";
const yelp_key =
  "zKvdPM6KCFwyUOSZl_vQt8U00kxchLYYK21J4BViwst_BgfWUAgH21hzUSSMQ0p8FhWS2z-T4N8kevV-CuUmx-0MCdhyIW-2Se5Kt33umMJAqPn4YRiWrSrlDqzBWnYx";

const yelp_client = yelp.client(yelp_key);

router.get("/", (req, res, next) => {
  res.send("test");
});

async function searchHandler(req, res) {
  let response;
  let form = req.query;
  let location = form.location;
  if (form.isUserInput == "true") {
    let url =
      "https://maps.googleapis.com/maps/api/geocode/json?key=" +
      encodeURIComponent(key) +
      "&address=" +
      encodeURIComponent(location);
    try {
      response = await axios.get(url);
    } catch (err) {
      console.log(err);
      res.status(500).send("faild to get geocode");
    }
    try {
      let geoJson = response.data.results[0].geometry.location;
      form.geoJson = geoJson;
    } catch (error) {
      console.log(error);
      res.status(500).send("no geometry");
    }
  } else {
    form.geoJson = JSON.parse(form.geoJson);
  }

  let rad = form.distance * 1609.344;
  let url =
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
    form.geoJson.lat +
    "," +
    form.geoJson.lng +
    "&radius=" +
    rad +
    "&type=" +
    form.category +
    "&keyword=" +
    encodeURIComponent(form.keyword) +
    "&key=" +
    key;
  try {
    response = await axios.get(url);
  } catch (err) {
    console.log(err);
    res.status(500).send("nearby search failed.");
  }
  let result = response.data;
  res.send(result);
}

router.get("/api/search", (req, res) => {
  searchHandler(req, res);
});

router.get("/api/nextpage", (req, res) => {
  let pagetoken = req.query.pagetoken;
  let url =
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=" +
    pagetoken +
    "&key=" +
    key;
  axios.get(url).then(response => {
    res.send(response.data);
  });
});

async function yelpHandler(req, res) {
  let query = req.query;
  let request = {
    name: query.name,
    address1: query.address,
    city: query.city,
    state: query.state,
    country: query.country
  };
  let response;
  try {
    response = await yelp_client.businessMatch("best", request);
  } catch (err) {
    res.status(500).send("business match error");
    console.log(err);
  }
  let jsonBody = response.jsonBody;
  try {
    let yelpId;
    if (jsonBody.businesses[0]) {
      yelpId = jsonBody.businesses[0].id;
    } else {
      res.send(null);
      return;
    }
    try {
      response = await yelp_client.reviews(yelpId);
    } catch (err) {
      res.status(500).send("review error");
      console.log(err);
    }
    res.send(response.jsonBody.reviews);
  } catch (error) {
    res.status(500).send("something goes wrong");
  }
}

router.get("/api/yelp_review", (req, res) => {
  yelpHandler(req, res);
});

module.exports = router;
