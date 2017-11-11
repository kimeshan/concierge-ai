/* eslint-disable */
import { GraphQLList as List } from "graphql";
import fetch from "node-fetch";
import PinType from "../types/PinType";
import User from "../models/User";
import Pin from "../models/Pin";

const baseUrl = "https://api.pinterest.com/v1/me/pins";
let allPins = [];

const pins = {
  type: new List(PinType),
  async resolve({ request }) {
    const id = request.body.variables.userId;
    const user = await User.findById(id);
    const url = `${baseUrl}?access_token=${user.get(
      "pinterestToken",
    )}&fields=image,media,created_at`;
    let response = await fetch(url);
    let results = await response.json();
    if (results && results.data) {
      allPins = results.data;
      // continue fetching paginated results until next is undefined
      while (results.page && results.page.next) {
        response = await fetch(results.page.next);
        results = await response.json();
        allPins = [...allPins, ...results.data];
      }
      // we have all pins at this point, let's filter for images only
      const imagePinsOnly = allPins.filter(pin => pin.media.type === "image");
      const pinObjects = imagePinsOnly.map(pin => ({
        userId: id,
        imageUrl: pin.image.original.url,
        pinId: pin.id,
        pinnedDate: pin.created_at,
      }));
      await Pin.bulkCreate(pinObjects, {ignoreDuplicates: true});
      const userPins = await Pin.findAll({ where: { userId: id } });
      return userPins;
    } else {
      console.log("ERROR, results:", results);
      return null;
    }
  },
};

export default pins;
