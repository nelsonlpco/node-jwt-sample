// import bcrypt from 'bcrypt';
import { Document, model, Schema } from 'mongoose';

interface UserSchema extends Document {
  email: string;
  password: string;
  isValidPassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<UserSchema>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.methods.isValidPassword = async function isValidPassword(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.pre<UserSchema>('save', async function onSaveHandler(next): Promise<void> {
  try {
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(this.password, salt);
    // this.password = hashedPassword;
  } catch (error) {
    next(error);
  }
});

export default model<UserSchema>('user', userSchema);
