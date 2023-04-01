const { response, request } = require("express");
const { InvoiceDetail, Product, HeaderInvoice } = require("../models");

const getInvoiceDetails = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };
  const [invoicedetails, total] = await Promise.all([
    InvoiceDetail.find(query)
      .populate("product_details.id_product", "name")
      .skip(from)
      .limit(limit),
    InvoiceDetail.countDocuments(query),
  ]);

  res.status(200).json({
    total,
    invoicedetails,
  });
};

const getInvoiceDetailById = async (req = request, res = response) => {
  const { id } = req.params;
  const invoicedetail = await InvoiceDetail.findById(id)
  res.status(200).json(invoicedetail);
};

const createInvoiceDetail = async (req, res = response) => {
  const { status, ...body } = req.body;
 
  const promises = body.product_details.map(async (detail) => {
    const { id_product, product_quantity } = detail;
    const product = await Product.findById(id_product);
    if (!product) throw new Error(`Product ${id_product} not found`);
    const total_product = product.precio * product_quantity;
    return { id_product, product_quantity, total_product };
  });

  const productDetails = await Promise.all(promises);

  const data = {
    id_invoice: body.id_invoice,
    product_details: productDetails,
  };

  const Invoicedetail = new InvoiceDetail(data);
  await Invoicedetail.save();
  await updateTotalInvoice(body.id_invoice);
  res.status(200).json(Invoicedetail);
};

async function updateTotalInvoice(id_invoice) {
  try {
    const details = await InvoiceDetail.find({ id_invoice });

    let total_invoice = 0;
    details.forEach(detail => {
      detail.product_details.forEach(product => {
        total_invoice += product.total_product;
      });
    });

    await HeaderInvoice.findByIdAndUpdate(id_invoice, { total_invoice });
    console.log(`Gran total updated for Invoice ${id_invoice}`);
  } catch (error) {
    console.error(error);
  }
}


module.exports = {
  getInvoiceDetails,
  getInvoiceDetailById,
  createInvoiceDetail,
  updateTotalInvoice
};
