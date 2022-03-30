import * as mongoose from 'mongoose';

const { Types } = mongoose;

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const InvoiceModel = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);

export default InvoiceModel;
