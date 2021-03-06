
// @source core/form/Number.js

Ext.form.NumberField.override({
    setValue: function (v) {
        this.callParent(arguments);

        if (this.trimTrailedZeros === false) {
            var value = this.getValue(),
                strValue;
        
            if (!Ext.isEmpty(value, false)) {
                strValue = value.toFixed(this.decimalPrecision).replace(".", this.decimalSeparator);    
                this.setRawValue(strValue);
            }
        }
    }
});