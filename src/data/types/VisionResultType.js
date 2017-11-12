import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
  GraphQLNonNull as NonNull,
  GraphQLList as ListType,
  GraphQLFloat as FloatType,
} from 'graphql';

const VisionResultType = new ObjectType({
  name: 'VisionResult',
  fields: {
    pinId: { type: new NonNull(StringType) },
    detected: { type: new NonNull(BooleanType) },
    descriptions: { type: new ListType(StringType) },
    scores: { type: new ListType(FloatType) },
    locality: { type: StringType },
    country: { type: StringType },
  },
});

export default VisionResultType;
