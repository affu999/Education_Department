const pool = require("../db/db_con");

//Check if Year and month are valid
const checkValidYearMonth = async (prevCurrYear, year, month) => {
    var all_months = {};
    if(prevCurrYear === "previous_year"){
        var query = "select prev_year from current_years";
        await pool.query(query).then((data) => {
            if(data.rows[0].prev_year == year){
                all_months = {Mar: "Mar", Apr: "Apr", May: "May", Jun: "Jun", Jul: "Jul", Aug: "Aug", Sep: "Sep", Oct: "Oct", Nov: "Nov", Dec: "Dec"};
            }
            else if(parseInt(data.rows[0].prev_year) + 1 == year){
                all_months = {Jan: "Jan", Feb: "Feb"};
            }
        });
        if(!(month in all_months)){
            return true;
        }
        else{
            return false;
        }
    }
    else if(prevCurrYear == "previous_year_2"){
        var query = "select prev_year_2 from current_years";
        await pool.query(query).then((data) => {
            if(data.rows[0].prev_year_2 == year){
                all_months = {Mar: "Mar", Apr: "Apr", May: "May", Jun: "Jun", Jul: "Jul", Aug: "Aug", Sep: "Sep", Oct: "Oct", Nov: "Nov", Dec: "Dec"};
            }
            else if(parseInt(data.rows[0].prev_year_2) + 1 == year){
                all_months = {Jan: "Jan", Feb: "Feb"};
            }
        });
        if(!(month in all_months)){
            return true;
        }
        else{
            return false;
        }
    }
    else if(prevCurrYear === "current_year"){
        temp_all_months = {"Jan":0, "Feb":1, "Mar":2, "Apr":3, "May":4, "Jun":5, "Jul":6, "Aug":7, "Sep":8, "Oct":9, "Nov":10, "Dec":11};
        //console.log(temp_all_months[`${month}`] <= new Date().getMonth());
        //console.log(year <= new Date().getFullYear())
        if(!(year <= new Date().getFullYear())){
            //console.log("returning true1");
            return true;
        }
        else if(!(temp_all_months[`${month}`] <= new Date().getMonth())){
            //console.log("returning true2");
            return true;
        }
        else{
            var query = "select curr_year from current_years"; // 2021
            await pool.query(query).then((data) => {
                if(data.rows[0].curr_year == year){
                    all_months = {Mar: "Mar", Apr: "Apr", May: "May", Jun: "Jun", Jul: "Jul", Aug: "Aug", Sep: "Sep", Oct: "Oct", Nov: "Nov", Dec: "Dec"};
                }
                else if(parseInt(data.rows[0].curr_year) + 1 == year){
                    all_months = {Jan: "Jan", Feb: "Feb"};
                }
            });
            if(!(month in all_months)){
                //console.log(all_months);
                //console.log(month);
                //console.log("returning true3");
                return true;
            }
            else{
                //console.log("returning false");
                return false;
            }
        }
    }
    else{
        //console.log("returning true4");
        return true;
    }
}

//Get Current/Previous Years
const getCurrentPreviousYear = async (prev_curr_year) => {
    var years = [];
    if(prev_curr_year === "previous_year"){
        var query = "select prev_year from current_years";
        await pool.query(query).then((data) => {
            years.push(parseInt(data.rows[0].prev_year));
            years.push(parseInt(data.rows[0].prev_year) + 1);
        });
    }
    else if(prev_curr_year == "previous_year_2"){
        var query = "select prev_year_2 from current_years";
        await pool.query(query).then((data) => {
            years.push(parseInt(data.rows[0].prev_year_2));
            years.push(parseInt(data.rows[0].prev_year_2) + 1);
        });
    }
    else if(prev_curr_year === "current_year"){
        var query = "select curr_year from current_years";
        await pool.query(query).then((data) => {
            years.push(parseInt(data.rows[0].curr_year));
            years.push(parseInt(data.rows[0].curr_year) + 1);
        });
    }
    return years;
}

//Get Curr Prev Year
const getCurrPrevYear = async () => {
    var query = "select * from current_years";
    var current_years = [];
    await pool.query(query).then((data) => {
        current_years.push(data.rows[0]);
    });
    return current_years;
}


//Get Staff KGID's
const getStaffKGIDS = async () => {
    var query  = "select kgid from login_credentials";
    all_staff_kgid = [];
    try {
        await pool.query(query).then((data) => {
            all_staff_kgid = data.rows;
        });
        return all_staff_kgid;
    } catch (err) {
        //console.log("Error Occured in getting staff kgid's");
        return [];
    }
}

