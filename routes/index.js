var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

//Route Functions Import
const login = require("../route_functions/login");

const profile = require("../route_functions/profile");

const {getUploadPdf, uploadPdf}  = require("../route_functions/upload_pdf");

const {getUpdateTaxSlip,
  updateTaxSlipValues,
  getUpdateTaxSlipValues
} = require("../route_functions/update_tax_slip");

const { updateViewAdd,
  viewStaff,
  addStaff,
  updateStaff,
  deleteStaff,
  viewAllStaff,
  getUpdateStaffValues
} = require("../route_functions/update_view_add");

const {
  updatePaySlip,
  getPaySlipEarningsDeductions,
  updatePaySlipEarnings,
  updatePaySlipDeductions,
  updateLoan,
  updateLoanRecoveries
} = require("../route_functions/update_pay_slip");

const getDashboard = require("../route_functions/dashboard");
const pool = require('../db/db_con');

//Multer Storage Function
const Storage = multer.diskStorage({
  destination: "/home/ubuntu/edu_dept/public/uploads",
  filename: (req, file, cb) => {
      cb(
          null,
          file.fieldname + "_" + req.body.pdf_type + "_" + Date.now() + path.extname(file.originalname)
      );
  },
});

const upload = multer({
  storage: Storage,
}).single("pdf_upload");

//Creating Unique Token
const createToken = (kgid) => {
  const secretKey = "educationdepartmentwebsiteforbelagavidistrictkahanapurtaluk";
  var userToken = jwt.sign({kgid: kgid}, secretKey);
  return userToken;
}

//Middlewares
const checkValidUser = (req, res, next) => {
  const role = req.session.role;
  if(req.session.userToken){
    if(role == "admin"){
      next();
    }
    else if(role == "teacher"){
      res.redirect("/teacher");
    }
    else{
      res.render('home', { title: 'Education Department', msg: "" });
    }
  }
  else{
    res.render('home', { title: 'Education Department', msg: "" });
  }
}


//==Defining Routes==

//Home Page
router.get('/', checkValidUser, function (req, res, next) {
  const kgid = req.session.kgid;
  const role = req.session.role;
  res.redirect("/dashboard/" + role + "/" + kgid);
});

//Login
router.post("/", (req, res, next) => {
  const userToken = createToken(req.params.kgid);
  login(req, res, userToken);
});

//Admin/Teacher Dashboard
router.get("/dashboard/:role/:kgid", checkValidUser, (req, res, next) => {
  getDashboard(req, res);
  //res.render("admin_dashboard", { title: "Admin Dashboard", msg: "", adminInfo: data.rows, kgid: kgid });
});

//Admin/Teacher Profile Page
router.get("/profile/:role/:kgid", checkValidUser, (req, res, next) => {
  profile(req, res);
});

//Admin > Update/View/Add Staff
router.get("/update-view-add/:kgid", checkValidUser, (req, res, next) => {
  updateViewAdd(req, res);
});

//Admin > View Staff
router.get("/view-staff/admin/:kgid", checkValidUser, (req, res, next) => {
  viewStaff(req, res);
});

//Admin > View All Staff
router.get("/view-all-staff/admin/:kgid/:currPage", checkValidUser, (req, res, next) => {
  viewAllStaff(req, res);
});

//Admin > Add Staff
router.post("/add-staff/admin/:kgid", checkValidUser, (req, res, next) => {
  addStaff(req, res);
});

//Admin > Update Staff
router.post("/update-staff/admin/:kgid", checkValidUser, (req, res, next) => {
  updateStaff(req, res);
});

//Admin > Get Update Staff Values
router.get("/get-update-staff-values/admin/:kgid", checkValidUser, (req, res, next) => {
  getUpdateStaffValues(req, res);
});

//Admin > Delete Staff
router.get("/delete-staff/admin/:kgid", checkValidUser, (req, res, next) => {
  deleteStaff(req, res);
});

//Admin > Update Pay Slip > Get Pay Slip
router.get("/update-pay-slip/admin/:prev_curr_year/:kgid", checkValidUser, (req, res, next) => {
  const admin_kgid = req.params.kgid;
  console.log("Update Pay Slip Called!!!");
  updatePaySlip(req, res);
});

