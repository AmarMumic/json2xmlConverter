"use strict";
exports.__esModule = true;
var objData = require("./put your .json file here/json.json"); //importing .json document to object called objData
var userStr = JSON.stringify(objData); //convert object data to string to check"
console.log("Your .json file: " + userStr + "is being converted."); //output .json data string for test
function json2xml(obj) {
    if (typeof obj == 'object' && obj.constructor == Object) {
        for (var a in obj) {
            return objtoXML(a, obj[a]);
        }
    }
    function objtoXML(ins, obj) {
        var doc = '<' + ins;
        if (typeof obj === 'undefined' || obj === null) {
            doc += '/>';
            return doc;
        }
        if (typeof obj !== 'object') {
            doc += '>' + obj + '</' + ins + '>' + '\n';
            return doc;
        }
        if (obj.constructor == Object) {
            for (var i in obj) {
                if (i.charAt(0) == '@') {
                    doc += ' ' + i.substring(1) + '=' + obj[i] + '';
                    delete obj[i];
                }
            }
            if (objLenght(obj) === 0) {
                doc += '/>';
                return doc;
            }
            else {
                doc += '>';
            }
            for (var b in obj) {
                if (obj[b].constructor == Array) {
                    for (var i = 0; i < obj[b].length; i++) {
                        if (typeof obj[b][i] !== 'object'
                            || obj[b][i].constructor == Object) {
                            doc += objtoXML(b, obj[b][i]);
                        }
                    }
                }
                else if (obj[b].constructor == Object
                    || typeof obj[b] !== 'object') {
                    doc += objtoXML(b, obj[b]);
                }
            }
            doc += '</' + ins + '>' + '\n';
            return doc;
        }
    }
    function objLenght(obj) {
        var i = 0;
        for (var a in obj) {
            i++;
        }
        return i;
    }
}
var fs = require('fs'); //FileSystem module whitch allows us to write to a local storage
fs.writeFile("./yourXmlFile.xml", json2xml(objData), function (err) {
    if (err) { //checking for errors
        console.error(err);
        return;
    }
    else
        console.log("Your JSON file has been converted to XML!");
});
