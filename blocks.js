Blockly.Blocks['settlement_days'] = {
  init: function() {
    this.appendStatementInput("days_calculation")
        .setCheck(null)
        .appendField("Settlement Days");
    this.setInputsInline(false);
    this.setColour(120);
    this.setTooltip('This routine calculates settlement days.');
  }
};

Blockly.Blocks['set_variable'] = {
  init: function() {
    this.appendStatementInput("set_variable_name")
        .setCheck(null)
        .appendField("set")
        .appendField(new Blockly.FieldVariable("<variable name>"), "variable_name")
        .appendField("to");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['client'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("client")
        .appendField(new Blockly.FieldDropdown([["AFV", "afv"], ["BFF", "bff"], ["DNC", "dnc"], ["GBF", "gbf"], ["JQF", "jqf"], ["JSF", "jsf"], ["LLB", "llb"], ["MSB", "msb"], ["PPR", "ppr"]]), "client_code_dropdown");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['conditional'] = {
  init: function() {
    this.appendStatementInput("condition")
        .setCheck(null)
        .appendField("if");
    this.appendStatementInput("condition_true_statements")
        .setCheck(null)
        .appendField("then");
    this.appendStatementInput("condition_false_statements")
        .setCheck(null)
        .appendField("else");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['comparison'] = {
  init: function() {
    this.appendStatementInput("comparison_operator")
        .setCheck(null)
        .appendField(new Blockly.FieldDropdown([["equals", "equals"], ["less than", "less than"], ["greater than", "greater than"]]), "comparison_operator_dropdown");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['variable'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable("<variable name>"), "variable_name");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['value'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("<value>"), "value_input");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};
