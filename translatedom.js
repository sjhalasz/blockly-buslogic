    function translateDom(dom){
    	unSelectBlock();
      indent = 0;
		document.getElementById('message').value = '';      
      if(dom.tagName != 'XML') throw 'expecting XML tag';
      dom = dom.children;
      var validIndicator = document.getElementById('validIndicator');
      try{
        if(dom.length > 1) {selectBlock(dom[dom.length - 1]); throw 'expecting exactly one root block only';}
        if(dom.length == 0) throw 'expecting exactly one root block';
        if(getAttribute(dom[0], 'type') != 'set_variable') {selectBlock(dom[0]); throw 'expecting root block to be set variable block';}
        var r = translateBlocks(dom, {type:'integer', singleton:true});
        validIndicator.innerHTML = '\u2713';
        validIndicator.style.color = 'green'
      } catch(e){
   	  document.getElementById('message').value = e.message || e;      
        validIndicator.innerHTML = '\u2a02';
        validIndicator.style.color = 'red';
        r = '';
      }
      return r;
    }

    function translateBlocks(nodes, state){
      if(nodes.length != 1) throw'expecting exactly 1 child node in translateBlocks';
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
          if(children.length == count){selectBlock(node0); throw 'expecting variable specification statements';}
          n = children[count];
          count++;
          if(n.tagName != "STATEMENT") throw 'expecting STATEMENT block';
          if(getAttribute(n, 'name') != 'variable_value') throw 'expecting STATEMENT with name "variable_value"';
          r += translateBlocks(n.children, state);
          r +=  indentIt() + '</set_variable>\n';
          break;
        case 'is_cash_client':
          if(state.type != 'any' && state.type != 'boolean') throw 'is_cash_client cannot be used as ' + state.type;
          r = indentIt() + '<is_cash_client/>\n';
          break;
        case 'security_type':
          if(state.type != 'any' && state.type != 'boolean') throw 'security_type = cannot be used as ' + state.type;
          n = children[0]; 
          count = 1;
          if(getAttribute(n, 'name') != 'security_type') throw 'expecting FIELD node named "security_type"';
          var securityType = n.innerText;
          r = indentIt() + '<security_type>' + securityType + '</security_type>\n';
          break;
        case 'conditional':
          r = indentIt() + '<conditional>\n';
          indent++;
          if(count == children.length) {selectBlock(node0); throw 'expecting "if" statements';}
			 n = children[count];
          count++;
          r += indentIt() + '<if>\n';
          r += translateBlocks(n.children, merge(state, {type:'boolean', singleton:true}));
          r += indentIt() + '</if>\n';
          if(count == children.length) {selectBlock(node0); throw 'expecting "then" statements';}
			 n = children[count];
          count++;
			 if(state.singleton && n.children.length > 1) throw'only one element allowed';
          r += indentIt() + '<then>\n';
          r += translateBlocks(n.children, state);
          r += indentIt() + '</then>\n';
          if(count == children.length) {selectBlock(node0); throw 'expecting "else" statements';}
			 n = children[count];
          count++;
			 if(state.singleton && n.children.length > 1) throw'only one element allowed';
          r += indentIt() + '<else>\n';
          r += translateBlocks(n.children, state);
          r += indentIt() + '</else>\n';
          indent--;
          r += indentIt() + '</conditional>\n';
          break;
        case 'comparison':
          if(state.type != 'any' && state.type != 'boolean') throw 'comparison cannot be used as ' + state.type;
          n = children[0];
          count = 1;
          if(n.tagName != 'FIELD') throw 'expecting FIELD node';
          if(getAttribute(n, 'name') != 'comparison_operator') throw 'expecting FIELD node named "comparison_operator"';
          r = indentIt() + '<comparison operator="' + n.innerText + '">\n';
			 indent++;
			 if(count == children.length) {selectBlock(node0); throw 'expecting comparison statements';}
          n = children[count];
          count++;
          if(n.tagName != "STATEMENT") throw 'expecting STATEMENT node';
          if(getAttribute(n, 'name') != 'left') {selectBlock(node0); throw 'expecting comparison statements';}
          r += indentIt() + '<left>\n';
          // TODO: need to capture type of left and force conformity to type of right
          r += translateBlocks(n.children, merge(state,{type:'any', singleton:true}));
			 r += indentIt() + '</left>\n';
			 if(count == children.length) {selectBlock(node0); throw 'expecting comparison statements';}
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
         if(state.type != 'any' && state.type != 'boolean') throw 'conjunction cannot be used as ' + state.type;
        	n = children[0];
        	count = 1;
         if(n.tagName != 'FIELD') throw 'expecting FIELD node';
         if(getAttribute(n, 'name') != 'conjunction_operator') throw 'expecting FIELD node named "conjunction_operator"';
         r = indentIt() + '<conjunction operator="' + n.innerText + '">\n';
         if(count == children.length) {selectBlock(node0); throw 'expecting conjunction statements';}
         n = children[count];
         count++;
         if(n.tagName != "STATEMENT") throw 'expecting STATEMENT node';
         if(getAttribute(n, 'name') != 'conjunction_statement') {selectBlock(node0); throw 'expecting "conjunction_statements"';}
         r += translateBlocks(n.children, merge(state, {singleton:false}));
			r += indentIt() + '</conjunction>\n';        
        	break;
        case 'variable':
          n = children[0];
          count = 1;
          if(n.tagName != 'FIELD') throw 'expecting FIELD node';
          if(getAttribute(n, 'name') != 'variable_type') throw 'expecting FIELD node named "variable_type"';
		    vtype = n.innerText;
          if(state.type != 'any' && state.type != vtype) throw vtype + ' cannot be used as ' + state.type;
			 n = children[count];
			 count++;
          if(getAttribute(n, 'name') != 'variable_name') throw 'expecting FIELD node named "variable_name"';
          if(isInvalidVariableName(n.innerText)) {selectBlock(node0); throw 'variable name cannot contain < > & %';}
          r = indentIt() + '<variable type="' + vtype + '">' + n.innerText + '</variable>\n';
          break;
        case 'value':
          n = children[0];
          count = 1;
          if(n.tagName != 'FIELD') throw 'expecting FIELD node';
          if(getAttribute(n, 'name') != 'variable_type') throw 'expecting FIELD node named "variable_type"';
		    vtype = n.innerText;
          if(state.type != 'any' && state.type != vtype) throw vtype + ' cannot be used as ' + state.type;
			 n = children[count];
			 count++;
          if(getAttribute(n, 'name') != 'value_input') throw 'expecting FIELD node named "value_input"';
			 if(isInvalidVariableName(n.innerText)) {selectBlock(node0); throw 'value cannot contain < > & %';}
			 t = n.innerText;
			 if(invalidType(vtype, t)) throw 'value ' + t + ' is not a valid ' + vtype;
          r = indentIt() + '<value type="' + vtype + '">' + t + '</value>\n';
          break;
        default:
          throw 'unknown type: ' + type;
          break;
      }
      indent--;
      // if there's another child node in node0 it's a "NEXT" ...
      if(children.length > count){
        if(state.singleton) throw 'expecting one element only';
        n = children[count];
        if(n.tagName != "NEXT") throw 'expecting "NEXT" node in "set_variable"';
        r += translateBlocks(n.children, state);
      }
      return r;
    }
    function indentIt(){
      return Array((2 * indent) + 1).join(' ');
    }
