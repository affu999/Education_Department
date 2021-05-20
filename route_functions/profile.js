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

const profile = async (req, res) => {
    const role = req.params.role;
    const kgid = req.params.kgid;
    const current_years = await getCurrPrevYear();
    if (role === "admin") {
        var query = "select * from staff s, staff_bank_details sbd where s.kgid=sbd.kgid and s.kgid=$1";
        await pool.query(query, [kgid]).then((data) => {
            res.render("profile", { title: "Admin", msg: "", kgid: kgid, admin_info: data.rows, current_years: current_years[0]});
        });
        // res.render("profile", { title: "Admin", msg: "", kgid: kgid});
    }
    else {
        res.render("profile", { title: "Teacher", msg: "", kgid: kgid, teacher_info: data.rows, current_years: current_years[0]});
    }
}

module.exports = profile;