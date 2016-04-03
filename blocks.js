  Blockly.Blocks['set_variable'] = {
  init: function() {
  	 this.appendDummyInput()
		  .appendField('settlement days {type: integer}')
 		  .appendField('=');
    this.appendStatementInput("variable_value")
        .setCheck(null);
    this.setInputsInline(false);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  onchange: blockChanged
};

Blockly.Blocks['is_cash_client'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("is cash client");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setColour(120);
    this.setHelpUrl('http://www.example.com/');
  },
  onchange: blockChanged
};

security_type_list = [
  ["stocks", "stocks"], 
  ["bonds", "bonds"], 
  ["money market", "money_market"], 
  ["treasury bills", "treasury_bills"], 
  ["mutual funds", "mutual_funds"], 
  ["options", "options"]
  ];

Blockly.Blocks['security_type'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("security type =")
        .appendField(new Blockly.FieldDropdown(security_type_list), "security_type");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setColour(120);
    this.setHelpUrl('http://www.example.com/');
  },
  onchange: blockChanged
};

Blockly.Blocks['conditional'] = {
  init: function() {
  	 this.appendDummyInput()
  	     .appendField('if');
    this.appendStatementInput("if")
        .setCheck(null);
    this.appendDummyInput()
        .appendField('then');
    this.appendStatementInput("then")
        .setCheck(null);
    this.appendDummyInput()
        .appendField('else');
    this.appendStatementInput("else")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  onchange: blockChanged
};

Blockly.Blocks['comparison'] = {
  init: function() {
    this.appendStatementInput("left")
        .setCheck(null);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["equals", "equals"], ["less than", "less_than"], ["greater than", "greater_than"], ["not equals", "not_equals"], ["in", "in"]]), "comparison_operator");
    this.appendStatementInput("right")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  onchange: blockChanged
};

Blockly.Blocks['conjunction'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["all", "all"], ["any", "any"]]), "conjunction_operator");
    this.appendStatementInput("conjunction_statement")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  onchange: blockChanged
};

Blockly.Blocks['variable'] = {
  init: function() {
  	 this.appendDummyInput()
  	 	  .appendField(new Blockly.FieldDropdown([['number','number'],['integer','integer'],['date','date'],['text','text'],['true/false','boolean']]),'variable_type');
    this.appendDummyInput()
		  .appendField(' ')
        .appendField(new Blockly.FieldVariable("<variable name>"), "variable_name");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setColour(120);
    this.setHelpUrl('http://www.example.com/');
  },
  onchange: blockChanged
};

Blockly.Blocks['value'] = {
  init: function() {
  	 this.appendDummyInput()
  	 	  .appendField(new Blockly.FieldDropdown([['number','number'],['integer','integer'],['date','date'],['text','text']]),'variable_type');
    this.appendDummyInput()
		  .appendField(' ')
        .appendField(new Blockly.FieldTextInput("<value>"), "value_input");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setColour(120);
    this.setHelpUrl('http://www.example.com/');
  },
  onchange: blockChanged
};