//Get Update Pay Slip Page
const updatePaySlip = async (req, res) => {
    const admin_kgid = req.params.kgid;
    const prevCurrYear = req.params.prev_curr_year;
    const current_years = await getCurrPrevYear();
    //console.log(admin_kgid);
    //console.log(prevCurrYear);
    var years = await getCurrentPreviousYear(prevCurrYear);
    var all_staff_kgid = await getStaffKGIDS();
    res.render("update_pay_slip", {title: "Update Pay Slip", msg: "", data: [{}, {}, {years: years}, {all_staff_kgid: all_staff_kgid}], kgid: admin_kgid, prev_curr_year:prevCurrYear, current_years: current_years[0], loan_recoveries_data: {}});
}


//Called Within getPaySlipEarningsDeductions
const getPaySlipDeductions = async (req, res) => {
    //Get Pay Slip Deductions
    const admin_kgid = req.params.kgid;
    const prevCurrYear = req.params.prev_curr_year;
    const current_years = await getCurrPrevYear();
    const {
        staff_kgid,
        year,
        month
    } = req.query;
    try {
        //console.log("In try block");
        //console.log(staff_kgid);
        var query = "insert into pay_slip_deductions(kgid, year, month) values($1, $2, $3)";
        await pool.query(query, [staff_kgid, year, month]);
        //console.log("query executed");
        var paySlipDeductionsData = [];
        query = "select * from pay_slip_deductions where kgid=$1 and year=$2 and month=$3";
        await pool.query(query).then((data) => {
            paySlipDeductionsData.push(data.rows[0]);
        });
        // res.render("update_pay_slip", {title: "Update Pay Slip", msg: "", data: paySlipDeductionsData, kgid: admin_kgid});
        return paySlipDeductionsData[0];
    } catch (err) {
        var query = "select * from pay_slip_deductions where kgid=$1 and year=$2 and month=$3";
        //console.log(staff_kgid);
        var paySlipDeductionsData = {};
        await pool.query(query, [staff_kgid, year, month]).then((data) => {
            //console.log("query executed");
            //console.log(data.rows[0]);
            // res.render("update_pay_slip", {title: "Update Pay Slip", msg: "", data: data.rows, kgid: admin_kgid});
            paySlipDeductionsData = data.rows[0];
        });
        return paySlipDeductionsData;
    }
}


