import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import me from './queries/me';
import pins from './queries/pins';
import vision from './queries/vision';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      me,
      pins,
      vision,
    },
  }),
});

export default schema;
