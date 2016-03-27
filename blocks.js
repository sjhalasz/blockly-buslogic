Blockly.Blocks['settlement_days'] = {
  init: function() {
    this.appendStatementInput("days")
        .setCheck(null)
        .appendField("Settlement Days");
    this.setInputsInline(false);
    this.setColour(120);
    this.setTooltip('This routine calculates settlement days.');
  }
};

Blockly.Blocks['set_variable'] = {
  init: function() {
    this.appendStatementInput("NAME")
        .setCheck(null)
        .appendField("set")
        .appendField(new Blockly.FieldVariable("<variable name>"), "variable")
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
        .appendField(new Blockly.FieldDropdown([["AFV", "afv"], ["BFF", "bff"], ["DNC", "dnc"], ["GBF", "gbf"], ["JQF", "jqf"], ["JSF", "jsf"], ["LLB", "llb"], ["MSB", "msb"], ["PPR", "ppr"]]), "NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['conditional'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck(null)
        .appendField("if");
    this.appendStatementInput("true")
        .setCheck(null)
        .appendField("then");
    this.appendStatementInput("false")
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

