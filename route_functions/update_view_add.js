const pool = require("../db/db_con");

//Get Curr Prev Year
const getCurrPrevYear = async () => {
    var query = "select * from current_years";
    var current_years = [];
    await pool.query(query).then((data) => {
        current_years.push(data.rows[0]);
    });
    return current_years;
}

const updateViewAdd = async (req, res) => {
    const kgid = req.params.kgid;
    const current_years = await getCurrPrevYear();
    res.render("update_view_add", { title: "Update/View/Add", msg: "", kgid: kgid, data: [], currPage: 0, updateStaffData: {}, current_years: current_years[0] });
}

const viewStaff = async (req, res) => {
    const admin_kgid = req.params.kgid;
    const current_years = await getCurrPrevYear();
    const staff_kgid = req.query.staff_kgid;
    var query = "select * from staff s, staff_bank_details sbd where s.kgid=sbd.kgid and s.kgid=$1";
    try {
        await pool.query(query, [staff_kgid]).then((data) => {
            if (data.rowCount === 1) {
                res.render("update_view_add", { title: "Update/View/Add Staff", msg: "", kgid: admin_kgid, data: data.rows, currPage: 0, updateStaffData: {}, current_years: current_years[0] });
            }
            else {
                res.render("update_view_add", { title: "Update/View/Add Staff", msg: "Invalid KGID!!!", kgid: admin_kgid, data: [], currPage: 0, updateStaffData: {}, current_years: current_years[0] });
            }
        });
    } catch (err) {
        res.send("Invalid KGID!!!");
    }
}

//View All Staff
const viewAllStaff = async (req, res) => {
    const admin_kgid = req.params.kgid;
    const current_years = await getCurrPrevYear();
    var perPage = 10;
    try {
        currPage = parseInt(req.params.currPage);
        var query = "select * from staff s, staff_bank_details sbd where s.kgid=sbd.kgid \
        offset $1 limit $2";
        await pool.query(query, [perPage * currPage, perPage]).then((data) => {
            if(data.rowCount > 0){
                if(data.rowCount == perPage){
                    currPage = currPage + 1;
                }
                res.render("update_view_add", {title: "Update/ViewAdd Staff", msg:"", kgid: admin_kgid, data: data.rows, currPage: currPage, updateStaffData: {}, current_years: current_years[0] });
            }
            else{
                currPage = 0;
                res.render("update_view_add", {title: "Update/ViewAdd Staff", msg:"", kgid: admin_kgid, data: data.rows, currPage: currPage, updateStaffData: {}, current_years: current_years[0] });
            }
        });
    } catch (err) {
        //console.log(err);
        res.send("Some Error Occured at View All Staff!!!");
    }
}

const addStaff = async (req, res) => {
    const admin_kgid = req.params.kgid;
    const current_years = await getCurrPrevYear();
    const {
        staff_kgid,
        staff_name,
        staff_working_place,
        staff_gender,
        staff_designation,
        staff_role,
        staff_contact,
        staff_email,
        pay_scale_min,
        pay_scale_max,
        basic_pay,
        department,
        ag_code,
        dob,
        ddo_code,
        next_inc_date,
        joining_date,
        staff_group,
        head_of_account,
        el_bal,
        hpl_bal,
        school_name,
        staff_bank_name,
        staff_account_number,
        staff_branch_name,
        staff_pran,
        payment_mode,
        pan_number,
        password,
        cpassword,
        recipient_id
    } = req.body;
    //console.log(staff_kgid, " : ", staff_name, " : ", staff_account_number);
    var query = "insert into login_credentials(kgid, password, contact, email, role) values(\
        $1, $2, $3, $4, $5)";
    try {
        if(password == cpassword){
            var values = [staff_kgid, password, staff_contact, staff_email, staff_role];
            await pool.query(query, values);
            query = "insert into staff values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
                $12, $13, $14, $15, $16, $17, $18, $19, $20)";
            values = [staff_kgid, staff_name, staff_working_place, staff_gender,
                staff_designation, pay_scale_min,pay_scale_max,basic_pay,department,
                ag_code,dob,ddo_code, joining_date,staff_group, head_of_account, el_bal,
                hpl_bal, next_inc_date, school_name, recipient_id];
            await pool.query(query, values);
            query = "insert into staff_bank_details values($1, $2, $3, $4, $5, $6, $7)";
            values = [staff_kgid, staff_bank_name, staff_account_number, staff_branch_name,
            staff_pran, payment_mode, pan_number];
            await pool.query(query, values);
            res.render("update_view_add", { title: "Update/View/Add Staff", msg: "Info: Staff Details Added Successfully", kgid: admin_kgid, data: [], currPage: 0, updateStaffData: {}, current_years: current_years[0] });
        }
        else{
            res.render("update_view_add", { title: "Update/View/Add Staff", msg: "Warning: Passwords do not match!!!", kgid: admin_kgid, data: [], currPage: 0, updateStaffData: {}, current_years: current_years[0] });
        }
    } catch (err) {
        //console.log(err);
        res.render("update_view_add", { title: "Update/View/Add Staff", msg: "Staff Already Exists!!!", kgid: admin_kgid, data: [], currPage: 0, updateStaffData: {}, current_years: current_years[0] });
    }
}

