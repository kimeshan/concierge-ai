import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import me from './queries/me';
import pins from './queries/pins';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      me,
      pins,
    },
  }),
});

export default schema;
