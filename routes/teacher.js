const express = require("express");
const router = express.Router();
const pool = require("../db/db_con");

//Route Functions Import
const {teacherDashboard} = require("../route_functions/teacher/dashboard");

const {getTaxForm} = require("../route_functions/teacher/tax_form");

const {getTaxSlip} = require("../route_functions/teacher/tax_slip");

const {
    getPaySlip,
    getPaySlipValues
} = require("../route_functions/teacher/paySlip");

//Middlewares
const checkValidUser = async (req, res, next) => {
    const role = req.session.role;
    if(role == "teacher"){
        next()
    }
    else if(role == "admin"){
        res.redirect("/");
    }
    else{
        res.render('home', { title: 'Education Department', msg: "" });
    }
}

//Teache > Dashboard
router.get("/", checkValidUser, async(req, res, next) => {
    teacherDashboard(req, res);
});

//Teacher > Pay Slip
router.get("/get-pay-slip/:prev_curr_year", checkValidUser, (req, res, next) => {
    getPaySlip(req, res);
});

//Teacher > Get Pay Slip Values
router.get("/get-pay-slip-values/:prev_curr_year", checkValidUser, (req, res, next) => {
    getPaySlipValues(req, res);
});

//Teacher > Get Tax Form
router.get("/get-tax-form/:prev_curr_year", checkValidUser, (req, res, next) => {
    getTaxForm(req, res);
});

//Teacher > Get Tax Slip
router.get("/get-tax-slip/:prev_curr_year", checkValidUser, (req, res, next) => {
    getTaxSlip(req, res);
});


//Logout
router.get("/logout", checkValidUser, async (req, res, next) => {
    var query = "update login_credentials set unique_token=$1 where kgid=$2";
    var kgid = req.session.kgid;
    await pool.query(query, ["", kgid]);
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/");
});

module.exports = router;