const subAdminModel = require("../model/user");
const storeModel = require("../model/store");
//const orderModel = require("../model/order");
//var mongodb= require('mongodb');
//var db = require('database.js');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.subAdmin_signup = async (req, res) => {
  try {
    let { email, password, storeId } = req.body;
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const userData = await subAdminModel.create({
      email: email,
      password: password,
      storeId: storeId,
    });
    const loginId = userData._id;
    const user = { loginId, password };
    await storeModel.findOneAndUpdate(
      { storeId: storeId },
      { $push: { subAdmins: user } }
    );
    return res
      .status(201)
      .send({ message: "Sub Admin data created successfully", userData });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.subAdmin_login = async (req, res) => {
  try {
    const subAdminEmail = req.body.email;
    const subAdminPassword = req.body.password;
    let subAdmin = await subAdminModel.findOne({ email: subAdminEmail });
    if (!subAdmin) {
      return res
        .status(400)
        .send({ message: "email is not valid or user dose not exist" });
    }
    const { _id, password } = subAdmin;
    const validPassword = await bcrypt.compare(subAdminPassword, password);
    if (!validPassword) {
      return res.status(400).send({ message: "Invalid Password" });
    }
    const payload = { userId: _id, email: subAdminEmail };
    const generatedToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {      // "" + added here
      expiresIn: "10080m",
    });
    res.header("jwt-token", generatedToken);
    return res
      .status(200)
      .send({
        message: ` you have logged in Successfully`,
        token: generatedToken
      });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// exports.subAdmin_update = async (req, res) => {
//   try {

//     const subAdminData = await subAdminModel.findOne({
//       _id:req.user.userId,
//     });
//     if (!subAdminData) {
//       return res.status(400).send({ message: "You are not authorized" });
//     }
//     let { firstName, lastName, mobileNumber, password, address } = req.body;
//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       password = await bcrypt.hash(password, salt);
//     }
//     if (address) {
//       if (address.street) {
//         subAdminData.address.street = address.street;
//       }
//       if (address.city) {
//         subAdminData.address.city = address.city;
//       }
//       if (address.pinCode) {
//         subAdminData.address.pinCode = address.pinCode;
//       }
//     }
//     const newSubAdminData = await userModel.findOneAndUpdate(
//       { _id: adminData._id },
//       {
//         firstName: firstName,
//         lastName: lastName,
//         email: email,
//         password: password,
//         mobileNumber: mobileNumber,
//         address: subAdminData.address,
//       }
//     );
//     return res
//       .status(201)
//       .send({
//         message: "Sub Admin data updated successfully",
//         UpdatedData: newSubAdminData,
//       });
//   } catch (err) {
//     return res.status(500).send(err.message);
//   }
// };

exports.delete_subAdmin = async (req, res) => {
  try {
    const subAdminData = await subAdminModel.findOne({
      _id: req.user.userId,
    });
    if (!subAdminData) {
      return res.status(400).send({ message: "You are not authorized" });
    }
    await subAdminModel.findOneAndUpdate(
      { _id: req.user.userId },
      { isDeleted: true }
    );
    return res.status(200).send({ message: "sub admin deleted successfully" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};



// exports.getSoldProductData = async (req, res) => {
  

//     const FIRST_MONTH = 1
// const LAST_MONTH = 12
// const MONTHS_ARRAY = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]

// let TODAY = "2020-04-06T23:59:59"
// let YEAR_BEFORE = "2019-04-07T00:00:00"

// db.orders.aggregate( [
//   { 
//       $match: { 
//           productId: req.body.productId, 
//           created_at: { $gte: YEAR_BEFORE, $lte: TODAY }
//       }
//   },
//   { 
//       $group: {
//           _id: { "year_month": { $substrCP: [ "$created_at", 0, 7 ] } }, 
//           count: { $sum: 1 }
//       } 
//   },
//   {
//       $sort: { "_id.year_month": 1 }
//   },
//   { 
//       $project: { 
//           _id: 0, 
//           count: 1, 
//           month_year: { 
//               $concat: [ 
//                  { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ { $toInt: { $substrCP: [ "$_id.year_month", 5, 2 ] } }, 1 ] } ] },
//                  "-", 
//                  { $substrCP: [ "$_id.year_month", 0, 4 ] }
//               ] 
//           }
//       } 
//   },
//   { 
//       $group: { 
//           _id: null, 
//           data: { $push: { k: "$month_year", v: "$count" } }
//       } 
//   },
//   { 
//       $addFields: { 
//           start_year: { $substrCP: [ YEAR_BEFORE, 0, 4 ] }, 
//           end_year: { $substrCP: [ TODAY, 0, 4 ] },
//           months1: { $range: [ { $toInt: { $substrCP: [ YEAR_BEFORE, 5, 2 ] } }, { $add: [ LAST_MONTH, 1 ] } ] },
//           months2: { $range: [ FIRST_MONTH, { $add: [ { $toInt: { $substrCP: [ TODAY, 5, 2 ] } }, 1 ] } ] }
//       } 
//   },
//   { 
//       $addFields: { 
//           template_data: { 
//               $concatArrays: [ 
//                   { $map: { 
//                        input: "$months1", as: "m1",
//                        in: {
//                            count: 0,
//                            month_year: { 
//                                $concat: [ { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ "$$m1", 1 ] } ] }, "-",  "$start_year" ] 
//                            }                                            
//                        }
//                   } }, 
//                   { $map: { 
//                        input: "$months2", as: "m2",
//                        in: {
//                            count: 0,
//                            month_year: { 
//                                $concat: [ { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ "$$m2", 1 ] } ] }, "-",  "$end_year" ] 
//                            }                                            
//                        }
//                   } }
//               ] 
//          }
//       }
//   },
//   { 
//       $addFields: { 
//           data: { 
//              $map: { 
//                  input: "$template_data", as: "t",
//                  in: {   
//                      k: "$$t.month_year",
//                      v: { 
//                          $reduce: { 
//                              input: "$data", initialValue: 0, 
//                              in: {
//                                  $cond: [ { $eq: [ "$$t.month_year", "$$this.k"] },
//                                               { $add: [ "$$this.v", "$$value" ] },
//                                               { $add: [ 0, "$$value" ] }
//                                  ]
//                              }
//                          } 
//                      }
//                  }
//               }
//           }
//       }
//   },
//   {
//       $project: { 
//           data: { $arrayToObject: "$data" }, 
//           _id: 0 
//       } 
//   }
// ] )


 
// }