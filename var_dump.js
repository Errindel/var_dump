/**
* Returns string of a var_dump. if no vardumps found, returns false
*/

function whatShoudWeBeautify() {
	var toReturn = $("body").html();
	if(toReturn.substring(0,4) == "object".substring(0,4)) {
		return splitDump(toReturn);
	}
	
	if(toReturn.substring(0,4) == "array".substring(0,4)) {
		return splitDump(toReturn);
	}
	
	return false
}

function removeTheDump() {
	$("body").empty()
}

var dump = whatShoudWeBeautify() 

if(dump) {
	removeTheDump();
	
	var tree = generateTheTree(dump);
	$('body').append(tree.print());
}

