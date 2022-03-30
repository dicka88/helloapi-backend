import * as mongoose from 'mongoose';

const { Schema } = mongoose;

export interface UserInterface {
  name: string,
  email: string,
  emailVerifiedAt: Date,
  password: string,
  passwordResetCode: string,
  avatarUrl: string,
  oauth: {
    github: {
      id: string,
      name: string,
      email: string
    },
    google: {
      id: string,
      name: string,
      email: string,
    }
  }
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
  oauth: {
    github: {
      id: String,
      name: String,
      email: String,
    },
    google: {
      id: String,
      name: String,
      email: String,
    },
  },
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model<UserInterface>('User', UserSchema);

export default User;
