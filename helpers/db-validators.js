const { Category, Product } = require("../models");
const Role = require("../models/role.model");
const User = require("../models/user.model");

const isAValidRole = async (role = "") => {
  const roleExist = await Role.findOne({ role });
  if (!roleExist)
    throw new Error(`Role: ${role} is not registered in Database`);
};

const emailExist = async (email = "") => {
  const emailExist = await User.findOne({ email });
  if (emailExist) throw new Error(`Email already exist in DB`);
};

const userByIdExist = async (id) => {
  const userExist = await User.findById(id);
  if (!userExist) throw new Error(`the Id does not exist`);
};

const categoryExistById = async (id) => {
  const categoryExist = await Category.findById(id);
  if (!categoryExist) throw new Error(`the category Id does not exist`);
};

const productExistById = async (id) => {
  const productExist = await Product.findById(id);
  if (!productExist) throw new Error(`the product Id does not exist`);
};

const allowedCollections = async (collection = "", collections = []) => {
  const isIncluded = collections.includes(collection);
  if (!isIncluded)
    throw new Error(
      `The collection ${collection} is not allowed, ${collections}`
    );
  return true;
};

const validateProductQuantity = (value, { req }) => {
  const MAX_QUANTITY = 7;
  const { product_details } = req.body;
  const invalidQuantities = product_details.filter(detail => detail.product_quantity > MAX_QUANTITY);
  if (invalidQuantities.length > 0) {
    const errorMessage = `You cannot buy more than ${MAX_QUANTITY} products`;
    throw new Error(errorMessage);
  }
  return true;
};


const validateDifferentProducts = (value, { req }) => {
  const MAX_PRODUCTS = 10;
  const { product_details } = req.body;
  // Obtener IDs de productos diferentes
  const differentProductIds = new Set(product_details.map(detail => detail.id_product));
  // Verificar si se supera el límite máximo de productos diferentes
  if (differentProductIds.size > MAX_PRODUCTS) {
    const errorMessage = `You can choose no more than ${MAX_PRODUCTS} different products`;
    throw new Error(errorMessage);
  }
  return true;
};



module.exports = {
  isAValidRole,
  emailExist,
  userByIdExist,
  categoryExistById,
  productExistById,
  allowedCollections,
  validateProductQuantity,
  validateDifferentProducts
};
