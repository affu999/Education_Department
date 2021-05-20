const pool = require("../db/db_con");


const login = async (req, res, userToken) => {
    try {
        var kgid = req.body.user_kgid;
        var password = req.body.user_password;
        var role = req.body.role;
        var query = "select * from login_credentials where kgid=$1 and password=$2";
        if(role == "admin" || role == "teacher"){
            await pool.query(query, [kgid, password]).then(async (data) => {
                if(data.rows[0].role.trim() == "admin" && (role == "admin" || role == "teacher")){
                    query = "update login_credentials set unique_token=$1 where kgid=$2";
                    await pool.query(query, [userToken, kgid]);
                    req.session.kgid = kgid;
                    req.session.role = role;
                    req.session.userToken = userToken;
                    if(role == "admin"){
                        res.redirect("/dashboard/" + role + "/" + kgid);
                    }
                    else if(role == "teacher"){
                        res.redirect("/teacher");
                    }
                    else{
                        res.send("Invalid Role!!!");
                    }
                }
                else if(data.rows[0].role.trim() == "teacher" && role == "teacher"){
                    query = "update login_credentials set unique_token=$1 where kgid=$2";
                    await pool.query(query, [userToken, kgid]);
                    req.session.kgid = kgid;
                    req.session.role = role;
                    req.session.userToken = userToken;
                    if(role == "admin"){
                        res.redirect("/dashboard/" + role + "/" + kgid);
                    }
                    else if(role == "teacher"){
                        res.redirect("/teacher");
                    }
                    else{
                        res.send("Invalid Role!!!");
                    }
                }
                else {
                    res.render("home", { title: 'Education Department', msg: "Invalid KGID/Password/Role" });
                }
            });
        }
        else{
            res.render("home", { title: 'Education Department', msg: "You must choose Admin/Teacher!!!"});
        }
        
    } catch (err) {
        // console.log("Error Occured in login!!!");
        // console.log(err)
        res.render("home", { title: 'Education Department', msg: "Invalid KGID/Password/Role"});
    }
}


module.exports = login;