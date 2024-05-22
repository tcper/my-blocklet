import { Sequelize } from 'sequelize';
import user from './user';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './data/sqlite',
  logQueryParameters: true,
  benchmark: true,
});

user(sequelize);

export default sequelize;
