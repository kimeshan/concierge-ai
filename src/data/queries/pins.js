/* eslint-disable */
import { GraphQLList as List } from 'graphql';
import fetch from 'node-fetch';
import PinType from '../types/PinType';
import User from '../models/User';

const baseUrl = 'https://api.pinterest.com/v1/me/pins';
let allPins = [];

const pins = {
  type: new List(PinType),
  async resolve({ request }) {
    const id = request.body.variables.userId;
    const user = await User.findById(id);
    const url = `${baseUrl}?access_token=${user.get(
      'pinterestTokens',
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
      // console.log("ALL PINS", allPins.length, allPins);
      // we have all pins at this point, let's filter for images only
      const imagePinsOnly = allPins.filter(pin => pin.media.type === 'image');
      const imageUrls = imagePinsOnly.map(
        pin =>
          new PinType({
            pinId: pin.id,
            userId: id,
            imageUrl: pin.image.original.url,
          }),
      );
    } else {
      // console.log("ERROR, results:", results);
      return null;
    }
  },
};

export default pins;
