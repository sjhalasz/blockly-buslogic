	 function translateXml(xml){
	   var parser = new DOMParser();
      var dom = parser.parseFromString(xml, "text/xml");
		if(dom.nodeName != '#document') throw 'translateXml expected root node named "#document"';
		return translateNodes(dom.children, {}); // 2nd argument is current parse state
	 }    

	 function translateNodes(nodes, state){
	   var code = '';																																																																																																																																																
	   var inputs = [];
	 	for(var i = 0; i < nodes.length; i++){
		  var t = translateNode(nodes[i], state);
		  inputs = inputs.concat(t.inputs);
		  code += t.code;
	 	}
	 	return {code:code, inputs:uniqueInputs(inputs)};
	 }

    function translateNode(oneNode, state){
		var code, inputs;	
		var tag = oneNode.tagName;
		var t, variableName, ifNode, ifCode, thenNode, thenCode, elseNode, elseCode;
		var conjunctionOperator, comparisonOperator;
		var left, right;
		var children = oneNode.children;
	   inputs = [];
		switch(tag){
			case 'set_variable':
				variableName = getAttribute(oneNode, 'name');
				variableName = variableName.replace(' ', '_');
				t = translateNodes(children, state);
				code = variableName + ':function(inputs){';
				code += 'return ' + t.code + '}'; 
				inputs = t.inputs;
				break;
			case 'is_cash_client':
				code = 'inputs.is_cash_client';	
				inputs = [{name:'is_cash_client', type:'boolean'}];		
				break;
			case 'security_type':
				code = 'inputs.security_type === "' + oneNode.textContent + '"';
				inputs = [{name:'security_type', type:'security_type'}];				
				break;
			case 'conditional':
			   if(children.length != 3) throw 'translateNode conditional expecting 3 children, has ' + children.length;
				ifNode = children[0];
				if(ifNode.tagName != 'if') throw 'translateNode conditional expecting "if" node, got ' + ifNode.tagName;
				ifCode = translateNodes(ifNode.children);
				inputs = inputs.concat(ifCode.inputs);
				ifCode = ifCode.code;
				thenNode = children[1];
				if(thenNode.tagName != 'then') throw 'translateNode conditional expecting "then" node, got ' + thenNode.tagName;
				thenCode = translateNodes(thenNode.children, state);
				inputs = inputs.concat(thenCode.inputs);
				thenCode = thenCode.code;
				elseNode = children[2];
				if(elseNode.tagName != 'else') throw 'translateNode conditional expecting "else" node, got ' + elseNode.tagName;
				elseCode = translateNodes(elseNode.children, state);
				inputs = inputs.concat(elseCode.inputs);
				elseCode = elseCode.code;
				code = '((' + ifCode + ') ? (' + thenCode + ') : (' + elseCode + '))';				
				break;
			case 'conjunction':
			   conjunctionOperator = getAttribute(oneNode, 'operator');
			   switch(conjunctionOperator){
					case 'any':
						conjunctionOperator = '||';
						break;
					case 'all':
						conjunctionOperator = '&&';
						break;
					default:
						throw 'conjunction expecting operator "any" or "all" got ' + conjunctionOperator; 			   
			   }
			   code = [];
			   inputs = [];
			   for(var i = 0; i < children.length; i++){
					t = translateNode(children[i], state);
					code.push(t.code);
					inputs = inputs.concat(t.inputs);			   
			   }
			   code = '(' + code.join(') ' + conjunctionOperator + ' (') + ')';
				break;
			case 'comparison':
				comparisonOperator = getAttribute(oneNode, 'operator');
				switch(comparisonOperator){
					case 'equals':
						comparisonOperator = 'eq';
						break;
					case 'less_than':
						comparisonOperator = 'lt';
						break;
					case 'greater_than':
						comparisonOperator = 'gt';
						break;
					case 'not_equals':
						comparisonOperator = 'ne';
						break;
					case 'in':
						comparisonOperator = 'inn';
						break;
					case 'not_in':
						comparisonOperator = 'nin';
						break;
					default:
						throw 'comparison got invalid operator: ' + comparisonOperator;				
				}
				state = merge(state, {singleton:true});
				left = translateNode(children[0], state);
				inputs = inputs.concat(left.inputs);
				left = left.code;
				right = translateNode(children[1], state);
				inputs = inputs.concat(right.inputs);
				right = right.code;
				code = comparisonOperator + '(' + left + ',' + right + ')';
				break;
			case 'left':
			case 'right':
				code = translateNodes(children, state);
				inputs = code.inputs;
				code = code.code;
				break;
				break;
			case 'variable':
				variableName = oneNode.textContent;
				variableName = variableName.replace(' ', '_');
				var vtype = getAttribute(oneNode, 'type');
				inputs = [{name:variableName, type:vtype}];
				code = 'inputs.' + variableName;
				break;
			case 'value':
				code = oneNode.textContent;	
				code = getType(code)[1].toString();
				break;
			default:
				throw 'translateNode unrecognized tag: ' + tag;
		}
		return {code:code, inputs:inputs};
    }
