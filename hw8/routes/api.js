const express = require("express");
const router = express.Router();
const logger = require("morgan");
var request = require("request");
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
  let form = req.body;
  let location = form.location;

  if (form.isUserInput) {
    let url =
      "https://maps.googleapis.com/maps/api/geocode/json?key=" +
      key +
      "&address=" +
      location;
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
    form.keyword +
    "&key=" +
    key;
  console.log(url);
  try {
    response = await axios.get(url);
  } catch (err) {
    console.log(err);
  }
  let result = response.data;
  // console.log(result);
  res.send(result);
}

router.post("/api/search", (req, res) => {
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
  console.log(query);
  let response;
  try {
    response = await yelp_client.businessMatch("best", request);
  } catch (err) {
    console.log(err);
  }
  let jsonBody = response.jsonBody;
  console.log(jsonBody);
  let yelpId = jsonBody.businesses[0].id;
  console.log(yelpId);
  try {
    response = await yelp_client.reviews(yelpId);
  } catch (err) {
    console.log(err);
  }
  console.log(response);
  res.send(response.jsonBody.reviews);
}

router.get("/api/yelp_review", (req, res) => {
  yelpHandler(req, res);
});

module.exports = router;
