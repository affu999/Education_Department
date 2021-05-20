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

//Get Pay Slip Earnings Calculations
const getPaySlipEarnings = async (year, kgid) => {
    var gross_sal = 0;
    var da = 0;
    var hra = 0;
    // var query = "select sum(pay)+sum(ir)+sum(sa)+sum(ma)+sum(ra)+sum(fta)+sum(pp)+sum(pay*11.25/100)+sum(pay*8/100) gross_sal from pay_slip_earnings where month not in(\
        // 'Jan', 'Feb') and year=$1 and kgid=$2";

    var query = "select *,pay+ir+sa+ma+ra+fta+pp gross_sal from pay_slip_earnings where month not in('Jan', 'Feb') and year=$1 and kgid=$2";
    
    await pool.query(query, [year, kgid]).then((data) => {
        console.log("Gross Sal from db: " + data.rows[0].gross_sal);
        if(!isNaN(data.rows[0].gross_sal)){
            //New Code
            data.rows.map((value) => {
                da = Math.round(value.pay * 11.25 / 100);
                hra = Math.round(value.pay * 8 / 100);
                value.gross_sal = value.gross_sal + da;
                value.gross_sal += hra;
                gross_sal += Math.round(value.gross_sal);
            });
            //New Code End
            // gross_sal += Math.round(data.rows[0].gross_sal);
        }
        console.log("Gross Sal:" + gross_sal);
    });


    var query = "select *,pay+ir+sa+ma+ra+fta+pp gross_sal from pay_slip_earnings where month in(\
        'Jan', 'Feb') and year=$1 and kgid=$2";
    
    await pool.query(query, [year + 1, kgid]).then((data) => {
        console.log("Gross Sal from db: " + data.rows[0].gross_sal);

        if(!isNaN(data.rows[0].gross_sal) && data.rows[0].gross_sal != null){
            data.rows.map((value) => {
                da = Math.round(value.pay * 11.25 / 100);
                hra = Math.round(value.pay * 8 / 100);
                value.gross_sal = value.gross_sal + da;
                value.gross_sal += hra;
                gross_sal += Math.round(value.gross_sal);
            });
            // gross_sal += Math.round(data.rows[0].gross_sal);
        }
    });

    console.log("Gross SAl" + gross_sal);

    return {gross_sal: gross_sal};
}

//Get Pay Slip Deductions Calculations
const getPaySlipDeductions = async (year, kgid) => {
    var pt = 000;
    var egis = 000;
    var lic = 000;
    var slip_kgid = 000;
    var gpf = 000;
    var nps = 000;

    var query = "select sum(pt) pt, sum(egis) egis, sum(lic) lic, sum(slip_kgid) slip_kgid, \
    sum(gpf) gpf, sum(nps) nps from pay_slip_deductions where month not in(\
        'Jan', 'Feb') and year=$1 and kgid=$2";
    await pool.query(query, [year, kgid]).then((data) => {
        if(!isNaN(data.rows[0].pt)){
            pt += Math.round(data.rows[0].pt);
            egis += Math.round(data.rows[0].egis);
            lic += Math.round(data.rows[0].lic);
            slip_kgid += Math.round(data.rows[0].slip_kgid);
            gpf += Math.round(data.rows[0].gpf);
            nps += Math.round(data.rows[0].nps);
        }
    });

    query = "select sum(pt) pt, sum(egis) egis, sum(lic) lic, sum(slip_kgid) slip_kgid, \
    sum(gpf) gpf, sum(nps) nps from pay_slip_deductions where month in(\
        'Jan', 'Feb') and year=$1 and kgid=$2";
    await pool.query(query, [year + 1, kgid]).then((data) => {
        //console.log("Deductions Data here: ");
        //console.log(data.rows);
        if(!isNaN(data.rows[0].pt) && data.rows[0].pt != null){
            pt += Math.round(data.rows[0].pt);
            egis += Math.round(data.rows[0].egis);
            lic += Math.round(data.rows[0].lic);
            slip_kgid += Math.round(data.rows[0].slip_kgid);
            gpf += Math.round(data.rows[0].gpf);
            nps += Math.round(data.rows[0].nps);
        }
    });

    return {pt: pt, egis: egis, lic: lic, slip_kgid: slip_kgid, gpf: gpf, nps: nps};
}

//Get Admin Tax Update, Staff and Staff Bank Details
const getAdminTaxUpdates = async (year, kgid) => {
    //console.log(year, kgid)
    var query = "select * from staff s, staff_bank_details sbd, admin_tax_updates atu, other_savings os where \
    s.kgid = sbd.kgid and s.kgid=atu.kgid and s.kgid=os.kgid and atu.year=$1 and atu.month='Feb' and s.kgid=$2 and os.year=$3";
    var taxValues = "";
    await pool.query(query, [year + 1, kgid, year + 1]).then((data) => {
        //console.log(data.rows);
        taxValues = data.rows[0];
    });
    //console.log(taxValues);
    return taxValues;
}

