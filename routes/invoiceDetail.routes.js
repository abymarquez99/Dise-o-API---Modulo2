const { Router } = require("express");
const { check } = require("express-validator");
const {
  getInvoiceDetails,
  getInvoiceDetailById,
  createInvoiceDetail,
} = require("../controllers/invoiceDetail.controller");

const { validateJWT, validateFields } = require("../middleware");
const {
  productExistById,
  validateDifferentProducts,
  validateProductQuantity,
} = require("../helpers/db-validators");

const router = Router();

router.get("/", getInvoiceDetails);

router.get(
  "/:id",
  [
    check("id", "is not a mongoID").isMongoId(),
    validateFields,
  ],
  getInvoiceDetailById
);

router.post(
  "/",
  [
    check("product_details")
      .isArray()
      .custom(async (productDetails) => {
        for (const product of productDetails) {
          const { id_product } = product;
          await productExistById(id_product);
        }
      }),
    check("product_details").custom(validateDifferentProducts),
    check("product_quantity").custom(validateProductQuantity),
    validateJWT,
    validateFields,
  ],
  createInvoiceDetail
);



module.exports = router;
