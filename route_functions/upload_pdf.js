const pool = require("../db/db_con");

//Get Upload PDF Page
const getUploadPdf = async (req, res) => {
    const admin_kgid = req.params.kgid;
    const current_years = await getCurrPrevYear();
    res.render("upload_pdf", { title: "Upload PDF", msg: "", kgid: admin_kgid, current_years: current_years[0] });
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

//Upload PDF
const uploadPdf = async (req, res) => {
    const admin_kgid = req.params.kgid;
    const current_years = await getCurrPrevYear();
    const pdfType = req.body.pdf_type;
    const fileName = req.file.filename;
    var query = "insert into pdf values($1, $2)";
    await pool.query(query, [fileName, pdfType]);
    res.render("upload_pdf", {title: "Upload PDF", msg: "PDF Uploaded", kgid: admin_kgid, current_years: current_years[0]});
}

module.exports = {
    getUploadPdf: getUploadPdf,
    uploadPdf: uploadPdf
}