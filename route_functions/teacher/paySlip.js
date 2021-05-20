const pool = require("../../db/db_con");

//Get Curr Prev Years
const getCurrPrevYears = async () => {
    var query = "select * from current_years";
    var current_years = [];
    await pool.query(query).then((data) => {
        current_years.push(data.rows[0]);
    });
    return current_years;
}

//Get Pay Slip Page
const getPaySlip = async (req, res) => {
    const kgid = req.session.kgid;
    const current_years = await getCurrPrevYears();
    const prevCurrYear = req.params.prev_curr_year;
    const {
        year,
        month
    } = req.body;
    website_data = [];
    if(prevCurrYear == "previous_year"){
        try {
            var query = "select prev_year from current_years";
            await pool.query(query).then((data) => {
                website_data.push({
                    years: [data.rows[0].prev_year, data.rows[0].prev_year + 1]
                })
            });
            website_data.push({prev_curr_year: "previous_year"});
            website_data.push({});
            const loan = {
                                total_ins: 0,
                                ins: 0,
                                rem_amt: 0
                            }

            res.render("./teacher/pay_slip", {title: "Pay Slip", loan: loan, data: website_data, current_years: current_years[0]});
        } catch (err) {
            //console.log("Error occured at pay slip previous year");
            console.log(err);
            res.send("Some Error Occured!!!");
        }
    }
    else if(prevCurrYear == "previous_year_2"){
        try {
            var query = "select prev_year_2 from current_years";
            await pool.query(query).then((data) => {
                website_data.push({
                    years: [data.rows[0].prev_year_2, data.rows[0].prev_year_2 + 1]
                })
            });
            website_data.push({prev_curr_year: "previous_year_2"});
            website_data.push({});
            const loan = {
                                total_ins: 0,
                                ins: 0,
                                rem_amt: 0
                            }

            res.render("./teacher/pay_slip", {title: "Pay Slip", loan: loan, data: website_data, current_years: current_years[0]});
        } catch (err) {
            //console.log("Error occured at pay slip previous year");
            res.send("Some Error Occured!!!");
        }
    }
    else if(prevCurrYear == "current_year"){
        try {
            var query = "select curr_year from current_years";
            await pool.query(query).then((data) => {
                website_data.push({
                    years: [data.rows[0].curr_year, data.rows[0].curr_year + 1]
                })
            });
            website_data.push({prev_curr_year: "current_year"});
            website_data.push({});
            const loan = {
                                total_ins: 0,
                                ins: 0,
                                rem_amt: 0
                            }

            res.render("./teacher/pay_slip", {title: "Pay Slip", loan: loan, data: website_data, current_years: current_years[0]});
        } catch (err) {
            //console.log("Error occured at pay slip previous year");
            res.send("Some Error Occured!!!");
        }
    }
    else{
        res.send("Invalid pay slip year!!!");
    }
}

//Called within Pay Slip Values
//Returns Net Salary Payable in Words
const netSalaryWords = (num) => {
    var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
    var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
    if(num == 0){
		return "Zero Only"
	}
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;

} 

//Called within Pay Slip Values
//Calculate DA & HRA
const calculateDaHra = async (basic_pay) => {
    try {
        // var query = "select * from calculations";
        var hra = 0;
        var da = 0;
        //console.log(basic_pay);
        // await pool.query(query).then((data) => {
        //     hra = basic_pay * data.rows[0].hra_percent / 100;
        //     da = basic_pay * data.rows[0].da_percent / 100;
        // });
        hra = basic_pay * 8 / 100;
        da = basic_pay * 11.25 / 100;
        //console.log(hra, da);
        return {da:da, hra:hra};
    } catch (error) {
        return {da:0, hra:0};
    }
}