//Get Update Staff Values
const getUpdateStaffValues = async (req, res) => {
    const admin_kgid = req.params.kgid;
    const current_years = await getCurrPrevYear();
    const staff_kgid = req.query.staff_kgid;
    var query = "select * from staff s, staff_bank_details sbd, login_credentials lc where \
    s.kgid=lc.kgid and s.kgid=sbd.kgid and s.kgid=$1";
    try {
        await pool.query(query, [staff_kgid]).then((data) => {
            var month = "";
            var date = "";
            //console.log(data.rows[0].dob);
            if(data.rows[0].dob != null || data.rows[0].dob != undefined){
                if(data.rows[0].dob.getMonth() < 10){
                    month = "0" + (data.rows[0].dob.getMonth() + 1);
                }
                else{
                    month = (data.rows[0].dob.getMonth() + 1);
                }
                if(data.rows[0].dob.getDate() < 10){
                    date = "0" + (data.rows[0].dob.getDate());
                }
                else{
                    date = (data.rows[0].dob.getDate());
                }
                data.rows[0].dob = data.rows[0].dob.getFullYear() + "-" + month + "-" + date;
            }

            //----
            if(data.rows[0].next_inc_date != null || data.rows[0].next_inc_date != undefined){
                if(data.rows[0].next_inc_date.getMonth() < 10){
                    month = "0" + (data.rows[0].next_inc_date.getMonth() + 1);
                }
                else{
                    month = (data.rows[0].next_inc_date.getMonth() + 1);
                }
                if(data.rows[0].next_inc_date.getDate() < 10){
                    date = "0" + (data.rows[0].next_inc_date.getDate());
                }
                else{
                    date = (data.rows[0].next_inc_date.getDate());
                }
                data.rows[0].next_inc_date = data.rows[0].next_inc_date.getFullYear() + "-" + month + "-" + date;
                
            }
            
            //--
            if(data.rows[0].joining_date != null || data.rows[0].joining_date != undefined){
                if(data.rows[0].joining_date.getMonth() < 10){
                    month = "0" + (data.rows[0].joining_date.getMonth() + 1);
                }
                else{
                    month = (data.rows[0].joining_date.getMonth() + 1);
                }
                if(data.rows[0].joining_date.getDate() < 10){
                    date = "0" + (data.rows[0].joining_date.getDate());
                }
                else{
                    date = (data.rows[0].joining_date.getDate());
                }
                data.rows[0].joining_date = data.rows[0].joining_date.getFullYear() + "-" + month + "-" + date;
    
            }
            
            res.render("update_view_add", { title: "Update/View/Add Staff", msg: "", kgid: admin_kgid, data: [], currPage: 0, updateStaffData: data.rows[0], current_years: current_years[0] });
        });
    } catch (err) {
        //console.log(err);
        res.send("Could not find staff!!!");
    }
}

