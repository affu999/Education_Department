const pool = require("../db/db_con");

const getDashboard = async (req, res) => {
    const { role, kgid } = req.params;
    var current_years = [];
    var query = "select * from current_years";
    await pool.query(query).then((data) => {
        current_years.push(data.rows[0]);
    });
    console.log(current_years);
    query = "select * from staff where kgid=$1";
    if(role === "admin"){
        await pool.query(query, [kgid]).then(async (data) => {            
            res.render("admin_dashboard", { title: "Admin Dashboard", msg: "", adminInfo: data.rows, kgid: kgid, current_years: current_years[0] });
        });
    }
    else if(role === "teacher"){
        await pool.query(query, [kgid]).then((data) => {
            res.render("admin_dashboard", { title: "Teacher Dashboard", msg: "", teacherInfo: data.rows, kgid: kgid, current_years: current_years[0] });
        });
    }
    else{
        res.send("Invalid URL");
    }
    
}

module.exports = getDashboard;