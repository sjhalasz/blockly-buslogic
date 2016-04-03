	 warningMessage = {set:false};
	 oldWarningMessage = {};
	 function blockChanged(){
	 	if(warningMessage.set && warningMessage.nodeId === this.id && oldWarningMessage.message === warningMessage.message) 
	 		return;
	 	if(warningMessage.set && this.id === warningMessage.nodeId){
			this.setWarningText(warningMessage.message);	 	
	 	} else {
			this.setWarningText(null);	 	
	 	}
	 }
	 function setWarningMessage(node, message){
		warningMessage = {set:true, nodeId: node.id, message: message};
	   throw message;
	 }
	 function cancelWarningMessage(){
		warningMessage = {set:false};
	 }

    function translateDom(dom){
    	indent = 0;
		document.getElementById('message').value = '';      
      if(dom.tagName != 'XML') throw 'expecting XML tag';
      dom = dom.children;
      var validIndicator = document.getElementById('validIndicator');
      try{
        // TODO: allow multiple root blocks but ignore fragments and warn about multiple roots
        if(dom.length > 1) setWarningMessage(dom[dom.length - 1], 'expecting exactly one root block only');
        if(dom.length == 0) throw 'expecting "settlement days" block';
        if(getAttribute(dom[0], 'type') != 'set_variable') setWarningMessage(dom[0], 'expecting root block to be "settlement days" block');
        var r = translateBlocks(dom, {type:'integer', singleton:true});
        return {valid:true, code:r};
      } catch(e){
        return {valid:false, message:e.message || e};
      }
      return r;
    }

    function translateBlocks(nodes, state){
      if(nodes.length != 1) throw'expecting exactly 1 node in translateBlocks';
      var node0 = nodes[0];
      if(!node0.tagName == "BLOCK") throw 'expecting BLOCK tag';
      var children = node0.children;
      var type = getAttribute(node0, 'type');
      indent++;
      var n, count = 0, t, vtype;
      switch(type){
        case 'set_variable':
          r = indentIt() + '<set_variable name="settlement days">\n';
          // may or may not be a "statement" node here with name "variable_value"
          if(children.length == count)setWarningMessage(node0, 'expecting "settlement days" specification statements');
          n = children[count];
          count++;
          if(n.tagName != "STATEMENT") throw 'expecting STATEMENT block';
          if(getAttribute(n, 'name') != 'variable_value') throw 'expecting STATEMENT with name "variable_value"';
          r += translateBlocks(n.children, state);
          r +=  indentIt() + '</set_variable>\n';
          break;
        case 'is_cash_client':
          if(state.type != 'any' && state.type != 'boolean') setWarningMessage(node0, 'cannot be used as ' + state.type);
          r = indentIt() + '<is_cash_client/>\n';
          break;
        case 'security_type':
          if(state.type != 'any' && state.type != 'boolean') setWarningMessage(node0, 'cannot be used as ' + state.type);
          n = children[0]; 
          count++;
          if(getAttribute(n, 'name') != 'security_type') throw 'expecting FIELD node named "security_type"';
          var securityType = n.innerText;
          r = indentIt() + '<security_type>' + securityType + '</security_type>\n';
          break;
        case 'conditional':
          r = indentIt() + '<conditional>\n';
          indent++;
          if(count == children.length) setWarningMessage(node0, 'expecting "if" statements');
			 n = children[count];
          count++;
          r += indentIt() + '<if>\n';
          r += translateBlocks(n.children, merge(state, {type:'boolean', singleton:true}));
          r += indentIt() + '</if>\n';
          if(count == children.length) setWarningMessage(node0, 'expecting "then" statements');
			 n = children[count];
          count++;
          r += indentIt() + '<then>\n';
          r += translateBlocks(n.children, state);
          r += indentIt() + '</then>\n';
          if(count == children.length) setWarningMessage(node0, 'expecting "else" statements');
			 n = children[count];
          count++;
          r += indentIt() + '<else>\n';
          r += translateBlocks(n.children, state);
          r += indentIt() + '</else>\n';
          indent--;
          r += indentIt() + '</conditional>\n';
          break;
        case 'comparison':
          if(state.type != 'any' && state.type != 'boolean') setWarningMessage(node0, 'cannot be used as ' + state.type);
          n = children[count];
          count++;
          if(n.tagName != 'FIELD') throw 'expecting FIELD node';
          if(getAttribute(n, 'name') != 'comparison_operator') throw 'expecting FIELD node named "comparison_operator"';
          r = indentIt() + '<comparison operator="' + n.innerText + '">\n';
			 indent++;
			 if(count == children.length) setWarningMessage(node0, 'expecting comparison statements');
          n = children[count];
          count++;
          if(n.tagName != "STATEMENT") throw 'expecting STATEMENT node';
          if(getAttribute(n, 'name') != 'left') setWarningMessage(node0, 'expecting left comparison statement');
          r += indentIt() + '<left>\n';
          // TODO: need to capture type of left and force conformity to type of right
          r += translateBlocks(n.children, merge(state,{type:'any', singleton:true}));
			 r += indentIt() + '</left>\n';
			 if(count == children.length) setWarningMessage(node0, 'expecting right comparison statement');
          n = children[count];
          count++;
          if(n.tagName != "STATEMENT") throw 'expecting STATEMENT node';
          if(getAttribute(n, 'name') != 'right') throw 'expecting "right"';
          r += indentIt() + '<right>\n';
          r += translateBlocks(n.children, merge(state,{type:'any', singleton:true}));
			 r += indentIt() + '</right>\n';
			 indent--;
          r += indentIt() + '</comparison>\n';
          break;
        case 'conjunction':
         if(state.type != 'any' && state.type != 'boolean') setWarningMessage(node0, 'cannot be used as ' + state.type);
        	n = children[count];
        	count++;
         if(n.tagName != 'FIELD') throw 'expecting FIELD node';
         if(getAttribute(n, 'name') != 'conjunction_operator') throw 'expecting FIELD node named "conjunction_operator"';
         r = indentIt() + '<conjunction operator="' + n.innerText + '">\n';
         if(count == children.length) setWarningMessage(node0, 'expecting conjunction statements');
         n = children[count];
         count++;
         if(n.tagName != "STATEMENT") throw 'expecting STATEMENT node';
         if(getAttribute(n, 'name') != 'conjunction_statement') throw 'expecting "conjunction_statements"';
         r += translateBlocks(n.children, merge(state, {singleton:false}));
			r += indentIt() + '</conjunction>\n';        
        	break;
        case 'variable':
          n = children[count];
          count++;
          if(n.tagName != 'FIELD') throw 'expecting FIELD node';
          if(getAttribute(n, 'name') != 'variable_type') throw 'expecting FIELD node named "variable_type"';
		    vtype = n.innerText;
          if(state.type != 'any' && state.type != vtype) setWarningMessage(node0, vtype + ' cannot be used as ' + state.type);
			 n = children[count];
			 count++;
          if(getAttribute(n, 'name') != 'variable_name') throw 'expecting FIELD node named "variable_name"';
          if(isInvalidVariableName(n.innerText)) setWarningMessage(node0, 'variable name cannot contain < > & %');
          r = indentIt() + '<variable type="' + vtype + '">' + n.innerText + '</variable>\n';
          break;
        case 'value':
          n = children[count];
          count++;
          if(n.tagName != 'FIELD') throw 'expecting FIELD node';
          if(getAttribute(n, 'name') != 'variable_type') throw 'expecting FIELD node named "variable_type"';
		    vtype = n.innerText;
          if(state.type != 'any' && state.type != vtype) setWarningMessage(node0, vtype + ' cannot be used as ' + state.type);
			 n = children[count];
			 count++;
          if(getAttribute(n, 'name') != 'value_input') throw 'expecting FIELD node named "value_input"';
			 if(isInvalidVariableName(n.innerText)) setWarningMessage(node0, 'value cannot contain < > & %');
			 t = n.innerText;
			 if(invalidType(vtype, t)) setWarningMessage(node0, 'not a valid ' + vtype);
          r = indentIt() + '<value type="' + vtype + '">' + t + '</value>\n';
          break;
        default:
          throw 'unknown type: ' + type;
          break;
      }
      indent--;
      // if there's another child node in node0 it's a "NEXT" ...
      if(children.length > count){
        n = children[count];
        if(n.tagName !== "NEXT") throw 'expecting "NEXT" node';
        if(state.singleton) setWarningMessage(n.children[0], 'expecting one element only');
        r += translateBlocks(n.children, state);
      }
      return r;
    }
    function indentIt(){
      return Array((2 * indent) + 1).join(' ');
    }
