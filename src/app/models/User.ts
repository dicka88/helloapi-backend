import * as mongoose from 'mongoose';

const { Schema } = mongoose;

export interface UserInterface extends mongoose.Document {
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
      email: string,
      avatar: string
    },
    google: {
      id: string,
      name: string,
      email: string,
      avatar: string
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
      avatar: String,
    },
    google: {
      id: String,
      name: String,
      email: String,
      avatar: String,
    },
  },
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model<UserInterface>('User', UserSchema);

export default User;
