/* eslint-disable */
import { GraphQLList as List, GraphQLString } from "graphql";
import fetch from "node-fetch";
import PinType from "../types/PinType";
import Landmark from "../models/Landmark";
import _ from "lodash";
import TopDestinationType from "../types/TopDestinationType";
import TripType from "../types/TripType";

const baseUrl = "https://api.pinterest.com/v1/me/pins";

const topDestinations = {
  type: TopDestinationType,
  async resolve({ request }) {
    const id = request.body.variables.userId;
    // group the user's landmarks by countries
    const landmarks = await Landmark.findAll();
    const countryGroups = _.groupBy(landmarks, (landmark)=> landmark.get('countryName'));
    const countries = Object.keys(countryGroups);
    const countryFrequency = countries.map((country)=> {
        const numLandmarksIncountry = landmarks.filter((lm)=> lm.get('countryName')===country).length;
        return {country, count: numLandmarksIncountry};
    });
    const topCountries = _.sortBy(countryFrequency, ['count']).reverse();
    const namesOnly = topCountries.map((c) => c.country).slice(0,2).reverse();
    // get localities in that country
    const cityGroups = _.groupBy(landmarks.filter(lm => lm.get('countryName') === namesOnly[0]), (lm)=> lm.get('locality'));
    const cities = Object.keys(cityGroups);
    const cityFrequency = cities.map((city)=> {
        const numLandmarksInCity = landmarks.filter((lm)=> lm.get('locality')===city).length;
        return {city, count: numLandmarksInCity};
    });
    const topCities = _.sortBy(cityFrequency, ['count']).reverse();
    const cityNamesOnly = topCities.map((c) => c.city);
    return {countries: namesOnly, firstCountryCities: cityNamesOnly};
  },
};

const trip = {
    type: TripType,
    async resolve({ request }) {
      const id = request.body.variables.userId;
      const countries = request.body.variables.countries;
      const destinations = request.body.variables.firstCountryCities;
      const key = "ha135592433329469511355786664317";
      // next weekend dates
      const depart = "2017-11-17";
      const returnFlight = "2017-11-19"; 
      // sky scanner API
      const baseUrl = "http://partners.api.skyscanner.net/apiservices/browsedates/v1.0/CH/chf/en-US/GVA/";
      const url = `${baseUrl}JFK/${depart}/${returnFlight}?apiKey=${key}`;
      let response = await fetch(url);
      let results = await response.json();
      return {
        destination: "New York John F. Kennedy",
        price: 584.00,
        departDate: "2017-11-17 18:35",
        returnDate: "2017-11-19 16:10",
      }
    },
  };

export {topDestinations, trip};
