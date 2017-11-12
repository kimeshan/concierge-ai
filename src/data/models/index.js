import sequelize from '../sequelize';
import User from './User';
import Pin from './Pin';
import Landmark from './Landmark';

User.hasMany(Pin, {
  foreignKey: 'userId',
  as: 'pins',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasMany(Landmark, {
  foreignKey: 'userId',
  as: 'landmarks',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

Pin.hasOne(Landmark, {
  foreignKey: 'pinId',
  as: 'landmark',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { User };
