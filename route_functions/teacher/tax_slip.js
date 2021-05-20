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

//Get Tax Slip Data
const getTaxSlipData = async (kgid, year) => {
    var query = "select * from staff s, pay_slip_earnings pse, pay_slip_deductions psd, \
    tax_slip_encashment tse where s.kgid=pse.kgid and s.kgid=psd.kgid and s.kgid=tse.kgid \
    and s.kgid=$1 and pse.year=$2 and psd.year=$2 and tse.year=$2";
    await pool.query(query, [kgid, year + 1]).then((data) => {

    });
}

//Get Tax Slip
const getTaxSlip = async (req, res) => {
    const kgid = req.session.kgid;
    const current_years = await getCurrPrevYears();
    const prevCurrYear = req.params.prev_curr_year;
    if(prevCurrYear == "previous_year"){
        try {
            var website_data = [];
            var other_data = [];
            var query ="select prev_year from current_years";
            var particulars_total = {
                pay: 000,
                da: 000,
                hra: 000,
                ir: 000,
                sa: 000,
                ma: 000,
                ra: 000,
                fta: 000,
                pp: 000,
                pp_sfn: 000,
                cha: 000,
                pt: 000,
                egis: 000,
                lic: 000,
                slip_kgid: 000,
                gpf: 000,
                nps: 000,
                hba: 000,
                others: 000,
                pse_total: 000,
                psd_total: 000,
                net_sal: 000
            }
            await pool.query(query).then(async (data) => {
                var query = "select *,pse.pay+pse.ir+pse.sa+pse.ma+pse.ra+pse.fta+pse.pp_sfn+pse.cha pse_total, psd.pt+psd.egis+psd.lic+psd.slip_kgid+psd.gpf+psd.nps+psd.hba+psd.others psd_total from pay_slip_earnings pse, pay_slip_deductions psd where pse.kgid=psd.kgid and pse.year=psd.year and pse.kgid=$1 and pse.year=$2 and pse.month=psd.month and pse.month not in('Jan', 'Feb')";
                var year = data.rows[0].prev_year;
                await pool.query(query, [kgid, year]).then((data) => {
                    var months = ["Mar","Apr", "May", "Jun", "Jul", 
                    "Aug", "Sep", "Oct", "Nov", "Dec"];

                    var tempMonths = [];
                    var tempIndex = 0;
                    data.rows.map((value) => {
                        tempMonths.push(value.month);
                    });

                    months.map((value) => {
                        if(!tempMonths.includes(value)){
                            website_data.push({
                                kgid: kgid,
                                year: year,
                                month: value,
                                pay: 0,
                                da: 0,
                                hra: 0,
                                ir: 0,
                                sa: 0,
                                ma: 0,
                                ra: 0,
                                fta: 0,
                                pp: 0,
                                pp_sfn:0,
                                cha:0,
                                pt: 0,
                                egis: 0,
                                lic: 0,
                                slip_kgid: 0,
                                gpf: 0,
                                nps: 0,
                                hba: 0,
                                others: 0,
                                pse_total: 0,
                                psd_total: 0,
                                net_sal: 0,
                            });
                        }
                        else{
                            data.rows[tempIndex].da = Math.round(data.rows[tempIndex].pay * 11.25 / 100);
                            data.rows[tempIndex].hra = Math.round(data.rows[tempIndex].pay * 8 / 100);
                            data.rows[tempIndex].pse_total = data.rows[tempIndex].pse_total + data.rows[tempIndex].da;
                            data.rows[tempIndex].pse_total += data.rows[tempIndex].hra;
                            
                            particulars_total.hra += ((data.rows[tempIndex].hra));
                            particulars_total.da += ((data.rows[tempIndex].da));
                            particulars_total.pay += ((data.rows[tempIndex].pay));
                            particulars_total.ir += ((data.rows[tempIndex].ir));
                            particulars_total.sa += ((data.rows[tempIndex].sa));
                            particulars_total.ma += ((data.rows[tempIndex].ma));
                            particulars_total.ra += ((data.rows[tempIndex].ra));
                            particulars_total.fta += ((data.rows[tempIndex].fta));
                            particulars_total.pp += ((data.rows[tempIndex].pp));
                            particulars_total.pp_sfn += ((data.rows[tempIndex].pp_sfn));
                            particulars_total.cha += ((data.rows[tempIndex].cha));
                            particulars_total.pt += ((data.rows[tempIndex].pt));
                            particulars_total.egis += ((data.rows[tempIndex].egis));
                            particulars_total.lic += ((data.rows[tempIndex].lic));
                            particulars_total.slip_kgid += ((data.rows[tempIndex].slip_kgid));
                            particulars_total.gpf += ((data.rows[tempIndex].gpf));
                            particulars_total.nps += ((data.rows[tempIndex].nps));
                            particulars_total.hba += ((data.rows[tempIndex].hba));
                            particulars_total.others += ((data.rows[tempIndex].others));
                            particulars_total.pse_total += (data.rows[tempIndex].pse_total);
                            particulars_total.psd_total += ((data.rows[tempIndex].psd_total));
                            particulars_total.net_sal += ((data.rows[tempIndex].pse_total - data.rows[tempIndex].psd_total));
                            website_data.push(data.rows[tempIndex]);
                            tempIndex += 1;
                        }
                    });

                });

                var query = "select *,pse.pay+pse.ir+pse.sa+pse.ma+pse.ra+pse.fta+pse.pp_sfn+pse.cha pse_total, psd.pt+psd.egis+psd.lic+psd.slip_kgid+psd.gpf+psd.nps+psd.hba+psd.others psd_total from pay_slip_earnings pse, pay_slip_deductions psd where pse.kgid=psd.kgid and pse.year=psd.year and pse.kgid=$1 and pse.year=$2 and pse.month=psd.month and pse.month in('Jan', 'Feb')";
                year = data.rows[0].prev_year + 1;
                await pool.query(query, [kgid, year]).then((data) => {
                    var months = ["Jan", "Feb"];

                    var tempMonths = [];
                    var tempIndex = 0;
                    data.rows.map((value) => {
                        tempMonths.push(value.month);
                    });

                    months.map((value) => {
                        if(!tempMonths.includes(value)){
                            website_data.push({
                                kgid: kgid,
                                year: year,
                                month: value,
                                pay: 0,
                                da: 0,
                                hra: 0,
                                ir: 0,
                                sa: 0,
                                ma: 0,
                                ra: 0,
                                fta: 0,
                                pp: 0,
                                pp_sfn:0,
                                cha:0,
                                pt: 0,
                                egis: 0,
                                lic: 0,
                                slip_kgid: 0,
                                gpf: 0,
                                nps: 0,
                                hba: 0,
                                others: 0,
                                pse_total: 0,
                                psd_total: 0,
                                net_sal: 0
                            });
                        }
                        else{
                            
                            data.rows[tempIndex].da = Math.round(data.rows[tempIndex].pay * 11.25 / 100);
                            data.rows[tempIndex].hra = Math.round(data.rows[tempIndex].pay * 8 / 100);
                            data.rows[tempIndex].pse_total = data.rows[tempIndex].pse_total + data.rows[tempIndex].da;
                            data.rows[tempIndex].pse_total += data.rows[tempIndex].hra;
                            console.log("PSE total before round:");
                            console.log(data.rows[tempIndex].pse_total);
                            data.rows[tempIndex].pse_total = (data.rows[tempIndex].pse_total);
                            console.log("PSE total after round:");
                            console.log(data.rows[tempIndex].pse_total);
                            data.rows[tempIndex].psd_total = ((data.rows[tempIndex].psd_total));
                            particulars_total.hra += ((data.rows[tempIndex].hra));
                            particulars_total.da += ((data.rows[tempIndex].da));
                            particulars_total.pay += ((data.rows[tempIndex].pay));
                            particulars_total.ir += ((data.rows[tempIndex].ir));
                            particulars_total.sa += ((data.rows[tempIndex].sa));
                            particulars_total.ma += ((data.rows[tempIndex].ma));
                            particulars_total.ra += ((data.rows[tempIndex].ra));
                            particulars_total.fta += ((data.rows[tempIndex].fta));
                            particulars_total.pp += ((data.rows[tempIndex].pp));
                            particulars_total.pp_sfn += ((data.rows[tempIndex].pp_sfn));
                            particulars_total.cha += ((data.rows[tempIndex].cha));
                            particulars_total.pt += ((data.rows[tempIndex].pt));
                            particulars_total.egis += ((data.rows[tempIndex].egis));
                            particulars_total.lic += ((data.rows[tempIndex].lic));
                            particulars_total.slip_kgid += ((data.rows[tempIndex].slip_kgid));
                            particulars_total.gpf += ((data.rows[tempIndex].gpf));
                            particulars_total.nps += ((data.rows[tempIndex].nps));
                            particulars_total.hba += ((data.rows[tempIndex].hba));
                            particulars_total.others += ((data.rows[tempIndex].others));
                            particulars_total.pse_total += (data.rows[tempIndex].pse_total);
                            particulars_total.psd_total += ((data.rows[tempIndex].psd_total));
                            particulars_total.net_sal += ((data.rows[tempIndex].pse_total - data.rows[tempIndex].psd_total));
                            website_data.push(data.rows[tempIndex]);
                            tempIndex += 1;
                        }
                    });
                });

                //console.log("Website Data: ");
                // console.log(website_data);

                query = "select * from other_savings os, staff s, tax_slip_encashment tse, \
                login_credentials lc where s.kgid=os.kgid and s.kgid=tse.kgid and s.kgid=lc.kgid and \
                tse.year=$1 and os.year=$1 and os.kgid=$2";
                await pool.query(query, [year, kgid]).then((data) => {
                    //console.log(data.rows[0]);
                    other_data.push({
                        lic_other: (data.rows[0].lic_other),
                        pli_other: (data.rows[0].pli_other),
                        tution_fee_other: (data.rows[0].tution_fee_other),
                        uti_ulpi_other: (data.rows[0].uti_ulpi_other),
                        sukanya_other: (data.rows[0].sukanya_other),
                        pay_enc: (data.rows[0].pay_enc),
                        ir_enc: (data.rows[0].ir_enc),
                        sa_enc: (data.rows[0].sa_enc),
                        ma_enc: (data.rows[0].ma_enc),
                        ra_enc: (data.rows[0].ra_enc),
                        fta_enc: (data.rows[0].fta_enc),
                        pp_enc: (data.rows[0].pp_enc),
                        staff_name: data.rows[0].name,
                        school_name: data.rows[0].school_name,
                        contact: data.rows[0].contact,
                        staff_kgid: data.rows[0].kgid,
                        year: year
                    });
                });

            });
            //console.log("Other Data: ");
            //console.log(other_data);
            //console.log(website_data);

            var monthPriority = {
                "Mar":1, "Apr":2, "May":3, "Jun":4, "Jul":5, "Aug":6, "Sep":7, "Oct":8,
                "Nov":9, "Dec":10, "Jan":11, "Feb":12
            };

            var finalData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

            website_data.map((value) => {
                finalData[monthPriority[`${value.month}`] - 1] = value;
            });

            website_data = finalData;

            res.render("./teacher/tax_slip", {title: "Tax Slip", data: website_data, other_data: other_data, particulars_total: particulars_total, current_years: current_years[0]});
        } catch (err) {
            //console.log("Error occured at Get Tax Slip Previous Year...");
            console.log(err);
            res.send("Tax Slip Not Yet Updated!!!");
        }
    }
    else if(prevCurrYear == "previous_year_2"){
        try {
            var website_data = [];
            var other_data = [];
            var query ="select prev_year_2 from current_years";
            var particulars_total = {
                pay: 000,
                da: 000,
                hra: 000,
                ir: 000,
                sa: 000,
                ma: 000,
                ra: 000,
                fta: 000,
                pp: 000,
                pp_sfn: 000,
                cha: 000,
                pt: 000,
                egis: 000,
                lic: 000,
                slip_kgid: 000,
                gpf: 000,
                nps: 000,
                hba: 000,
                others: 000,
                pse_total: 000,
                psd_total: 000,
                net_sal: 000
            }
            await pool.query(query).then(async (data) => {
                var query = "select *,pse.pay+pse.ir+pse.sa+pse.ma+pse.ra+pse.fta+pse.pp_sfn+pse.cha pse_total, psd.pt+psd.egis+psd.lic+psd.slip_kgid+psd.gpf+psd.nps+psd.hba+psd.others psd_total from pay_slip_earnings pse, pay_slip_deductions psd where pse.kgid=psd.kgid and pse.year=psd.year and pse.kgid=$1 and pse.year=$2 and pse.month=psd.month and pse.month not in('Jan', 'Feb')";
                var year = data.rows[0].prev_year_2;
                await pool.query(query, [kgid, year]).then((data) => {
                    var months = ["Mar","Apr", "May", "Jun", "Jul", 
                    "Aug", "Sep", "Oct", "Nov", "Dec"];

                    // console.log("PSD Total: ");
                    // console.log(data.rows);

                    var tempMonths = [];
                    var tempIndex = 0;
                    data.rows.map((value) => {
                        tempMonths.push(value.month);
                    });

                    months.map((value) => {
                        if(!tempMonths.includes(value)){
                            website_data.push({
                                kgid: kgid,
                                year: year,
                                month: value,
                                pay: 0,
                                da: 0,
                                hra: 0,
                                ir: 0,
                                sa: 0,
                                ma: 0,
                                ra: 0,
                                fta: 0,
                                pp: 0,
                                pp_sfn: 0,
                                cha: 0,
                                pt: 0,
                                egis: 0,
                                lic: 0,
                                slip_kgid: 0,
                                gpf: 0,
                                nps: 0,
                                hba: 0,
                                others: 0,
                                pse_total: 0,
                                psd_total: 0,
                                net_sal: 0,
                            });
                        }
                        else{
                            
                            
                            
                            data.rows[tempIndex].da = Math.round(data.rows[tempIndex].pay * 11.25 / 100);
                            data.rows[tempIndex].hra = Math.round(data.rows[tempIndex].pay * 8 / 100);
                            data.rows[tempIndex].pse_total = data.rows[tempIndex].pse_total + data.rows[tempIndex].da;
                            data.rows[tempIndex].pse_total += data.rows[tempIndex].hra;
                            
                            data.rows[tempIndex].pse_total = (data.rows[tempIndex].pse_total);
                            
                            data.rows[tempIndex].psd_total = ((data.rows[tempIndex].psd_total));
                            particulars_total.hra += ((data.rows[tempIndex].hra));
                            particulars_total.da += ((data.rows[tempIndex].da));
                            particulars_total.pay += ((data.rows[tempIndex].pay));
                            particulars_total.ir += ((data.rows[tempIndex].ir));
                            particulars_total.sa += ((data.rows[tempIndex].sa));
                            particulars_total.ma += ((data.rows[tempIndex].ma));
                            particulars_total.ra += ((data.rows[tempIndex].ra));
                            particulars_total.fta += ((data.rows[tempIndex].fta));
                            particulars_total.pp += ((data.rows[tempIndex].pp));
                            particulars_total.pp_sfn += ((data.rows[tempIndex].pp_sfn));
                            particulars_total.pt += ((data.rows[tempIndex].pt));
                            particulars_total.egis += ((data.rows[tempIndex].egis));
                            particulars_total.lic += ((data.rows[tempIndex].lic));
                            particulars_total.slip_kgid += ((data.rows[tempIndex].slip_kgid));
                            particulars_total.gpf += ((data.rows[tempIndex].gpf));
                            particulars_total.nps += ((data.rows[tempIndex].nps));
                            particulars_total.hba += ((data.rows[tempIndex].hba));
                            particulars_total.others += ((data.rows[tempIndex].others));
                            particulars_total.pse_total += ((data.rows[tempIndex].pse_total));
                            particulars_total.psd_total += (data.rows[tempIndex].psd_total);
                            particulars_total.net_sal += ((data.rows[tempIndex].pse_total - data.rows[tempIndex].psd_total));
                            website_data.push(data.rows[tempIndex]);
                            tempIndex += 1;
                        }
                    });

                });

                var query = "select *,pse.pay+pse.ir+pse.sa+pse.ma+pse.ra+pse.fta+pse.pp_sfn+pse.cha pse_total, psd.pt+psd.egis+psd.lic+psd.slip_kgid+psd.gpf+psd.nps+psd.hba+psd.others psd_total from pay_slip_earnings pse, pay_slip_deductions psd where pse.kgid=psd.kgid and pse.year=psd.year and pse.kgid=$1 and pse.year=$2 and pse.month=psd.month and pse.month in('Jan', 'Feb')";
                year = data.rows[0].prev_year_2 + 1;
                await pool.query(query, [kgid, year]).then((data) => {
                    var months = ["Jan", "Feb"];

                    var tempMonths = [];
                    var tempIndex = 0;
                    data.rows.map((value) => {
                        tempMonths.push(value.month);
                    });

                    months.map((value) => {
                        if(!tempMonths.includes(value)){
                            website_data.push({
                                kgid: kgid,
                                year: year,
                                month: value,
                                pay: 0,
                                da: 0,
                                hra: 0,
                                ir: 0,
                                sa: 0,
                                ma: 0,
                                ra: 0,
                                fta: 0,
                                pp: 0,
                                pp_sfn:0,
                                cha:0,
                                pt: 0,
                                egis: 0,
                                lic: 0,
                                slip_kgid: 0,
                                gpf: 0,
                                nps: 0,
                                hba: 0,
                                others: 0,
                                pse_total: 0,
                                psd_total: 0,
                                net_sal: 0
                            });
                        }
                        else{
                            
                            
                            
                            data.rows[tempIndex].da = Math.round(data.rows[tempIndex].pay * 11.25 / 100);
                            data.rows[tempIndex].hra = Math.round(data.rows[tempIndex].pay * 8 / 100);
                            data.rows[tempIndex].pse_total = data.rows[tempIndex].pse_total + data.rows[tempIndex].da;
                            data.rows[tempIndex].pse_total += data.rows[tempIndex].hra;
                            console.log("PSE total before round:");
                            console.log(data.rows[tempIndex].pse_total);
                            data.rows[tempIndex].pse_total = (data.rows[tempIndex].pse_total);
                            console.log("PSE total after round:");
                            console.log(data.rows[tempIndex].pse_total);
                            data.rows[tempIndex].psd_total = ((data.rows[tempIndex].psd_total));
                            particulars_total.hra += ((data.rows[tempIndex].hra));
                            particulars_total.da += ((data.rows[tempIndex].da));
                            particulars_total.pay += ((data.rows[tempIndex].pay));
                            particulars_total.ir += ((data.rows[tempIndex].ir));
                            particulars_total.sa += ((data.rows[tempIndex].sa));
                            particulars_total.ma += ((data.rows[tempIndex].ma));
                            particulars_total.ra += ((data.rows[tempIndex].ra));
                            particulars_total.fta += ((data.rows[tempIndex].fta));
                            particulars_total.pp += ((data.rows[tempIndex].pp));
                            particulars_total.pp_sfn += ((data.rows[tempIndex].pp_sfn));
                            particulars_total.cha += ((data.rows[tempIndex].cha));
                            particulars_total.pt += ((data.rows[tempIndex].pt));
                            particulars_total.egis += ((data.rows[tempIndex].egis));
                            particulars_total.lic += ((data.rows[tempIndex].lic));
                            particulars_total.slip_kgid += ((data.rows[tempIndex].slip_kgid));
                            particulars_total.gpf += ((data.rows[tempIndex].gpf));
                            particulars_total.nps += ((data.rows[tempIndex].nps));
                            particulars_total.hba += ((data.rows[tempIndex].hba));
                            particulars_total.others += ((data.rows[tempIndex].others));
                            particulars_total.pse_total += (data.rows[tempIndex].pse_total);
                            particulars_total.psd_total += (data.rows[tempIndex].psd_total);
                            particulars_total.net_sal += ((data.rows[tempIndex].pse_total - data.rows[tempIndex].psd_total));
                            website_data.push(data.rows[tempIndex]);
                            tempIndex += 1;
                        }
                    });
                });

                //console.log("Website Data: ");
                //console.log(website_data);

                query = "select * from other_savings os, staff s, tax_slip_encashment tse, \
                login_credentials lc where s.kgid=os.kgid and s.kgid=tse.kgid and s.kgid=lc.kgid and \
                tse.year=$1 and os.year=$1 and os.kgid=$2";
                await pool.query(query, [year, kgid]).then((data) => {
                    //console.log(data.rows[0]);
                    other_data.push({
                        lic_other: (data.rows[0].lic_other),
                        pli_other: (data.rows[0].pli_other),
                        tution_fee_other: (data.rows[0].tution_fee_other),
                        uti_ulpi_other: (data.rows[0].uti_ulpi_other),
                        sukanya_other: (data.rows[0].sukanya_other),
                        pay_enc: (data.rows[0].pay_enc),
                        ir_enc: (data.rows[0].ir_enc),
                        sa_enc: (data.rows[0].sa_enc),
                        ma_enc: (data.rows[0].ma_enc),
                        ra_enc: (data.rows[0].ra_enc),
                        fta_enc: (data.rows[0].fta_enc),
                        pp_enc: (data.rows[0].pp_enc),
                        staff_name: data.rows[0].name,
                        school_name: data.rows[0].school_name,
                        contact: data.rows[0].contact,
                        staff_kgid: data.rows[0].kgid,
                        year: year
                    });
                });

            });
            //console.log("Other Data: ");
            //console.log(other_data);
            //console.log(website_data);

            var monthPriority = {
                "Mar":1, "Apr":2, "May":3, "Jun":4, "Jul":5, "Aug":6, "Sep":7, "Oct":8,
                "Nov":9, "Dec":10, "Jan":11, "Feb":12
            };

            var finalData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

            website_data.map((value) => {
                finalData[monthPriority[`${value.month}`] - 1] = value;
            });

            website_data = finalData;

            res.render("./teacher/tax_slip", {title: "Tax Slip", data: website_data, other_data: other_data, particulars_total: particulars_total, current_years: current_years[0]});
        } catch (err) {
            //console.log("Error occured at Get Tax Slip Previous Year...");
            console.log(err);
            res.send("Tax Slip Not Yet Updated!!!");
        }
    }
    else if(prevCurrYear == "current_year"){
        try {
            var website_data = [];
            var other_data = [];
            var query ="select curr_year from current_years";
            var particulars_total = {
                pay: 000,
                da: 000,
                hra: 000,
                ir: 000,
                sa: 000,
                ma: 000,
                ra: 000,
                fta: 000,
                pp: 000,
                pp_sfn: 000,
                cha: 000,
                pt: 000,
                egis: 000,
                lic: 000,
                slip_kgid: 000,
                gpf: 000,
                nps: 000,
                hba: 000,
                others: 000,
                pse_total: 000,
                psd_total: 000,
                net_sal: 000
            }
            await pool.query(query).then(async (data) => {
                var query = "select *,pse.pay+pse.ir+pse.sa+pse.ma+pse.ra+pse.fta+pse.pp_sfn+pse.cha pse_total, psd.pt+psd.egis+psd.lic+psd.slip_kgid+psd.gpf+psd.nps+psd.hba+psd.others psd_total from pay_slip_earnings pse, pay_slip_deductions psd where pse.kgid=psd.kgid and pse.year=psd.year and pse.kgid=$1 and pse.year=$2 and pse.month=psd.month and pse.month not in('Jan', 'Feb')";
                var year = data.rows[0].curr_year;
                await pool.query(query, [kgid, year]).then((data) => {
                    var months = ["Mar","Apr", "May", "Jun", "Jul", 
                    "Aug", "Sep", "Oct", "Nov", "Dec"];

                    var tempMonths = [];
                    var tempIndex = 0;
                    data.rows.map((value) => {
                        tempMonths.push(value.month);
                    });

                    months.map((value) => {
                        if(!tempMonths.includes(value)){
                            website_data.push({
                                kgid: kgid,
                                year: year,
                                month: value,
                                pay: 0,
                                da: 0,
                                hra: 0,
                                ir: 0,
                                sa: 0,
                                ma: 0,
                                ra: 0,
                                fta: 0,
                                pp: 0,
                                pp_sfn:0,
                                cha:0,
                                pt: 0,
                                egis: 0,
                                lic: 0,
                                slip_kgid: 0,
                                gpf: 0,
                                nps: 0,
                                hba: 0,
                                others: 0,
                                pse_total: 0,
                                psd_total: 0,
                                net_sal: 0,
                            });
                        }
                        else{

                            data.rows[tempIndex].pt = (data.rows[tempIndex].pt);
                            data.rows[tempIndex].egis = (data.rows[tempIndex].egis);
                            data.rows[tempIndex].lic = (data.rows[tempIndex].lic);
                            data.rows[tempIndex].slip_kgid = (data.rows[tempIndex].slip_kgid);
                            data.rows[tempIndex].gpf = (data.rows[tempIndex].gpf);
                            data.rows[tempIndex].nps = (data.rows[tempIndex].nps);
                            data.rows[tempIndex].hba = (data.rows[tempIndex].hba);
                            data.rows[tempIndex].others = (data.rows[tempIndex].others);
                            data.rows[tempIndex].slip_kgid_recoveries = (data.rows[tempIndex].slip_kgid_recoveries);
                            data.rows[tempIndex].local_recoveries = (data.rows[tempIndex].local_recoveries);
                            // data.rows[tempIndex].eegis = (data.rows[tempIndex].eegis);
                            
                            data.rows[tempIndex].pay = (data.rows[tempIndex].pay);
                            data.rows[tempIndex].ir = (data.rows[tempIndex].ir);
                            data.rows[tempIndex].sa = (data.rows[tempIndex].sa);
                            data.rows[tempIndex].ma = (data.rows[tempIndex].ma);
                            data.rows[tempIndex].ra = (data.rows[tempIndex].ra);
                            data.rows[tempIndex].fta = (data.rows[tempIndex].fta);
                            data.rows[tempIndex].pp = (data.rows[tempIndex].pp);
                            //data.rows[tempIndex].med = (data.rows[tempIndex].med);
                            data.rows[tempIndex].cha = (data.rows[tempIndex].cha);
                            data.rows[tempIndex].pp_sfn = (data.rows[tempIndex].pp_sfn);
                            data.rows[tempIndex].stag_count = (data.rows[tempIndex].stag_count);
                            data.rows[tempIndex].stag_amt = (data.rows[tempIndex].stag_amt);
                            data.rows[tempIndex].pay_fixation_amt = (data.rows[tempIndex].pay_fixation_amt);
                            
                            data.rows[tempIndex].da = Math.round(data.rows[tempIndex].pay * 11.25 / 100);
                            data.rows[tempIndex].hra = Math.round(data.rows[tempIndex].pay * 8 / 100);
                            data.rows[tempIndex].pse_total = data.rows[tempIndex].pse_total + data.rows[tempIndex].da;
                            data.rows[tempIndex].pse_total += data.rows[tempIndex].hra;
                            console.log("PSE total before round:");
                            console.log(data.rows[tempIndex].pse_total);
                            data.rows[tempIndex].pse_total = (data.rows[tempIndex].pse_total);
                            console.log("PSE total after round:");
                            console.log(data.rows[tempIndex].pse_total);
                            data.rows[tempIndex].psd_total = ((data.rows[tempIndex].psd_total));
                            particulars_total.hra += ((data.rows[tempIndex].hra));
                            particulars_total.da += ((data.rows[tempIndex].da));
                            particulars_total.pay += ((data.rows[tempIndex].pay));
                            particulars_total.ir += ((data.rows[tempIndex].ir));
                            particulars_total.sa += ((data.rows[tempIndex].sa));
                            particulars_total.ma += ((data.rows[tempIndex].ma));
                            particulars_total.ra += ((data.rows[tempIndex].ra));
                            particulars_total.fta += ((data.rows[tempIndex].fta));
                            particulars_total.pp += ((data.rows[tempIndex].pp));
                            particulars_total.pp_sfn += ((data.rows[tempIndex].pp_sfn));
                            particulars_total.cha += ((data.rows[tempIndex].cha));
                            particulars_total.pt += ((data.rows[tempIndex].pt));
                            particulars_total.egis += ((data.rows[tempIndex].egis));
                            particulars_total.lic += ((data.rows[tempIndex].lic));
                            particulars_total.slip_kgid += ((data.rows[tempIndex].slip_kgid));
                            particulars_total.gpf += ((data.rows[tempIndex].gpf));
                            particulars_total.nps += ((data.rows[tempIndex].nps));
                            particulars_total.hba += ((data.rows[tempIndex].hba));
                            particulars_total.others += ((data.rows[tempIndex].others));
                            particulars_total.pse_total += (data.rows[tempIndex].pse_total);
                            particulars_total.psd_total += (data.rows[tempIndex].psd_total);
                            particulars_total.net_sal += ((data.rows[tempIndex].pse_total - data.rows[tempIndex].psd_total));
                            website_data.push(data.rows[tempIndex]);
                            tempIndex += 1;
                        }
                    });

                });

                var query = "select *,pse.pay+pse.ir+pse.sa+pse.ma+pse.ra+pse.fta+pse.pp_sfn+pse.cha pse_total, psd.pt+psd.egis+psd.lic+psd.slip_kgid+psd.gpf+psd.nps+psd.hba+psd.others psd_total from pay_slip_earnings pse, pay_slip_deductions psd where pse.kgid=psd.kgid and pse.year=psd.year and pse.kgid=$1 and pse.year=$2 and pse.month=psd.month and pse.month in('Jan', 'Feb')";
                year = data.rows[0].curr_year + 1;
                await pool.query(query, [kgid, year]).then((data) => {
                    var months = ["Jan", "Feb"];

                    var tempMonths = [];
                    var tempIndex = 0;
                    data.rows.map((value) => {
                        tempMonths.push(value.month);
                    });

                    months.map((value) => {
                        if(!tempMonths.includes(value)){
                            website_data.push({
                                kgid: kgid,
                                year: year,
                                month: value,
                                pay: 0,
                                da: 0,
                                hra: 0,
                                ir: 0,
                                sa: 0,
                                ma: 0,
                                ra: 0,
                                fta: 0,
                                pp: 0,
                                pp_sfn:0,
                                cha:0,
                                pt: 0,
                                egis: 0,
                                lic: 0,
                                slip_kgid: 0,
                                gpf: 0,
                                nps: 0,
                                hba: 0,
                                others: 0,
                                pse_total: 0,
                                psd_total: 0,
                                net_sal: 0
                            });
                        }
                        else{
                            
                            
                            
                            data.rows[tempIndex].da = Math.round(data.rows[tempIndex].pay * 11.25 / 100);
                            data.rows[tempIndex].hra = Math.round(data.rows[tempIndex].pay * 8 / 100);
                            data.rows[tempIndex].pse_total = data.rows[tempIndex].pse_total + data.rows[tempIndex].da;
                            data.rows[tempIndex].pse_total += data.rows[tempIndex].hra;
                            console.log("PSE total before round:");
                            console.log(data.rows[tempIndex].pse_total);
                            data.rows[tempIndex].pse_total = (data.rows[tempIndex].pse_total);
                            console.log("PSE total after round:");
                            console.log(data.rows[tempIndex].pse_total);
                            data.rows[tempIndex].psd_total = ((data.rows[tempIndex].psd_total));
                            particulars_total.hra += ((data.rows[tempIndex].hra));
                            particulars_total.da += ((data.rows[tempIndex].da));
                            particulars_total.pay += ((data.rows[tempIndex].pay));
                            particulars_total.ir += ((data.rows[tempIndex].ir));
                            particulars_total.sa += ((data.rows[tempIndex].sa));
                            particulars_total.ma += ((data.rows[tempIndex].ma));
                            particulars_total.ra += ((data.rows[tempIndex].ra));
                            particulars_total.fta += ((data.rows[tempIndex].fta));
                            particulars_total.pp += ((data.rows[tempIndex].pp));
                            particulars_total.pp_sfn += ((data.rows[tempIndex].pp_sfn));
                            particulars_total.cha += ((data.rows[tempIndex].cha));
                            particulars_total.pt += ((data.rows[tempIndex].pt));
                            particulars_total.egis += ((data.rows[tempIndex].egis));
                            particulars_total.lic += ((data.rows[tempIndex].lic));
                            particulars_total.slip_kgid += ((data.rows[tempIndex].slip_kgid));
                            particulars_total.gpf += ((data.rows[tempIndex].gpf));
                            particulars_total.nps += ((data.rows[tempIndex].nps));
                            particulars_total.hba += ((data.rows[tempIndex].hba));
                            particulars_total.others += ((data.rows[tempIndex].others));
                            particulars_total.pse_total += (data.rows[tempIndex].pse_total);
                            particulars_total.psd_total += (data.rows[tempIndex].psd_total);
                            particulars_total.net_sal += ((data.rows[tempIndex].pse_total - data.rows[tempIndex].psd_total));
                            website_data.push(data.rows[tempIndex]);
                            tempIndex += 1;
                        }
                    });
                });

                //console.log("Website Data: ");
                // console.log(website_data);

                query = "select * from other_savings os, staff s, tax_slip_encashment tse, \
                login_credentials lc where s.kgid=os.kgid and s.kgid=tse.kgid and s.kgid=lc.kgid and \
                tse.year=$1 and os.year=$1 and os.kgid=$2";
                await pool.query(query, [year, kgid]).then((data) => {
                    //console.log(data.rows[0]);
                    other_data.push({
                        lic_other: (data.rows[0].lic_other),
                        pli_other: (data.rows[0].pli_other),
                        tution_fee_other: (data.rows[0].tution_fee_other),
                        uti_ulpi_other: (data.rows[0].uti_ulpi_other),
                        sukanya_other: (data.rows[0].sukanya_other),
                        pay_enc: (data.rows[0].pay_enc),
                        ir_enc: (data.rows[0].ir_enc),
                        sa_enc: (data.rows[0].sa_enc),
                        ma_enc: (data.rows[0].ma_enc),
                        ra_enc: (data.rows[0].ra_enc),
                        fta_enc: (data.rows[0].fta_enc),
                        pp_enc: (data.rows[0].pp_enc),
                        staff_name: data.rows[0].name,
                        school_name: data.rows[0].school_name,
                        contact: data.rows[0].contact,
                        staff_kgid: data.rows[0].kgid,
                        year: year
                    });
                });

            });
            //console.log("Other Data: ");
            //console.log(other_data);
            //console.log(website_data);

            var monthPriority = {
                "Mar":1, "Apr":2, "May":3, "Jun":4, "Jul":5, "Aug":6, "Sep":7, "Oct":8,
                "Nov":9, "Dec":10, "Jan":11, "Feb":12
            };

            var finalData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

            website_data.map((value) => {
                finalData[monthPriority[`${value.month}`] - 1] = value;
            });

            website_data = finalData;

            res.render("./teacher/tax_slip", {title: "Tax Slip", data: website_data, other_data: other_data, particulars_total: particulars_total, current_years: current_years[0]});
        } catch (err) {
            //console.log("Error occured at Get Tax Slip Previous Year...");
            console.log(err);
            res.send("Tax Slip Not Yet Updated!!!");
        }
    }
    else{
        res.send("Invalid Year");
    }
}

module.exports = {
    getTaxSlip: getTaxSlip
}