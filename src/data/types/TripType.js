import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType,
  } from 'graphql';
  
  const TripType = new ObjectType({
    name: 'Trip',
    fields: {
      destination: { type: new NonNull(StringType) },
      price: { type: new NonNull(FloatType) },
      departDate: { type: new NonNull(StringType) },
      returnDate: { type: new NonNull(StringType) },
    },
  });
  
  export default TripType;
  