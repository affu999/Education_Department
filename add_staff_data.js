// Requiring the module
const reader = require('xlsx');
const pool = require("./db/db_con");

function ExcelDateToJSDate(serial) {
   var utc_days  = Math.floor(serial - 25569);
   var utc_value = utc_days * 86400;                                        
   var date_info = new Date(utc_value * 1000);

   var fractional_day = serial - Math.floor(serial) + 0.0000001;

   var total_seconds = Math.floor(86400 * fractional_day);

   var seconds = total_seconds % 60;

   total_seconds -= seconds;

   var hours = Math.floor(total_seconds / (60 * 60));
   var minutes = Math.floor(total_seconds / 60) % 60;

   return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

const getFileData = (file) => {
	var data = [];
	const sheets = file.SheetNames
  
	for(let i = 0; i < sheets.length; i++)
	{
	   const temp = reader.utils.sheet_to_json(
	       file.Sheets[file.SheetNames[i]])
	   temp.forEach((res) => {
	   		var date = ExcelDateToJSDate(res.joindt);
	   		var year = date.getFullYear();
	   		var month = date.getMonth();
	   		var day = date.getDate();
	   		if(month < 9){
	                month = "0" + (month + 1);
	        }
	        else{
	            month = (month + 1);
	        }
	        if(day < 10){
	            date = "0" + day;
	        }

	        res.joindt = year + "-" + month + "-" + day;

	        //----

	        date = ExcelDateToJSDate(res.dob);
	   		year = date.getFullYear();
	   		month = date.getMonth();
	   		day = date.getDate();
	   		if(month < 9){
	                month = "0" + (month + 1);
	        }
	        else{
	            month = (month + 1);
	        }
	        if(day < 10){
	            date = "0" + day;
	        }

	        res.dob = year + "-" + month + "-" + day;

	   		res.pay_scale_min = res.payscale.slice(0,5);
	   		res.pay_scale_max = res.payscale.slice(6,11);
	   		res.role = "teacher";
	     	data.push(res);
	   });
	}
	return data;
}

const getFileData2 = (file) => {
	var data = [];
	const sheets = file.SheetNames
  
	for(let i = 0; i < sheets.length; i++)
	{
	   const temp = reader.utils.sheet_to_json(
	       file.Sheets[file.SheetNames[i]])
	   temp.forEach((res) => {
	     	data.push(res);
	   });
	}
	return data;
}

const uploadData = async () => {
	// Reading our test file
	const file = reader.readFile('./Data.xls');
	const file2 = reader.readFile("./Mobile_No.xls");
	const file3 = reader.readFile("./Pan_Number.xls");
	const file4 = reader.readFile("./Recipient_Id.xls");
	  
	var data = getFileData(file);
	var data2 = getFileData2(file2);
	var data3 = getFileData2(file3);
	var data4 = getFileData2(file4);
	  
	// Printing data
	console.log(data[0]);
	console.log(data2[0]);
	console.log(data3[0]);
	console.log(data4[0]);

	var query = "insert into login_credentials(kgid, password, role) values($1, $2, $3)";
	
	// await pool.query(query, [data[0].kgidno, data[0].Password, data[0].role]);

	// query = "insert into staff(kgid, name, designation, gender, pay_scale_min, pay_scale_max, \
	// joining_date, dob, basic_pay) values($1, $2, $3, $4, $5, $6, $7, $8, $9)";

	// await pool.query(query, [data[0].kgidno, data[0].empname, data[0].designation, data[0].gender, data[0].pay_scale_min,
	//  	data[0].pay_scale_max, data[0].joindt, data[0].dob, data[0].basic]);

	// query = "update login_credentials set contact=$1 where kgid=$2";

	// await pool.query(query, [data2[0].Mobile_No, data[0].kgidno]);

	// query = "insert into staff_bank_details(kgid, pan_number) values($1, $2)";

	// await pool.query(query, [data[0].kgidno, data3[0].PAN_NUMBER]);

	data.map(async (value) => {
		try{
			await pool.query(query, [value.kgidno, value.Password, value.role]);
			query = "insert into staff(kgid, name, designation, gender, pay_scale_min, pay_scale_max, \
			joining_date, dob, basic_pay) values($1, $2, $3, $4, $5, $6, $7, $8, $9)";
			await pool.query(query, [value.kgidno, value.empname, value.designation, value.gender, value.pay_scale_min,
				value.pay_scale_max, value.joindt, value.dob, value.basic]);
		}
		catch(err){

		}
	});

	query = "update login_credentials set contact=$1 where kgid=$2";

	data2.map(async (value) => {
		try{
			await pool.query(query, [value.Mobile_No, value.KGID_No]);
		}
		catch(err){

		}
	});

	query = "insert into staff_bank_details(kgid, pan_number) values($1, $2)";

	data3.map(async (value) => {
		try{
			await pool.query(query, [value.KGID_NO, value.PAN_NUMBER]);
		}
		catch(err){

		}
	});

	query = "update staff set recipient_id=$1 where kgid=$2";

	data4.map(async (value) => {
		try{
			await pool.query(query, [value.Recipient_ID, value.KGID_No]);
		}
		catch(err){
			
		}
	});

}

const uploadData2 = async () => {
	const file = reader.readFile('./gpf_numbers.xls');
	const file2 = reader.readFile('./pran_numbers.xls');

	var data = getFileData2(file);
	var data2 = getFileData2(file2);

	console.log(data[0]);
	console.log(data2[0]);

	var query = "update staff_bank_details set pran=$1 where kgid=$2";
	data.map(async (value) => {
		try{
			await pool.query(query, [value.GPF_Account_Number, value.Kgid_No]);
		}
		catch(err){
			console.log("Error");
			console.log(err);
		}
	});

	data2.map(async (value) => {
		try{
			await pool.query(query, ["" + value.PRAN_No, value.KGID_No]);
		}
		catch(err){
			console.log("Error");
		}
	});
}

//uploadData();
uploadData2()
