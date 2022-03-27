import * as mongoose from 'mongoose';

const { Schema } = mongoose;

export enum LoginType {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
}

interface UserInterface {
  name: string,
  email: string,
  emailVerifiedAt: Date,
  password: string,
  passwordResetCode: string,
  avatarUrl: string,
  loginType: LoginType
}

const UserSchema = new Schema<UserInterface>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  emailVerifiedAt: Date,
  password: String,
  passwordResetCode: String,
  avatarUrl: String,
  loginType: {
    type: String,
    enum: [LoginType.EMAIL, LoginType.GOOGLE, LoginType.GITHUB],
  },
}, {
  timestamps: true,
});

const User = mongoose.model<UserInterface>('User', UserSchema);

export default User;
