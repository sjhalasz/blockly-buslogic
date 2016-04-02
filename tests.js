	function buildTest(js){
		var code = js.code;
		var inputs = js.inputs;
		var test = document.createElement('div');
		var i, j;
		for(i = 0; i < inputs.length; i++){
			var input = inputs[i];
			var name = input.name;
			var type = input.type;
			var control, list, opt, option;
			var label = document.createElement('label');
			var text = document.createTextNode('  ' + name + ': ');
			label.appendChild(text);
			switch(type){
				case 'boolean':
					control = document.createElement('input');
					control.type = 'checkbox';
					break;
				case 'security_type':
				   list = security_type_list;
					control = document.createElement('select');
					for(j = 0; j < list.length; j++){
						opt = list[j];
						option = document.createElement('option');
						option.text = opt[0];
						option.value = opt[1];
						control.add(option);		
					}
					break;
				case 'date':
					control = document.createElement('input');
					break;
				case 'text':
				case 'number':
				case 'integer':
					control = document.createElement('input');
					break;
				default:
					throw 'buildTests input type not recognized: ' + type;			
			}
			control.name = name;
			label.appendChild(control);
			test.appendChild(label);
		}
		// expect field
		label = document.createElement('label');
		label.appendChild(document.createTextNode('  expect:'));
		control = document.createElement('input');
		label.appendChild(control);
		test.appendChild(label);
		// output field
		label = document.createElement('label');
		label.appendChild(document.createTextNode('  output:'));
		control = document.createTextNode('<>');
		label.appendChild(control);
		test.appendChild(label);
		// pass/fail indicator
		label = document.createElement('label');
		control = document.createElement('scan');
		label.appendChild(control);
		test.appendChild(label);
		// line break
		test.appendChild(document.createElement('br'));
		test.appendChild(document.createElement('br'));
		return test;
	}
	
	function buildTests(js){
		var test = document.getElementById('tests');
		test.innerHTML = '';
		var button = document.createElement('button');
		button.innerHTML = 'Run Tests';
		button.onclick = function() {runTests(js.code);};
		test.appendChild(button);
		var i;
		for(i = 0; i < 10; i++){
			test.appendChild(buildTest(js));
		}
	}

	function runTests(js){
		var tests = document.getElementById('tests');
		var children = tests.children;
		var i, j, test, label, control, name, value, output, obj;
		var inputs = {};
		for(i = 1; i < children.length; i++){
			test = children[i];
			var testChildren = test.children;
			for(j = 0; j < testChildren.length - 4; j++){
				label = testChildren[j];
				control = label.children[0];
				name = control.name;
				value = getValue(control);
				inputs[name] = value;
			}
			eval('obj = {' + js + '}');
			output = obj.settlement_days(inputs);
			// expect
			control = testChildren[testChildren.length - 5];
			control = control.childNodes[1];
			var passfail = control.value == output;
			//output
			control = testChildren[testChildren.length - 4];
			control = control.childNodes[1];
			control.textContent = output;
			// passfail indicator
			control = testChildren[testChildren.length - 3];
			control = control.childNodes[0];
			control.innerHTML = passfail ? '&nbsp;\u2713' : '&nbsp;\u2a02';
			control.style.color = passfail ? 'green' : 'red';
		}
	}

   function backupTests(){
		var backup = [];
		var tests = document.getElementById('tests');
		var children = tests.children;
		if(!children || children.length < 2) return;
		var i, j, test, label, control, name, value;
		for(i = 1; i < children.length; i++){
			test = children[i];
			var testChildren = test.children;
			var inputs = {};
			for(j = 0; j < testChildren.length - 4; j++){
				label = testChildren[j];
				control = label.children[0];
				name = control.name;
				value = getValue(control, true);
				inputs[name] = value;
			}
			backup.push(inputs);
		}
		localStorage.setItem('tests', JSON.stringify(backup));
	}
   
   function restoreTests(){
		var backup = localStorage.getItem('tests');
		backup = eval(backup);
		var tests = document.getElementById('tests');
		var children = tests.children;
		var i, j, test, label, control, name, value;
		for(i = 0; i < backup.length && i < children.length - 1; i++){
			inputs = backup[i];
			test = children[i + 1];
			var testChildren = test.children;
			for(j = 0; j < testChildren.length - 4; j++){
				label = testChildren[j];
				control = label.children[0];
				name = control.name;
				setValue(control, inputs[name]);
			}
		}
   }