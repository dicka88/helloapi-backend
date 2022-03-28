import * as mongoose from 'mongoose';

const { Schema, Types } = mongoose;

export interface Endpoint {
  name: string,
  description: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  type: 'faker' | 'json',
  schema: object | Array<any>,
  count: number,
  data: string,
  hit: number,
  createdAt: Date
}

export interface ProjectInterface {
  id: string,
  userId: string,
  collaboratos: [string],
  projectName: string,
  projectAvatarUrl: string,
  projectDescription: string,
  apiKey: string,
  prefixPath: string,
  hitTotal: number,
  endpoints: Endpoint[],
}

const ProjectSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'Users',
  },
  collaborators: [{
    type: Types.ObjectId,
    ref: 'Users',
  }],
  projectName: {
    type: String,
    required: true,
  },
  projectAvatarUrl: String,
  projectDescription: String,
  apiKey: {
    type: String,
    required: true,
  },
  prefixPath: {
    type: String,
    unique: true,
    lowercase: true,
  },
  hitTotal: {
    type: Number,
    default: 0,
  },
  endpoints: [{
    name: {
      type: String,
      required: true,
    },
    description: String,
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'DELETE'],
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['json', 'faker'],
    },
    schema: Schema.Types.Mixed,
    count: Number,
    data: String,
    hit: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;