//Get Pay Slip Earnings and Deductions
const getPaySlipEarningsDeductions = async (req, res) => {
    const admin_kgid = req.params.kgid;
    const prevCurrYear = req.params.prev_curr_year;
    const current_years = await getCurrPrevYear();
    var years = await getCurrentPreviousYear(prevCurrYear);
    var all_staff_kgid = await getStaffKGIDS();
    var loan_recoveries_data = [];
    const {
        staff_kgid,
        year,
        month
    } = req.query;
    //console.log(year, month, staff_kgid);

    var query = "select kgid from login_credentials where kgid=$1";
    try {
        await pool.query(query, [staff_kgid]).then(async (data) => {
            if(data.rowCount == 0){
                res.send("Invalid KGID Staff Doesn't Exist!!!");
            }
            else{
                // Year Month Validations
                var check = await checkValidYearMonth(prevCurrYear, year, month);
                //console.log(check);
                if(check){
                    res.render("update_pay_slip", {title: "Update Pay Slip", msg: "Could Not Update Data!!!", data: [{}, {}, {years: years}, {all_staff_kgid: all_staff_kgid}], kgid: admin_kgid, prev_curr_year:prevCurrYear, current_years: current_years[0], loan_recoveries_data: {}});
                }
                else{
                    //Get Pay Slip Earnings
                    try {
                        //console.log("In try block");
                        try {
                            var query = "insert into loan_recoveries(kgid, year, month) values($1, $2, $3)";
                            await pool.query(query, [staff_kgid, year, month]);
                            query = "select * from loan_recoveries where kgid=$1 and year=$2 and month=$3";
                            await pool.query(query, [staff_kgid, year, month]).then((data) => {
                                loan_recoveries_data.push(data.rows[0]);
                            });
                        } catch (err) {
                            var query = "select * from loan_recoveries where kgid=$1 and year=$2 and month=$3";
                            await pool.query(query, [staff_kgid, year, month]).then((data) => {
                                loan_recoveries_data.push(data.rows[0]);
                            });
                        }

                        query = "insert into pay_slip_earnings(kgid, year, month) values($1, $2, $3)";
                        await pool.query(query, [staff_kgid, year, month]);
                        //console.log("query executed");
                        paySlipEarningData = [];
                        query = "select * from pay_slip_earnings where \
                        kgid=$1 and year=$2 and month=$3";
                        await pool.query(query, [staff_kgid, year, month]).then((data) => {
                            paySlipEarningData.push(data.rows[0]);
                        });
                        const paySlipDeductionData = await getPaySlipDeductions(req, res);
                        paySlipEarningData.push(paySlipDeductionData);
                        paySlipEarningData.push({years:years});
                        paySlipEarningData.push({all_staff_kgid: all_staff_kgid});
                        res.render("update_pay_slip", {title: "Update Pay Slip", msg: "", data: paySlipEarningData, kgid: admin_kgid, prev_curr_year:prevCurrYear, current_years: current_years[0], loan_recoveries_data: loan_recoveries_data[0]});
                    } catch (err) {
                        var query = "select * from pay_slip_earnings where kgid=$1 and year=$2 and month=$3";
                        var paySlipEarningDeductionData = [];
                        await pool.query(query, [staff_kgid, year, month]).then(async (data) => {
                            const paySlipDeductionData = await getPaySlipDeductions(req, res);
                            paySlipEarningDeductionData.push(data.rows[0]);
                            paySlipEarningDeductionData.push(paySlipDeductionData);
                            paySlipEarningDeductionData.push({years: years});
                            paySlipEarningDeductionData.push({all_staff_kgid: all_staff_kgid});
                            res.render("update_pay_slip", {title: "Update Pay Slip", msg: "", data: paySlipEarningDeductionData, kgid: admin_kgid, prev_curr_year:prevCurrYear, current_years: current_years[0], loan_recoveries_data: loan_recoveries_data[0]});
                        });
                    }
                }
            }
        });
    } catch (err) {
        res.send("Some Error Occured at Update Pay Slip");
    }

    
}

const updatePaySlipDeductions = async (req, res) => {
    const admin_kgid = req.params.kgid;
    const prevCurrYear = req.params.prev_curr_year;
    const current_years = await getCurrPrevYear();
    var years = await getCurrentPreviousYear(prevCurrYear);
    var all_staff_kgid = await getStaffKGIDS();
    
    const {
        staff_kgid, pt, lic, slip_kgid, gpf, it, nps, hba, others, slip_kgid_recoveries, gpf_recoveries, local_recoveries, egis, year, month
    } = req.body;
    try {
        var query = "update pay_slip_deductions set it=$15, gpf_recoveries=$14, \
        pt=$1, lic=$2, slip_kgid=$3, gpf=$4, nps=$5, hba=$6, others=$7, \
        slip_kgid_recoveries=$9, local_recoveries=$10, egis=$11 where kgid=$8 and year=$12 and month=$13";

        await pool.query(query, [pt, lic, slip_kgid, gpf, nps, hba, others, staff_kgid, slip_kgid_recoveries, local_recoveries, egis, year, month, gpf_recoveries, it]);
        // res.render("update_pay_slip", {title: "Update Pay Slip", msg: "Pay Slip Updated", data: [{}, {}, {years: years}, {all_staff_kgid: all_staff_kgid}], kgid: admin_kgid, prev_curr_year:prevCurrYear, current_years: current_years[0], loan_recoveries_data: {}});
    } catch (err) {
        res.render("update_pay_slip", {title: "Update Pay Slip", msg: "Updation Unsuccessful!!!", data: [{}, {}, {years: years}, {all_staff_kgid: all_staff_kgid}], kgid: admin_kgid, prev_curr_year:prevCurrYear, current_years: current_years[0], loan_recoveries_data: {}});
    }
}

