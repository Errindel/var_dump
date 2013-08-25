//"use strict"; http://stackoverflow.com/a/1335881
function ContentItem(data, caller) {
	"use strict";
	data = data.trim();
	
	this.raw = data;
	this.node = caller ; //the containing node
	this.type = "";
	this.html = "";
	this.extraInfo = []; //first element is actual value, other elements are extra data
	this.compound = false;
	var openingQ = data.indexOf("\""),
		closingQ = data.indexOf("\"", openingQ + 1),
		openingP = data.indexOf("("),
		closingP = data.indexOf(")");

	//http://www.php.net/manual/en/language.types.intro.php
	//check primitive scalar types
	if (data.substring(0, 4) == "bool") {
		this.type = "boolean";
		this.html = "Boolean: " + data.substring(openingP + 1, closingP);
		this.extraInfo.push((data.substring(openingP, closingP) == true));
	} else if (data.substring(0, 3) == "int") {
		this.type = "integer";
		this.html = "integer: " + data.substring(openingP + 1, closingP);
		this.extraInfo.push(parseInt(data.substring(openingP + 1, closingP)));
	} else if (data.substring(0, 4) == "float") {
		this.type = "float";
		this.html = "float: " + data.substring(openingP + 1, closingP);
		this.extraInfo.push(parseFloat(data.substring(openingP + 1, closingP)));
	} else if (data.substring(0, 6) == "string") {
		this.type = "string";
		this.html = "string: " + data.substring(openingQ + 1, closingQ);
		this.extraInfo.push(data.substring(openingQ + 1, closingQ));
		this.extraInfo.push("Length of String: " + data.substring(7, closingP));
	}

	// check compound types
	else if (data.substring(0, 5) == "array") {
		this.type = "array";
		this.html = "array { ";
		this.compound = true;
		this.extraInfo.push("Number of Elements: " + data.substring(6, closingP));
	} else if (data.substring(0, 6) == "object") {
		this.type = "object { ";
		this.compound = true;
		this.html = data.substring(8, data.length);
		//TODO: Don't think this is complete
	}

	// check special types
	// ignore resource..'cause I got no clue what those are :Packages
	else if (data == "NULL") {
		this.type = "NULL";
		this.html = "NULL";
	}

	// check for var dump things
	else if (data.indexOf("=&gt;") !== -1) {
		this.type = "key";
		this.html = data;
	}

	// all other cases
	else {
		this.type = "unknown";
		this.html = data;
	}
}

ContentItem.prototype.printOpening = function () {
	"use strict";
	
	var toPrint = "";
	switch(this.type) {
		case "object":
			if(this.node.parent.content.compound) {toPrint += '<li>';}
			toPrint += "<ul class='obj collapible'>"
			break;
		case "array": 
			if(this.node.parent.content.compound) {toPrint += '<li>';}
			toPrint += "<ul class='array collapible'>" + this.html + "[" + this.extraInfo[0] + "]";
			break;
		case "integer":
		case "float":
			toPrint += "<span class='type-number'>" + this.html + "</span>";
			break;
		case "bool":
			toPrint += "<span class='type-boolean'>" + this.html + "</span>";
			break;
		case "string":
			toPrint += "<span class='type-string'>" + this.html + "</span>";
			break;
		case "NULL":
			toPrint += "<span class='type-bull'>" + this.html + "</span>";
			break;
		case "key":
			if(this.node.parent.content.compound) {toPrint += '<li>';}
			toPrint += "<span class='property'>" + this.html + "</span>";
			
			break;
		default:
			toPrint += this.html
	}
	
	return toPrint;
};

ContentItem.prototype.printClosing = function () {
	"use strict";
	
	var toPrint = "";
	switch(this.type) {
		case "object":
			toPrint += "</ul>"
			if(this.node.parent.content.compound) {toPrint += '</li>';}
			break;
		case "array": 
			toPrint += "</ul>";
			if(this.node.parent.content.compound) {toPrint += '</li>';}
			break;
		case "key":
		case "unknown":
			break;
		case "integer":
		case "float":
		case "bool":
		case "string":
		case "NULL":
		default:
			if(this.node.parent.content.compound) {toPrint += '</li>';}
	}
	
	return toPrint;
};