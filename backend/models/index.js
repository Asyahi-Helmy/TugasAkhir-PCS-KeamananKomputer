const User = require('./User');
const SlipGaji = require('./SlipGaji');

// Relasi One-to-Many: 1 User punya banyak SlipGaji
User.hasMany(SlipGaji, { foreignKey: 'userId', onDelete: 'CASCADE' });
SlipGaji.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, SlipGaji };