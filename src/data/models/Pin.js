/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

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
    },

    url: {
      type: DataType.STRING(255),
    },

    pinId: {
      type: DataType.STRING(255),
      defaultValue: false,
    },

    dateCreated: {
      type: DataType.STRING(255),
      defaultValue: false,
    },
  },
  {
    indexes: [{ fields: ['pin_id', 'url'] }],
  },
);

export default Pin;