const updateStaff = async (req, res) => {
    const admin_kgid = req.params.kgid;
    const current_years = await getCurrPrevYear();
    const {
        staff_kgid,
        staff_name,
        staff_working_place,
        staff_gender,
        staff_designation,
        staff_role,
        staff_contact,
        staff_email,
        pay_scale_min,
        pay_scale_max,
        department,
        ag_code,
        dob,
        ddo_code,
        next_inc_date,
        joining_date,
        staff_group,
        head_of_account,
        el_bal,
        hpl_bal,
        staff_bank_name,
        staff_account_number,
        staff_branch_name,
        staff_pran,
        payment_mode,
        pan_number,
        password,
        cpassword,
        school_name,
        basic_pay,
        recipient_id
    } = req.body;
    //console.log(staff_kgid, " : ", staff_name, " : ", staff_account_number);
    var query = "update login_credentials set contact=$1, email=$2, role=$3, password=$5 where kgid=$4";
    try {
        if(password == cpassword){
            var values = [staff_contact, staff_email, staff_role, staff_kgid, password];
            await pool.query(query, values);
            query = "update staff set name=$1, working_place=$2, gender=$3, designation=$4, \
            pay_scale_min=$6, pay_scale_max=$7, department=$8, ag_code=$9, \
            dob=$10, ddo_code=$11, next_inc_date=$12, joining_date=$13, \
            staff_group=$14, head_of_account=$15, el_bal=$16, hpl_bal=$17, school_name=$18, basic_pay=$19, \
            recipient_id=$20 where kgid=$5";
            values = [staff_name, staff_working_place, staff_gender, staff_designation, staff_kgid,
                pay_scale_min, pay_scale_max, department, ag_code, dob, ddo_code, next_inc_date,
                joining_date, staff_group, head_of_account, el_bal, hpl_bal, school_name, basic_pay, recipient_id];
            await pool.query(query, values);
            //console.log(payment_mode);
            //console.log(pan_number);
            query = "update staff_bank_details set bank_name=$1, account_no=$2, branch=$3, pran=$4, payment_mode=$6, pan_number=$7 where kgid=$5";
            values = [staff_bank_name, staff_account_number, staff_branch_name, staff_pran, staff_kgid, payment_mode, pan_number];
            await pool.query(query, values);
            res.render("update_view_add", { title: "Update/View/Add Staff", msg: "Info: Staff Details Updated Successfully", kgid: admin_kgid, data: [], currPage: 0, updateStaffData: {}, current_years: current_years[0] });
        } 
        else{
            res.render("update_view_add", { title: "Update/View/Add Staff", msg: "Warning: Passwords do not match!!!", kgid: admin_kgid, data: [], currPage: 0, updateStaffData: {}, current_years: current_years[0] });
        }  
    } catch (err) {
        //console.log(err);
        res.render("update_view_add", { title: "Update/View/Add Staff", msg: "Warning: Some Error Occured!!!", kgid: admin_kgid, data: [], currPage: 0, updateStaffData: {}, current_years: current_years[0] });
    }
}

const deleteStaff = async (req, res) => {
    const admin_kgid = req.params.kgid;
    const current_years = await getCurrPrevYear();
    const staff_kgid = req.query.staff_kgid;
    //console.log(staff_kgid);
    try {
        if(staff_kgid != admin_kgid){
            var query = "delete from login_credentials where kgid=$1";
            await pool.query(query, [staff_kgid]);
            res.render("update_view_add", { title: "Update/View/Add Staff", msg: "Staff Deleted Successfully!!!", kgid: admin_kgid, data: [], currPage: 0, updateStaffData: {}, current_years: current_years[0] });
        }
        else{
            res.render("update_view_add", { title: "Update/View/Add Staff", msg: "Warning: Admin Cannot be deleted!!!", kgid: admin_kgid, data: [], currPage: 0, updateStaffData: {}, current_years: current_years[0] });
        }
        
    } catch (err) {
        //console.log(err);
        res.render("update_view_add", { title: "Update/View/Add Staff", msg: "Couldn't find Staff!!!", kgid: admin_kgid, data: [], currPage: 0, updateStaffData: {}, current_years: current_years[0] });
    }
}

module.exports = {
    updateViewAdd: updateViewAdd,
    viewStaff: viewStaff,
    addStaff: addStaff,
    updateStaff: updateStaff,
    deleteStaff: deleteStaff,
    viewAllStaff: viewAllStaff,
    getUpdateStaffValues: getUpdateStaffValues
};


/*
alter table staff add foreign key(kgid) references login_credentials(kgid) on delete cascade; 
*/