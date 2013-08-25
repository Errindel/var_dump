function TreeNode(content){
	this.level = 0;
	this.children = new Array();
	this.parent = undefined;
	this.content = new ContentItem(content, this);
}

TreeNode.prototype.addChild = function(child){
	if(!DEBUG_PRINTJSON){child.parent = this;}
	child.level = this.level + 1;
	
	this.children.push(child);
}

TreeNode.prototype.print = function(text) {
	if(text == undefined) {
		var text = "<div id='var_dump'>";
		var first = true;
	}

	
	text += (this.content.printOpening());
	
	var i =0;
	while(i < this.children.length) {
		text = this.children[i].print(text);
		i++;
	}
	
	text += (this.content.printClosing());
	
	if(first) {
		text += "</div>" //close the #var_dump div
	}
	
	return text;
}