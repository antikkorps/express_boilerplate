import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Unique,
  AllowNull,
} from "sequelize-typescript";

@Table({
  tableName: "users",
  timestamps: true,
})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  name?: string;
}

// Helper functions for User operations
export const findUserByEmail = async (email: string) => {
  return await User.findOne({ where: { email } });
};

export const findUserById = async (id: string) => {
  return await User.findByPk(id);
};

export const createUser = async (
  email: string,
  password: string,
  name?: string,
) => {
  return await User.create({ email, password, name });
};

export const updateUser = async (
  id: string,
  data: Partial<{ email: string; password: string; name: string }>,
) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  return await user.update(data);
};

export const deleteUser = async (id: string) => {
  const user = await User.findByPk(id);
  if (!user) return false;
  await user.destroy();
  return true;
};
