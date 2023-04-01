const { Router } = require("express");
const { check } = require("express-validator");
const {
  getHeaderInvoices,
  getHeaderInvoiceById,
  createHeaderInvoice,
  updateHeaderInvoice,
} = require("../controllers/headerInvoice.controller");

const { validateJWT, validateFields, isAdminRole } = require("../middleware");

const router = Router();

router.get("/", getHeaderInvoices);

router.get(
  "/:id",
  [
    check("id", "is not a mongoID").isMongoId(),
    validateFields,
  ],
  getHeaderInvoiceById
);

router.post(
  "/",
  [
     check("user", "user is mandatory").not().isEmpty(),
     check("user", "is not a mongoID").isMongoId(),
     validateJWT,
     validateFields,
  ],
  createHeaderInvoice
);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "is not a mongoID").isMongoId(),
    validateFields,
  ],
  updateHeaderInvoice
);

module.exports = router;
