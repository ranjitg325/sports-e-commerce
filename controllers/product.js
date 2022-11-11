const userModel = require("../model/user");
const customerModel = require("../model/customer");
const adminModel = require("../model/admin.js")
const productModel = require("../model/product");
const aws = require("../aws/aws");


// exports.add_product = async (req, res) => {
//   try {
//     const adminId = req.user.userId;
//     const adminData = await userModel.findOne({ _id: adminId });
//     if (!adminData) {
//       return res.status(400).send({ message: "You are not authorized" });
//     }
//     const productRequest = req.body;
//     const productData = await productModel.create(productRequest);
//     return res.status(201).send({
//       message: "product created successfully",
//       ProductData: productData,
//     });
//   } catch (err) {
//     return res.status(500).send(err.message);
//   }
// };
exports.add_product = async (req, res) => {
  try {
    let { 
      brand,
      productName,
      title,
      description,
      category,
      subcategory,
      price,
      currencyId,
      currencyFormat,
      isFreeShipping,
      productType,
      quantity
    } = req.body;
    let images = req.files;

    if(req.files && req.files.length > 0){
      images = await Promise.all(
        req.files.map(async (file) => {
          return await aws.uploadToS3(file.buffer);
          
        })
      );
    }
   console.log(images);
    const newProduct = new productModel({
      brand,
      productName,
      title,  
      description,
      category,
      subcategory,
      price,
      currencyId,
      currencyFormat,
      isFreeShipping,
      productType,
      quantity,
      images,
      //adminId : req.user.userId
    });

    const product = await newProduct.save();
    return res.status(201).send({
      message: "product created successfully",
      ProductData: product,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
}


exports.edit_product = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userData = await userModel.findOne({ _id: userId });

    if (!userData) {
      return res.status(400).send({ message: "You are not authorized" });
    }

    const productId = req.params.productId;
    const {
      brand,
      productName,
      title,
      description,
      category,
      subcategory,
      price,
      productType,
    } = req.body;
    const updatedProduct = await productModel.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      {
        brand: brand,
        productName: productName,
        title: title,
        description: description,
        category: category,
        subcategory: subcategory,
        price: price,
        productType: productType,
      }, { new: true }
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
    //const userId = req.user;
    const userId = req.user.userId;
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

// exports.get_specific_product = async (req, res) => {
//   try {
//     const {
//       brandName,
//       productName,
//       title,
//       subcategory,
//       priceLes,
//       productType,
//       priceGr
//     } = req.body;

//     if (
//       brandName ||
//       productName ||
//       title ||
//       subcategory ||
//       priceLes ||
//       priceGr||
//       productType
//     ) {
//         let product = {};
//         product.isDeleted = false;
//         if (brandName) product.brandName = brandName;

//         if (productName) product.productName = productName;

//         if (title) product.title = title;

//         if (subcategory) product.subcategory = subcategory;

//         if (priceLes) product.price = priceLes;

//         if (priceGr) product.price = priceGr;

//         if(priceGr){
//         const products = await productModel
//           .find({price:{$gte:priceGr}})

//           console.log(products);
//           res.status(200).send(products);
//           // console.log("---------------------",products.length);
//         if (!products)
//           return res.status(404).send({ message: "no product found" });
//         }
//         else{
//          const products = await  productModel.find({price:{$lte:priceLes}});
//         return res.status(200).send(products);
//         }

//     } else {
//       return res
//       .status(500)
//       .send("Please enter a valid field name");

//     }
//   } catch (err) {
//     return res.status(500).send(err.message);
//   }
// };



exports.get_specific_product = async (req, res) => {

  try {
    const filterQuery = { isDeleted: false } 
    const queryParams = req.body;


    if (queryParams) {
      const { name_by_product, name_by_brand, category, subcategory, priceLes, priceGr, priceSort } = queryParams;

      if (name_by_product || name_by_brand || category || subcategory) {

        let body = {};
        body.isDeleted = false

        if (name_by_product) {
          body.productName = { "$regex": name_by_product, "$options": "i" }
        }
        if (name_by_brand) {
          body.brand = { "$regex": name_by_brand, "$options": "i" }
        }
        if (category) {
          body.category = { "$regex": category, "$options": "i" }
        }
        if (subcategory) {
          body.subcategory = { "$regex": subcategory, "$options": "i" }
        }
        let productFound = await productModel.find(body).sort({ price: priceSort })
        if (!(productFound.length > 0)) {
          return res.status(404).send({ status: false, message: "No Product found" });
        }
        return res.status(200).send({ status: true, message: 'searched Product list', data: productFound });
      }

      //setting price for ranging the product's price to fetch them.
      if (priceGr) {

        if (!(!isNaN(Number(priceGr)))) {
          return res.status(400).send({ status: false, message: `priceGreaterThan should be a valid number` })
        }
        if (priceGr <= 0) {
          return res.status(400).send({ status: false, message: `priceGreaterThan should be a valid number` })
        }
        if (!filterQuery.hasOwnProperty('price'))
          filterQuery['price'] = {}
        filterQuery['price']['$gte'] = Number(priceGr)
      }

      //setting price for ranging the product's price to fetch them.
      if (priceLes) {

        if (!(!isNaN(Number(priceLes)))) {
          return res.status(400).send({ status: false, message: `priceLessThan should be a valid number` })
        }
        if (priceLes <= 0) {
          return res.status(400).send({ status: false, message: `priceLessThan should be a valid number` })
        }
        if (!filterQuery.hasOwnProperty('price'))
          filterQuery['price'] = {}
        filterQuery['price']['$lte'] = Number(priceLes)
      }

      //sorting the products acc. to prices => 1 for ascending & -1 for descending.
      if (priceSort) {

        if (!((priceSort == 1) || (priceSort == -1))) {
          return res.status(400).send({ status: false, message: `priceSort should be 1 or -1 ` })
        }

        const products = await productModel.find(filterQuery).sort({ price: priceSort })

        if (Array.isArray(products) && products.length === 0) {
          return res.status(404).send({ productStatus: false, message: 'No Product found' })
        }

        return res.status(200).send({ status: true, message: 'Product list', data2: products })
      }
    

    const products = await productModel.find(filterQuery).sort({ price: priceSort })

    //verifying is it an array and having some data in that array.
    if (Array.isArray(products) && products.length === 0) {
      return res.status(404).send({ productStatus: false, message: 'No Product found' })
    }

    return res.status(200).send({ status: true, message: 'Product list', data: products })
  }
  } 
  catch (error) {
    return res.status(500).send({ status: false, error: error.message });
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

exports.newArivalProduct = async (req, res) => {
  console.log("newArivalProduct");
  try {
    const user = req.user.userId;
    const validUser = await adminModel.findOne({ _id: user }) || await userModel.findOne({ _id: user });
    if (!validUser) {
      return res.status(400).send({ message: "You are not authorized" });
    }
    const checkDate = getOneWeekBeforeDate();
    const price = req.body.price;
    if (price >= 0) {
      res.status(200).send(await productModel.find({ price: { $gte: price }, createdAt: { $gte: checkDate } }));
    }
    else {
      res.status(500).send("There is no product in this price range and given date");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}
function getOneWeekBeforeDate() {
  var today = new Date();
  var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  return lastWeek;
}

