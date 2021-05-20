const pool = require("../db/db_con");

//Get Staff KGID's
const getStaffKgids = async () => {
    website_data = [];
    query = "select kgid from login_credentials";
    await pool.query(query).then((data) => {
        website_data.push(data.rows);
    });
    return website_data[0];
}

//Get Dummy Staff Tax Slip Values
const dummyTaxSlipValues = () => {
    const dummyData = [{kgid:"",
    standard_deduction:"",
    interest_nsc:"",
    interest_bank_deposit:"",
    other_charges:"",
    gross_rent:"",
    tax_paid_authorities:"",
    annual_value:"",
    interest_borrowed_capital:"",
    us_80e:"",
    us_80u:"",
    us_80ccd:"",
    pli:"",
    tution_fee:"",
    uti_ulpi:"",
    sukanya_samruddhi:"",
    housing_loan_repay:"",
    tax_rebate:"",
    surcharge:"",
    relief_sec89:"",
    hra_recieved:"",
    rent_paid:"",
    pay_40_percent:"",
    gis_private:"",
    kgid_slip_private:"",
    gpf_private:"",
    nps_private:"",
    housing_loan_private:""}];
    return dummyData;
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

//Get Tax Slip
const getUpdateTaxSlip = async (req, res) => {
    const prevCurrYear = req.params.prev_curr_year;
    const admin_kgid = req.params.kgid;
    const current_years = await getCurrPrevYear();
    if (prevCurrYear == "current_year") {
        try {
            var query = "select curr_year from current_years";
            //console.log(new Date().getFullYear());
            await pool.query(query).then(async (data) => {
                //console.log(data.rows[0].curr_year);
                //console.log(new Date().getFullYear());
                //console.log(data.rows[0].curr_year < new Date().getFullYear());
                if (data.rows[0].curr_year < new Date().getFullYear()) {
                    //Provide Data
                    website_data = [];
                    website_data.push(await getStaffKgids());
                    website_data.push({prev_curr_year: prevCurrYear});
                    website_data.push(dummyTaxSlipValues());
                    res.render("update_tax_slip", { title: "Update Tax Slip", msg: "", data: website_data, kgid: admin_kgid, current_years: current_years[0] });
                }
                else {
                    //Dont Provide Data
                    var msg = "Data Available on December month";
                    res.render("update_tax_slip", { title: "Update Tax Slip", msg: msg, data: [[], {}, dummyTaxSlipValues()], kgid: admin_kgid, current_years: current_years[0] });
                }
            });
        } catch (err) {
            //console.log("Some Error Occured 1");
            // //console.log(err);
            //Give Error Message
            var msg = "Some Error Occured!!!";
            res.render("update_tax_slip", { title: "Update Tax Slip", msg: msg, data: [[], {}, dummyTaxSlipValues()], kgid: admin_kgid, current_years: current_years[0] });
        }
    }
    else if (prevCurrYear == "previous_year") {
        try {
            var query = "select prev_year from current_years";
            //console.log(new Date().getFullYear());
            await pool.query(query).then(async (data) => {
                //console.log(data.rows[0].prev_year);
                //console.log(new Date().getFullYear());
                //console.log(data.rows[0].prev_year < new Date().getFullYear());
                if (data.rows[0].prev_year < new Date().getFullYear()) {
                    //Provide Data
                    website_data = [];
                    website_data.push(await getStaffKgids());
                    website_data.push({prev_curr_year: prevCurrYear});
                    website_data.push(dummyTaxSlipValues());
                    res.render("update_tax_slip", { title: "Update Tax Slip", msg: "", data: website_data, kgid: admin_kgid, current_years: current_years[0] });
                }
                else {
                    //Dont Provide Data
                    var msg = "Data Available on December month";
                    res.render("update_tax_slip", { title: "Update Tax Slip", msg: msg, data: [[], {}, dummyTaxSlipValues()], kgid: admin_kgid, current_years: current_years[0] });
                }
            });
        } catch (err) {
            //console.log("Some Error Occured 1");
            // //console.log(err);
            //Give Error Message
            var msg = "Some Error Occured!!!";
            res.render("update_tax_slip", { title: "Update Tax Slip", msg: msg, data: [[], {}, dummyTaxSlipValues()], kgid: admin_kgid, current_years: current_years[0] });
        }
    }
    else if(prevCurrYear == "previous_year_2"){
        try {
            var query = "select prev_year_2 from current_years";
            //console.log(new Date().getFullYear());
            await pool.query(query).then(async (data) => {
                //console.log(data.rows[0].prev_year);
                //console.log(new Date().getFullYear());
                //console.log(data.rows[0].prev_year < new Date().getFullYear());
                if (data.rows[0].prev_year_2 < new Date().getFullYear()) {
                    //Provide Data
                    website_data = [];
                    website_data.push(await getStaffKgids());
                    website_data.push({prev_curr_year: prevCurrYear});
                    website_data.push(dummyTaxSlipValues());
                    res.render("update_tax_slip", { title: "Update Tax Slip", msg: "", data: website_data, kgid: admin_kgid, current_years: current_years[0] });
                }
                else {
                    //Dont Provide Data
                    var msg = "Data Available on December month";
                    res.render("update_tax_slip", { title: "Update Tax Slip", msg: msg, data: [[], {}, dummyTaxSlipValues()], kgid: admin_kgid, current_years: current_years[0] });
                }
            });
        } catch (err) {
            //console.log("Some Error Occured 1");
            // //console.log(err);
            //Give Error Message
            var msg = "Some Error Occured!!!";
            res.render("update_tax_slip", { title: "Update Tax Slip", msg: msg, data: [[], {}, dummyTaxSlipValues()], kgid: admin_kgid, current_years: current_years[0] });
        }
    }
    else {
        var msg = "Invalid Year!!!";
        res.render("update_tax_slip", { title: "Update Tax Slip", msg: msg, data: [[], {}, dummyTaxSlipValues()], kgid: admin_kgid, current_years: current_years[0] });
    }

}

//Called inside Update Tax Slip Values
//Returns Staff Tax Slip Insert true/false
const getStaffTaxSlipValues = async (staff_kgid, year, month) => {
    try {
        var query = "insert into admin_tax_updates(kgid, year, month) values($1, $2, $3)";
        await pool.query(query, [staff_kgid, year, month]);
        query = "insert into other_savings(kgid, year) values($1, $2)";
        await pool.query(query, [staff_kgid, year]);
        query = "insert into tax_slip_encashment(kgid, year) values($1, $2)";
        await pool.query(query, [staff_kgid, year]);
    } catch (err) {
        // //console.log("Some Error Occured at getStaffTaxSlipValues()");
        //console.log(err);
    }
}

//Get Update Tax Slip Values
const getUpdateTaxSlipValues = async (req, res) => {
    const prevCurrYear = req.params.prev_curr_year;
    const admin_kgid = req.params.kgid;
    const current_years = await getCurrPrevYear();
    const {staff_kgid} = req.query;
    const month = "Feb";
    var query = "select kgid from login_credentials where kgid=$1";
    await pool.query(query, [staff_kgid]).then(async (data) => {
        if(data.rowCount == 0){
            res.send("Invalid KGID Staff Doesn't Exist!!!");
        }
        else{
            if (prevCurrYear == "current_year") {
                try {
                    var query = "select curr_year from current_years";
                    //console.log(new Date().getFullYear());
                    await pool.query(query).then(async (data) => {
                        if (data.rows[0].curr_year < new Date().getFullYear()) {
                            //Provide Data
                            website_data = [];
                            website_data.push(await getStaffKgids());
                            website_data.push({prev_curr_year: prevCurrYear});
                            console.log("Prev Year 2: " + data.rows[0].curr_year);
                            await getStaffTaxSlipValues(staff_kgid, data.rows[0].curr_year + 1, month);
                            // //console.log("Entered");
                            var query = "select * from admin_tax_updates atu, other_savings os, tax_slip_encashment tse\
                             where atu.kgid=os.kgid and atu.kgid=tse.kgid and tse.year=$2 and \
                             atu.kgid=$1 and atu.year=$2 and os.year=$2";
                            await pool.query(query, [staff_kgid, data.rows[0].curr_year + 1]).then((data) => {
                                // //console.log(data.rows);
                                website_data.push(data.rows);
                                //console.log(website_data);
                                res.render("update_tax_slip", { title: "Update Tax Slip", msg: "", data: website_data, kgid: admin_kgid, current_years: current_years[0] });
                            });
                        }
                        else {
                            //Dont Provide Data
                            var msg = "Data Available on December month";
                            res.render("update_tax_slip", { title: "Update Tax Slip", msg: msg, data: [[], {}, dummyTaxSlipValues()], kgid: admin_kgid, current_years: current_years[0] });
                        }
                    });
                } catch (err) {
                    //console.log("Some Error Occured 1");
                    //console.log(err);
                    //Give Error Message
                    var msg = "Some Error Occured!!!";
                    res.render("update_tax_slip", { title: "Update Tax Slip", msg: msg, data: [[], {}, dummyTaxSlipValues()], kgid: admin_kgid, current_years: current_years[0] });
                }
            }
            else if(prevCurrYear == "previous_year_2"){
                try {
                    var query = "select prev_year_2 from current_years";
                    //console.log(new Date().getFullYear());
                    await pool.query(query).then(async (data) => {
                        if (data.rows[0].prev_year_2 < new Date().getFullYear()) {
                            //Provide Data
                            website_data = [];
                            website_data.push(await getStaffKgids());
                            website_data.push({prev_curr_year: prevCurrYear});
                            console.log("Prev Year 2: " + data.rows[0].prev_year_2);
                            await getStaffTaxSlipValues(staff_kgid, data.rows[0].prev_year_2 + 1, month);
                            // //console.log("Entered");
                            var query = "select * from admin_tax_updates atu, other_savings os, tax_slip_encashment tse\
                             where atu.kgid=os.kgid and atu.kgid=tse.kgid and tse.year=$2 and \
                             atu.kgid=$1 and atu.year=$2 and os.year=$2";
                            await pool.query(query, [staff_kgid, data.rows[0].prev_year_2 + 1]).then((data) => {
                                // //console.log(data.rows);
                                website_data.push(data.rows);
                                //console.log(website_data);
                                res.render("update_tax_slip", { title: "Update Tax Slip", msg: "", data: website_data, kgid: admin_kgid, current_years: current_years[0] });
                            });
                        }
                        else {
                            //Dont Provide Data
                            var msg = "Data Available on December month";
                            res.render("update_tax_slip", { title: "Update Tax Slip", msg: msg, data: [[], {}, dummyTaxSlipValues()], kgid: admin_kgid, current_years: current_years[0] });
                        }
                    });
                } catch (err) {
                    //console.log("Some Error Occured 1");
                    //console.log(err);
                    //Give Error Message
                    var msg = "Some Error Occured!!!";
                    res.render("update_tax_slip", { title: "Update Tax Slip", msg: msg, data: [[], {}, dummyTaxSlipValues()], kgid: admin_kgid, current_years: current_years[0] });
                }
            }
            else if (prevCurrYear == "previous_year") {
                try {
                    var query = "select prev_year from current_years";
                    //console.log(new Date().getFullYear());
                    await pool.query(query).then(async (data) => {
                        if (data.rows[0].prev_year < new Date().getFullYear()) {
                            //Provide Data
                            website_data = [];
                            website_data.push(await getStaffKgids());
                            website_data.push({prev_curr_year: prevCurrYear});
                            await getStaffTaxSlipValues(staff_kgid, data.rows[0].prev_year + 1, month);
                            // //console.log("Entered");
                            var query = "select * from admin_tax_updates atu, other_savings os, tax_slip_encashment tse\
                             where atu.kgid=os.kgid and atu.kgid=tse.kgid and tse.year=$2 and \
                             atu.kgid=$1 and atu.year=$2 and os.year=$2";
                            await pool.query(query, [staff_kgid, data.rows[0].prev_year + 1]).then((data) => {
                                // //console.log(data.rows);
                                website_data.push(data.rows);
                                //console.log(website_data);
                                res.render("update_tax_slip", { title: "Update Tax Slip", msg: "", data: website_data, kgid: admin_kgid, current_years: current_years[0] });
                            });
                        }
                        else {
                            //Dont Provide Data
                            var msg = "Data Available on December month";
                            res.render("update_tax_slip", { title: "Update Tax Slip", msg: msg, data: [[], {}, dummyTaxSlipValues()], kgid: admin_kgid, current_years: current_years[0] });
                        }
                    });
                } catch (err) {
                    //console.log("Some Error Occured 1");
                    //console.log(err);
                    //Give Error Message
                    var msg = "Some Error Occured!!!";
                    res.render("update_tax_slip", { title: "Update Tax Slip", msg: msg, data: [[], {}, dummyTaxSlipValues()], kgid: admin_kgid, current_years: current_years[0] });
                }
            }
            else {
                var msg = "Invalid Year!!!";
                res.render("update_tax_slip", { title: "Update Tax Slip", msg: msg, data: [[], {}, dummyTaxSlipValues()], kgid: admin_kgid, current_years: current_years[0] });
            }
        }
    });
}

//Update Tax Slip
const updateTaxSlipValues = async (req, res) => {
    const prevCurrYear = req.params.prev_curr_year;
    const admin_kgid = req.params.kgid;
    const current_years = await getCurrPrevYear();
    const month = "Feb";
    const {
        staff_kgid,
        standard_deduction,
        interest_nsc,
        interest_bank_deposit,
        other_charges,
        gross_rent,
        tax_paid_authorities,
        annual_value,
        interest_borrowed_capital,
        us_80e,
        us_80u,
        us_80ccd,
        pli,
        tution_fee,
        uti_ulpi,
        sukanya_samruddhi,
        housing_loan_repay,
        tax_rebate,
        surcharge,
        relief_sec89,
        hra_recieved,
        rent_paid,
        pay_40_percent,
        gis_private,
        kgid_slip_private,
        gpf_private,
        nps_private,
        housing_loan_private,
        enable_disable,
        lic_other,
        pli_other,
        tution_fee_other,
        uti_ulpi_other,
        sukanya_other,
        pay_enc,
        ir_enc,
        sa_enc,
        ma_enc,
        ra_enc,
        fta_enc,
        pp_enc
    } = req.body;
    //console.log(tax_paid_authorities);
    //console.log("Enable/Disable: " + enable_disable);
    //console.log(typeof enable_disable);
    var ena_dis = 0;
    if(enable_disable == "on"){
        ena_dis = 1;
    }
    else{
        ena_dis = 0;
    }
    if (prevCurrYear == "current_year") {
        try {
            var query = "select curr_year from current_years";
            await pool.query(query).then(async (data) => {
                if (data.rows[0].curr_year < new Date().getFullYear()) {
                    //Update Data
                    //console.log("Year: ", data.rows[0].curr_year);
                    var query = "update admin_tax_updates set standard_deduction=$2,\
                        interest_nsc=$3,\
                        interest_bank_deposit=$4,\
                        other_charges=$5,\
                        gross_rent=$6,\
                        tax_paid_authorities=$7,\
                        annual_value=$8,\
                        interest_borrowed_capital=$9,\
                        us_80e=$10,\
                        us_80u=$11,\
                        us_80ccd=$12,\
                        pli=$13,\
                        tution_fee=$14,\
                        uti_ulpi=$15,\
                        sukanya_samruddhi=$16,\
                        housing_loan_repay=$17,\
                        tax_rebate=$18,\
                        surcharge=$19,\
                        relief_sec89=$20,\
                        hra_recieved=$21,\
                        rent_paid=$22,\
                        pay_40_percent=$23,\
                        gis_private=$24,\
                        kgid_slip_private=$25,\
                        gpf_private=$26,\
                        nps_private=$27,\
                        housing_loan_private=$28, enable_disable=$31 where kgid=$1 and year=$29 and month=$30";
                        await pool.query(query, [
                            staff_kgid,
                            standard_deduction,
                            interest_nsc,
                            interest_bank_deposit,
                            other_charges,
                            gross_rent,
                            tax_paid_authorities,
                            annual_value,
                            interest_borrowed_capital,
                            us_80e,
                            us_80u,
                            us_80ccd,
                            pli,
                            tution_fee,
                            uti_ulpi,
                            sukanya_samruddhi,
                            housing_loan_repay,
                            tax_rebate,
                            surcharge,
                            relief_sec89,
                            hra_recieved,
                            rent_paid,
                            pay_40_percent,
                            gis_private,
                            kgid_slip_private,
                            gpf_private,
                            nps_private,
                            housing_loan_private,
                            data.rows[0].curr_year + 1,
                            month,
                            ena_dis
                        ]);

                        query = "update other_savings set lic_other=$1, pli_other=$2, tution_fee_other=$3, \
                        uti_ulpi_other=$4, sukanya_other=$5 where kgid=$6 and year=$7";
                        await pool.query(query, [lic_other, pli_other, tution_fee_other,
                        uti_ulpi_other, sukanya_other, staff_kgid, data.rows[0].curr_year + 1]);
                        
                        query = "update tax_slip_encashment set pay_enc=$1, ir_enc=$2, sa_enc=$3, ma_enc=$4, \
                        ra_enc=$5, fta_enc=$6, pp_enc=$7 where kgid=$8 and year=$9";
                        await pool.query(query, [pay_enc, ir_enc, sa_enc, ma_enc, ra_enc, fta_enc, pp_enc,
                        staff_kgid, data.rows[0].curr_year + 1]);

                        //console.log("Data Updated");
                        website_data = [];
                        website_data.push(await getStaffKgids());
                        website_data.push({prev_curr_year: prevCurrYear});
                        website_data.push(dummyTaxSlipValues());
                        res.render("update_tax_slip", { title: "Update Tax Slip", msg: "Data Updated", data: website_data, kgid: admin_kgid, current_years: current_years[0] });
                }
                else {
                    //Dont Update Data
                    website_data = [];
                    website_data.push(await getStaffKgids());
                    website_data.push({prev_curr_year: prevCurrYear});
                    website_data.push(dummyTaxSlipValues());
                    res.render("update_tax_slip", { title: "Update Tax Slip", msg: "Data Not Updated", data: website_data, kgid: admin_kgid, current_years: current_years[0] });
                }
            });
        } catch (err) {
            //console.log("Some Error Occured 1");
            //console.log(err);
            //Give Error Message
            website_data = [];
            website_data.push(await getStaffKgids());
            website_data.push({prev_curr_year: prevCurrYear});
            website_data.push(dummyTaxSlipValues());
            res.render("update_tax_slip", { title: "Update Tax Slip", msg: "Some Error Occured", data: website_data, kgid: admin_kgid, current_years: current_years[0] });
        }
    }
    else if(prevCurrYear == "previous_year_2"){
        try {
            var query = "select prev_year_2 from current_years";
            await pool.query(query).then(async (data) => {
                if (data.rows[0].prev_year_2 < new Date().getFullYear()) {
                    //Update Data
                    console.log("Year: ", data.rows[0].prev_year_2);
                    var query = "update admin_tax_updates set standard_deduction=$2,\
                        interest_nsc=$3,\
                        interest_bank_deposit=$4,\
                        other_charges=$5,\
                        gross_rent=$6,\
                        tax_paid_authorities=$7,\
                        annual_value=$8,\
                        interest_borrowed_capital=$9,\
                        us_80e=$10,\
                        us_80u=$11,\
                        us_80ccd=$12,\
                        pli=$13,\
                        tution_fee=$14,\
                        uti_ulpi=$15,\
                        sukanya_samruddhi=$16,\
                        housing_loan_repay=$17,\
                        tax_rebate=$18,\
                        surcharge=$19,\
                        relief_sec89=$20,\
                        hra_recieved=$21,\
                        rent_paid=$22,\
                        pay_40_percent=$23,\
                        gis_private=$24,\
                        kgid_slip_private=$25,\
                        gpf_private=$26,\
                        nps_private=$27,\
                        housing_loan_private=$28, enable_disable=$31 where kgid=$1 and year=$29 and month=$30";
                        await pool.query(query, [
                            staff_kgid,
                            standard_deduction,
                            interest_nsc,
                            interest_bank_deposit,
                            other_charges,
                            gross_rent,
                            tax_paid_authorities,
                            annual_value,
                            interest_borrowed_capital,
                            us_80e,
                            us_80u,
                            us_80ccd,
                            pli,
                            tution_fee,
                            uti_ulpi,
                            sukanya_samruddhi,
                            housing_loan_repay,
                            tax_rebate,
                            surcharge,
                            relief_sec89,
                            hra_recieved,
                            rent_paid,
                            pay_40_percent,
                            gis_private,
                            kgid_slip_private,
                            gpf_private,
                            nps_private,
                            housing_loan_private,
                            data.rows[0].prev_year_2 + 1,
                            month,
                            ena_dis
                        ]);

                        query = "update other_savings set lic_other=$1, pli_other=$2, tution_fee_other=$3, \
                        uti_ulpi_other=$4, sukanya_other=$5 where kgid=$6 and year=$7";
                        await pool.query(query, [lic_other, pli_other, tution_fee_other,
                        uti_ulpi_other, sukanya_other, staff_kgid, data.rows[0].prev_year_2 + 1]);
                        
                        query = "update tax_slip_encashment set pay_enc=$1, ir_enc=$2, sa_enc=$3, ma_enc=$4, \
                        ra_enc=$5, fta_enc=$6, pp_enc=$7 where kgid=$8 and year=$9";
                        await pool.query(query, [pay_enc, ir_enc, sa_enc, ma_enc, ra_enc, fta_enc, pp_enc,
                        staff_kgid, data.rows[0].prev_year_2 + 1]);

                        //console.log("Data Updated");
                        website_data = [];
                        website_data.push(await getStaffKgids());
                        website_data.push({prev_curr_year: prevCurrYear});
                        website_data.push(dummyTaxSlipValues());
                        res.render("update_tax_slip", { title: "Update Tax Slip", msg: "Data Updated", data: website_data, kgid: admin_kgid, current_years: current_years[0] });
                }
                else {
                    //Dont Update Data
                    website_data = [];
                    website_data.push(await getStaffKgids());
                    website_data.push({prev_curr_year: prevCurrYear});
                    website_data.push(dummyTaxSlipValues());
                    res.render("update_tax_slip", { title: "Update Tax Slip", msg: "Data Not Updated", data: website_data, kgid: admin_kgid, current_years: current_years[0] });
                }
            });
        } catch (err) {
            //console.log("Some Error Occured 1");
            //console.log(err);
            //Give Error Message
            website_data = [];
            website_data.push(await getStaffKgids());
            website_data.push({prev_curr_year: prevCurrYear});
            website_data.push(dummyTaxSlipValues());
            res.render("update_tax_slip", { title: "Update Tax Slip", msg: "Some Error Occured", data: website_data, kgid: admin_kgid, current_years: current_years[0] });
        }
    }
    else if (prevCurrYear == "previous_year") {
        try {
            var query = "select prev_year from current_years";
            await pool.query(query).then(async (data) => {
                if (data.rows[0].prev_year < new Date().getFullYear()) {
                    //Update Data
                    console.log("Year: ", data.rows[0].prev_year);
                    var query = "update admin_tax_updates set standard_deduction=$2,\
                        interest_nsc=$3,\
                        interest_bank_deposit=$4,\
                        other_charges=$5,\
                        gross_rent=$6,\
                        tax_paid_authorities=$7,\
                        annual_value=$8,\
                        interest_borrowed_capital=$9,\
                        us_80e=$10,\
                        us_80u=$11,\
                        us_80ccd=$12,\
                        pli=$13,\
                        tution_fee=$14,\
                        uti_ulpi=$15,\
                        sukanya_samruddhi=$16,\
                        housing_loan_repay=$17,\
                        tax_rebate=$18,\
                        surcharge=$19,\
                        relief_sec89=$20,\
                        hra_recieved=$21,\
                        rent_paid=$22,\
                        pay_40_percent=$23,\
                        gis_private=$24,\
                        kgid_slip_private=$25,\
                        gpf_private=$26,\
                        nps_private=$27,\
                        housing_loan_private=$28, enable_disable=$31 where kgid=$1 and year=$29 and month=$30";
                        await pool.query(query, [
                            staff_kgid,
                            standard_deduction,
                            interest_nsc,
                            interest_bank_deposit,
                            other_charges,
                            gross_rent,
                            tax_paid_authorities,
                            annual_value,
                            interest_borrowed_capital,
                            us_80e,
                            us_80u,
                            us_80ccd,
                            pli,
                            tution_fee,
                            uti_ulpi,
                            sukanya_samruddhi,
                            housing_loan_repay,
                            tax_rebate,
                            surcharge,
                            relief_sec89,
                            hra_recieved,
                            rent_paid,
                            pay_40_percent,
                            gis_private,
                            kgid_slip_private,
                            gpf_private,
                            nps_private,
                            housing_loan_private,
                            data.rows[0].prev_year + 1,
                            month,
                            ena_dis
                        ]);

                        query = "update other_savings set lic_other=$1, pli_other=$2, tution_fee_other=$3, \
                        uti_ulpi_other=$4, sukanya_other=$5 where kgid=$6 and year=$7";
                        await pool.query(query, [lic_other, pli_other, tution_fee_other,
                        uti_ulpi_other, sukanya_other, staff_kgid, data.rows[0].prev_year + 1]);
                        
                        query = "update tax_slip_encashment set pay_enc=$1, ir_enc=$2, sa_enc=$3, ma_enc=$4, \
                        ra_enc=$5, fta_enc=$6, pp_enc=$7 where kgid=$8 and year=$9";
                        await pool.query(query, [pay_enc, ir_enc, sa_enc, ma_enc, ra_enc, fta_enc, pp_enc,
                        staff_kgid, data.rows[0].prev_year + 1]);

                        //console.log("Data Updated");
                        website_data = [];
                        website_data.push(await getStaffKgids());
                        website_data.push({prev_curr_year: prevCurrYear});
                        website_data.push(dummyTaxSlipValues());
                        res.render("update_tax_slip", { title: "Update Tax Slip", msg: "Data Updated", data: website_data, kgid: admin_kgid, current_years: current_years[0] });
                }
                else {
                    //Dont Update Data
                    website_data = [];
                    website_data.push(await getStaffKgids());
                    website_data.push({prev_curr_year: prevCurrYear});
                    website_data.push(dummyTaxSlipValues());
                    res.render("update_tax_slip", { title: "Update Tax Slip", msg: "Data Not Updated", data: website_data, kgid: admin_kgid, current_years: current_years[0] });
                }
            });
        } catch (err) {
            //console.log("Some Error Occured 1");
            //console.log(err);
            //Give Error Message
            website_data = [];
            website_data.push(await getStaffKgids());
            website_data.push({prev_curr_year: prevCurrYear});
            website_data.push(dummyTaxSlipValues());
            res.render("update_tax_slip", { title: "Update Tax Slip", msg: "Some Error Occured", data: website_data, kgid: admin_kgid, current_years: current_years[0] });
        }
    }
    else {
        website_data = [];
        website_data.push(await getStaffKgids());
        website_data.push({prev_curr_year: prevCurrYear});
        website_data.push(dummyTaxSlipValues());
        res.render("update_tax_slip", { title: "Update Tax Slip", msg: "Data Not Updated", data: website_data, kgid: admin_kgid, current_years: current_years[0] });
    }
}

module.exports = { getUpdateTaxSlip,
    updateTaxSlipValues,
    getUpdateTaxSlipValues
};