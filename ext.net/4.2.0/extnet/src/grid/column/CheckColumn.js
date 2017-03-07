// @source src/grid/Column/CheckColumn.js

Ext.grid.column.Check.override({
    processEvent: function (type, view, cell, recordIndex, cellIndex, e, record, row) {
        var me = this,
            key = type === "keydown" && e.getKey(),
            isClick = type === me.triggerEvent; // Introduced in ExtJS 6.2.0

        // Flag event to tell SelectionModel not to process it.
        e.stopSelection = !key && me.stopSelection;

        // From this point, the code has heavily been changed from ExtJS
        // There's no issue information on this change, and it has been
        // in code since at least commit 7db83a84.
        // The beforecheckchange event was added on 2ae4f6aa (ExtJS 4.1.1).
        if (!me.disabled && !!me.editable && (isClick || (key === e.ENTER || key === e.SPACE))) {
            var store = view.panel.store,
                dataIndex = me.dataIndex,
                checked = !me.isRecordChecked(record),
                eventTarget = view.panel.editingPlugin || view.panel;

            var ev = {
                grid   : view.panel,
                record : record,
                field  : dataIndex,
                value  : !checked,
                row    : row,
                column : me,
                rowIdx : recordIndex,
                colIdx : cellIndex,
                cancel : false
            };

            // Allow apps to hook beforecheckchange and beforeedit
            // Updated from ExtJS 6.0.2 to ExtJS 6.2.0
            if (me.fireEvent("beforecheckchange", me, recordIndex, record, checked, record, e) === false
	            || eventTarget.fireEvent("beforeedit", eventTarget, ev) === false
		        || ev.cancel === true) {

                return;
            }

            ev.originalValue = ev.value;
            ev.value = checked;

            if (eventTarget.fireEvent("validateedit", eventTarget, ev) === false || ev.cancel === true) {
                return;
            }

            if (me.singleSelect) {
                store.suspendEvents();

                store.each(function (record, i) {
                    var value = (i == recordIndex);

                    if (value != me.isRecordChecked(record)) {
                        record.set(dataIndex, value);
                    }
                });

                store.resumeEvents();
                store.fireEvent("datachanged", store);
            } else {
                // ExtJS 6.2.0 introduced recordIndex parameter below
                me.setRecordCheck(record, recordIndex, checked, cell, row, e);
            }

            // Introduced on ExtJS 6.2.0 ('if' block below)
            // Do not allow focus to follow from this mousedown unless the grid is already in actionable mode
            if (isClick && !view.actionableMode) {
                e.preventDefault();
            }
            
            // Updated from ExtJS 6.0.2 to ExtJS 6.2.0
            if (me.hasListeners.checkchange) {
                me.fireEvent("checkchange", me, recordIndex, record, checked, record, e);
            }
            
            eventTarget.fireEvent("edit", eventTarget, ev);
        } else {
            return this.callSuper(arguments);
        }
    }
});
