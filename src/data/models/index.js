import sequelize from '../sequelize';
import User from './User';
import Pin from './Pin';

User.hasMany(Pin, {
  foreignKey: 'userId',
  as: 'pins',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { User };
