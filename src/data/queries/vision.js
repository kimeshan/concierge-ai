/* eslint-disable */
import { GraphQLList as List } from "graphql";
import PinType from "../types/PinType";
import Vision from "@google-cloud/vision";

const vision = {
  type: PinType,
  async resolve({request}) {
    const {id, imageUrl} = request.body.variables.pin;  
    console.log(id, imageUrl);
    // Let's call Google Machine Vision API
    const APIKey = "AIzaSyBfkS8icsSdUkctV3vO4iplaqgGKZWvDVo";
    const vision = new Vision();
    // const req = {
    //   source: {
    //     imageUri: ``
    //   }
    // };
    // const user = await User.findById(id);
    // const url = `${baseUrl}?access_token=${user.get(
    //   "pinterestToken",
    // )}&fields=image,media,created_at`;
    // let response = await fetch(url);
    // let results = await response.json();
  },
};

export default vision;
