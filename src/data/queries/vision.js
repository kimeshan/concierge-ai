/* eslint-disable */
import { GraphQLList as List } from "graphql";
import VisionResultType from "../types/VisionResultType";
import Vision from "@google-cloud/vision";
import GoogleMaps from "@google/maps";
import config from "../../config";
import Landmark from "../models/Landmark";

const vision = {
  type: VisionResultType,
  async resolve({ request }) {
    const { id, imageUrl } = request.body.variables.pin;
    const { userId } = request.body.variables;
    // Let's call Google Machine Vision API
    const vision = new Vision({
      projectId: "ai-concierge-185823",
      keyFilename: config.googley_key_file,
    });
    const minAccuracy = 0.4;
    const req = { source: { imageUri: imageUrl } };
    const visionResponse = await vision.landmarkDetection(req);
    // check if the machine vision has detected a landmark with good accuracy
    const isLandmark = visionResponse[0].landmarkAnnotations.length > 0;
    if (!isLandmark) return { pinId: id, detected: false };
    const bestGuess = visionResponse[0].landmarkAnnotations[0];
    const hasGoodScore = bestGuess.score >= minAccuracy;
    if (!hasGoodScore) return { pinId: id, detected: false };
    // it's good - we can return a detection with all info
    const annotations = visionResponse[0].landmarkAnnotations;
    const goodAnnotations = annotations.filter(
      anno => anno.score > minAccuracy,
    ); //filer low accuracy
    const { latitude, longitude } = bestGuess.locations[0].latLng; //extract lat/long

    const landmark = await Landmark.findOne({
      where: { userId, pinId: id },
    });
    const landmarkObject = {
      pinId: id,
      detected: true,
      descriptions: goodAnnotations.map(anno => anno.description).slice(0, 2),
      scores: goodAnnotations.map(anno => anno.score).slice(0, 2),
    };
    console.log(landmark);
    // if landmark is stored, just return with database info
    if (landmark) {
      return {
        ...landmarkObject,
        locality: landmark.get("locality"),
        country: landmark.get("countryName"),
      };
    }
    // fetch the country and city using reverse geo encoding
    const maps = await GoogleMaps.createClient({
      key: config.google_api_key,
      Promise: Promise,
    });
    const mapsResponse = await maps
      .reverseGeocode({ latlng: [latitude, longitude] })
      .asPromise();
    let locality,
      countryName = "";
    if (mapsResponse.status === 200) {
      // get country and locality
      const components = mapsResponse.json.results[0].address_components;
      const countryComp = components.filter(comp =>
        comp.types.includes("country"),
      )[0];
      const localityComp = components.filter(comp =>
        comp.types.includes("locality"),
      )[0];
      countryName = countryComp.long_name;
      locality = localityComp.long_name;
      await Landmark.create({
        pinId: id,
        userId,
        latitude,
        longitude,
        locality,
        countryName,
        countryCode: countryComp.short_name,
      });
    }
    return {
      ...landmarkObject,
      locality,
      country: countryName,
    };
  },
};

export default vision;
