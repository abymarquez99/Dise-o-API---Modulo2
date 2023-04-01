const { Router } = require("express");
const { check } = require("express-validator");
const {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoice.controller");
const {
  invoiceExistById,
} = require("../helpers/db-validators");
const { validateJWT, validateFields, isAdminRole } = require("../middleware");

const router = Router();

router.get("/", getInvoices);

router.get(
  "/:id",
  [
    check("id", "is not a mongoID").isMongoId(),
    check("id").custom(invoiceExistById),
    validateFields,
  ],
  getInvoiceById
);

router.post(
  "/",
  [
    
    check("user", "user is mandatory").not().isEmpty(),
    validateJWT,
    validateFields,
  ],
  createInvoice
);

router.put(
  "/:id",
  [
    validateJWT,
    check("user", "user is mandatory").not().isEmpty(),
    check("id", "is not a mongoID").isMongoId(),
    check("id").custom(invoiceExistById),
    validateFields,
  ],
  updateInvoice
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "is not a mongoID").isMongoId(),
    check("id").custom(invoiceExistById),
    validateFields,
  ],
  deleteInvoice
);

module.exports = router;
