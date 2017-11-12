import DataType from 'sequelize';
import Model from '../sequelize';

const Landmark = Model.define(
  'Landmark',
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

    pinId: {
      type: DataType.STRING(255),
      defaultValue: false,
      unique: true,
    },

    longitude: {
      type: DataType.FLOAT(),
      defaultValue: false,
    },

    latitude: {
      type: DataType.FLOAT(),
      defaultValue: false,
    },

    country: {
      type: DataType.STRING(255),
      defaultValue: false,
    },

    city: {
      type: DataType.STRING(255),
      defaultValue: false,
    },
  },
  {
    indexes: [{ fields: ['userId', 'pinId'] }],
  },
);

export default Landmark;
