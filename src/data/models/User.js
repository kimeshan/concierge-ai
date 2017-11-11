import DataType from 'sequelize';
import Model from '../sequelize';

const User = Model.define(
  'User',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1,
      primaryKey: true,
      allowNull: false,
    },

    email: {
      type: DataType.STRING(255),
      validate: { isEmail: true },
    },

    pinterestToken: {
      type: DataType.STRING(255),
    },
  },
  {
    indexes: [{ fields: ['email'] }],
  },
);

export default User;