//Get Pay Slip Values
const getPaySlipValues = async (req, res) => {
    const {year, month} = req.query;
    const kgid = req.session.kgid;
    const current_years = await getCurrPrevYears();
    const prevCurrYear = req.params.prev_curr_year;

    /*const reqData = {
        month,
        year,
        department,
        kgid,
        pran_number,
        ag_code, ???
        staff_name,
        gender,
        dob,
        designation,
        ddo_code,
        days_worked,
        next_inc_date,
        joining_date,
        group,
        head_of_account,
        pan_number,
        el_bal,
        hpl_bal,
        pay_scale,
        basic,
        stag_count,
        stag_amt,
        pay_fixation_amt,
        da,
        hra,
        ma,
        fta,
        cha,
        pp_sfn,
        pt,
        egis,
        lic,
        gpf,
        slip_kgid,
        slip_kgid_recoveries,
        president,
        gross_salary,

    }*/

    if(prevCurrYear == "current_year"){
        var query = "select curr_year from current_years";
        try {
            await pool.query(query).then(async (data) => {
                if(data.rows[0].curr_year == year){
                    var all_months = {"Mar":2, "Apr":3, "May":4, "Jun":5, "Jul":6, "Aug":7, "Sep":8, "Oct":9, "Nov":10, "Dec":11};
                    var all_months_rev = {2:"Mar", 3:"Apr", 4:"May", 5:"Jun", 6:"Jul", 7:"Aug", 8:"Sep", 9:"Oct", 10:"Nov", 11:"Dec"};
                    
                    var months_in = ``;
                    var month_priority = all_months[`${month}`];
                    var month_cnt = 2;
                    while(month_cnt <= month_priority){
                        if(month_cnt <= month_priority - 1){
                            months_in += `'${all_months_rev[`${month_cnt}`]}',`;
                        }
                        else{
                            months_in += `'${all_months_rev[`${month_cnt}`]}'`;
                        }
                        month_cnt += 1;
                    }
                    var kgid_cnt = 0;
                    var kgid_total = 0;
                    var gpf_cnt = 0;
                    var gpf_total = 0;
                    var local_recoveries_cnt = 0;
                    var local_recoveries_total = 0;
                    console.log("MOnth sin : ", months_in);
                    query = `select count(slip_kgid_recoveries) cnt, sum(slip_kgid_recoveries) total\
                     from pay_slip_deductions where kgid=$1 and slip_kgid_recoveries>0 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        kgid_cnt = data.rows[0].cnt;
                        kgid_total = data.rows[0].total;
                    });

                    //=====

                    query = `select count(gpf_recoveries) gpf_cnt, sum(gpf_recoveries) gpf_total\
                     from pay_slip_deductions where kgid=$1 and gpf_recoveries>0 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        gpf_cnt = data.rows[0].gpf_cnt;
                        gpf_total = data.rows[0].gpf_total;
                    });

                    query = `select count(local_recoveries) local_recoveries_cnt, sum(local_recoveries) local_recoveries_total\
                     from pay_slip_deductions where kgid=$1 and local_recoveries>0 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        local_recoveries_cnt = data.rows[0].local_recoveries_cnt;
                        local_recoveries_total = data.rows[0].local_recoveries_total;
                    });

                    var sum_loan = 0;
                    var sum_ins = 0;
                    var sum_loan_gpf = 0;
                    var sum_ins_gpf = 0;
                    var sum_local_recoveries = 0;
                    var sum_ins_local_recoveries = 0;

                    query = `select sum(slip_kgid_loan) sum_loan, sum(slip_kgid_total_ins) sum_ins, sum(gpf_loan) sum_loan_gpf, sum(gpf_total_ins) sum_ins_gpf, \
                    sum(local_recoveries) sum_local_recoveries, sum(local_recoveries_ins) sum_ins_local_recoveries from loan_recoveries where kgid=$1 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        sum_loan = data.rows[0].sum_loan;
                        sum_ins = data.rows[0].sum_ins;
                        sum_loan_gpf = data.rows[0].sum_loan_gpf;
                        sum_ins_gpf = data.rows[0].sum_ins_gpf;
                        sum_local_recoveries = data.rows[0].sum_local_recoveries;
                        sum_ins_local_recoveries = data.rows[0].sum_ins_local_recoveries;
                    });


                    const loan = {
                        total_ins: sum_ins,
                        ins: kgid_cnt,
                        rem_amt: sum_loan - kgid_total,
                        total_ins_gpf: sum_ins_gpf,
                        ins_gpf: gpf_cnt,
                        rem_amt_gpf: sum_loan_gpf - gpf_total,
                        total_ins_local_recoveries: sum_ins_local_recoveries,
                        ins_local_recoveries: local_recoveries_cnt,
                        rem_amt_local_recoveries: sum_local_recoveries - local_recoveries_total
                    }

                    if(year < new Date().getFullYear()){
                        if(month in all_months){
                            //Provide Data
                            website_data = [];
                            website_data.push({
                                years: [data.rows[0].curr_year, data.rows[0].curr_year + 1]
                            });
                            website_data.push({prev_curr_year: "current_year"});
                                                        var query ="select * from pay_slip_earnings pse, pay_slip_deductions psd,\
                            staff s, staff_bank_details sbd, loan_recoveries lr where pse.kgid=lr.kgid and pse.kgid=s.kgid and pse.kgid=sbd.kgid and pse.kgid=psd.kgid \
                            and pse.month=psd.month and pse.year=psd.year \
                            and pse.kgid=$1 and pse.year=$2 and pse.month=$3";
                            await pool.query(query, [kgid, year, month]).then(async (data) => {
                                var {da, hra} = await calculateDaHra(data.rows[0].pay);
                                var grossSalary = (data.rows[0].pay) + Math.round(da) + Math.round(hra) + (data.rows[0].ma) + (data.rows[0].fta) + (data.rows[0].cha) + (data.rows[0].pp_sfn);
                                var deductionsSum = (data.rows[0].pt) + (data.rows[0].egis) + (data.rows[0].lic) + (data.rows[0].gpf) + (data.rows[0].it) + (data.rows[0].slip_kgid) + (data.rows[0].slip_kgid_recoveries) + (data.rows[0].gpf_recoveries);
                                var netSalary = grossSalary - deductionsSum;
                                var totalLocalRecoveries = (data.rows[0].local_recoveries);
                                var netSalaryPayable = netSalary - totalLocalRecoveries;
                                var netSalaryPayableWords = netSalaryWords(netSalaryPayable);
                                var dobMonth = "";
                                var nextIncMonth = "";
                                var joiningMonth = "";
                                if(parseInt(data.rows[0].dob.getMonth()) < 9){
                                    dobMonth = "0" + parseInt(data.rows[0].dob.getMonth());
                                }
                                else{
                                    dobMonth = parseInt(data.rows[0].dob.getMonth());
                                }
                                if(parseInt(data.rows[0].next_inc_date.getMonth()) < 9){
                                    nextIncMonth = "0" + parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                else{
                                    nextIncMonth = parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                if(parseInt(data.rows[0].joining_date.getMonth()) < 9){
                                    joiningMonth = "0" + parseInt(data.rows[0].joining_date.getMonth());

                                }
                                else{
                                    joiningMonth = parseInt(data.rows[0].joining_date.getMonth());
                                }
                                website_data.push({
                                    month: data.rows[0].month,
                                    year: data.rows[0].year,
                                    department: data.rows[0].department,
                                    kgid: data.rows[0].kgid,
                                    pran_number: data.rows[0].pran,
                                    ag_code: data.rows[0].ag_code,
                                    staff_name: data.rows[0].name,
                                    gender: data.rows[0].gender,
                                    dob: data.rows[0].dob.getDate() + "/" + dobMonth + "/" + data.rows[0].dob.getFullYear(),
                                    designation: data.rows[0].designation,
                                    ddo_code: data.rows[0].ddo_code,
                                    days_worked: Math.ceil((Math.abs(new Date() - new Date(data.rows[0].joining_date)))/ (1000 * 60 * 60 * 24)),
                                    next_inc_date: data.rows[0].next_inc_date.getDate() + "/" + nextIncMonth + "/" + data.rows[0].next_inc_date.getFullYear(),
                                    joining_date: data.rows[0].joining_date.getDate() + "/" + joiningMonth + "/" + data.rows[0].joining_date.getFullYear(),
                                    group: data.rows[0].staff_group,
                                    head_of_account: data.rows[0].head_of_account,
                                    pan_number: data.rows[0].pan_number,
                                    el_bal: Math.round(data.rows[0].el_bal),
                                    hpl_bal: Math.round(data.rows[0].hpl_bal),
                                    pay_scale: Math.round(data.rows[0].pay_scale_min) + "-" + Math.round(data.rows[0].pay_scale_max),
                                    basic: Math.round(data.rows[0].pay),
                                    stag_count: Math.round(data.rows[0].stag_count),
                                    stag_amt: Math.round(data.rows[0].stag_amt),
                                    pay_fixation_amt: Math.round(data.rows[0].pay_fixation_amt),
                                    da: Math.round(da),
                                    hra: Math.round(hra),
                                    ma: Math.round(data.rows[0].ma),
                                    fta: Math.round(data.rows[0].fta),
                                    cha: Math.round(data.rows[0].cha),
                                    pp_sfn: Math.round(data.rows[0].pp_sfn),
                                    pt: Math.round(data.rows[0].pt),
                                    egis: Math.round(data.rows[0].egis),
                                    lic: Math.round(data.rows[0].lic),
                                    lic_tax: Math.round(data.rows[0].lic_tax),
                                    gpf: Math.round(data.rows[0].gpf),
                                    it: Math.round(data.rows[0].it),
                                    gpf_recoveries: Math.round(data.rows[0].gpf_recoveries),
                                    slip_kgid: Math.round(data.rows[0].slip_kgid),
                                    slip_kgid_recoveries: Math.round(data.rows[0].slip_kgid_recoveries),
                                    local_recoveries: Math.round(data.rows[0].local_recoveries),
                                    gross_salary: Math.round(grossSalary),
                                    deduction_recoveries: Math.round(deductionsSum),
                                    net_salary: Math.round(netSalary),
                                    total_local_recoveries: Math.round(totalLocalRecoveries),
                                    net_payable_salary: Math.round(netSalaryPayable),
                                    payment_mode: data.rows[0].payment_mode,
                                    account_no: data.rows[0].account_no,
                                    bank_name: data.rows[0].bank_name,
                                    branch: data.rows[0].branch,
                                    salary_in_words: netSalaryPayableWords,
                                    recipient_id: data.rows[0].recipient_id,
                                    establishment_no: data.rows[0].establishment_no,
                                    bank_name_recoveries: data.rows[0].bank_name_recoveries,
                                });
                            });
                            // var sk_loan = 0;
                            // var sk_ins= 0;
                            // var sk_total_ins = 0;
                            // var query = "select slip_kgid_loan, slip_kgid_rem_ins, slip_kgid_total_ins from loan_recoveries where kgid=$1";
                            // await pool.query(query, [kgid]).then((data) => {
                            //     sk_loan = data.rows[0].slip_kgid_loan;
                            //     sk_ins = data.rows[0].slip_kgid_rem_ins;
                            //     sk_total_ins = data.rows[0].slip_kgid_total_ins;
                            // });
                            // var loan = {
                            //     sk_loan: sk_loan,
                            //     sk_ins: sk_ins,
                            //     sk_total_ins: sk_total_ins
                            // };

                            res.render("./teacher/pay_slip", {title: "Pay Slip", loan: loan, data: website_data, current_years: current_years[0]});
                        }
                        else{
                            res.send("Invalid Month Choice");
                        }
                    }
                    else if(year == new Date().getFullYear() && all_months[`${month}`] <= new Date().getMonth()){
                        if(month in all_months){
                            //Provide Data
                            website_data = [];
                            website_data.push({
                                years: [data.rows[0].curr_year, data.rows[0].curr_year + 1]
                            });
                            website_data.push({prev_curr_year: "current_year"});
                                                        var query ="select * from pay_slip_earnings pse, pay_slip_deductions psd,\
                            staff_bank_details sbd, staff s, loan_recoveries lr where pse.kgid=lr.kgid and pse.kgid=s.kgid and pse.kgid=sbd.kgid and pse.kgid=psd.kgid \
                            and pse.month=psd.month and pse.year=psd.year \
                            and pse.kgid=$1 and pse.year=$2 and pse.month=$3";
                            await pool.query(query, [kgid, year, month]).then(async (data) => {
                                var {da, hra} = await calculateDaHra(data.rows[0].pay);
                                var grossSalary = (data.rows[0].pay) + Math.round(da) + Math.round(hra) + (data.rows[0].ma) + (data.rows[0].fta) + (data.rows[0].cha) + (data.rows[0].pp_sfn);
                                var deductionsSum = (data.rows[0].pt) + (data.rows[0].egis) + (data.rows[0].lic) + (data.rows[0].gpf) + (data.rows[0].it) + (data.rows[0].slip_kgid) + (data.rows[0].slip_kgid_recoveries) + (data.rows[0].gpf_recoveries);
                                var netSalary = grossSalary - deductionsSum;
                                var totalLocalRecoveries = (data.rows[0].local_recoveries);
                                var netSalaryPayable = netSalary - totalLocalRecoveries;
                                var netSalaryPayableWords = netSalaryWords(netSalaryPayable);
                                var dobMonth = "";
                                var nextIncMonth = "";
                                var joiningMonth = "";
                                if(parseInt(data.rows[0].dob.getMonth()) < 9){
                                    dobMonth = "0" + parseInt(data.rows[0].dob.getMonth());
                                }
                                else{
                                    dobMonth = parseInt(data.rows[0].dob.getMonth());
                                }
                                if(parseInt(data.rows[0].next_inc_date.getMonth()) < 9){
                                    nextIncMonth = "0" + parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                else{
                                    nextIncMonth = parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                if(parseInt(data.rows[0].joining_date.getMonth()) < 9){
                                    joiningMonth = "0" + parseInt(data.rows[0].joining_date.getMonth());

                                }
                                else{
                                    joiningMonth = parseInt(data.rows[0].joining_date.getMonth());
                                }
                                website_data.push({
                                    month: data.rows[0].month,
                                    year: data.rows[0].year,
                                    department: data.rows[0].department,
                                    kgid: data.rows[0].kgid,
                                    pran_number: data.rows[0].pran,
                                    ag_code: data.rows[0].ag_code,
                                    staff_name: data.rows[0].name,
                                    gender: data.rows[0].gender,
                                    dob: data.rows[0].dob.getDate() + "/" + dobMonth + "/" + data.rows[0].dob.getFullYear(),
                                    designation: data.rows[0].designation,
                                    ddo_code: data.rows[0].ddo_code,
                                    days_worked: Math.ceil((Math.abs(new Date() - new Date(data.rows[0].joining_date)))/ (1000 * 60 * 60 * 24)),
                                    next_inc_date: data.rows[0].next_inc_date.getDate() + "/" + nextIncMonth + "/" + data.rows[0].next_inc_date.getFullYear(),
                                    joining_date: data.rows[0].joining_date.getDate() + "/" + joiningMonth + "/" + data.rows[0].joining_date.getFullYear(),
                                    group: data.rows[0].staff_group,
                                    head_of_account: data.rows[0].head_of_account,
                                    pan_number: data.rows[0].pan_number,
                                    el_bal: Math.round(data.rows[0].el_bal),
                                    hpl_bal: Math.round(data.rows[0].hpl_bal),
                                    pay_scale: Math.round(data.rows[0].pay_scale_min) + "-" + Math.round(data.rows[0].pay_scale_max),
                                    basic: Math.round(data.rows[0].pay),
                                    stag_count: Math.round(data.rows[0].stag_count),
                                    stag_amt: Math.round(data.rows[0].stag_amt),
                                    pay_fixation_amt: Math.round(data.rows[0].pay_fixation_amt),
                                    da: Math.round(da),
                                    hra: Math.round(hra),
                                    ma: Math.round(data.rows[0].ma),
                                    fta: Math.round(data.rows[0].fta),
                                    cha: Math.round(data.rows[0].cha),
                                    pp_sfn: Math.round(data.rows[0].pp_sfn),
                                    pt: Math.round(data.rows[0].pt),
                                    egis: Math.round(data.rows[0].egis),
                                    lic: Math.round(data.rows[0].lic),
                                    lic_tax: Math.round(data.rows[0].lic_tax),
                                    gpf: Math.round(data.rows[0].gpf),
                                    it: Math.round(data.rows[0].it),
                                    gpf_recoveries: Math.round(data.rows[0].gpf_recoveries),
                                    slip_kgid: Math.round(data.rows[0].slip_kgid),
                                    slip_kgid_recoveries: Math.round(data.rows[0].slip_kgid_recoveries),
                                    local_recoveries: Math.round(data.rows[0].local_recoveries),
                                    gross_salary: Math.round(grossSalary),
                                    deduction_recoveries: Math.round(deductionsSum),
                                    net_salary: Math.round(netSalary),
                                    total_local_recoveries: Math.round(totalLocalRecoveries),
                                    net_payable_salary: Math.round(netSalaryPayable),
                                    payment_mode: data.rows[0].payment_mode,
                                    account_no: data.rows[0].account_no,
                                    bank_name: data.rows[0].bank_name,
                                    branch: data.rows[0].branch,
                                    salary_in_words: netSalaryPayableWords,
                                    recipient_id: data.rows[0].recipient_id,
                                    establishment_no: data.rows[0].establishment_no,
                                    bank_name_recoveries: data.rows[0].bank_name_recoveries,
                                });
                            });

                            res.render("./teacher/pay_slip", {title: "Pay Slip", loan: loan, data: website_data, current_years: current_years[0]});
                        }
                        else{
                            res.send("Invalid Month Choice");
                        }
                    }
                    else{
                        res.send("Data not available");
                    }
                }
                else if(data.rows[0].curr_year + 1 == year){
                    var all_months = {"Jan":0, "Feb":1};
                    var all_months_rev = {0: "Jan", 1: "Feb"};
                    var months_in = ``;
                    var month_priority = all_months[`${month}`];
                    var month_cnt = 0;
                    while(month_cnt <= month_priority){
                        if(month_cnt <= month_priority - 1){
                            months_in += `'${all_months_rev[`${month_cnt}`]}',`;
                        }
                        else{
                            months_in += `'${all_months_rev[`${month_cnt}`]}'`;
                        }
                        month_cnt += 1;
                    }
                    var kgid_cnt = 0;
                    var kgid_total = 0;
                    var gpf_cnt = 0;
                    var gpf_total = 0;
                    var local_recoveries_cnt = 0;
                    var local_recoveries_total = 0;
                    console.log("MOnth sin : ", months_in);
                    query = `select count(slip_kgid_recoveries) cnt, sum(slip_kgid_recoveries) total\
                     from pay_slip_deductions where kgid=$1 and slip_kgid_recoveries>0 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        kgid_cnt = data.rows[0].cnt;
                        kgid_total = data.rows[0].total;
                    });

                    //====

                    query = `select count(gpf_recoveries) gpf_cnt, sum(gpf_recoveries) gpf_total\
                     from pay_slip_deductions where kgid=$1 and gpf_recoveries>0 and year=$2 and month in(${months_in})`;
                     await pool.query(query, [kgid, year]).then((data) => {
                        gpf_cnt = data.rows[0].gpf_cnt;
                        gpf_total = data.rows[0].gpf_total;
                    });

                    query = `select count(local_recoveries) local_recoveries_cnt, sum(local_recoveries) local_recoveries_total\
                     from pay_slip_deductions where kgid=$1 and local_recoveries>0 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        local_recoveries_cnt = data.rows[0].local_recoveries_cnt;
                        local_recoveries_total = data.rows[0].local_recoveries_total;
                    });

                    query = `select count(slip_kgid_recoveries) cnt, sum(slip_kgid_recoveries) total\
                     from pay_slip_deductions where kgid=$1 and slip_kgid_recoveries>0 and year=$2`;
                    await pool.query(query, [kgid, year - 1]).then((data) => {
                        kgid_cnt += parseInt(data.rows[0].cnt);
                        kgid_total += parseInt(data.rows[0].total);
                    });

                    //====

                    query = `select count(gpf_recoveries) gpf_cnt, sum(gpf_recoveries) gpf_total\
                     from pay_slip_deductions where kgid=$1 and gpf_recoveries>0 and year=$2`;
                    await pool.query(query, [kgid, year - 1]).then((data) => {
                        gpf_cnt += parseInt(data.rows[0].gpf_cnt);
                        gpf_total += parseInt(data.rows[0].gpf_total);
                    });

                    query = `select count(local_recoveries) local_recoveries_cnt, sum(local_recoveries) local_recoveries_total\
                     from pay_slip_deductions where kgid=$1 and local_recoveries>0 and year=$2`;
                    await pool.query(query, [kgid, year - 1]).then((data) => {
                        local_recoveries_cnt += parseInt(data.rows[0].local_recoveries_cnt);
                        local_recoveries_total += parseInt(data.rows[0].local_recoveries_total);
                    });

                    var sum_loan = 0;
                    var sum_ins = 0;
                    var sum_loan_gpf = 0;
                    var sum_ins_gpf = 0;
                    var sum_local_recoveries = 0;
                    var sum_ins_local_recoveries = 0;

                    query = `select sum(slip_kgid_loan) sum_loan, sum(slip_kgid_total_ins) sum_ins, sum(gpf_loan) sum_loan_gpf, sum(gpf_total_ins) sum_ins_gpf, \
                    sum(local_recoveries) sum_local_recoveries, sum(local_recoveries_ins) sum_ins_local_recoveries from loan_recoveries where kgid=$1 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        sum_loan = data.rows[0].sum_loan;
                        sum_ins = data.rows[0].sum_ins;
                        sum_loan_gpf = data.rows[0].sum_loan_gpf;
                        sum_ins_gpf = data.rows[0].sum_ins_gpf;
                        sum_local_recoveries = data.rows[0].sum_local_recoveries;
                        sum_ins_local_recoveries = data.rows[0].sum_ins_local_recoveries;
                    });

                    query = `select sum(slip_kgid_loan) sum_loan, sum(slip_kgid_total_ins) sum_ins, sum(gpf_loan) sum_loan_gpf, sum(gpf_total_ins) sum_ins_gpf, \
                    sum(local_recoveries) sum_local_recoveries, sum(local_recoveries_ins) sum_ins_local_recoveries from loan_recoveries where kgid=$1 and year=$2`;
                    await pool.query(query, [kgid, year - 1]).then((data) => {
                        sum_loan += parseInt(data.rows[0].sum_loan);
                        sum_ins += parseInt(data.rows[0].sum_ins);
                        sum_loan_gpf += parseInt(data.rows[0].sum_loan_gpf);
                        sum_ins_gpf += parseInt(data.rows[0].sum_ins_gpf);
                        sum_local_recoveries += parseInt(data.rows[0].sum_local_recoveries);
                        sum_ins_local_recoveries += parseInt(data.rows[0].sum_ins_local_recoveries);
                    });

                    const loan = {
                        total_ins: sum_ins,
                        ins: kgid_cnt,
                        rem_amt: sum_loan - kgid_total,
                        total_ins_gpf: sum_ins_gpf,
                        ins_gpf: gpf_cnt,
                        rem_amt_gpf: sum_loan_gpf - gpf_total,
                        total_ins_local_recoveries: sum_ins_local_recoveries,
                        ins_local_recoveries: local_recoveries_cnt,
                        rem_amt_local_recoveries: sum_local_recoveries - local_recoveries_total
                    }

                    if(year < new Date().getFullYear()){
                        if(month in all_months){
                            //Provide Data
                            website_data = [];
                            website_data.push({
                                years: [data.rows[0].curr_year, data.rows[0].curr_year + 1]
                            });
                            website_data.push({prev_curr_year: "current_year"});
                                                        var query ="select * from pay_slip_earnings pse, pay_slip_deductions psd,\
                            staff_bank_details sbd, staff s, loan_recoveries lr where pse.kgid=lr.kgid and pse.kgid=s.kgid and pse.kgid=sbd.kgid and pse.kgid=psd.kgid \
                            and pse.month=psd.month and pse.year=psd.year \
                            and pse.kgid=$1 and pse.year=$2 and pse.month=$3";
                            await pool.query(query, [kgid, year, month]).then(async (data) => {
                                var {da, hra} = await calculateDaHra(data.rows[0].pay);
                                var grossSalary = (data.rows[0].pay) + Math.round(da) + Math.round(hra) + (data.rows[0].ma) + (data.rows[0].fta) + (data.rows[0].cha) + (data.rows[0].pp_sfn);
                                var deductionsSum = (data.rows[0].pt) + (data.rows[0].egis) + (data.rows[0].lic) + (data.rows[0].gpf) + (data.rows[0].it) + (data.rows[0].slip_kgid) + (data.rows[0].slip_kgid_recoveries) + (data.rows[0].gpf_recoveries);
                                var netSalary = grossSalary - deductionsSum;
                                var totalLocalRecoveries = (data.rows[0].local_recoveries);
                                var netSalaryPayable = netSalary - totalLocalRecoveries;
                                var netSalaryPayableWords = netSalaryWords(netSalaryPayable);
                                var dobMonth = "";
                                var nextIncMonth = "";
                                var joiningMonth = "";
                                if(parseInt(data.rows[0].dob.getMonth()) < 9){
                                    dobMonth = "0" + parseInt(data.rows[0].dob.getMonth());
                                }
                                else{
                                    dobMonth = parseInt(data.rows[0].dob.getMonth());
                                }
                                if(parseInt(data.rows[0].next_inc_date.getMonth()) < 9){
                                    nextIncMonth = "0" + parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                else{
                                    nextIncMonth = parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                if(parseInt(data.rows[0].joining_date.getMonth()) < 9){
                                    joiningMonth = "0" + parseInt(data.rows[0].joining_date.getMonth());

                                }
                                else{
                                    joiningMonth = parseInt(data.rows[0].joining_date.getMonth());
                                }
                                website_data.push({
                                    month: data.rows[0].month,
                                    year: data.rows[0].year,
                                    department: data.rows[0].department,
                                    kgid: data.rows[0].kgid,
                                    pran_number: data.rows[0].pran,
                                    ag_code: data.rows[0].ag_code,
                                    staff_name: data.rows[0].name,
                                    gender: data.rows[0].gender,
                                    dob: data.rows[0].dob.getDate() + "/" + dobMonth + "/" + data.rows[0].dob.getFullYear(),
                                    designation: data.rows[0].designation,
                                    ddo_code: data.rows[0].ddo_code,
                                    days_worked: Math.ceil((Math.abs(new Date() - new Date(data.rows[0].joining_date)))/ (1000 * 60 * 60 * 24)),
                                    next_inc_date: data.rows[0].next_inc_date.getDate() + "/" + nextIncMonth + "/" + data.rows[0].next_inc_date.getFullYear(),
                                    joining_date: data.rows[0].joining_date.getDate() + "/" + joiningMonth + "/" + data.rows[0].joining_date.getFullYear(),
                                    group: data.rows[0].staff_group,
                                    head_of_account: data.rows[0].head_of_account,
                                    pan_number: data.rows[0].pan_number,
                                    el_bal: Math.round(data.rows[0].el_bal),
                                    hpl_bal: Math.round(data.rows[0].hpl_bal),
                                    pay_scale: Math.round(data.rows[0].pay_scale_min) + "-" + Math.round(data.rows[0].pay_scale_max),
                                    basic: Math.round(data.rows[0].pay),
                                    stag_count: Math.round(data.rows[0].stag_count),
                                    stag_amt: Math.round(data.rows[0].stag_amt),
                                    pay_fixation_amt: Math.round(data.rows[0].pay_fixation_amt),
                                    da: Math.round(da),
                                    hra: Math.round(hra),
                                    ma: Math.round(data.rows[0].ma),
                                    fta: Math.round(data.rows[0].fta),
                                    cha: Math.round(data.rows[0].cha),
                                    pp_sfn: Math.round(data.rows[0].pp_sfn),
                                    pt: Math.round(data.rows[0].pt),
                                    egis: Math.round(data.rows[0].egis),
                                    lic: Math.round(data.rows[0].lic),
                                    lic_tax: Math.round(data.rows[0].lic_tax),
                                    gpf: Math.round(data.rows[0].gpf),
                                    it: Math.round(data.rows[0].it),
                                    gpf_recoveries: Math.round(data.rows[0].gpf_recoveries),
                                    slip_kgid: Math.round(data.rows[0].slip_kgid),
                                    slip_kgid_recoveries: Math.round(data.rows[0].slip_kgid_recoveries),
                                    local_recoveries: Math.round(data.rows[0].local_recoveries),
                                    gross_salary: Math.round(grossSalary),
                                    deduction_recoveries: Math.round(deductionsSum),
                                    net_salary: Math.round(netSalary),
                                    total_local_recoveries: Math.round(totalLocalRecoveries),
                                    net_payable_salary: Math.round(netSalaryPayable),
                                    payment_mode: data.rows[0].payment_mode,
                                    account_no: data.rows[0].account_no,
                                    bank_name: data.rows[0].bank_name,
                                    branch: data.rows[0].branch,
                                    salary_in_words: netSalaryPayableWords,
                                    recipient_id: data.rows[0].recipient_id,
                                    establishment_no: data.rows[0].establishment_no,
                                    bank_name_recoveries: data.rows[0].bank_name_recoveries,
                                });
                            });

                            res.render("./teacher/pay_slip", {title: "Pay Slip", loan: loan, data: website_data, current_years: current_years[0]});
                        }
                        else{
                            res.send("Invalid Month Choice");
                        }
                    }
                    else if(year == new Date().getFullYear() && all_months[`${month}`] <= new Date().getMonth()){
                        if(month in all_months){
                            //Provide Data
                            website_data = [];
                            website_data.push({
                                years: [data.rows[0].curr_year, data.rows[0].curr_year + 1]
                            });
                            website_data.push({prev_curr_year: "current_year"});
                                                        var query ="select * from pay_slip_earnings pse, pay_slip_deductions psd,\
                            staff_bank_details sbd, staff s, loan_recoveries lr where pse.kgid=lr.kgid and pse.kgid=s.kgid and pse.kgid=sbd.kgid and pse.kgid=psd.kgid \
                            and pse.month=psd.month and pse.year=psd.year \
                            and pse.kgid=$1 and pse.year=$2 and pse.month=$3";
                            await pool.query(query, [kgid, year, month]).then(async (data) => {
                                var {da, hra} = await calculateDaHra(data.rows[0].pay);
                                var grossSalary = (data.rows[0].pay) + Math.round(da) + Math.round(hra) + (data.rows[0].ma) + (data.rows[0].fta) + (data.rows[0].cha) + (data.rows[0].pp_sfn);
                                var deductionsSum = (data.rows[0].pt) + (data.rows[0].egis) + (data.rows[0].lic) + (data.rows[0].gpf) + (data.rows[0].it) + (data.rows[0].slip_kgid) + (data.rows[0].slip_kgid_recoveries) + (data.rows[0].gpf_recoveries);
                                var netSalary = grossSalary - deductionsSum;
                                var totalLocalRecoveries = (data.rows[0].local_recoveries);
                                var netSalaryPayable = netSalary - totalLocalRecoveries;
                                var netSalaryPayableWords = netSalaryWords(netSalaryPayable);
                                try {
                                    var dob = "";
                                    dob = data.rows[0].dob.getDate() + "/" + data.rows[0].dob.getMonth() + "/" + data.rows[0].dob.getFullYear();
                                } catch (err) {
                                    
                                }
                                try {
                                    var next_inc_date = "";
                                    next_inc_date = data.rows[0].next_inc_date.getDate() + "/" + data.rows[0].next_inc_date.getMonth() + "/" + data.rows[0].next_inc_date.getFullYear();
                                } catch (err) {
                                    
                                }
                                try {
                                    var joining_date = "";
                                    joining_date = data.rows[0].joining_date.getDate() + "/" + data.rows[0].joining_date.getMonth() + "/" + data.rows[0].joining_date.getFullYear();
                                } catch (err) {
                                    
                                }
                                try {
                                    var days_worked = "";
                                    days_worked = Math.ceil((Math.abs(new Date() - new Date(data.rows[0].joining_date)))/ (1000 * 60 * 60 * 24));
                                } catch (error) {
                                    
                                }
                                var dobMonth = "";
                                var nextIncMonth = "";
                                var joiningMonth = "";
                                if(parseInt(data.rows[0].dob.getMonth()) < 9){
                                    dobMonth = "0" + parseInt(data.rows[0].dob.getMonth());
                                }
                                else{
                                    dobMonth = parseInt(data.rows[0].dob.getMonth());
                                }
                                if(parseInt(data.rows[0].next_inc_date.getMonth()) < 9){
                                    nextIncMonth = "0" + parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                else{
                                    nextIncMonth = parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                if(parseInt(data.rows[0].joining_date.getMonth()) < 9){
                                    joiningMonth = "0" + parseInt(data.rows[0].joining_date.getMonth());

                                }
                                else{
                                    joiningMonth = parseInt(data.rows[0].joining_date.getMonth());
                                }
                                website_data.push({
                                    month: data.rows[0].month,
                                    year: data.rows[0].year,
                                    department: data.rows[0].department,
                                    kgid: data.rows[0].kgid,
                                    pran_number: data.rows[0].pran,
                                    ag_code: data.rows[0].ag_code,
                                    staff_name: data.rows[0].name,
                                    gender: data.rows[0].gender,
                                    dob: dob,
                                    designation: data.rows[0].designation,
                                    ddo_code: data.rows[0].ddo_code,
                                    days_worked: days_worked,
                                    next_inc_date: next_inc_date,
                                    joining_date: joining_date,
                                    group: data.rows[0].staff_group,
                                    head_of_account: data.rows[0].head_of_account,
                                    pan_number: data.rows[0].pan_number,
                                    el_bal: Math.round(data.rows[0].el_bal),
                                    hpl_bal: Math.round(data.rows[0].hpl_bal),
                                    pay_scale: Math.round(data.rows[0].pay_scale_min) + "-" + Math.round(data.rows[0].pay_scale_max),
                                    basic: Math.round(data.rows[0].pay),
                                    stag_count: Math.round(data.rows[0].stag_count),
                                    stag_amt: Math.round(data.rows[0].stag_amt),
                                    pay_fixation_amt: Math.round(data.rows[0].pay_fixation_amt),
                                    da: Math.round(da),
                                    hra: Math.round(hra),
                                    ma: Math.round(data.rows[0].ma),
                                    fta: Math.round(data.rows[0].fta),
                                    cha: Math.round(data.rows[0].cha),
                                    pp_sfn: Math.round(data.rows[0].pp_sfn),
                                    pt: Math.round(data.rows[0].pt),
                                    egis: Math.round(data.rows[0].egis),
                                    lic: Math.round(data.rows[0].lic),
                                    lic_tax: Math.round(data.rows[0].lic_tax),
                                    gpf: Math.round(data.rows[0].gpf),
                                    it: Math.round(data.rows[0].it),
                                    gpf_recoveries: Math.round(data.rows[0].gpf_recoveries),
                                    slip_kgid: Math.round(data.rows[0].slip_kgid),
                                    slip_kgid_recoveries: Math.round(data.rows[0].slip_kgid_recoveries),
                                    local_recoveries: Math.round(data.rows[0].local_recoveries),
                                    gross_salary: Math.round(grossSalary),
                                    deduction_recoveries: Math.round(deductionsSum),
                                    net_salary: Math.round(netSalary),
                                    total_local_recoveries: Math.round(totalLocalRecoveries),
                                    net_payable_salary: Math.round(netSalaryPayable),
                                    payment_mode: data.rows[0].payment_mode,
                                    account_no: data.rows[0].account_no,
                                    bank_name: data.rows[0].bank_name,
                                    branch: data.rows[0].branch,
                                    salary_in_words: netSalaryPayableWords,
                                    recipient_id: data.rows[0].recipient_id,
                                    establishment_no: data.rows[0].establishment_no,
                                    bank_name_recoveries: data.rows[0].bank_name_recoveries,
                                });
                            });

                            res.render("./teacher/pay_slip", {title: "Pay Slip", loan: loan, data: website_data, current_years: current_years[0]});
                        }
                        else{
                            res.send("Invalid Month Choice");
                        }
                    }
                    else{
                        res.send("Data not available");
                    }
                }
                else{
                    res.send("invalid Year");
                }
            });
        } catch (err) {
            console.log(err);
            res.send("Data not available");
        }
    }
    else if(prevCurrYear == "previous_year_2"){
        var query = "select prev_year_2 from current_years";
        try {
            await pool.query(query).then(async (data) => {
                if(data.rows[0].prev_year_2 == year){
                    var all_months = {"Mar":2, "Apr":3, "May":4, "Jun":5, "Jul":6, "Aug":7, "Sep":8, "Oct":9, "Nov":10, "Dec":11};
                    var all_months_rev = {2:"Mar", 3:"Apr", 4:"May", 5:"Jun", 6:"Jul", 7:"Aug", 8:"Sep", 9:"Oct", 10:"Nov", 11:"Dec"};
                    
                    //year: 2019
                    var months_in = ``;
                    var month_priority = all_months[`${month}`];
                    var month_cnt = 2;
                    while(month_cnt <= month_priority){
                        if(month_cnt <= month_priority - 1){
                            months_in += `'${all_months_rev[`${month_cnt}`]}',`;
                        }
                        else{
                            months_in += `'${all_months_rev[`${month_cnt}`]}'`;
                        }
                        month_cnt += 1;
                    }
                    var kgid_cnt = 0;
                    var kgid_total = 0;
                    var gpf_cnt = 0;
                    var gpf_total = 0;
                    var local_recoveries_cnt = 0;
                    var local_recoveries_total = 0;
                    console.log("MOnth sin : ", months_in);
                    query = `select count(slip_kgid_recoveries) cnt, sum(slip_kgid_recoveries) total\
                     from pay_slip_deductions where kgid=$1 and slip_kgid_recoveries>0 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        kgid_cnt = data.rows[0].cnt;
                        kgid_total = data.rows[0].total;
                    });

                    //=====

                    query = `select count(gpf_recoveries) gpf_cnt, sum(gpf_recoveries) gpf_total\
                     from pay_slip_deductions where kgid=$1 and gpf_recoveries>0 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        gpf_cnt = data.rows[0].gpf_cnt;
                        gpf_total = data.rows[0].gpf_total;
                    });

                    query = `select count(local_recoveries) local_recoveries_cnt, sum(local_recoveries) local_recoveries_total\
                     from pay_slip_deductions where kgid=$1 and local_recoveries>0 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        local_recoveries_cnt = data.rows[0].local_recoveries_cnt;
                        local_recoveries_total = data.rows[0].local_recoveries_total;
                    });

                    var sum_loan = 0;
                    var sum_ins = 0;
                    var sum_loan_gpf = 0;
                    var sum_ins_gpf = 0;
                    var sum_local_recoveries = 0;
                    var sum_ins_local_recoveries = 0;

                    query = `select sum(slip_kgid_loan) sum_loan, sum(slip_kgid_total_ins) sum_ins, sum(gpf_loan) sum_loan_gpf, sum(gpf_total_ins) sum_ins_gpf, \
                    sum(local_recoveries) sum_local_recoveries, sum(local_recoveries_ins) sum_ins_local_recoveries from loan_recoveries where kgid=$1 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        sum_loan = data.rows[0].sum_loan;
                        sum_ins = data.rows[0].sum_ins;
                        sum_loan_gpf = data.rows[0].sum_loan_gpf;
                        sum_ins_gpf = data.rows[0].sum_ins_gpf;
                        sum_local_recoveries = data.rows[0].sum_local_recoveries;
                        sum_ins_local_recoveries = data.rows[0].sum_ins_local_recoveries;
                    });


                    const loan = {
                        total_ins: sum_ins,
                        ins: kgid_cnt,
                        rem_amt: sum_loan - kgid_total,
                        total_ins_gpf: sum_ins_gpf,
                        ins_gpf: gpf_cnt,
                        rem_amt_gpf: sum_loan_gpf - gpf_total,
                        total_ins_local_recoveries: sum_ins_local_recoveries,
                        ins_local_recoveries: local_recoveries_cnt,
                        rem_amt_local_recoveries: sum_local_recoveries - local_recoveries_total
                    }

                    console.log(loan);

                    if(year < new Date().getFullYear()){
                        if(month in all_months){
                            //Provide Data
                            website_data = [];
                            website_data.push({
                                years: [data.rows[0].prev_year_2, data.rows[0].prev_year_2 + 1]
                            });
                            website_data.push({prev_curr_year: "previous_year_2"});
                                                        var query ="select * from pay_slip_earnings pse, pay_slip_deductions psd,\
                            staff s, staff_bank_details sbd, loan_recoveries lr where pse.kgid=lr.kgid and pse.kgid=s.kgid and pse.kgid=sbd.kgid and pse.kgid=psd.kgid \
                            and pse.month=psd.month and pse.year=psd.year \
                            and pse.kgid=$1 and pse.year=$2 and pse.month=$3";
                            await pool.query(query, [kgid, year, month]).then(async (data) => {
                                var {da, hra} = await calculateDaHra(data.rows[0].pay);
                                var grossSalary = (data.rows[0].pay) + Math.round(da) + Math.round(hra) + (data.rows[0].ma) + (data.rows[0].fta) + (data.rows[0].cha) + (data.rows[0].pp_sfn);
                                var deductionsSum = (data.rows[0].pt) + (data.rows[0].egis) + (data.rows[0].lic) + (data.rows[0].gpf) + (data.rows[0].it) + (data.rows[0].slip_kgid) + (data.rows[0].slip_kgid_recoveries) + (data.rows[0].gpf_recoveries);
                                var netSalary = grossSalary - deductionsSum;
                                var totalLocalRecoveries = (data.rows[0].local_recoveries);
                                var netSalaryPayable = netSalary - totalLocalRecoveries;
                                var netSalaryPayableWords = netSalaryWords(netSalaryPayable);
                                var dobMonth = "";
                                var nextIncMonth = "";
                                var joiningMonth = "";
                                if(parseInt(data.rows[0].dob.getMonth()) < 9){
                                    dobMonth = "0" + parseInt(data.rows[0].dob.getMonth());
                                }
                                else{
                                    dobMonth = parseInt(data.rows[0].dob.getMonth());
                                }
                                if(parseInt(data.rows[0].next_inc_date.getMonth()) < 9){
                                    nextIncMonth = "0" + parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                else{
                                    nextIncMonth = parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                if(parseInt(data.rows[0].joining_date.getMonth()) < 9){
                                    joiningMonth = "0" + parseInt(data.rows[0].joining_date.getMonth());

                                }
                                else{
                                    joiningMonth = parseInt(data.rows[0].joining_date.getMonth());
                                }
                                website_data.push({
                                    month: data.rows[0].month,
                                    year: data.rows[0].year,
                                    department: data.rows[0].department,
                                    kgid: data.rows[0].kgid,
                                    pran_number: data.rows[0].pran,
                                    ag_code: data.rows[0].ag_code,
                                    staff_name: data.rows[0].name,
                                    gender: data.rows[0].gender,
                                    dob: data.rows[0].dob.getDate() + "/" + dobMonth + "/" + data.rows[0].dob.getFullYear(),
                                    designation: data.rows[0].designation,
                                    ddo_code: data.rows[0].ddo_code,
                                    days_worked: Math.ceil((Math.abs(new Date() - new Date(data.rows[0].joining_date)))/ (1000 * 60 * 60 * 24)),
                                    next_inc_date: data.rows[0].next_inc_date.getDate() + "/" + nextIncMonth + "/" + data.rows[0].next_inc_date.getFullYear(),
                                    joining_date: data.rows[0].joining_date.getDate() + "/" + joiningMonth + "/" + data.rows[0].joining_date.getFullYear(),
                                    group: data.rows[0].staff_group,
                                    head_of_account: data.rows[0].head_of_account,
                                    pan_number: data.rows[0].pan_number,
                                    el_bal: Math.round(data.rows[0].el_bal),
                                    hpl_bal: Math.round(data.rows[0].hpl_bal),
                                    pay_scale: Math.round(data.rows[0].pay_scale_min) + "-" + Math.round(data.rows[0].pay_scale_max),
                                    basic: Math.round(data.rows[0].pay),
                                    stag_count: Math.round(data.rows[0].stag_count),
                                    stag_amt: Math.round(data.rows[0].stag_amt),
                                    pay_fixation_amt: Math.round(data.rows[0].pay_fixation_amt),
                                    da: Math.round(da),
                                    hra: Math.round(hra),
                                    ma: Math.round(data.rows[0].ma),
                                    fta: Math.round(data.rows[0].fta),
                                    cha: Math.round(data.rows[0].cha),
                                    pp_sfn: Math.round(data.rows[0].pp_sfn),
                                    pt: Math.round(data.rows[0].pt),
                                    egis: Math.round(data.rows[0].egis),
                                    lic: Math.round(data.rows[0].lic),
                                    lic_tax: Math.round(data.rows[0].lic_tax),
                                    gpf: Math.round(data.rows[0].gpf),
                                    it: Math.round(data.rows[0].it),
                                    gpf_recoveries: Math.round(data.rows[0].gpf_recoveries),
                                    slip_kgid: Math.round(data.rows[0].slip_kgid),
                                    slip_kgid_recoveries: Math.round(data.rows[0].slip_kgid_recoveries),
                                    local_recoveries: Math.round(data.rows[0].local_recoveries),
                                    gross_salary: Math.round(grossSalary),
                                    deduction_recoveries: Math.round(deductionsSum),
                                    net_salary: Math.round(netSalary),
                                    total_local_recoveries: Math.round(totalLocalRecoveries),
                                    net_payable_salary: Math.round(netSalaryPayable),
                                    payment_mode: data.rows[0].payment_mode,
                                    account_no: data.rows[0].account_no,
                                    bank_name: data.rows[0].bank_name,
                                    branch: data.rows[0].branch,
                                    salary_in_words: netSalaryPayableWords,
                                    recipient_id: data.rows[0].recipient_id,
                                    establishment_no: data.rows[0].establishment_no,
                                    bank_name_recoveries: data.rows[0].bank_name_recoveries,
                                });
                            });
                            
                            console.log("Loan: ");
                            console.log(loan);
                            res.render("./teacher/pay_slip", {title: "Pay Slip", loan: loan, data: website_data, current_years: current_years[0]});
                        }
                        else{
                            res.send("Invalid Month Choice");
                        }
                    }
                    else if(year == new Date().getFullYear() && all_months[`${month}`] <= new Date().getMonth()){
                        if(month in all_months){
                            //Provide Data
                            website_data = [];
                            website_data.push({
                                years: [data.rows[0].prev_year_2, data.rows[0].prev_year_2 + 1]
                            });
                            website_data.push({prev_curr_year: "previous_year_2"});
                                                        var query ="select * from pay_slip_earnings pse, pay_slip_deductions psd,\
                            staff_bank_details sbd, staff s, loan_recoveries lr where pse.kgid=lr.kgid and pse.kgid=s.kgid and pse.kgid=sbd.kgid and pse.kgid=psd.kgid \
                            and pse.month=psd.month and pse.year=psd.year \
                            and pse.kgid=$1 and pse.year=$2 and pse.month=$3";
                            await pool.query(query, [kgid, year, month]).then(async (data) => {
                                var {da, hra} = await calculateDaHra(data.rows[0].pay);
                                var grossSalary = (data.rows[0].pay) + Math.round(da) + Math.round(hra) + (data.rows[0].ma) + (data.rows[0].fta) + (data.rows[0].cha) + (data.rows[0].pp_sfn);
                                var deductionsSum = (data.rows[0].pt) + (data.rows[0].egis) + (data.rows[0].lic) + (data.rows[0].gpf) + (data.rows[0].it) + (data.rows[0].slip_kgid) + (data.rows[0].slip_kgid_recoveries) + (data.rows[0].gpf_recoveries);
                                var netSalary = grossSalary - deductionsSum;
                                var totalLocalRecoveries = (data.rows[0].local_recoveries);
                                var netSalaryPayable = netSalary - totalLocalRecoveries;
                                var netSalaryPayableWords = netSalaryWords(netSalaryPayable);
                                var dobMonth = "";
                                var nextIncMonth = "";
                                var joiningMonth = "";
                                if(parseInt(data.rows[0].dob.getMonth()) < 9){
                                    dobMonth = "0" + parseInt(data.rows[0].dob.getMonth());
                                }
                                else{
                                    dobMonth = parseInt(data.rows[0].dob.getMonth());
                                }
                                if(parseInt(data.rows[0].next_inc_date.getMonth()) < 9){
                                    nextIncMonth = "0" + parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                else{
                                    nextIncMonth = parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                if(parseInt(data.rows[0].joining_date.getMonth()) < 9){
                                    joiningMonth = "0" + parseInt(data.rows[0].joining_date.getMonth());

                                }
                                else{
                                    joiningMonth = parseInt(data.rows[0].joining_date.getMonth());
                                }
                                website_data.push({
                                    month: data.rows[0].month,
                                    year: data.rows[0].year,
                                    department: data.rows[0].department,
                                    kgid: data.rows[0].kgid,
                                    pran_number: data.rows[0].pran,
                                    ag_code: data.rows[0].ag_code,
                                    staff_name: data.rows[0].name,
                                    gender: data.rows[0].gender,
                                    dob: data.rows[0].dob.getDate() + "/" + dobMonth + "/" + data.rows[0].dob.getFullYear(),
                                    designation: data.rows[0].designation,
                                    ddo_code: data.rows[0].ddo_code,
                                    days_worked: Math.ceil((Math.abs(new Date() - new Date(data.rows[0].joining_date)))/ (1000 * 60 * 60 * 24)),
                                    next_inc_date: data.rows[0].next_inc_date.getDate() + "/" + nextIncMonth + "/" + data.rows[0].next_inc_date.getFullYear(),
                                    joining_date: data.rows[0].joining_date.getDate() + "/" + joiningMonth + "/" + data.rows[0].joining_date.getFullYear(),
                                    group: data.rows[0].staff_group,
                                    head_of_account: data.rows[0].head_of_account,
                                    pan_number: data.rows[0].pan_number,
                                    el_bal: Math.round(data.rows[0].el_bal),
                                    hpl_bal: Math.round(data.rows[0].hpl_bal),
                                    pay_scale: Math.round(data.rows[0].pay_scale_min) + "-" + Math.round(data.rows[0].pay_scale_max),
                                    basic: Math.round(data.rows[0].pay),
                                    stag_count: Math.round(data.rows[0].stag_count),
                                    stag_amt: Math.round(data.rows[0].stag_amt),
                                    pay_fixation_amt: Math.round(data.rows[0].pay_fixation_amt),
                                    da: Math.round(da),
                                    hra: Math.round(hra),
                                    ma: Math.round(data.rows[0].ma),
                                    fta: Math.round(data.rows[0].fta),
                                    cha: Math.round(data.rows[0].cha),
                                    pp_sfn: Math.round(data.rows[0].pp_sfn),
                                    pt: Math.round(data.rows[0].pt),
                                    egis: Math.round(data.rows[0].egis),
                                    lic: Math.round(data.rows[0].lic),
                                    lic_tax: Math.round(data.rows[0].lic_tax),
                                    gpf: Math.round(data.rows[0].gpf),
                                    it: Math.round(data.rows[0].it),
                                    gpf_recoveries: Math.round(data.rows[0].gpf_recoveries),
                                    slip_kgid: Math.round(data.rows[0].slip_kgid),
                                    slip_kgid_recoveries: Math.round(data.rows[0].slip_kgid_recoveries),
                                    local_recoveries: Math.round(data.rows[0].local_recoveries),
                                    gross_salary: Math.round(grossSalary),
                                    deduction_recoveries: Math.round(deductionsSum),
                                    net_salary: Math.round(netSalary),
                                    total_local_recoveries: Math.round(totalLocalRecoveries),
                                    net_payable_salary: Math.round(netSalaryPayable),
                                    payment_mode: data.rows[0].payment_mode,
                                    account_no: data.rows[0].account_no,
                                    bank_name: data.rows[0].bank_name,
                                    branch: data.rows[0].branch,
                                    salary_in_words: netSalaryPayableWords,
                                    recipient_id: data.rows[0].recipient_id,
                                    establishment_no: data.rows[0].establishment_no,
                                    bank_name_recoveries: data.rows[0].bank_name_recoveries,
                                });
                            });

                            res.render("./teacher/pay_slip", {title: "Pay Slip", loan: loan, data: website_data, current_years: current_years[0]});
                        }
                        else{
                            res.send("Invalid Month Choice");
                        }
                    }
                    else{
                        res.send("Data not available");
                    }
                }
                else if(data.rows[0].prev_year_2 + 1 == year){
                    var all_months = {"Jan":0, "Feb":1};
                    var all_months_rev = {0: "Jan", 1: "Feb"};
                    
                    //year: 2019
                    var months_in = ``;
                    var month_priority = all_months[`${month}`];
                    var month_cnt = 0;
                    while(month_cnt <= month_priority){
                        if(month_cnt <= month_priority - 1){
                            months_in += `'${all_months_rev[`${month_cnt}`]}',`;
                        }
                        else{
                            months_in += `'${all_months_rev[`${month_cnt}`]}'`;
                        }
                        month_cnt += 1;
                    }
                    var kgid_cnt = 0;
                    var kgid_total = 0;
                    var gpf_cnt = 0;
                    var gpf_total = 0;
                    var local_recoveries_cnt = 0;
                    var local_recoveries_total = 0;
                    console.log("MOnth sin : ", months_in);
                    query = `select count(slip_kgid_recoveries) cnt, sum(slip_kgid_recoveries) total\
                     from pay_slip_deductions where kgid=$1 and slip_kgid_recoveries>0 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        kgid_cnt = data.rows[0].cnt;
                        kgid_total = data.rows[0].total;
                    });

                    //====

                    query = `select count(gpf_recoveries) gpf_cnt, sum(gpf_recoveries) gpf_total\
                     from pay_slip_deductions where kgid=$1 and gpf_recoveries>0 and year=$2 and month in(${months_in})`;
                     await pool.query(query, [kgid, year]).then((data) => {
                        gpf_cnt = data.rows[0].gpf_cnt;
                        gpf_total = data.rows[0].gpf_total;
                    });

                    query = `select count(local_recoveries) local_recoveries_cnt, sum(local_recoveries) local_recoveries_total\
                     from pay_slip_deductions where kgid=$1 and local_recoveries>0 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        local_recoveries_cnt = data.rows[0].local_recoveries_cnt;
                        local_recoveries_total = data.rows[0].local_recoveries_total;
                    });

                    query = `select count(slip_kgid_recoveries) cnt, sum(slip_kgid_recoveries) total\
                     from pay_slip_deductions where kgid=$1 and slip_kgid_recoveries>0 and year=$2`;
                    await pool.query(query, [kgid, year - 1]).then((data) => {
                        kgid_cnt += parseInt(data.rows[0].cnt);
                        kgid_total += parseInt(data.rows[0].total);
                    });

                    //====

                    query = `select count(gpf_recoveries) gpf_cnt, sum(gpf_recoveries) gpf_total\
                     from pay_slip_deductions where kgid=$1 and gpf_recoveries>0 and year=$2`;
                    await pool.query(query, [kgid, year - 1]).then((data) => {
                        gpf_cnt += parseInt(data.rows[0].gpf_cnt);
                        gpf_total += parseInt(data.rows[0].gpf_total);
                    });

                    query = `select count(local_recoveries) local_recoveries_cnt, sum(local_recoveries) local_recoveries_total\
                     from pay_slip_deductions where kgid=$1 and local_recoveries>0 and year=$2`;
                    await pool.query(query, [kgid, year - 1]).then((data) => {
                        local_recoveries_cnt += parseInt(data.rows[0].local_recoveries_cnt);
                        local_recoveries_total += parseInt(data.rows[0].local_recoveries_total);
                    });

                    var sum_loan = 0;
                    var sum_ins = 0;
                    var sum_loan_gpf = 0;
                    var sum_ins_gpf = 0;
                    var sum_local_recoveries = 0;
                    var sum_ins_local_recoveries = 0;

                    query = `select sum(slip_kgid_loan) sum_loan, sum(slip_kgid_total_ins) sum_ins, sum(gpf_loan) sum_loan_gpf, sum(gpf_total_ins) sum_ins_gpf, \
                    sum(local_recoveries) sum_local_recoveries, sum(local_recoveries_ins) sum_ins_local_recoveries from loan_recoveries where kgid=$1 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        sum_loan = data.rows[0].sum_loan;
                        sum_ins = data.rows[0].sum_ins;
                        sum_loan_gpf = data.rows[0].sum_loan_gpf;
                        sum_ins_gpf = data.rows[0].sum_ins_gpf;
                        sum_local_recoveries = data.rows[0].sum_local_recoveries;
                        sum_ins_local_recoveries = data.rows[0].sum_ins_local_recoveries;
                    });

                    query = `select sum(slip_kgid_loan) sum_loan, sum(slip_kgid_total_ins) sum_ins, sum(gpf_loan) sum_loan_gpf, sum(gpf_total_ins) sum_ins_gpf, \
                    sum(local_recoveries) sum_local_recoveries, sum(local_recoveries_ins) sum_ins_local_recoveries from loan_recoveries where kgid=$1 and year=$2`;
                    await pool.query(query, [kgid, year - 1]).then((data) => {
                        sum_loan += parseInt(data.rows[0].sum_loan);
                        sum_ins += parseInt(data.rows[0].sum_ins);
                        sum_loan_gpf += parseInt(data.rows[0].sum_loan_gpf);
                        sum_ins_gpf += parseInt(data.rows[0].sum_ins_gpf);
                        sum_local_recoveries += parseInt(data.rows[0].sum_local_recoveries);
                        sum_ins_local_recoveries += parseInt(data.rows[0].sum_ins_local_recoveries);
                    });

                    const loan = {
                        total_ins: sum_ins,
                        ins: kgid_cnt,
                        rem_amt: sum_loan - kgid_total,
                        total_ins_gpf: sum_ins_gpf,
                        ins_gpf: gpf_cnt,
                        rem_amt_gpf: sum_loan_gpf - gpf_total,
                        total_ins_local_recoveries: sum_ins_local_recoveries,
                        ins_local_recoveries: local_recoveries_cnt,
                        rem_amt_local_recoveries: sum_local_recoveries - local_recoveries_total
                    }
                    console.log("Loan Amount: ");
                    console.log(loan);  
                    
                    if(year < new Date().getFullYear()){
                        if(month in all_months){
                            //Provide Data
                            website_data = [];
                            website_data.push({
                                years: [data.rows[0].prev_year_2, data.rows[0].prev_year_2 + 1]
                            });
                            website_data.push({prev_curr_year: "previous_year_2"});
                                                        var query ="select * from pay_slip_earnings pse, pay_slip_deductions psd,\
                            staff_bank_details sbd, staff s, loan_recoveries lr where pse.kgid=lr.kgid and pse.kgid=s.kgid and pse.kgid=sbd.kgid and pse.kgid=psd.kgid \
                            and pse.month=psd.month and pse.year=psd.year \
                            and pse.kgid=$1 and pse.year=$2 and pse.month=$3";
                            await pool.query(query, [kgid, year, month]).then(async (data) => {
                                var {da, hra} = await calculateDaHra(data.rows[0].pay);
                                var grossSalary = (data.rows[0].pay) + Math.round(da) + Math.round(hra) + (data.rows[0].ma) + (data.rows[0].fta) + (data.rows[0].cha) + (data.rows[0].pp_sfn);
                                var deductionsSum = (data.rows[0].pt) + (data.rows[0].egis) + (data.rows[0].lic) + (data.rows[0].gpf) + (data.rows[0].it) + (data.rows[0].slip_kgid) + (data.rows[0].slip_kgid_recoveries) + (data.rows[0].gpf_recoveries);
                                var netSalary = grossSalary - deductionsSum;
                                var totalLocalRecoveries = (data.rows[0].local_recoveries);
                                var netSalaryPayable = netSalary - totalLocalRecoveries;
                                var netSalaryPayableWords = netSalaryWords(netSalaryPayable);
                                var dobMonth = "";
                                var nextIncMonth = "";
                                var joiningMonth = "";
                                if(parseInt(data.rows[0].dob.getMonth()) < 9){
                                    dobMonth = "0" + parseInt(data.rows[0].dob.getMonth());
                                }
                                else{
                                    dobMonth = parseInt(data.rows[0].dob.getMonth());
                                }
                                if(parseInt(data.rows[0].next_inc_date.getMonth()) < 9){
                                    nextIncMonth = "0" + parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                else{
                                    nextIncMonth = parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                if(parseInt(data.rows[0].joining_date.getMonth()) < 9){
                                    joiningMonth = "0" + parseInt(data.rows[0].joining_date.getMonth());

                                }
                                else{
                                    joiningMonth = parseInt(data.rows[0].joining_date.getMonth());
                                }
                                website_data.push({
                                    month: data.rows[0].month,
                                    year: data.rows[0].year,
                                    department: data.rows[0].department,
                                    kgid: data.rows[0].kgid,
                                    pran_number: data.rows[0].pran,
                                    ag_code: data.rows[0].ag_code,
                                    staff_name: data.rows[0].name,
                                    gender: data.rows[0].gender,
                                    dob: data.rows[0].dob.getDate() + "/" + dobMonth + "/" + data.rows[0].dob.getFullYear(),
                                    designation: data.rows[0].designation,
                                    ddo_code: data.rows[0].ddo_code,
                                    days_worked: Math.ceil((Math.abs(new Date() - new Date(data.rows[0].joining_date)))/ (1000 * 60 * 60 * 24)),
                                    next_inc_date: data.rows[0].next_inc_date.getDate() + "/" + nextIncMonth + "/" + data.rows[0].next_inc_date.getFullYear(),
                                    joining_date: data.rows[0].joining_date.getDate() + "/" + joiningMonth + "/" + data.rows[0].joining_date.getFullYear(),
                                    group: data.rows[0].staff_group,
                                    head_of_account: data.rows[0].head_of_account,
                                    pan_number: data.rows[0].pan_number,
                                    el_bal: Math.round(data.rows[0].el_bal),
                                    hpl_bal: Math.round(data.rows[0].hpl_bal),
                                    pay_scale: Math.round(data.rows[0].pay_scale_min) + "-" + Math.round(data.rows[0].pay_scale_max),
                                    basic: Math.round(data.rows[0].pay),
                                    stag_count: Math.round(data.rows[0].stag_count),
                                    stag_amt: Math.round(data.rows[0].stag_amt),
                                    pay_fixation_amt: Math.round(data.rows[0].pay_fixation_amt),
                                    da: Math.round(da),
                                    hra: Math.round(hra),
                                    ma: Math.round(data.rows[0].ma),
                                    fta: Math.round(data.rows[0].fta),
                                    cha: Math.round(data.rows[0].cha),
                                    pp_sfn: Math.round(data.rows[0].pp_sfn),
                                    pt: Math.round(data.rows[0].pt),
                                    egis: Math.round(data.rows[0].egis),
                                    lic: Math.round(data.rows[0].lic),
                                    lic_tax: Math.round(data.rows[0].lic_tax),
                                    gpf: Math.round(data.rows[0].gpf),
                                    it: Math.round(data.rows[0].it),
                                    gpf_recoveries: Math.round(data.rows[0].gpf_recoveries),
                                    slip_kgid: Math.round(data.rows[0].slip_kgid),
                                    slip_kgid_recoveries: Math.round(data.rows[0].slip_kgid_recoveries),
                                    local_recoveries: Math.round(data.rows[0].local_recoveries),
                                    gross_salary: Math.round(grossSalary),
                                    deduction_recoveries: Math.round(deductionsSum),
                                    net_salary: Math.round(netSalary),
                                    total_local_recoveries: Math.round(totalLocalRecoveries),
                                    net_payable_salary: Math.round(netSalaryPayable),
                                    payment_mode: data.rows[0].payment_mode,
                                    account_no: data.rows[0].account_no,
                                    bank_name: data.rows[0].bank_name,
                                    branch: data.rows[0].branch,
                                    salary_in_words: netSalaryPayableWords,
                                    recipient_id: data.rows[0].recipient_id,
                                    establishment_no: data.rows[0].establishment_no,
                                    bank_name_recoveries: data.rows[0].bank_name_recoveries,
                                });
                            });
                            
                            res.render("./teacher/pay_slip", {title: "Pay Slip", loan: loan, data: website_data, current_years: current_years[0]});
                        }
                        else{
                            res.send("Invalid Month Choice");
                        }
                    }
                    else if(year == new Date().getFullYear() && all_months[`${month}`] <= new Date().getMonth()){
                        if(month in all_months){
                            //Provide Data
                            website_data = [];
                            website_data.push({
                                years: [data.rows[0].prev_year_2, data.rows[0].prev_year_2 + 1]
                            });
                            website_data.push({prev_curr_year: "previous_year_2"});
                                                        var query ="select * from pay_slip_earnings pse, pay_slip_deductions psd,\
                            staff_bank_details sbd, staff s, loan_recoveries lr where pse.kgid=lr.kgid and pse.kgid=s.kgid and pse.kgid=sbd.kgid and pse.kgid=psd.kgid \
                            and pse.month=psd.month and pse.year=psd.year \
                            and pse.kgid=$1 and pse.year=$2 and pse.month=$3";
                            await pool.query(query, [kgid, year, month]).then(async (data) => {
                                var {da, hra} = await calculateDaHra(data.rows[0].pay);
                                var grossSalary = (data.rows[0].pay) + Math.round(da) + Math.round(hra) + (data.rows[0].ma) + (data.rows[0].fta) + (data.rows[0].cha) + (data.rows[0].pp_sfn);
                                var deductionsSum = (data.rows[0].pt) + (data.rows[0].egis) + (data.rows[0].lic) + (data.rows[0].gpf) + (data.rows[0].it) + (data.rows[0].slip_kgid) + (data.rows[0].slip_kgid_recoveries) + (data.rows[0].gpf_recoveries);
                                var netSalary = grossSalary - deductionsSum;
                                var totalLocalRecoveries = (data.rows[0].local_recoveries);
                                var netSalaryPayable = netSalary - totalLocalRecoveries;
                                var netSalaryPayableWords = netSalaryWords(netSalaryPayable);
                                try {
                                    var dob = "";
                                    dob = data.rows[0].dob.getDate() + "/" + data.rows[0].dob.getMonth() + "/" + data.rows[0].dob.getFullYear();
                                } catch (err) {
                                    
                                }
                                try {
                                    var next_inc_date = "";
                                    next_inc_date = data.rows[0].next_inc_date.getDate() + "/" + data.rows[0].next_inc_date.getMonth() + "/" + data.rows[0].next_inc_date.getFullYear();
                                } catch (err) {
                                    
                                }
                                try {
                                    var joining_date = "";
                                    joining_date = data.rows[0].joining_date.getDate() + "/" + data.rows[0].joining_date.getMonth() + "/" + data.rows[0].joining_date.getFullYear();
                                } catch (err) {
                                    
                                }
                                try {
                                    var days_worked = "";
                                    days_worked = Math.ceil((Math.abs(new Date() - new Date(data.rows[0].joining_date)))/ (1000 * 60 * 60 * 24));
                                } catch (error) {
                                    
                                }
                                var dobMonth = "";
                                var nextIncMonth = "";
                                var joiningMonth = "";
                                if(parseInt(data.rows[0].dob.getMonth()) < 9){
                                    dobMonth = "0" + parseInt(data.rows[0].dob.getMonth());
                                }
                                else{
                                    dobMonth = parseInt(data.rows[0].dob.getMonth());
                                }
                                if(parseInt(data.rows[0].next_inc_date.getMonth()) < 9){
                                    nextIncMonth = "0" + parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                else{
                                    nextIncMonth = parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                if(parseInt(data.rows[0].joining_date.getMonth()) < 9){
                                    joiningMonth = "0" + parseInt(data.rows[0].joining_date.getMonth());

                                }
                                else{
                                    joiningMonth = parseInt(data.rows[0].joining_date.getMonth());
                                }
                                website_data.push({
                                    month: data.rows[0].month,
                                    year: data.rows[0].year,
                                    department: data.rows[0].department,
                                    kgid: data.rows[0].kgid,
                                    pran_number: data.rows[0].pran,
                                    ag_code: data.rows[0].ag_code,
                                    staff_name: data.rows[0].name,
                                    gender: data.rows[0].gender,
                                    dob: dob,
                                    designation: data.rows[0].designation,
                                    ddo_code: data.rows[0].ddo_code,
                                    days_worked: days_worked,
                                    next_inc_date: next_inc_date,
                                    joining_date: joining_date,
                                    group: data.rows[0].staff_group,
                                    head_of_account: data.rows[0].head_of_account,
                                    pan_number: data.rows[0].pan_number,
                                    el_bal: Math.round(data.rows[0].el_bal),
                                    hpl_bal: Math.round(data.rows[0].hpl_bal),
                                    pay_scale: Math.round(data.rows[0].pay_scale_min) + "-" + Math.round(data.rows[0].pay_scale_max),
                                    basic: Math.round(data.rows[0].pay),
                                    stag_count: Math.round(data.rows[0].stag_count),
                                    stag_amt: Math.round(data.rows[0].stag_amt),
                                    pay_fixation_amt: Math.round(data.rows[0].pay_fixation_amt),
                                    da: Math.round(da),
                                    hra: Math.round(hra),
                                    ma: Math.round(data.rows[0].ma),
                                    fta: Math.round(data.rows[0].fta),
                                    cha: Math.round(data.rows[0].cha),
                                    pp_sfn: Math.round(data.rows[0].pp_sfn),
                                    pt: Math.round(data.rows[0].pt),
                                    egis: Math.round(data.rows[0].egis),
                                    lic: Math.round(data.rows[0].lic),
                                    lic_tax: Math.round(data.rows[0].lic_tax),
                                    gpf: Math.round(data.rows[0].gpf),
                                    it: Math.round(data.rows[0].it),
                                    gpf_recoveries: Math.round(data.rows[0].gpf_recoveries),
                                    slip_kgid: Math.round(data.rows[0].slip_kgid),
                                    slip_kgid_recoveries: Math.round(data.rows[0].slip_kgid_recoveries),
                                    local_recoveries: Math.round(data.rows[0].local_recoveries),
                                    gross_salary: Math.round(grossSalary),
                                    deduction_recoveries: Math.round(deductionsSum),
                                    net_salary: Math.round(netSalary),
                                    total_local_recoveries: Math.round(totalLocalRecoveries),
                                    net_payable_salary: Math.round(netSalaryPayable),
                                    payment_mode: data.rows[0].payment_mode,
                                    account_no: data.rows[0].account_no,
                                    bank_name: data.rows[0].bank_name,
                                    branch: data.rows[0].branch,
                                    salary_in_words: netSalaryPayableWords,
                                    recipient_id: data.rows[0].recipient_id,
                                    establishment_no: data.rows[0].establishment_no,
                                    bank_name_recoveries: data.rows[0].bank_name_recoveries,
                                });
                            });
                            
                            res.render("./teacher/pay_slip", {title: "Pay Slip", loan: loan, data: website_data, current_years: current_years[0]});
                        }
                        else{
                            res.send("Invalid Month Choice");
                        }
                    }
                    else{
                        res.send("Data not available");
                    }
                }
                else{
                    res.send("invalid Year");
                }
            });
        } catch (err) {
            console.log(err);
            res.send("Data not available");
        }
    }
    else if(prevCurrYear == "previous_year"){
        var query = "select prev_year from current_years";
        try {
            await pool.query(query).then(async (data) => {
                if(data.rows[0].prev_year == year){
                    var all_months = {"Mar":2, "Apr":3, "May":4, "Jun":5, "Jul":6, "Aug":7, "Sep":8, "Oct":9, "Nov":10, "Dec":11};
                    var all_months_rev = {2:"Mar", 3:"Apr", 4:"May", 5:"Jun", 6:"Jul", 7:"Aug", 8:"Sep", 9:"Oct", 10:"Nov", 11:"Dec"};
                    
                    var months_in = ``;
                    var month_priority = all_months[`${month}`];
                    var month_cnt = 2;
                    while(month_cnt <= month_priority){
                        if(month_cnt <= month_priority - 1){
                            months_in += `'${all_months_rev[`${month_cnt}`]}',`;
                        }
                        else{
                            months_in += `'${all_months_rev[`${month_cnt}`]}'`;
                        }
                        month_cnt += 1;
                    }
                    var kgid_cnt = 0;
                    var kgid_total = 0;
                    var gpf_cnt = 0;
                    var gpf_total = 0;
                    var local_recoveries_cnt = 0;
                    var local_recoveries_total = 0;
                    console.log("MOnth sin : ", months_in);
                    query = `select count(slip_kgid_recoveries) cnt, sum(slip_kgid_recoveries) total\
                     from pay_slip_deductions where kgid=$1 and slip_kgid_recoveries>0 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        kgid_cnt = data.rows[0].cnt;
                        kgid_total = data.rows[0].total;
                    });

                    //=====

                    query = `select count(gpf_recoveries) gpf_cnt, sum(gpf_recoveries) gpf_total\
                     from pay_slip_deductions where kgid=$1 and gpf_recoveries>0 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        gpf_cnt = data.rows[0].gpf_cnt;
                        gpf_total = data.rows[0].gpf_total;
                    });

                    query = `select count(local_recoveries) local_recoveries_cnt, sum(local_recoveries) local_recoveries_total\
                     from pay_slip_deductions where kgid=$1 and local_recoveries>0 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        local_recoveries_cnt = data.rows[0].local_recoveries_cnt;
                        local_recoveries_total = data.rows[0].local_recoveries_total;
                    });

                    var sum_loan = 0;
                    var sum_ins = 0;
                    var sum_loan_gpf = 0;
                    var sum_ins_gpf = 0;
                    var sum_local_recoveries = 0;
                    var sum_ins_local_recoveries = 0;

                    query = `select sum(slip_kgid_loan) sum_loan, sum(slip_kgid_total_ins) sum_ins, sum(gpf_loan) sum_loan_gpf, sum(gpf_total_ins) sum_ins_gpf, \
                    sum(local_recoveries) sum_local_recoveries, sum(local_recoveries_ins) sum_ins_local_recoveries from loan_recoveries where kgid=$1 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        sum_loan = data.rows[0].sum_loan;
                        sum_ins = data.rows[0].sum_ins;
                        sum_loan_gpf = data.rows[0].sum_loan_gpf;
                        sum_ins_gpf = data.rows[0].sum_ins_gpf;
                        sum_local_recoveries = data.rows[0].sum_local_recoveries;
                        sum_ins_local_recoveries = data.rows[0].sum_ins_local_recoveries;
                    });


                    const loan = {
                        total_ins: sum_ins,
                        ins: kgid_cnt,
                        rem_amt: sum_loan - kgid_total,
                        total_ins_gpf: sum_ins_gpf,
                        ins_gpf: gpf_cnt,
                        rem_amt_gpf: sum_loan_gpf - gpf_total,
                        total_ins_local_recoveries: sum_ins_local_recoveries,
                        ins_local_recoveries: local_recoveries_cnt,
                        rem_amt_local_recoveries: sum_local_recoveries - local_recoveries_total
                    }

                    if(year < new Date().getFullYear()){
                        if(month in all_months){
                            //Provide Data
                            website_data = [];
                            website_data.push({
                                years: [data.rows[0].prev_year, data.rows[0].prev_year + 1]
                            });
                            website_data.push({prev_curr_year: "previous_year"});
                                                        var query ="select * from pay_slip_earnings pse, pay_slip_deductions psd,\
                            staff s, staff_bank_details sbd, loan_recoveries lr where pse.kgid=lr.kgid and pse.kgid=s.kgid and pse.kgid=sbd.kgid and pse.kgid=psd.kgid \
                            and pse.month=psd.month and pse.year=psd.year \
                            and pse.kgid=$1 and pse.year=$2 and pse.month=$3";
                            await pool.query(query, [kgid, year, month]).then(async (data) => {
                                var {da, hra} = await calculateDaHra(data.rows[0].pay);
                                var grossSalary = (data.rows[0].pay) + Math.round(da) + Math.round(hra) + (data.rows[0].ma) + (data.rows[0].fta) + (data.rows[0].cha) + (data.rows[0].pp_sfn);
                                var deductionsSum = (data.rows[0].pt) + (data.rows[0].egis) + (data.rows[0].lic) + (data.rows[0].gpf) + (data.rows[0].it) + (data.rows[0].slip_kgid) + (data.rows[0].slip_kgid_recoveries) + (data.rows[0].gpf_recoveries);
                                var netSalary = grossSalary - deductionsSum;
                                var totalLocalRecoveries = (data.rows[0].local_recoveries);
                                var netSalaryPayable = netSalary - totalLocalRecoveries;
                                var netSalaryPayableWords = netSalaryWords(netSalaryPayable);
                                var dobMonth = "";
                                var nextIncMonth = "";
                                var joiningMonth = "";
                                if(parseInt(data.rows[0].dob.getMonth()) < 9){
                                    dobMonth = "0" + parseInt(data.rows[0].dob.getMonth());
                                }
                                else{
                                    dobMonth = parseInt(data.rows[0].dob.getMonth());
                                }
                                if(parseInt(data.rows[0].next_inc_date.getMonth()) < 9){
                                    nextIncMonth = "0" + parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                else{
                                    nextIncMonth = parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                if(parseInt(data.rows[0].joining_date.getMonth()) < 9){
                                    joiningMonth = "0" + parseInt(data.rows[0].joining_date.getMonth());

                                }
                                else{
                                    joiningMonth = parseInt(data.rows[0].joining_date.getMonth());
                                }
                                website_data.push({
                                    month: data.rows[0].month,
                                    year: data.rows[0].year,
                                    department: data.rows[0].department,
                                    kgid: data.rows[0].kgid,
                                    pran_number: data.rows[0].pran,
                                    ag_code: data.rows[0].ag_code,
                                    staff_name: data.rows[0].name,
                                    gender: data.rows[0].gender,
                                    dob: data.rows[0].dob.getDate() + "/" + dobMonth + "/" + data.rows[0].dob.getFullYear(),
                                    designation: data.rows[0].designation,
                                    ddo_code: data.rows[0].ddo_code,
                                    days_worked: Math.ceil((Math.abs(new Date() - new Date(data.rows[0].joining_date)))/ (1000 * 60 * 60 * 24)),
                                    next_inc_date: data.rows[0].next_inc_date.getDate() + "/" + nextIncMonth + "/" + data.rows[0].next_inc_date.getFullYear(),
                                    joining_date: data.rows[0].joining_date.getDate() + "/" + joiningMonth + "/" + data.rows[0].joining_date.getFullYear(),
                                    group: data.rows[0].staff_group,
                                    head_of_account: data.rows[0].head_of_account,
                                    pan_number: data.rows[0].pan_number,
                                    el_bal: Math.round(data.rows[0].el_bal),
                                    hpl_bal: Math.round(data.rows[0].hpl_bal),
                                    pay_scale: Math.round(data.rows[0].pay_scale_min) + "-" + Math.round(data.rows[0].pay_scale_max),
                                    basic: Math.round(data.rows[0].pay),
                                    stag_count: Math.round(data.rows[0].stag_count),
                                    stag_amt: Math.round(data.rows[0].stag_amt),
                                    pay_fixation_amt: Math.round(data.rows[0].pay_fixation_amt),
                                    da: Math.round(da),
                                    hra: Math.round(hra),
                                    ma: Math.round(data.rows[0].ma),
                                    fta: Math.round(data.rows[0].fta),
                                    cha: Math.round(data.rows[0].cha),
                                    pp_sfn: Math.round(data.rows[0].pp_sfn),
                                    pt: Math.round(data.rows[0].pt),
                                    egis: Math.round(data.rows[0].egis),
                                    lic: Math.round(data.rows[0].lic),
                                    lic_tax: Math.round(data.rows[0].lic_tax),
                                    gpf: Math.round(data.rows[0].gpf),
                                    it: Math.round(data.rows[0].it),
                                    gpf_recoveries: Math.round(data.rows[0].gpf_recoveries),
                                    slip_kgid: Math.round(data.rows[0].slip_kgid),
                                    slip_kgid_recoveries: Math.round(data.rows[0].slip_kgid_recoveries),
                                    local_recoveries: Math.round(data.rows[0].local_recoveries),
                                    gross_salary: Math.round(grossSalary),
                                    deduction_recoveries: Math.round(deductionsSum),
                                    net_salary: Math.round(netSalary),
                                    total_local_recoveries: Math.round(totalLocalRecoveries),
                                    net_payable_salary: Math.round(netSalaryPayable),
                                    payment_mode: data.rows[0].payment_mode,
                                    account_no: data.rows[0].account_no,
                                    bank_name: data.rows[0].bank_name,
                                    branch: data.rows[0].branch,
                                    salary_in_words: netSalaryPayableWords,
                                    recipient_id: data.rows[0].recipient_id,
                                    establishment_no: data.rows[0].establishment_no,
                                    bank_name_recoveries: data.rows[0].bank_name_recoveries,
                                });
                            });
                            
                            const loan = {
                                total_ins: 0,
                                ins: 0,
                                rem_amt: 0
                            }

                            res.render("./teacher/pay_slip", {title: "Pay Slip", loan: loan, data: website_data, current_years: current_years[0]});
                        }
                        else{
                            res.send("Invalid Month Choice");
                        }
                    }
                    else if(year == new Date().getFullYear() && all_months[`${month}`] <= new Date().getMonth()){
                        if(month in all_months){
                            //Provide Data
                            website_data = [];
                            website_data.push({
                                years: [data.rows[0].prev_year, data.rows[0].prev_year + 1]
                            });
                            website_data.push({prev_curr_year: "previous_year"});
                                                        var query ="select * from pay_slip_earnings pse, pay_slip_deductions psd,\
                            staff_bank_details sbd, staff s, loan_recoveries lr where pse.kgid=lr.kgid and pse.kgid=s.kgid and pse.kgid=sbd.kgid and pse.kgid=psd.kgid \
                            and pse.month=psd.month and pse.year=psd.year \
                            and pse.kgid=$1 and pse.year=$2 and pse.month=$3";
                            await pool.query(query, [kgid, year, month]).then(async (data) => {
                                var {da, hra} = await calculateDaHra(data.rows[0].pay);
                                var grossSalary = (data.rows[0].pay) + Math.round(da) + Math.round(hra) + (data.rows[0].ma) + (data.rows[0].fta) + (data.rows[0].cha) + (data.rows[0].pp_sfn);
                                var deductionsSum = (data.rows[0].pt) + (data.rows[0].egis) + (data.rows[0].lic) + (data.rows[0].gpf) + (data.rows[0].it) + (data.rows[0].slip_kgid) + (data.rows[0].slip_kgid_recoveries) + (data.rows[0].gpf_recoveries);
                                var netSalary = grossSalary - deductionsSum;
                                var totalLocalRecoveries = (data.rows[0].local_recoveries);
                                var netSalaryPayable = netSalary - totalLocalRecoveries;
                                var netSalaryPayableWords = netSalaryWords(netSalaryPayable);
                                var dobMonth = "";
                                var nextIncMonth = "";
                                var joiningMonth = "";
                                if(parseInt(data.rows[0].dob.getMonth()) < 9){
                                    dobMonth = "0" + parseInt(data.rows[0].dob.getMonth());
                                }
                                else{
                                    dobMonth = parseInt(data.rows[0].dob.getMonth());
                                }
                                if(parseInt(data.rows[0].next_inc_date.getMonth()) < 9){
                                    nextIncMonth = "0" + parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                else{
                                    nextIncMonth = parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                if(parseInt(data.rows[0].joining_date.getMonth()) < 9){
                                    joiningMonth = "0" + parseInt(data.rows[0].joining_date.getMonth());

                                }
                                else{
                                    joiningMonth = parseInt(data.rows[0].joining_date.getMonth());
                                }
                                website_data.push({
                                    month: data.rows[0].month,
                                    year: data.rows[0].year,
                                    department: data.rows[0].department,
                                    kgid: data.rows[0].kgid,
                                    pran_number: data.rows[0].pran,
                                    ag_code: data.rows[0].ag_code,
                                    staff_name: data.rows[0].name,
                                    gender: data.rows[0].gender,
                                    dob: data.rows[0].dob.getDate() + "/" + dobMonth + "/" + data.rows[0].dob.getFullYear(),
                                    designation: data.rows[0].designation,
                                    ddo_code: data.rows[0].ddo_code,
                                    days_worked: Math.ceil((Math.abs(new Date() - new Date(data.rows[0].joining_date)))/ (1000 * 60 * 60 * 24)),
                                    next_inc_date: data.rows[0].next_inc_date.getDate() + "/" + nextIncMonth + "/" + data.rows[0].next_inc_date.getFullYear(),
                                    joining_date: data.rows[0].joining_date.getDate() + "/" + joiningMonth + "/" + data.rows[0].joining_date.getFullYear(),
                                    group: data.rows[0].staff_group,
                                    head_of_account: data.rows[0].head_of_account,
                                    pan_number: data.rows[0].pan_number,
                                    el_bal: Math.round(data.rows[0].el_bal),
                                    hpl_bal: Math.round(data.rows[0].hpl_bal),
                                    pay_scale: Math.round(data.rows[0].pay_scale_min) + "-" + Math.round(data.rows[0].pay_scale_max),
                                    basic: Math.round(data.rows[0].pay),
                                    stag_count: Math.round(data.rows[0].stag_count),
                                    stag_amt: Math.round(data.rows[0].stag_amt),
                                    pay_fixation_amt: Math.round(data.rows[0].pay_fixation_amt),
                                    da: Math.round(da),
                                    hra: Math.round(hra),
                                    ma: Math.round(data.rows[0].ma),
                                    fta: Math.round(data.rows[0].fta),
                                    cha: Math.round(data.rows[0].cha),
                                    pp_sfn: Math.round(data.rows[0].pp_sfn),
                                    pt: Math.round(data.rows[0].pt),
                                    egis: Math.round(data.rows[0].egis),
                                    lic: Math.round(data.rows[0].lic),
                                    lic_tax: Math.round(data.rows[0].lic_tax),
                                    gpf: Math.round(data.rows[0].gpf),
                                    it: Math.round(data.rows[0].it),
                                    gpf_recoveries: Math.round(data.rows[0].gpf_recoveries),
                                    slip_kgid: Math.round(data.rows[0].slip_kgid),
                                    slip_kgid_recoveries: Math.round(data.rows[0].slip_kgid_recoveries),
                                    local_recoveries: Math.round(data.rows[0].local_recoveries),
                                    gross_salary: Math.round(grossSalary),
                                    deduction_recoveries: Math.round(deductionsSum),
                                    net_salary: Math.round(netSalary),
                                    total_local_recoveries: Math.round(totalLocalRecoveries),
                                    net_payable_salary: Math.round(netSalaryPayable),
                                    payment_mode: data.rows[0].payment_mode,
                                    account_no: data.rows[0].account_no,
                                    bank_name: data.rows[0].bank_name,
                                    branch: data.rows[0].branch,
                                    salary_in_words: netSalaryPayableWords,
                                    recipient_id: data.rows[0].recipient_id,
                                    establishment_no: data.rows[0].establishment_no,
                                    bank_name_recoveries: data.rows[0].bank_name_recoveries,
                                });
                            });
                            
                            const loan = {
                                total_ins: 0,
                                ins: 0,
                                rem_amt: 0
                            }

                            res.render("./teacher/pay_slip", {title: "Pay Slip", loan: loan, data: website_data, current_years: current_years[0]});
                        }
                        else{
                            res.send("Invalid Month Choice");
                        }
                    }
                    else{
                        res.send("Data not available");
                    }
                }
                else if(data.rows[0].prev_year + 1 == year){
                    var all_months = {"Jan":0, "Feb":1};
                    var all_months_rev = {0: "Jan", 1: "Feb"};
                    //year: 2019
                    var months_in = ``;
                    var month_priority = all_months[`${month}`];
                    var month_cnt = 0;
                    while(month_cnt <= month_priority){
                        if(month_cnt <= month_priority - 1){
                            months_in += `'${all_months_rev[`${month_cnt}`]}',`;
                        }
                        else{
                            months_in += `'${all_months_rev[`${month_cnt}`]}'`;
                        }
                        month_cnt += 1;
                    }
                    var kgid_cnt = 0;
                    var kgid_total = 0;
                    var gpf_cnt = 0;
                    var gpf_total = 0;
                    var local_recoveries_cnt = 0;
                    var local_recoveries_total = 0;
                    console.log("MOnth sin : ", months_in);
                    query = `select count(slip_kgid_recoveries) cnt, sum(slip_kgid_recoveries) total\
                     from pay_slip_deductions where kgid=$1 and slip_kgid_recoveries>0 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        kgid_cnt = data.rows[0].cnt;
                        kgid_total = data.rows[0].total;
                    });

                    //====

                    query = `select count(gpf_recoveries) gpf_cnt, sum(gpf_recoveries) gpf_total\
                     from pay_slip_deductions where kgid=$1 and gpf_recoveries>0 and year=$2 and month in(${months_in})`;
                     await pool.query(query, [kgid, year]).then((data) => {
                        gpf_cnt = data.rows[0].gpf_cnt;
                        gpf_total = data.rows[0].gpf_total;
                    });

                    query = `select count(local_recoveries) local_recoveries_cnt, sum(local_recoveries) local_recoveries_total\
                     from pay_slip_deductions where kgid=$1 and local_recoveries>0 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        local_recoveries_cnt = data.rows[0].local_recoveries_cnt;
                        local_recoveries_total = data.rows[0].local_recoveries_total;
                    });

                    query = `select count(slip_kgid_recoveries) cnt, sum(slip_kgid_recoveries) total\
                     from pay_slip_deductions where kgid=$1 and slip_kgid_recoveries>0 and year=$2`;
                    await pool.query(query, [kgid, year - 1]).then((data) => {
                        kgid_cnt += parseInt(data.rows[0].cnt);
                        kgid_total += parseInt(data.rows[0].total);
                    });

                    //====

                    query = `select count(gpf_recoveries) gpf_cnt, sum(gpf_recoveries) gpf_total\
                     from pay_slip_deductions where kgid=$1 and gpf_recoveries>0 and year=$2`;
                    await pool.query(query, [kgid, year - 1]).then((data) => {
                        gpf_cnt += parseInt(data.rows[0].gpf_cnt);
                        gpf_total += parseInt(data.rows[0].gpf_total);
                    });

                    query = `select count(local_recoveries) local_recoveries_cnt, sum(local_recoveries) local_recoveries_total\
                     from pay_slip_deductions where kgid=$1 and local_recoveries>0 and year=$2`;
                    await pool.query(query, [kgid, year - 1]).then((data) => {
                        local_recoveries_cnt += parseInt(data.rows[0].local_recoveries_cnt);
                        local_recoveries_total += parseInt(data.rows[0].local_recoveries_total);
                    });

                    var sum_loan = 0;
                    var sum_ins = 0;
                    var sum_loan_gpf = 0;
                    var sum_ins_gpf = 0;
                    var sum_local_recoveries = 0;
                    var sum_ins_local_recoveries = 0;

                    query = `select sum(slip_kgid_loan) sum_loan, sum(slip_kgid_total_ins) sum_ins, sum(gpf_loan) sum_loan_gpf, sum(gpf_total_ins) sum_ins_gpf, \
                    sum(local_recoveries) sum_local_recoveries, sum(local_recoveries_ins) sum_ins_local_recoveries from loan_recoveries where kgid=$1 and year=$2 and month in(${months_in})`;
                    await pool.query(query, [kgid, year]).then((data) => {
                        sum_loan = data.rows[0].sum_loan;
                        sum_ins = data.rows[0].sum_ins;
                        sum_loan_gpf = data.rows[0].sum_loan_gpf;
                        sum_ins_gpf = data.rows[0].sum_ins_gpf;
                        sum_local_recoveries = data.rows[0].sum_local_recoveries;
                        sum_ins_local_recoveries = data.rows[0].sum_ins_local_recoveries;
                    });

                    query = `select sum(slip_kgid_loan) sum_loan, sum(slip_kgid_total_ins) sum_ins, sum(gpf_loan) sum_loan_gpf, sum(gpf_total_ins) sum_ins_gpf, \
                    sum(local_recoveries) sum_local_recoveries, sum(local_recoveries_ins) sum_ins_local_recoveries from loan_recoveries where kgid=$1 and year=$2`;
                    await pool.query(query, [kgid, year - 1]).then((data) => {
                        sum_loan += parseInt(data.rows[0].sum_loan);
                        sum_ins += parseInt(data.rows[0].sum_ins);
                        sum_loan_gpf += parseInt(data.rows[0].sum_loan_gpf);
                        sum_ins_gpf += parseInt(data.rows[0].sum_ins_gpf);
                        sum_local_recoveries += parseInt(data.rows[0].sum_local_recoveries);
                        sum_ins_local_recoveries += parseInt(data.rows[0].sum_ins_local_recoveries);
                    });

                    const loan = {
                        total_ins: sum_ins,
                        ins: kgid_cnt,
                        rem_amt: sum_loan - kgid_total,
                        total_ins_gpf: sum_ins_gpf,
                        ins_gpf: gpf_cnt,
                        rem_amt_gpf: sum_loan_gpf - gpf_total,
                        total_ins_local_recoveries: sum_ins_local_recoveries,
                        ins_local_recoveries: local_recoveries_cnt,
                        rem_amt_local_recoveries: sum_local_recoveries - local_recoveries_total
                    }

                    if(year < new Date().getFullYear()){
                        if(month in all_months){
                            //Provide Data
                            website_data = [];
                            website_data.push({
                                years: [data.rows[0].prev_year, data.rows[0].prev_year + 1]
                            });
                            website_data.push({prev_curr_year: "previous_year"});
                                                        var query ="select * from pay_slip_earnings pse, pay_slip_deductions psd,\
                            staff_bank_details sbd, staff s, loan_recoveries lr where pse.kgid=lr.kgid and pse.kgid=s.kgid and pse.kgid=sbd.kgid and pse.kgid=psd.kgid \
                            and pse.month=psd.month and pse.year=psd.year \
                            and pse.kgid=$1 and pse.year=$2 and pse.month=$3";
                            await pool.query(query, [kgid, year, month]).then(async (data) => {
                                var {da, hra} = await calculateDaHra(data.rows[0].pay);
                                var grossSalary = (data.rows[0].pay) + Math.round(da) + Math.round(hra) + (data.rows[0].ma) + (data.rows[0].fta) + (data.rows[0].cha) + (data.rows[0].pp_sfn);
                                var deductionsSum = (data.rows[0].pt) + (data.rows[0].egis) + (data.rows[0].lic) + (data.rows[0].gpf) + (data.rows[0].it) + (data.rows[0].slip_kgid) + (data.rows[0].slip_kgid_recoveries) + (data.rows[0].gpf_recoveries);
                                var netSalary = grossSalary - deductionsSum;
                                var totalLocalRecoveries = (data.rows[0].local_recoveries);
                                var netSalaryPayable = netSalary - totalLocalRecoveries;
                                var netSalaryPayableWords = netSalaryWords(netSalaryPayable);
                                var dobMonth = "";
                                var nextIncMonth = "";
                                var joiningMonth = "";
                                if(parseInt(data.rows[0].dob.getMonth()) < 9){
                                    dobMonth = "0" + parseInt(data.rows[0].dob.getMonth());
                                }
                                else{
                                    dobMonth = parseInt(data.rows[0].dob.getMonth());
                                }
                                if(parseInt(data.rows[0].next_inc_date.getMonth()) < 9){
                                    nextIncMonth = "0" + parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                else{
                                    nextIncMonth = parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                if(parseInt(data.rows[0].joining_date.getMonth()) < 9){
                                    joiningMonth = "0" + parseInt(data.rows[0].joining_date.getMonth());

                                }
                                else{
                                    joiningMonth = parseInt(data.rows[0].joining_date.getMonth());
                                }
                                website_data.push({
                                    month: data.rows[0].month,
                                    year: data.rows[0].year,
                                    department: data.rows[0].department,
                                    kgid: data.rows[0].kgid,
                                    pran_number: data.rows[0].pran,
                                    ag_code: data.rows[0].ag_code,
                                    staff_name: data.rows[0].name,
                                    gender: data.rows[0].gender,
                                    dob: data.rows[0].dob.getDate() + "/" + dobMonth + "/" + data.rows[0].dob.getFullYear(),
                                    designation: data.rows[0].designation,
                                    ddo_code: data.rows[0].ddo_code,
                                    days_worked: Math.ceil((Math.abs(new Date() - new Date(data.rows[0].joining_date)))/ (1000 * 60 * 60 * 24)),
                                    next_inc_date: data.rows[0].next_inc_date.getDate() + "/" + nextIncMonth + "/" + data.rows[0].next_inc_date.getFullYear(),
                                    joining_date: data.rows[0].joining_date.getDate() + "/" + joiningMonth + "/" + data.rows[0].joining_date.getFullYear(),
                                    group: data.rows[0].staff_group,
                                    head_of_account: data.rows[0].head_of_account,
                                    pan_number: data.rows[0].pan_number,
                                    el_bal: Math.round(data.rows[0].el_bal),
                                    hpl_bal: Math.round(data.rows[0].hpl_bal),
                                    pay_scale: Math.round(data.rows[0].pay_scale_min) + "-" + Math.round(data.rows[0].pay_scale_max),
                                    basic: Math.round(data.rows[0].pay),
                                    stag_count: Math.round(data.rows[0].stag_count),
                                    stag_amt: Math.round(data.rows[0].stag_amt),
                                    pay_fixation_amt: Math.round(data.rows[0].pay_fixation_amt),
                                    da: Math.round(da),
                                    hra: Math.round(hra),
                                    ma: Math.round(data.rows[0].ma),
                                    fta: Math.round(data.rows[0].fta),
                                    cha: Math.round(data.rows[0].cha),
                                    pp_sfn: Math.round(data.rows[0].pp_sfn),
                                    pt: Math.round(data.rows[0].pt),
                                    egis: Math.round(data.rows[0].egis),
                                    lic: Math.round(data.rows[0].lic),
                                    lic_tax: Math.round(data.rows[0].lic_tax),
                                    gpf: Math.round(data.rows[0].gpf),
                                    it: Math.round(data.rows[0].it),
                                    gpf_recoveries: Math.round(data.rows[0].gpf_recoveries),
                                    slip_kgid: Math.round(data.rows[0].slip_kgid),
                                    slip_kgid_recoveries: Math.round(data.rows[0].slip_kgid_recoveries),
                                    local_recoveries: Math.round(data.rows[0].local_recoveries),
                                    gross_salary: Math.round(grossSalary),
                                    deduction_recoveries: Math.round(deductionsSum),
                                    net_salary: Math.round(netSalary),
                                    total_local_recoveries: Math.round(totalLocalRecoveries),
                                    net_payable_salary: Math.round(netSalaryPayable),
                                    payment_mode: data.rows[0].payment_mode,
                                    account_no: data.rows[0].account_no,
                                    bank_name: data.rows[0].bank_name,
                                    branch: data.rows[0].branch,
                                    salary_in_words: netSalaryPayableWords,
                                    recipient_id: data.rows[0].recipient_id,
                                    establishment_no: data.rows[0].establishment_no,
                                    bank_name_recoveries: data.rows[0].bank_name_recoveries,
                                });
                            });
                            
                            const loan = {
                                total_ins: 0,
                                ins: 0,
                                rem_amt: 0
                            }

                            res.render("./teacher/pay_slip", {title: "Pay Slip", loan: loan, data: website_data, current_years: current_years[0]});
                        }
                        else{
                            res.send("Invalid Month Choice");
                        }
                    }
                    else if(year == new Date().getFullYear() && all_months[`${month}`] <= new Date().getMonth()){
                        if(month in all_months){
                            //Provide Data
                            website_data = [];
                            website_data.push({
                                years: [data.rows[0].prev_year, data.rows[0].prev_year + 1]
                            });
                            website_data.push({prev_curr_year: "previous_year"});
                                                        var query ="select * from pay_slip_earnings pse, pay_slip_deductions psd,\
                            staff_bank_details sbd, staff s, loan_recoveries lr where pse.kgid=lr.kgid and pse.kgid=s.kgid and pse.kgid=sbd.kgid and pse.kgid=psd.kgid \
                            and pse.month=psd.month and pse.year=psd.year \
                            and pse.kgid=$1 and pse.year=$2 and pse.month=$3";
                            await pool.query(query, [kgid, year, month]).then(async (data) => {
                                var {da, hra} = await calculateDaHra(data.rows[0].pay);
                                var grossSalary = (data.rows[0].pay) + Math.round(da) + Math.round(hra) + (data.rows[0].ma) + (data.rows[0].fta) + (data.rows[0].cha) + (data.rows[0].pp_sfn);
                                var deductionsSum = (data.rows[0].pt) + (data.rows[0].egis) + (data.rows[0].lic) + (data.rows[0].gpf) + (data.rows[0].it) + (data.rows[0].slip_kgid) + (data.rows[0].slip_kgid_recoveries) + (data.rows[0].gpf_recoveries);
                                var netSalary = grossSalary - deductionsSum;
                                var totalLocalRecoveries = (data.rows[0].local_recoveries);
                                var netSalaryPayable = netSalary - totalLocalRecoveries;
                                var netSalaryPayableWords = netSalaryWords(netSalaryPayable);
                                try {
                                    var dob = "";
                                    dob = data.rows[0].dob.getDate() + "/" + data.rows[0].dob.getMonth() + "/" + data.rows[0].dob.getFullYear();
                                } catch (err) {
                                    
                                }
                                try {
                                    var next_inc_date = "";
                                    next_inc_date = data.rows[0].next_inc_date.getDate() + "/" + data.rows[0].next_inc_date.getMonth() + "/" + data.rows[0].next_inc_date.getFullYear();
                                } catch (err) {
                                    
                                }
                                try {
                                    var joining_date = "";
                                    joining_date = data.rows[0].joining_date.getDate() + "/" + data.rows[0].joining_date.getMonth() + "/" + data.rows[0].joining_date.getFullYear();
                                } catch (err) {
                                    
                                }
                                try {
                                    var days_worked = "";
                                    days_worked = Math.ceil((Math.abs(new Date() - new Date(data.rows[0].joining_date)))/ (1000 * 60 * 60 * 24));
                                } catch (error) {
                                    
                                }
                                var dobMonth = "";
                                var nextIncMonth = "";
                                var joiningMonth = "";
                                if(parseInt(data.rows[0].dob.getMonth()) < 9){
                                    dobMonth = "0" + parseInt(data.rows[0].dob.getMonth());
                                }
                                else{
                                    dobMonth = parseInt(data.rows[0].dob.getMonth());
                                }
                                if(parseInt(data.rows[0].next_inc_date.getMonth()) < 9){
                                    nextIncMonth = "0" + parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                else{
                                    nextIncMonth = parseInt(data.rows[0].next_inc_date.getMonth());
                                }
                                if(parseInt(data.rows[0].joining_date.getMonth()) < 9){
                                    joiningMonth = "0" + parseInt(data.rows[0].joining_date.getMonth());

                                }
                                else{
                                    joiningMonth = parseInt(data.rows[0].joining_date.getMonth());
                                }
                                website_data.push({
                                    month: data.rows[0].month,
                                    year: data.rows[0].year,
                                    department: data.rows[0].department,
                                    kgid: data.rows[0].kgid,
                                    pran_number: data.rows[0].pran,
                                    ag_code: data.rows[0].ag_code,
                                    staff_name: data.rows[0].name,
                                    gender: data.rows[0].gender,
                                    dob: dob,
                                    designation: data.rows[0].designation,
                                    ddo_code: data.rows[0].ddo_code,
                                    days_worked: days_worked,
                                    next_inc_date: next_inc_date,
                                    joining_date: joining_date,
                                    group: data.rows[0].staff_group,
                                    head_of_account: data.rows[0].head_of_account,
                                    pan_number: data.rows[0].pan_number,
                                    el_bal: Math.round(data.rows[0].el_bal),
                                    hpl_bal: Math.round(data.rows[0].hpl_bal),
                                    pay_scale: Math.round(data.rows[0].pay_scale_min) + "-" + Math.round(data.rows[0].pay_scale_max),
                                    basic: Math.round(data.rows[0].pay),
                                    stag_count: Math.round(data.rows[0].stag_count),
                                    stag_amt: Math.round(data.rows[0].stag_amt),
                                    pay_fixation_amt: Math.round(data.rows[0].pay_fixation_amt),
                                    da: Math.round(da),
                                    hra: Math.round(hra),
                                    ma: Math.round(data.rows[0].ma),
                                    fta: Math.round(data.rows[0].fta),
                                    cha: Math.round(data.rows[0].cha),
                                    pp_sfn: Math.round(data.rows[0].pp_sfn),
                                    pt: Math.round(data.rows[0].pt),
                                    egis: Math.round(data.rows[0].egis),
                                    lic: Math.round(data.rows[0].lic),
                                    lic_tax: Math.round(data.rows[0].lic_tax),
                                    gpf: Math.round(data.rows[0].gpf),
                                    it: Math.round(data.rows[0].it),
                                    gpf_recoveries: Math.round(data.rows[0].gpf_recoveries),
                                    slip_kgid: Math.round(data.rows[0].slip_kgid),
                                    slip_kgid_recoveries: Math.round(data.rows[0].slip_kgid_recoveries),
                                    local_recoveries: Math.round(data.rows[0].local_recoveries),
                                    gross_salary: Math.round(grossSalary),
                                    deduction_recoveries: Math.round(deductionsSum),
                                    net_salary: Math.round(netSalary),
                                    total_local_recoveries: Math.round(totalLocalRecoveries),
                                    net_payable_salary: Math.round(netSalaryPayable),
                                    payment_mode: data.rows[0].payment_mode,
                                    account_no: data.rows[0].account_no,
                                    bank_name: data.rows[0].bank_name,
                                    branch: data.rows[0].branch,
                                    salary_in_words: netSalaryPayableWords,
                                    recipient_id: data.rows[0].recipient_id,
                                    establishment_no: data.rows[0].establishment_no,
                                    bank_name_recoveries: data.rows[0].bank_name_recoveries,
                                });
                            });
                            
                            const loan = {
                                total_ins: 0,
                                ins: 0,
                                rem_amt: 0
                            }

                            res.render("./teacher/pay_slip", {title: "Pay Slip", loan: loan, data: website_data, current_years: current_years[0]});
                        }
                        else{
                            res.send("Invalid Month Choice");
                        }
                    }
                    else{
                        res.send("Data not available");
                    }
                }
                else{
                    res.send("invalid Year");
                }
            });
        } catch (err) {
            console.log(err);
            res.send("Data not available");
        }
    }
    else{
        res.send("Invalid Year!!!");
    }
}

module.exports = {
    getPaySlip: getPaySlip,
    getPaySlipValues: getPaySlipValues
}