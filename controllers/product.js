const userModel = require("../model/user");
const customerModel = require("../model/customer");

const productModel = require("../model/product");

exports.add_product = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const adminData = await userModel.findOne({ _id: adminId });
    if (!adminData) {
      return res.status(400).send({ message: "You are not authorized" });
    }
    const productRequest = req.body;
    const productData = await productModel.create(productRequest);
    return res.status(201).send({
      message: "product created successfully",
      ProductData: productData,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.edit_product = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userData = await userModel.findOne({ _id: userId });

    if (!userData) {
      return res.status(400).send({ message: "You are not authorized" });
    }

    const productId = req.params.productId;
    const {
      brandName,
      productName,
      title,
      description,
      subcategory,
      price,
      productType,
    } = req.body;
    const updatedProduct = await productModel.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      {
        brandName: brandName,
        productName: productName,
        title: title,
        description: description,
        subcategory: subcategory,
        price: price,
        productType: productType,
      }
    );

    if (!updatedProduct)
      return res
        .status(400)
        .send({ message: "product id is invalid or product dos not exist" });

    return res.status(200).send({ updatedProduct });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.get_products = async (req, res) => {
  try {
    const allProduct = await productModel.find({ isDeleted: false });
    return res.status(200).send(allProduct);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.delete_product = async (req, res) => {
  try {
    const userId = req.user;
    const validUser = await userModel.findOne({ _id: userId });
    if (!validUser) {
      return res.status(400).send({ message: "You are not authorized" });
    }

    const productId = req.params.productId;
    await productModel.updateOne({ _id: productId }, { isDeleted: true });

    return res.status(200).send({ message: "Product deleted successfully" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.get_specific_product = async (req, res) => {
  try {
    const {
      brandName,
      productName,
      title,
      subcategory,
      priceLes,
      productType,
    } = req.body;

    if (
      brandName ||
      productName ||
      title ||
      subcategory ||
      priceLes ||
      productType
    ) {
      let product = {};
      product.isDeleted = false;
      if (brandName) product.brandName = brandName;

      if (productName) product.brandName = productName;

      if (title) product.title = title;

      if (subcategory) product.subcategory = subcategory;

      if (priceLes) product.price = { $lt: priceLes };

      if (priceGr) product.price = { $gt: priceGr };

      const products = await productModel
        .find(product)
        .sort({ price: priceLes });
      if (!(products.length > 0))
        return res.status(404).send({ message: "no product found" });

      return res.status(200).send(products);
    } else {
      const products = await productModel.find().sort({ price: priceLes });
      return res.status(200).send(products);
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.add_to_wishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const validUser = await customerModel.findOne({ _id: userId });
    if (!validUser) {
      return res.status(400).send({ message: "You are not authorized" });
    }
    const productId = req.body.productId;
    await customerModel.updateOne({ _id: userId }, { $push: { wishlist: productId } });
    
    return res.status(200).send({ message: "Product added to wishlist" });  
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
exports.remove_from_wishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const validUser = await customerModel.findOne({ _id: userId });
    if (!validUser) {
      return res.status(400).send({ message: "You are not authorized" });
    }
    const productId = req.body.productId;
    await customerModel.updateOne({ _id: userId }, { $pull: { wishlist: productId } });
    
    return res.status(200).send({ message: "Product removed from wishlist" });  
  } catch (error) {
    return res.status(500).send(error.message);
  }
}