const updatePaySlipEarnings = async (req, res) => {
    const admin_kgid = req.params.kgid;
    const prevCurrYear = req.params.prev_curr_year;
    const current_years = await getCurrPrevYear();
    var years = await getCurrentPreviousYear(prevCurrYear);
    var all_staff_kgid = await getStaffKGIDS();
    const {
        staff_kgid, pay, ir, sa, ma, ra, fta, pp, cha, pp_sfn, stag_count, stag_amt,
        pay_fixation_amt, year, month, establishment_no
    } = req.body;
    try {
        var query = "select * from calculations";
        var da = 0;
        var hra = 0;
        await pool.query(query).then((data) => {
            da = pay * data.rows[0].da_percent / 100;
            hra = pay * data.rows[0].hra_percent / 100;
        });

        query = "update pay_slip_earnings set establishment_no=$18, \
        pay=$1, da=$2, hra=$3, ir=$4, sa=$5, ma=$6, ra=$7, fta=$8, pp=$9, \
        cha=$11, pp_sfn=$12, stag_count=$13, stag_amt=$14, \
        pay_fixation_amt=$15 where kgid=$10 and year=$16 and month=$17";

        await pool.query(query, [pay, 0, 0, ir, sa, ma, ra, fta, pp, staff_kgid, cha, pp_sfn, stag_count, stag_amt, 
        pay_fixation_amt, year, month, establishment_no]);
        await updatePaySlipDeductions(req, res);
        res.render("update_pay_slip", {title: "Update Pay Slip", msg: "Pay Slip Updated", data: [{}, {}, {years: years}, {all_staff_kgid: all_staff_kgid}], kgid: admin_kgid, prev_curr_year:prevCurrYear, current_years: current_years[0], loan_recoveries_data: {}});
    } catch (err) {
        console.log(err);
        res.render("update_pay_slip", {title: "Update Pay Slip", msg: "Updation Unsuccessful!!!", data: [{}, {}, {years: years}, {all_staff_kgid: all_staff_kgid}], kgid: admin_kgid, prev_curr_year:prevCurrYear, current_years: current_years[0], loan_recoveries_data: {}});
    }
}



//Update Loan
const updateLoan = async (req, res) => {
    const admin_kgid = req.params.kgid;
    const prevCurrYear = req.params.prev_curr_year;
    const current_years = await getCurrPrevYear();
    var years = await getCurrentPreviousYear(prevCurrYear); 
    var all_staff_kgid = await getStaffKGIDS();
    var {
        staff_kgid,
        slip_kgid_loan,
        slip_kgid_total_ins,
        gpf_loan,
        gpf_total_ins,
        year,
        month
    } = req.body;
    var query = "update loan_recoveries set slip_kgid_loan=$1, gpf_loan=$2, slip_kgid_total_ins=$3, \
    gpf_total_ins=$4 where kgid=$5 and year=$6 and month=$7";
    try {
        await pool.query(query, [slip_kgid_loan, gpf_loan, slip_kgid_total_ins,
        gpf_total_ins, staff_kgid, year, month]);
        res.render("update_pay_slip", {title: "Update Pay Slip", msg: "Loan Amount Updated", data: [{}, {}, {years: years}, {all_staff_kgid: all_staff_kgid}], kgid: admin_kgid, prev_curr_year:prevCurrYear, current_years: current_years[0], loan_recoveries_data: {}});
    } catch (err) {
        console.log(err);
        res.send("Invalid KGID");
    }
}

//Update Loan Recoveries
const updateLoanRecoveries = async (req, res) => {
    const admin_kgid = req.params.kgid;
    const prevCurrYear = req.params.prev_curr_year;
    const current_years = await getCurrPrevYear();
    var years = await getCurrentPreviousYear(prevCurrYear); 
    var all_staff_kgid = await getStaffKGIDS();
    var {
        staff_kgid, bank_name_recoveries, local_recoveries, local_recoveries_ins, year, month
    } = req.body;

    try {
        var query = "update loan_recoveries set bank_name_recoveries=$1, local_recoveries=$2, \
        local_recoveries_ins=$6 where kgid=$3 and year=$4 and month=$5";
        await pool.query(query, [bank_name_recoveries, local_recoveries, staff_kgid, year, month, local_recoveries_ins]);
        res.render("update_pay_slip", {title: "Update Pay Slip", msg: "Loan Amount Updated", data: [{}, {}, {years: years}, {all_staff_kgid: all_staff_kgid}], kgid: admin_kgid, prev_curr_year:prevCurrYear, current_years: current_years[0], loan_recoveries_data: {}});
    } catch (err) {
        console.log(err);
        res.send("Invalid KGID");
    }

}

module.exports = {
    updatePaySlip: updatePaySlip,
    getPaySlipEarningsDeductions: getPaySlipEarningsDeductions,
    updatePaySlipEarnings: updatePaySlipEarnings,
    updatePaySlipDeductions: updatePaySlipDeductions,
    updateLoan: updateLoan,
    updateLoanRecoveries: updateLoanRecoveries
};