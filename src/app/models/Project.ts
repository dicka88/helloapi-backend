import * as mongoose from 'mongoose';

const { Schema, Types } = mongoose;

export type EndpointSchema = {
  key: string,
  value: string
}
export interface Endpoint {
  name: string,
  description: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  type: 'faker' | 'json',
  schema: EndpointSchema[],
  count: number,
  data: object | string | Array<any>,
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

const endpointFakerSchemaSchema = new Schema({
  key: String,
  value: String,
});

const endpointsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE'],
    required: true,
    default: 'GET',
  },
  path: {
    type: String,
    // unique: true,
    required: true,
  },
  type: {
    type: String,
    enum: ['json', 'faker'],
    default: 'json',
  },
  schema: {
    type: Array,
    default: [],
  },
  count: Number,
  data: Schema.Types.Mixed,
  hit: {
    type: Number,
    default: 0,
  },
});

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
    // unique: true,
    lowercase: true,
  },
  hitTotal: {
    type: Number,
    default: 0,
  },
  endpoints: [endpointsSchema],
}, {
  timestamps: true,
});

ProjectSchema.index({ endpoints: 1 }, {
  unique: true,
  partialFilterExpression: {
    'endpoints.0': { $exists: true },
  },
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;
