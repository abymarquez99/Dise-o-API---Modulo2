const { response, request } = require("express");
const { Invoice } = require("../models");

const getInvoices = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };
  const [invoices, total] = await Promise.all([
    Invoice.find(query)
      .populate("user")
      .skip(from)
      .limit(limit),
    Invoice.countDocuments(query),
  ]);

  res.status(200).json({
    total,
    invoices,
  });
};

const getInvoiceById = async (req = request, res = response) => {
  const { id } = req.params;
  const invoice = await Invoice.findById(id).populate("user");

  res.status(200).json(invoice);
};

const createInvoice = async (req, res = response) => {
  const { date_invoice, user, total_invoice } = req.body;

  const data = {
    date_invoice,
    user,
    total_invoice,
  };

  const invoice = new Invoice(data);
  await invoice.save();
  res.status(200).json(invoice);
};

const updateInvoice = async (req, res) => {
  const { id } = req.params;
  const { date_invoice, user, total_invoice } = req.body;

  const data = {
    date_invoice,
    user,
    total_invoice,
  };

  const invoice = await Invoice.findByIdAndUpdate(id, data, { new: true });

  res.json(invoice);
};

const deleteInvoice = async (req, res) => {
  const { id } = req.params;
  const deletedInvoice = await Invoice.findByIdAndDelete(
    id,
    { status: false },
    { new: true }
  );
  res.json(deletedInvoice);
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