//Get Website Data Values
const getWebsiteDataValues = (pse, psd, taxValues) => {
    //console.log("Gross Income BAl: ", taxValues.hra_recieved, taxValues.rent_paid, taxValues.pay_40_percent);
    var gross_income_bal = Math.round(taxValues.hra_recieved) + Math.round(taxValues.rent_paid) + Math.round(taxValues.pay_40_percent);
    //console.log(gross_income_bal);
    var gross_income_bal_sum = Math.round(pse.gross_sal) - gross_income_bal;
    var income_chargeable = Math.round(taxValues.standard_deduction) + Math.round(psd.pt);
    var income_chargeable_sum = Math.round(pse.gross_sal) - gross_income_bal - income_chargeable;
    var other_income = Math.round(taxValues.interest_nsc) + Math.round(taxValues.interest_bank_deposit) + Math.round(taxValues.other_charges);
    var other_income_sum = income_chargeable_sum + other_income;
    var house_property  = Math.round(taxValues.gross_rent) - Math.round(taxValues.tax_paid_authorities);
    var house_property_sum = other_income_sum + house_property;
    var net_house_property = Math.round(taxValues.annual_value) + Math.round(taxValues.interest_borrowed_capital);
    var gross_total_income =  house_property_sum - net_house_property;
    var deductions_under_chapter = Math.round(taxValues.us_80ccd) + Math.round(taxValues.us_80e) + 0 + Math.round(taxValues.us_80u);
    var deductions_under_chapter_sum = gross_total_income - deductions_under_chapter;
    
    var egis_sum = Math.round(psd.egis) + Math.round(taxValues.gis_private);
    var lic_sum = Math.round(psd.lic) + Math.round(taxValues.lic_other);
    var kgid_sum = Math.round(psd.slip_kgid) + Math.round(taxValues.kgid_slip_private);
    var gpf_sum = Math.round(psd.gpf) + Math.round(taxValues.gpf_private);
    var nps_sum = Math.round(psd.nps) + Math.round(taxValues.nps_private);
    var pli_sum = Math.round(taxValues.pli) + Math.round(taxValues.pli_other);
    var tution_fee_sum = Math.round(taxValues.tution_fee) + Math.round(taxValues.tution_fee_other);
    var uti_ulpi_sum = Math.round(taxValues.uti_ulpi) + Math.round(taxValues.uti_ulpi_other);
    var sukanya_sum = Math.round(taxValues.sukanya_samruddhi) + Math.round(taxValues.sukanya_other);
    var housing_loan_sum = Math.round(taxValues.housing_loan_repay) + Math.round(taxValues.housing_loan_private);
    var us_80_total_salaried = Math.round(psd.egis) + Math.round(psd.lic) + Math.round(psd.slip_kgid) + Math.round(psd.gpf) + Math.round(psd.nps) + Math.round(taxValues.pli) + Math.round(taxValues.tution_fee) + Math.round(taxValues.uti_ulpi) + Math.round(taxValues.sukanya_samruddhi) + Math.round(taxValues.housing_loan_repay);
    var us_80_total_private = Math.round(taxValues.gis_private) + Math.round(taxValues.lic_other) + Math.round(taxValues.kgid_slip_private) + Math.round(taxValues.gpf_private) + Math.round(taxValues.nps_private) + Math.round(taxValues.pli_other) + Math.round(taxValues.tution_fee_other) + Math.round(taxValues.uti_ulpi_other) + Math.round(taxValues.sukanya_other) + Math.round(taxValues.housing_loan_private);
    var us_80_total_sum = us_80_total_salaried + us_80_total_private;

    //Total Taxable Income
    if(us_80_total_sum > 150000){
        var totalTaxableIncome = deductions_under_chapter_sum - 150000;
    }
    else if(us_80_total_sum <= 150000){
        var totalTaxableIncome = deductions_under_chapter_sum - us_80_total_sum;
    }

    //Tax on Total Income
    var taxOnTotalIncome = 0;
    if(totalTaxableIncome < 250000){
        taxOnTotalIncome = 0;
    }
    else if(totalTaxableIncome < 500000){
        taxOnTotalIncome = (totalTaxableIncome - 250001) * 0.05;
    }
    else if(totalTaxableIncome < 750000){
        taxOnTotalIncome = (totalTaxableIncome - 500001) * 0.1 + 12500;
    }
    else if(totalTaxableIncome < 1000000){
        taxOnTotalIncome = (totalTaxableIncome - 750001) * 0.15 + 37500;
    }
    else if(totalTaxableIncome < 1250000){
        taxOnTotalIncome = (totalTaxableIncome - 1000001) * 0.2 + 75000;
    }

    //Tax Amount Distro
    var temp_total_taxable_income = totalTaxableIncome;
    var tax_amt_distro_0 = 0;
    var tax_amt_distro_5 = 0;
    var tax_amt_distro_20 = 0;
    var tax_amt_distro_20_2 = 0;
    var tax_amt_distro_30 = 0;

    if(temp_total_taxable_income >= 250000){
        temp_total_taxable_income -= 250000;
        tax_amt_distro_0 = 250000;
    }
    else{
        tax_amt_distro_0 = temp_total_taxable_income;
        temp_total_taxable_income = 0;
    }
    if(temp_total_taxable_income >= 250000){
        temp_total_taxable_income -= 250000;
        tax_amt_distro_5 = 250000;
    }
    else{
        tax_amt_distro_5 = temp_total_taxable_income;
        temp_total_taxable_income = 0;
    }
    if(temp_total_taxable_income >= 250000){
        temp_total_taxable_income -= 250000;
        tax_amt_distro_20 = 250000;
    }
    else{
        tax_amt_distro_20 = temp_total_taxable_income;
        temp_total_taxable_income = 0;
    }
    if(temp_total_taxable_income >= 250000){
        temp_total_taxable_income -= 250000;
        tax_amt_distro_20_2 = 250000;
    }
    else{
        tax_amt_distro_20_2 = temp_total_taxable_income;
        temp_total_taxable_income = 0;
    }
    if(temp_total_taxable_income >= 250000){
        temp_total_taxable_income -= 250000;
        tax_amt_distro_30 = 250000;
    }
    else{
        tax_amt_distro_30 = temp_total_taxable_income;
        temp_total_taxable_income = 0;
    }

    var tax_amt_distro_0_tax = tax_amt_distro_0 * 0;
    var tax_amt_distro_5_tax = tax_amt_distro_5 * 0.05;
    var tax_amt_distro_20_tax = tax_amt_distro_20 * 0.1;
    var tax_amt_distro_20_2_tax = tax_amt_distro_20_2 * 0.15;
    var tax_amt_distro_30_tax = tax_amt_distro_30 * 0.2;

    var tax_after_rebate = (tax_amt_distro_5_tax + tax_amt_distro_20_tax + tax_amt_distro_20_2_tax + tax_amt_distro_30_tax) - taxValues.tax_rebate;

    var health_education = tax_after_rebate * 0.04;

    var tax_payable = tax_after_rebate + health_education;

    return {
        gross_income_bal: gross_income_bal,
        gross_income_bal_sum: gross_income_bal_sum,
        income_chargeable: income_chargeable,
        income_chargeable_sum: income_chargeable_sum,
        other_income: other_income,
        other_income_sum: other_income_sum,
        house_property: house_property,
        house_property_sum: house_property_sum,
        net_house_property: net_house_property,
        gross_total_income: gross_total_income,
        deductions_under_chapter: deductions_under_chapter,
        deductions_under_chapter_sum: deductions_under_chapter_sum,
        egis_sum: egis_sum,
        lic_sum: lic_sum,
        kgid_sum: kgid_sum,
        gpf_sum: gpf_sum,
        nps_sum: nps_sum,
        pli_sum: pli_sum,
        tution_fee_sum: tution_fee_sum,
        uti_ulpi_sum: uti_ulpi_sum,
        sukanya_sum: sukanya_sum,
        housing_loan_sum: housing_loan_sum,
        us_80_total_salaried: us_80_total_salaried,
        us_80_total_private: us_80_total_private,
        us_80_total_sum: us_80_total_sum,
        totalTaxableIncome: totalTaxableIncome,
        taxOnTotalIncome: taxOnTotalIncome,
        tax_amt_distro_0: tax_amt_distro_0,
        tax_amt_distro_5: tax_amt_distro_5,
        tax_amt_distro_20: tax_amt_distro_20,
        tax_amt_distro_20_2: tax_amt_distro_20_2,
        tax_amt_distro_30: tax_amt_distro_30,
        tax_amt_distro_0_tax: tax_amt_distro_0_tax,
        tax_amt_distro_5_tax: tax_amt_distro_5_tax,
        tax_amt_distro_20_tax: tax_amt_distro_20_tax,
        tax_amt_distro_20_2_tax: tax_amt_distro_20_2_tax,
        tax_amt_distro_30_tax: tax_amt_distro_30_tax,
        tax_after_rebate: tax_after_rebate,
        health_education: health_education,
        tax_payable: tax_payable
    }
}

