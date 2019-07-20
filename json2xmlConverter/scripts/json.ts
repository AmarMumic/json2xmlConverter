let fs = require('fs'); //FileSystem module whitch allows us to read and write local storage

let rawData = fs.readFileSync('./put your .json file here/json.json'); //reads .json in rawdata (buffer data)
let objData = JSON.parse(rawData); //converting raw data from buffer to object

let a:string = '<root>\n'; //string to store whole conversion to .xml

for (let i in objData){ //going through every property of root object (if there is more than one property)
	if (typeof objData[i] !== 'object' || (typeof objData[i] == 'object' && objData[i].constructor == Object)){
		if (isNaN(Number(i))){ //checking if there is name of property; if yes, put <name> (<i>) in xml string
			a += obj2xml(i, objData[i]);
		}
		else { //if not; put <row> instead of <0>,<1>, ...
			a += obj2xml('row', objData[i]); //if root element is object or null or undefined, call conversion function and pass through one by one property
		}
	}
	if (objData[i].constructor == Array){ // checking if root element is array
		for (let b in objData[i]) { 
			if (typeof objData[i][b] === 'undefined' || objData[i][b] === null) { //changing property of null or undefied with " " if property is null, for root element
				a += '<' + i + '></' + i + '>\n';
			}
			else if (typeof objData[i][b] !== 'object' || objData[i][b].constructor == Object) { 
					if (isNaN(Number(i))){ //checking if there is name of property; if yes, put <name> (<i>) in xml string
						a += obj2xml(i, objData[i][b]); //calling conversion function (i)
					}
					else { //if root element is object or null or undefined, call conversion function and pass through one by one property
						a += obj2xml('item', objData[i][b]); //calling conversion function ('row')
					}
			}
			else {
				for (let j = 0; j < objData[i][b].length; j++) {
					if (typeof objData[i][b][j] !== 'object' || objData[i][b][j].constructor == Object) { 
						a += obj2xml(i, objData[i][b][j]); //calling conversion function for every property in array of objects(arrays) and calling function again to check if its array again
					}
				}
			}
		}
	}
}

function obj2xml(ins, obj) { //function for conversion obj to xml string called doc
	let doc = '<' + ins; 
	if (typeof obj === 'undefined' || obj === null) { //changing property of null or undefied "</>" if property is null
		doc += '</>\n';
	}
	if (typeof obj !== 'object') { //writing name of object to xml string (with special character conversion)
		doc += '>' + specialCharacter(obj) + '</' + ins + '>\n';
	}
	if (obj.constructor == Object) { 
		for (let i in obj) {
			if (i.charAt(0) == '@') { //checking if property of object is starting with @ (special circumstance)
					doc += ' ' + i.substring(1) + '=' + obj[i] + '';
					delete obj[i];
			}
		}
		doc += '>\n'; //adding closing tag for properties
		for (let b in obj) {
			if (obj[b].constructor == Array) { //if property is array
				for (let i = 0; i < obj[b].length; i++) {
					if (typeof obj[b][i] === 'undefined' || obj[b][i] === null){ //writing "</>" if object is null or undefied in array 
						doc += '<'+ b + '>' + '< />' + '</'+ b + '>\n'; //making it in array by not calling function because null or undefied is not array
					}
					else if (typeof obj[b][i] !== 'object' || obj[b][i].constructor == Object) { 
						doc += obj2xml(b, obj[b][i]); //calling conversion function for every property in array of objects(arrays) and calling function again to check if its array again
					}
				}
			} else if (typeof obj[b] !== 'object' || obj[b].constructor == Object) { 
				doc += obj2xml(b, obj[b]); //calling conversion function for every object
			}
		}
		doc += '</' + ins + '>\n'; //closing tags
		return doc;
	}
	return doc;
}
function specialCharacter(obj){ //function for replacing special characters
	let str = obj.toString();
	str = str.replace(/\&/gi, '&amp;');
	str = str.replace(/\"/gi, '&quot;');
	str = str.replace(/</gi, '&lt;');
	str = str.replace(/>/gi, '&gt;');
	return str;
}

a += '</root>'; //closing tag for root element

fs.writeFile ("./yourXmlFile.xml", a, (err) => { //exporting xml file
    if (err){ //checking for errors of conversion
        console.error(err);
        return;
    }
    else
        console.log("Your JSON file has been converted to XML!");
})