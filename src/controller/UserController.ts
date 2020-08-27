import httpErrors from 'http-errors';
import UserModel from 'models/UserModel';

const register = async (email: string, password: string): Promise<any> => {
  const doesExists = await UserModel.findOne({ email });

  if (doesExists) {
    throw new httpErrors.Conflict();
  }

  const newUser = new UserModel({ email, password });
  const savedUser = await newUser.save();

  return savedUser;
};

export default register;