//Get Tax Form Page
const getTaxForm = async (req, res) => {
    const kgid = req.session.kgid;
    const current_years = await getCurrPrevYears();
    const prevCurrYear = req.params.prev_curr_year;
    if(prevCurrYear == "previous_year"){
        try {
            var query = "select * from current_years";
            var websiteData = []
            await pool.query(query).then(async (data) => {
                var query = "select enable_disable from admin_tax_updates where year=$1 and kgid=$2";
                var year = data.rows[0].prev_year;
                await pool.query(query, [data.rows[0].prev_year + 1, kgid]).then(async (data) => {
                    if(data.rows[0].enable_disable == 1){
                        //Get Pay Slip Earning Calculations
                        var pse = await getPaySlipEarnings(year, kgid);
                        //Pay Slip Deduction Calculations
                        var psd = await getPaySlipDeductions(year, kgid);
                        //Get Admin Tax Update, Staff, Staff Bank Details
                        var taxValues = await getAdminTaxUpdates(year, kgid);
                        // //console.log("US 80e " + taxValues.us_80e);
                        //Get Website Data Values
                        var {
                            gross_income_bal,
                            gross_income_bal_sum,
                            income_chargeable,
                            income_chargeable_sum,
                            other_income,
                            other_income_sum,
                            house_property,
                            house_property_sum,
                            net_house_property,
                            gross_total_income,
                            deductions_under_chapter,
                            deductions_under_chapter_sum,
                            egis_sum,
                            lic_sum,
                            kgid_sum,
                            gpf_sum,
                            nps_sum,
                            pli_sum,
                            tution_fee_sum,
                            uti_ulpi_sum,
                            sukanya_sum,
                            housing_loan_sum,
                            us_80_total_salaried,
                            us_80_total_private,
                            us_80_total_sum,
                            totalTaxableIncome,
                            taxOnTotalIncome,
                            tax_amt_distro_0,
                            tax_amt_distro_5,
                            tax_amt_distro_20,
                            tax_amt_distro_20_2,
                            tax_amt_distro_30,
                            tax_amt_distro_0_tax,
                            tax_amt_distro_5_tax,
                            tax_amt_distro_20_tax,
                            tax_amt_distro_20_2_tax,
                            tax_amt_distro_30_tax,
                            tax_after_rebate,
                            health_education,
                            tax_payable
                        } = getWebsiteDataValues(pse, psd, taxValues);
                        websiteData.push({
                            gross_sal: pse.gross_sal,
                            hra_recieved: Math.round(taxValues.hra_recieved),
                            rent_paid: Math.round(taxValues.rent_paid),
                            pay_40_percent: Math.round(taxValues.pay_40_percent),
                            gross_income_bal: Math.round(gross_income_bal),
                            gross_income_bal_sum: Math.round(gross_income_bal_sum),
                            standard_deduction: Math.round(taxValues.standard_deduction),
                            pt: Math.round(psd.pt),
                            income_chargeable: Math.round(income_chargeable),
                            income_chargeable_sum: Math.round(income_chargeable_sum),
                            interest_nsc: Math.round(taxValues.interest_nsc),
                            interest_bank_deposit: Math.round(taxValues.interest_bank_deposit),
                            other_charges: Math.round(taxValues.other_charges),
                            other_income_sum: Math.round(other_income_sum),
                            other_income: Math.round(other_income),
                            gross_rent: Math.round(taxValues.gross_rent),
                            tax_paid_authorities: Math.round(taxValues.tax_paid_authorities),
                            house_property: Math.round(house_property),
                            house_property_sum: Math.round(house_property_sum),
                            annual_value: Math.round(taxValues.annual_value),
                            interest_borrowed_capital: Math.round(taxValues.interest_borrowed_capital),
                            net_house_property: Math.round(net_house_property),
                            gross_total_income: Math.round(gross_total_income),
                            us_80e: Math.round(taxValues.us_80e),
                            us_80u: Math.round(taxValues.us_80u),
                            us_80ccd: Math.round(taxValues.us_80ccd),
                            us_80g: Math.round(0),
                            deductions_under_chapter: Math.round(deductions_under_chapter),
                            deductions_under_chapter_sum: Math.round(deductions_under_chapter_sum),
                            egis: Math.round(psd.egis),
                            gis_private: Math.round(taxValues.gis_private),
                            lic: Math.round(psd.lic),
                            slip_kgid: Math.round(psd.slip_kgid),
                            gpf: Math.round(psd.gpf),
                            nps: Math.round(psd.nps),
                            pli: Math.round(taxValues.pli),
                            tution_fee: Math.round(taxValues.tution_fee),
                            uti_ulpi: Math.round(taxValues.uti_ulpi),
                            sukanya_samruddhi: Math.round(taxValues.sukanya_samruddhi),
                            housing_loan_repay: Math.round(taxValues.housing_loan_repay),
                            lic_other: Math.round(taxValues.lic_other),
                            kgid_slip_private: Math.round(taxValues.kgid_slip_private),
                            gpf_private: Math.round(taxValues.gpf_private),
                            nps_private: Math.round(taxValues.nps_private),
                            pli_other: Math.round(taxValues.pli_other),
                            tution_fee_other: Math.round(taxValues.tution_fee_other),
                            uti_ulpi_other: Math.round(taxValues.uti_ulpi_other),
                            sukanya_other: Math.round(taxValues.sukanya_other),
                            housing_loan_private: Math.round(taxValues.housing_loan_private),
                            egis_sum: Math.round(egis_sum),
                            lic_sum: Math.round(lic_sum),
                            kgid_sum: Math.round(kgid_sum),
                            gpf_sum: Math.round(gpf_sum),
                            nps_sum: Math.round(nps_sum),
                            pli_sum: Math.round(pli_sum),
                            tution_fee_sum: Math.round(tution_fee_sum),
                            uti_ulpi_sum: Math.round(uti_ulpi_sum),
                            sukanya_sum: Math.round(sukanya_sum),
                            housing_loan_sum: Math.round(housing_loan_sum),
                            us_80_total_salaried: Math.round(us_80_total_salaried),
                            us_80_total_private: Math.round(us_80_total_private),
                            us_80_total_sum: Math.round(us_80_total_sum),
                            totalTaxableIncome: Math.round(totalTaxableIncome),
                            taxOnTotalIncome: Math.round(taxOnTotalIncome),
                            tax_amt_distro_0: Math.round(tax_amt_distro_0),
                            tax_amt_distro_5: Math.round(tax_amt_distro_5),
                            tax_amt_distro_20: Math.round(tax_amt_distro_20),
                            tax_amt_distro_20_2: Math.round(tax_amt_distro_20_2),
                            tax_amt_distro_30: Math.round(tax_amt_distro_30),
                            tax_amt_distro_0_tax: Math.round(tax_amt_distro_0_tax),
                            tax_amt_distro_5_tax: Math.round(tax_amt_distro_5_tax),
                            tax_amt_distro_20_tax: Math.round(tax_amt_distro_20_tax),
                            tax_amt_distro_20_2_tax: Math.round(tax_amt_distro_20_2_tax),
                            tax_amt_distro_30_tax: Math.round(tax_amt_distro_30_tax),
                            tax_rebate: Math.round(taxValues.tax_rebate),
                            tax_after_rebate: Math.round(tax_after_rebate),
                            surcharge: Math.round(taxValues.surcharge),
                            health_education: Math.round(health_education),
                            tax_payable: Math.round(tax_payable),
                            relief_sec89: Math.round(taxValues.relief_sec89),
                            net_tax_payable: Math.round(tax_payable - taxValues.relief_sec89)
                        });
                        var query = "select s.name, s.school_name, sbd.pan_number from staff s, staff_bank_details sbd \
                        where s.kgid=sbd.kgid and s.kgid=$1";
                        staff_details = [];
                        await pool.query(query, [kgid]).then((data) => {
                            staff_details.push(data.rows[0]);
                        });
                        staff_details[0].assessment_year = year + 1;
                        //console.log(staff_details);
                        res.render("./teacher/tax_form", {title:"Tax Form", data:websiteData, staff_details: staff_details[0], current_years: current_years[0]});
                    }
                    else if(data.rows[0].enable_disable == 0){
                        res.send("Tax Form has not been updated yet!!!");
                    }
                    else{
                        res.send("Tax Form has not been updated yet!!!");
                    }
                });
            });
        } catch (err) {
            //console.log(err);
            res.send("Tax Form has not been updated yet!!!");
        }
    }
    else if(prevCurrYear == "previous_year_2"){
        try {
            var query = "select * from current_years";
            var websiteData = []
            await pool.query(query).then(async (data) => {
                var query = "select enable_disable from admin_tax_updates where year=$1 and kgid=$2";
                var year = data.rows[0].prev_year_2;
                await pool.query(query, [data.rows[0].prev_year_2 + 1, kgid]).then(async (data) => {
                    if(data.rows[0].enable_disable == 1){
                        //Get Pay Slip Earning Calculations
                        var pse = await getPaySlipEarnings(year, kgid);
                        //Pay Slip Deduction Calculations
                        var psd = await getPaySlipDeductions(year, kgid);
                        //Get Admin Tax Update, Staff, Staff Bank Details
                        var taxValues = await getAdminTaxUpdates(year, kgid);
                        // //console.log("US 80e " + taxValues.us_80e);
                        //Get Website Data Values
                        var {
                            gross_income_bal,
                            gross_income_bal_sum,
                            income_chargeable,
                            income_chargeable_sum,
                            other_income,
                            other_income_sum,
                            house_property,
                            house_property_sum,
                            net_house_property,
                            gross_total_income,
                            deductions_under_chapter,
                            deductions_under_chapter_sum,
                            egis_sum,
                            lic_sum,
                            kgid_sum,
                            gpf_sum,
                            nps_sum,
                            pli_sum,
                            tution_fee_sum,
                            uti_ulpi_sum,
                            sukanya_sum,
                            housing_loan_sum,
                            us_80_total_salaried,
                            us_80_total_private,
                            us_80_total_sum,
                            totalTaxableIncome,
                            taxOnTotalIncome,
                            tax_amt_distro_0,
                            tax_amt_distro_5,
                            tax_amt_distro_20,
                            tax_amt_distro_20_2,
                            tax_amt_distro_30,
                            tax_amt_distro_0_tax,
                            tax_amt_distro_5_tax,
                            tax_amt_distro_20_tax,
                            tax_amt_distro_20_2_tax,
                            tax_amt_distro_30_tax,
                            tax_after_rebate,
                            health_education,
                            tax_payable
                        } = getWebsiteDataValues(pse, psd, taxValues);
                        websiteData.push({
                            gross_sal: pse.gross_sal,
                            hra_recieved: Math.round(taxValues.hra_recieved),
                            rent_paid: Math.round(taxValues.rent_paid),
                            pay_40_percent: Math.round(taxValues.pay_40_percent),
                            gross_income_bal: Math.round(gross_income_bal),
                            gross_income_bal_sum: Math.round(gross_income_bal_sum),
                            standard_deduction: Math.round(taxValues.standard_deduction),
                            pt: Math.round(psd.pt),
                            income_chargeable: Math.round(income_chargeable),
                            income_chargeable_sum: Math.round(income_chargeable_sum),
                            interest_nsc: Math.round(taxValues.interest_nsc),
                            interest_bank_deposit: Math.round(taxValues.interest_bank_deposit),
                            other_charges: Math.round(taxValues.other_charges),
                            other_income_sum: Math.round(other_income_sum),
                            other_income: Math.round(other_income),
                            gross_rent: Math.round(taxValues.gross_rent),
                            tax_paid_authorities: Math.round(taxValues.tax_paid_authorities),
                            house_property: Math.round(house_property),
                            house_property_sum: Math.round(house_property_sum),
                            annual_value: Math.round(taxValues.annual_value),
                            interest_borrowed_capital: Math.round(taxValues.interest_borrowed_capital),
                            net_house_property: Math.round(net_house_property),
                            gross_total_income: Math.round(gross_total_income),
                            us_80e: Math.round(taxValues.us_80e),
                            us_80u: Math.round(taxValues.us_80u),
                            us_80ccd: Math.round(taxValues.us_80ccd),
                            us_80g: Math.round(0),
                            deductions_under_chapter: Math.round(deductions_under_chapter),
                            deductions_under_chapter_sum: Math.round(deductions_under_chapter_sum),
                            egis: Math.round(psd.egis),
                            gis_private: Math.round(taxValues.gis_private),
                            lic: Math.round(psd.lic),
                            slip_kgid: Math.round(psd.slip_kgid),
                            gpf: Math.round(psd.gpf),
                            nps: Math.round(psd.nps),
                            pli: Math.round(taxValues.pli),
                            tution_fee: Math.round(taxValues.tution_fee),
                            uti_ulpi: Math.round(taxValues.uti_ulpi),
                            sukanya_samruddhi: Math.round(taxValues.sukanya_samruddhi),
                            housing_loan_repay: Math.round(taxValues.housing_loan_repay),
                            lic_other: Math.round(taxValues.lic_other),
                            kgid_slip_private: Math.round(taxValues.kgid_slip_private),
                            gpf_private: Math.round(taxValues.gpf_private),
                            nps_private: Math.round(taxValues.nps_private),
                            pli_other: Math.round(taxValues.pli_other),
                            tution_fee_other: Math.round(taxValues.tution_fee_other),
                            uti_ulpi_other: Math.round(taxValues.uti_ulpi_other),
                            sukanya_other: Math.round(taxValues.sukanya_other),
                            housing_loan_private: Math.round(taxValues.housing_loan_private),
                            egis_sum: Math.round(egis_sum),
                            lic_sum: Math.round(lic_sum),
                            kgid_sum: Math.round(kgid_sum),
                            gpf_sum: Math.round(gpf_sum),
                            nps_sum: Math.round(nps_sum),
                            pli_sum: Math.round(pli_sum),
                            tution_fee_sum: Math.round(tution_fee_sum),
                            uti_ulpi_sum: Math.round(uti_ulpi_sum),
                            sukanya_sum: Math.round(sukanya_sum),
                            housing_loan_sum: Math.round(housing_loan_sum),
                            us_80_total_salaried: Math.round(us_80_total_salaried),
                            us_80_total_private: Math.round(us_80_total_private),
                            us_80_total_sum: Math.round(us_80_total_sum),
                            totalTaxableIncome: Math.round(totalTaxableIncome),
                            taxOnTotalIncome: Math.round(taxOnTotalIncome),
                            tax_amt_distro_0: Math.round(tax_amt_distro_0),
                            tax_amt_distro_5: Math.round(tax_amt_distro_5),
                            tax_amt_distro_20: Math.round(tax_amt_distro_20),
                            tax_amt_distro_20_2: Math.round(tax_amt_distro_20_2),
                            tax_amt_distro_30: Math.round(tax_amt_distro_30),
                            tax_amt_distro_0_tax: Math.round(tax_amt_distro_0_tax),
                            tax_amt_distro_5_tax: Math.round(tax_amt_distro_5_tax),
                            tax_amt_distro_20_tax: Math.round(tax_amt_distro_20_tax),
                            tax_amt_distro_20_2_tax: Math.round(tax_amt_distro_20_2_tax),
                            tax_amt_distro_30_tax: Math.round(tax_amt_distro_30_tax),
                            tax_rebate: Math.round(taxValues.tax_rebate),
                            tax_after_rebate: Math.round(tax_after_rebate),
                            surcharge: Math.round(taxValues.surcharge),
                            health_education: Math.round(health_education),
                            tax_payable: Math.round(tax_payable),
                            relief_sec89: Math.round(taxValues.relief_sec89),
                            net_tax_payable: Math.round(tax_payable - taxValues.relief_sec89)
                        });
                        var query = "select s.name, s.school_name, sbd.pan_number from staff s, staff_bank_details sbd \
                        where s.kgid=sbd.kgid and s.kgid=$1";
                        staff_details = [];
                        await pool.query(query, [kgid]).then((data) => {
                            staff_details.push(data.rows[0]);
                        });
                        staff_details[0].assessment_year = year + 1;
                        //console.log(staff_details);
                        res.render("./teacher/tax_form", {title:"Tax Form", data:websiteData, staff_details: staff_details[0], current_years: current_years[0]});
                    }
                    else if(data.rows[0].enable_disable == 0){
                        res.send("Tax Form has not been updated yet!!!");
                    }
                    else{
                        res.send("Tax Form has not been updated yet!!!");
                    }
                });
            });
        } catch (err) {
            console.log(err);
            res.send("Tax Form has not been updated yet!!!");
        }
    }
    else if(prevCurrYear == "current_year"){
        try {
            var query = "select * from current_years";
            var websiteData = []
            await pool.query(query).then(async (data) => {
                var query = "select enable_disable from admin_tax_updates where year=$1 and kgid=$2";
                var year = data.rows[0].curr_year;
                await pool.query(query, [data.rows[0].curr_year + 1, kgid]).then(async (data) => {
                    if(data.rows[0].enable_disable == 1){
                        //Get Pay Slip Earning Calculations
                        var pse = await getPaySlipEarnings(year, kgid);
                        //Pay Slip Deduction Calculations
                        var psd = await getPaySlipDeductions(year, kgid);
                        //Get Admin Tax Update, Staff, Staff Bank Details
                        var taxValues = await getAdminTaxUpdates(year, kgid);
                        // //console.log("US 80e " + taxValues.us_80e);
                        //Get Website Data Values
                        var {
                            gross_income_bal,
                            gross_income_bal_sum,
                            income_chargeable,
                            income_chargeable_sum,
                            other_income,
                            other_income_sum,
                            house_property,
                            house_property_sum,
                            net_house_property,
                            gross_total_income,
                            deductions_under_chapter,
                            deductions_under_chapter_sum,
                            egis_sum,
                            lic_sum,
                            kgid_sum,
                            gpf_sum,
                            nps_sum,
                            pli_sum,
                            tution_fee_sum,
                            uti_ulpi_sum,
                            sukanya_sum,
                            housing_loan_sum,
                            us_80_total_salaried,
                            us_80_total_private,
                            us_80_total_sum,
                            totalTaxableIncome,
                            taxOnTotalIncome,
                            tax_amt_distro_0,
                            tax_amt_distro_5,
                            tax_amt_distro_20,
                            tax_amt_distro_20_2,
                            tax_amt_distro_30,
                            tax_amt_distro_0_tax,
                            tax_amt_distro_5_tax,
                            tax_amt_distro_20_tax,
                            tax_amt_distro_20_2_tax,
                            tax_amt_distro_30_tax,
                            tax_after_rebate,
                            health_education,
                            tax_payable
                        } = getWebsiteDataValues(pse, psd, taxValues);
                        websiteData.push({
                            gross_sal: pse.gross_sal,
                            hra_recieved: Math.round(taxValues.hra_recieved),
                            rent_paid: Math.round(taxValues.rent_paid),
                            pay_40_percent: Math.round(taxValues.pay_40_percent),
                            gross_income_bal: Math.round(gross_income_bal),
                            gross_income_bal_sum: Math.round(gross_income_bal_sum),
                            standard_deduction: Math.round(taxValues.standard_deduction),
                            pt: Math.round(psd.pt),
                            income_chargeable: Math.round(income_chargeable),
                            income_chargeable_sum: Math.round(income_chargeable_sum),
                            interest_nsc: Math.round(taxValues.interest_nsc),
                            interest_bank_deposit: Math.round(taxValues.interest_bank_deposit),
                            other_charges: Math.round(taxValues.other_charges),
                            other_income_sum: Math.round(other_income_sum),
                            other_income: Math.round(other_income),
                            gross_rent: Math.round(taxValues.gross_rent),
                            tax_paid_authorities: Math.round(taxValues.tax_paid_authorities),
                            house_property: Math.round(house_property),
                            house_property_sum: Math.round(house_property_sum),
                            annual_value: Math.round(taxValues.annual_value),
                            interest_borrowed_capital: Math.round(taxValues.interest_borrowed_capital),
                            net_house_property: Math.round(net_house_property),
                            gross_total_income: Math.round(gross_total_income),
                            us_80e: Math.round(taxValues.us_80e),
                            us_80u: Math.round(taxValues.us_80u),
                            us_80ccd: Math.round(taxValues.us_80ccd),
                            us_80g: Math.round(0),
                            deductions_under_chapter: Math.round(deductions_under_chapter),
                            deductions_under_chapter_sum: Math.round(deductions_under_chapter_sum),
                            egis: Math.round(psd.egis),
                            gis_private: Math.round(taxValues.gis_private),
                            lic: Math.round(psd.lic),
                            slip_kgid: Math.round(psd.slip_kgid),
                            gpf: Math.round(psd.gpf),
                            nps: Math.round(psd.nps),
                            pli: Math.round(taxValues.pli),
                            tution_fee: Math.round(taxValues.tution_fee),
                            uti_ulpi: Math.round(taxValues.uti_ulpi),
                            sukanya_samruddhi: Math.round(taxValues.sukanya_samruddhi),
                            housing_loan_repay: Math.round(taxValues.housing_loan_repay),
                            lic_other: Math.round(taxValues.lic_other),
                            kgid_slip_private: Math.round(taxValues.kgid_slip_private),
                            gpf_private: Math.round(taxValues.gpf_private),
                            nps_private: Math.round(taxValues.nps_private),
                            pli_other: Math.round(taxValues.pli_other),
                            tution_fee_other: Math.round(taxValues.tution_fee_other),
                            uti_ulpi_other: Math.round(taxValues.uti_ulpi_other),
                            sukanya_other: Math.round(taxValues.sukanya_other),
                            housing_loan_private: Math.round(taxValues.housing_loan_private),
                            egis_sum: Math.round(egis_sum),
                            lic_sum: Math.round(lic_sum),
                            kgid_sum: Math.round(kgid_sum),
                            gpf_sum: Math.round(gpf_sum),
                            nps_sum: Math.round(nps_sum),
                            pli_sum: Math.round(pli_sum),
                            tution_fee_sum: Math.round(tution_fee_sum),
                            uti_ulpi_sum: Math.round(uti_ulpi_sum),
                            sukanya_sum: Math.round(sukanya_sum),
                            housing_loan_sum: Math.round(housing_loan_sum),
                            us_80_total_salaried: Math.round(us_80_total_salaried),
                            us_80_total_private: Math.round(us_80_total_private),
                            us_80_total_sum: Math.round(us_80_total_sum),
                            totalTaxableIncome: Math.round(totalTaxableIncome),
                            taxOnTotalIncome: Math.round(taxOnTotalIncome),
                            tax_amt_distro_0: Math.round(tax_amt_distro_0),
                            tax_amt_distro_5: Math.round(tax_amt_distro_5),
                            tax_amt_distro_20: Math.round(tax_amt_distro_20),
                            tax_amt_distro_20_2: Math.round(tax_amt_distro_20_2),
                            tax_amt_distro_30: Math.round(tax_amt_distro_30),
                            tax_amt_distro_0_tax: Math.round(tax_amt_distro_0_tax),
                            tax_amt_distro_5_tax: Math.round(tax_amt_distro_5_tax),
                            tax_amt_distro_20_tax: Math.round(tax_amt_distro_20_tax),
                            tax_amt_distro_20_2_tax: Math.round(tax_amt_distro_20_2_tax),
                            tax_amt_distro_30_tax: Math.round(tax_amt_distro_30_tax),
                            tax_rebate: Math.round(taxValues.tax_rebate),
                            tax_after_rebate: Math.round(tax_after_rebate),
                            surcharge: Math.round(taxValues.surcharge),
                            health_education: Math.round(health_education),
                            tax_payable: Math.round(tax_payable),
                            relief_sec89: Math.round(taxValues.relief_sec89),
                            net_tax_payable: Math.round(tax_payable - taxValues.relief_sec89)
                        });
                        var query = "select s.name, s.school_name, sbd.pan_number from staff s, staff_bank_details sbd \
                        where s.kgid=sbd.kgid and s.kgid=$1";
                        staff_details = [];
                        await pool.query(query, [kgid]).then((data) => {
                            staff_details.push(data.rows[0]);
                        });
                        staff_details[0].assessment_year = year + 1;
                        //console.log(staff_details);
                        res.render("./teacher/tax_form", {title:"Tax Form", data:websiteData, staff_details: staff_details[0], current_years: current_years[0]});
                    }
                    else if(data.rows[0].enable_disable == 0){
                        res.send("Tax Form has not been updated yet!!!");
                    }
                    else{
                        res.send("Tax Form has not been updated yet!!!");
                    }
                });
            });
        } catch (err) {
            //console.log(err);
            res.send("Tax Form has not been updated yet!!!");
        }
    }
    else{
        res.send("Invalid Year!!!");
    }
}

module.exports = {getTaxForm};
