import DataType from 'sequelize';
import Model from '../sequelize';

const Pin = Model.define(
  'Pin',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1,
      primaryKey: true,
    },

    userId: {
      type: DataType.UUID,
      allowNull: false,
    },

    imageUrl: {
      type: DataType.STRING(255),
    },

    pinId: {
      type: DataType.STRING(255),
      defaultValue: false,
      unique: true,
    },

    pinnedDate: {
      type: DataType.STRING(255),
      defaultValue: false,
    },
  },
  {
    indexes: [{ fields: ['pinId', 'imageUrl'] }],
  },
);

export default Pin;