//Admin > Update Pay Slip > Get Pay Slip Earnings and Deductions
router.get("/get-pay-slip-earnings-deductions/admin/:prev_curr_year/:kgid", checkValidUser, (req, res, next) => {
  getPaySlipEarningsDeductions(req, res);
});

//Admin > Update Pay Slip > Update Pay Slip Earnings
router.post("/update-pay-slip-earnings/admin/:prev_curr_year/:kgid", checkValidUser, (req, res, next) => {
  updatePaySlipEarnings(req, res);
});

//Admin > Update Pay Slip > Update Pay Slip Deductions
router.post("/update-pay-slip-deductions/admin/:prev_curr_year/:kgid", checkValidUser, (req, res, next) => {
  updatePaySlipDeductions(req, res);
});

//Admin > Update Pay Slip > Update Loan
router.post("/update-loan/admin/:prev_curr_year/:kgid", checkValidUser, (req, res, next) => {
  updateLoan(req, res);
});

//Admin > Update Pay Slip > Update Loan Recoveries
router.post("/update-loan-recoveries/admin/:prev_curr_year/:kgid", checkValidUser, (req, res, next) => {
  console.log("Working...");
  updateLoanRecoveries(req, res);
});

//Admin > Update Tax Slip > Get Tax Slip
router.get("/get-update-tax-slip/admin/:prev_curr_year/:kgid", checkValidUser, (req, res, next) => {
  getUpdateTaxSlip(req, res);
});

//Admin > Update Tax Slip > Get Tax Slip Values
router.get("/get-update-tax-slip-values/admin/:prev_curr_year/:kgid", checkValidUser, (req, res, next) => {
  getUpdateTaxSlipValues(req, res);
});

//Admin > Update Tax Slip > Update Tax Slip Values
router.post("/update-tax-slip-values/admin/:prev_curr_year/:kgid", checkValidUser, (req, res, next) => {
  updateTaxSlipValues(req, res);
});

//Admin > Get Upload PDF
router.get("/get-upload-pdf/admin/:kgid",checkValidUser, (req, res, next) => {
  getUploadPdf(req, res);
});

//Admin > Check PDF
const checkPdf = (req, res, next) => {
  const admin_kgid = req.params.kgid;
  if(path.extname(req.file.originalname) == ".pdf"){
    next();
  }
  else{
    res.render("upload_pdf", {title: "Upload PDF", msg: "File Should only be pdf!", kgid: admin_kgid});
  }
}

//Admin > Upload PDF
router.post("/upload-pdf/admin/:kgid", [checkValidUser, checkPdf, upload], (req, res, next) => {
  const admin_kgid = req.params.kgid;
  uploadPdf(req, res);
});

//Logout
router.get("/logout", checkValidUser, async (req, res, next) => {
  var query = "update login_credentials set unique_token=$1 where kgid=$2";
  var kgid = req.session.kgid;
  await pool.query(query, ["", kgid]);
  req.session.destroy((err) => {
    if(err){
      console.log(err);
    }
  });
  res.redirect("/");
});

module.exports = router;

/*
  Admin Login > 1000
  Admin Dashboard > 500
  Admin Profile > 500
  Admin Staff Updates > 3000
  Admin Pay Slip Update > 2500
  Admin Tax Slip Update > 2500
  Admin PDF Uploads > 1000
  Admin Logout > 500

  Teacher Login > 1000
  Teacher Dashboard > 500
  Teacher Profile > 500
  Teacher Pay Slip > 1500
  Teacher Tax Slip > 1500
  Techer PDF's > 500
  Teacher GPF Statement > 500
  Teacher Logout > 500

  Server Deployment and Maintainance
  Per 3 Month > 2000 (Can be scaled on usage)
  
  Database Maintainance
  Per 3 Months > 2000 (Can be scaled on usage)

  Extra charges applicable for website modifications

  Total: 18,000 /-
  Server Maintainance and DB(Per 3 Months): 4000 (Can be scaled on usage)
*/
