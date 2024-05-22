import { DataTypes } from 'sequelize';

export default function (sequelize: any) {
  const UserSchema = sequelize.define(
    'User',
    {
      did: DataTypes.STRING,
      info: DataTypes.STRING,
    },
    {
      timestamps: false,
    }
  );
  return UserSchema;
}
