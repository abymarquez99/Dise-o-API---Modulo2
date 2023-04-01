const { Schema, model } = require("mongoose");

const HeaderInvoiceSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  total_invoice: {
    type: Number,
    required: true,
    default: 0,
  },
  date_created: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

HeaderInvoiceSchema.methods.toJSON = function () {
  const { __v, status, ...data } = this.toObject();
  return data;
};

module.exports = model("HeaderInvoice", HeaderInvoiceSchema);