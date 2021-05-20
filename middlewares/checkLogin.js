const checkLogin = (req, res, next) => {
    var userToken = localStorage.getItem("userToken");
    try {
        var decoded = jwt.verify(userToken, 'loginToken');
    } catch (err) {
        res.redirect("/");
    }
    next();
}

module.exports = checkLogin;