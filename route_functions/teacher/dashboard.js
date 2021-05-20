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

const teacherDashboard = async(req, res, next) => {
    const kgid = req.session.kgid;
    const current_years = await getCurrPrevYears();
    var website_data = []
    try {
        var query = "select * from staff where kgid=$1";
        await pool.query(query, [kgid]).then((data) => {
            data.rows[0].basic_pay = Math.round(data.rows[0].basic_pay);
            data.rows[0].pay_scale_min = Math.round(data.rows[0].pay_scale_min);
            data.rows[0].pay_scale_max = Math.round(data.rows[0].pay_scale_max);
            website_data.push(data.rows[0]);
        });
        res.render("./teacher/teacher_dashboard", {title: "Teacher Dashboard", data: website_data, current_years: current_years[0]});
    } catch (err) {
        res.send("Some Error Occured!!!");
    }
}

module.exports = {
    teacherDashboard: teacherDashboard
}