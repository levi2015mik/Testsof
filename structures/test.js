var user = require("./user")
//user._restruct()
var data = [
	{name:"Rike",description:"GMN"},
	{name:"Bill",description:"Pec"},
	{name:"Alisa",description:"kvant", ratio:40},
	{name:"Bob",description:"Kvant", ratio:32}];

for(i=0;i<data.length;i++){
	user.add(data[i]).then(
	res => {console.log(res)},
	err => {throw(err)}
	)
}