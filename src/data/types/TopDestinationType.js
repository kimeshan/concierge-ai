import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLList as ListType,
  } from 'graphql';
  
  const TopDestinationType = new ObjectType({
    name: 'TopDestination',
    fields: {
        countries: { type: new ListType(StringType)},
        firstCountryCities: { type: new ListType(StringType)},
    },
  });
  
  export default TopDestinationType;
  