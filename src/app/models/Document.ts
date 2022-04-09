import * as mongoose from 'mongoose';

export interface DocumentInterface extends mongoose.Document {
  title: string;
  userId: string;
  content: any;
}

const { ObjectId, Mixed } = mongoose.Schema.Types;

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: ObjectId,
    ref: 'User',
  },
  content: Mixed,
}, {
  timestamps: true,
});

const model = mongoose.models.Document || mongoose.model<DocumentInterface>('Document', DocumentSchema);

export default model;
