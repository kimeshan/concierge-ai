/* eslint-disable */
import { GraphQLList as List } from "graphql";
import VisionResultType from "../types/VisionResultType";
import Vision from "@google-cloud/vision";
import config from "../../config";

const vision = {
  type: VisionResultType,
  async resolve({request}) {
    const {id, imageUrl} = request.body.variables.pin;  
    const {userId} = request.body.variables;
    // Let's call Google Machine Vision API
    const vision = new Vision({
      projectId: 'ai-concierge-185823',
      keyFilename: config.google_key,
    });
    const minAccuracy = 0.4;
    const req = {source: {imageUri: imageUrl}};
    const visionResponse = await vision.landmarkDetection(req);
    // check if the machine vision has detected a landmark with good accuracy
    const isLandmark = visionResponse[0].landmarkAnnotations.length > 0;
    if (!isLandmark) return {pinId: id, detected: false};
    const bestGuess = visionResponse[0].landmarkAnnotations[0];
    const hasGoodScore = bestGuess.score >= minAccuracy;
    if (!hasGoodScore) return {pinId: id, detected: false};
    // it's good - we can return a detection with all info
    const annotations = visionResponse[0].landmarkAnnotations;
    const goodAnnotations = annotations.filter((anno) => anno.score > minAccuracy); //filer low accuracy
    const {latitude, longitude} = bestGuess.locations[0].latLng; //extract lat/long
    // fetch the country and city using reverse geo encoding
    await Landmark.create({
      pinId: id,
      userId,
      latitude,
      longitude,
    });
    return {
      pinId: id,
      detected: true,
      descriptions: goodAnnotations.map((anno) => anno.description),
      scores: goodAnnotations.map((anno) => anno.score),
    };
  },
};

export default vision;
