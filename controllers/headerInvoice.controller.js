const { response, request } = require("express");
const { HeaderInvoice } = require("../models");

const getHeaderInvoices = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };
  const [headerInvoices, total] = await Promise.all([
    HeaderInvoice.find(query)
      .populate("user", "name")
      .skip(from)
      .limit(limit),
      HeaderInvoice.countDocuments(query),
  ]);
  res.status(200).json({
    total,
    headerInvoices,
  });
};

const getHeaderInvoiceById = async (req = request, res = response) => {
  const { id } = req.params;
  const headerInvoice = await HeaderInvoice.findById(id)
    .populate("user", "name")
  res.status(200).json(headerInvoice);
};

const createHeaderInvoice = async (req, res = response) => {
  const { status, user, ...body } = req.body;
  const data = {
    ...body,
    user: req.user._id,
  };
  const headerInvoice = new HeaderInvoice(data);
  await headerInvoice.save();
  res.status(200).json(headerInvoice);
};

const updateHeaderInvoice = async (req, res) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;
  data.user = req.user._id;
  const headerInvoice = await HeaderInvoice.findByIdAndUpdate(id, data, { new: true });
  res.json(headerInvoice);
};

module.exports = {
  getHeaderInvoices,
  getHeaderInvoiceById,
  createHeaderInvoice,
  updateHeaderInvoice
};
