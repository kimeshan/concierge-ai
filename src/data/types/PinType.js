import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const PinType = new ObjectType({
  name: 'Pin',
  fields: {
    id: { type: new NonNull(StringType) },
    userId: { type: new NonNull(StringType) },
    imageUrl: { type: StringType },
    pinId: { type: new NonNull(StringType) },
    pinnedDate: { type: StringType },
  },
});

export default PinType;
