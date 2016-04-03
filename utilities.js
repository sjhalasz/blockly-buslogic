    function getAttribute(node, name){
      var attributes = node.attributes;
      for(var i = 0; i < attributes.length; i++){
        if(attributes[i].name == name) return attributes[i].value;
      }
    }
	
	function getValue(control, textDate){
		var tag = control.tagName;
		var type, value;
		switch(tag){
			case 'INPUT':
				type = control.type;
				switch(type){
					case'checkbox':
						return control.checked;
					default:
						return getType(control.value, textDate)[2];
				}
				break;
			case 'SELECT':
				return getAttribute(control.selectedOptions[0], 'value');
			default:
		}
	}

	function setValue(control, value){
		var tag = control.tagName;
		var type, value;
		switch(tag){
			case 'INPUT':
				type = control.type;
				switch(type){
					case'checkbox':
						control.checked = value;
					default:
						control.value = value;
				}
				break;
			case 'SELECT':
				control.value = value;
			default:
		}
	}

	function getType(text, textDate){
	   // returns [<type>, <js code>, <converted value>]
		if(isNaN(text)) {
			var date = new Date(text);
			if('Invalid Date' === date.toDateString()){
				switch(text.toUpperCase()){
					case 'TRUE':
						return ['boolean', 'true', true];
						break;
					case 'YES':
						return ['boolean', 'true', true];
						break;
					case 'FALSE':
						return ['boolean', 'false', false];
						break;
					case 'NO':
						return ['boolean', 'false', false];
						break;
					default:
						return ['text', '"' + text + '"', text];
						break;				
				}
			} else {
				if(textDate) {
					return ['text', '"' + text + '"', text];
				} else {
					var time = date.getTime();
					return ['date', '' + time, time];
			}
			}
		} else {
			var num = Number(text);
			if(num == Math.floor(num)){
				return ['integer', text, num];			
			} else {
				return ['number', text, num];			
			}			
		}	
	}

   function invalidType(type, text){
		if(type === 'text') return false;
		var ttype = getType(text)[0];
		if(type === ttype) return false;
		if(type === 'number' && ttype === 'integer') return false; 
		return true;
   }

	function eq (a, b) {
		return a === b;
	}

	function gt (a, b) {
		return a > b;
	}

	function lt (a, b) {
		return a < b;
	}

	function ne (a, b) {
		return !eq(a, b);
	}

	function inn (a, b) {
		return -1 != b.indexOf(a);
	}

	function nin(a, b) {
		return !inn(a, b);
	}

	function getAttribute(node, name){
		return node && node.attributes.getNamedItem(name).nodeValue;
	}

Array.prototype.indexOfObject = function arrayObjectIndexOf(property, value) {
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i][property] === value) return i;
    }
    return -1;
}


   function uniqueInputs(inputs) {
    	var a = [];
    		for (var i=0, l=inputs.length; i<l; i++)
        		if (a.indexOfObject('name', inputs[i].name) === -1)
            	a.push(inputs[i]);
    	return a;
	}

	function merge(obj1,obj2){
   	 var obj3 = {};
    	for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    	for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    	return obj3;
	} 
 	
    function isInvalidVariableName(name){
      return /[<>&%'"]/g.test(name);
    }
