const { Schema, model } = require("mongoose");

const InvoiceDetailSchema = Schema({
  id_invoice: {
    type: Schema.Types.ObjectId,
    ref: "HeaderInvoice",
  },
  product_details: [{
    id_product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "product id is mandatory"],
    },
    product_quantity: {
      type: Number,
      required: [true, "product quantity id is mandatory"],
      default: 0,
    },
    total_product: {
      type: Number,
      default: 0,
    }
  }]
});

InvoiceDetailSchema.methods.toJSON = function () {
  const { __v, status, ...data } = this.toObject();
  return data;
};

module.exports = model("InvoiceDetail", InvoiceDetailSchema);