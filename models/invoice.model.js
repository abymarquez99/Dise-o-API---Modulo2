const { Schema, model } = require("mongoose");

const InvoiceSchema = Schema({
  date_invoice: {
    type: String,
    required: [true, "date is mandatory"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  total_invoice: {
    type: Number,
    default: 0,
  }
});

InvoiceSchema.methods.toJSON = function () {
  const { __v, status, ...data } = this.toObject();
  return data;
};

module.exports = model("Invoice", InvoiceSchema);
