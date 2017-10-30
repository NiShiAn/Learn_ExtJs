Ext.onReady(function () {
    Ext.create('Ext.panel.Panel', {
        title: '复选框',
        layout: 'column',
        height: 400,
        items: [
            {
                xtype: 'button',
                text: '全选',
                handler: function () {
                    Ext.getCmp('checkg_os').items.each(function (cmp) {
                        cmp.setValue(true);
                    })
                }
            },
            {
                xtype: 'button',
                text: '取消',
                handler: function () {
                    Ext.getCmp('checkg_os').items.each(function (cmp) {
                        cmp.setValue(false);
                    })
                }
            },
            {
                xtype: "checkboxgroup",
                columnWidth: 1,
                id: 'checkg_os',
                columns: 4,
                allowBlank: false,
                items: [
                    {
                        xtype: "checkbox",
                        boxLabel: '哈哈',
                        id: "dd",
                        inputValue: '30',
                        checked: false,
                        handler: function (checkbox, checked) {
                            if (checked) {
                                checkbox.el.setStyle("color", "red");
                            } else {
                                checkbox.el.setStyle("color", "black");
                            }
                        }
                    }
                ],
            }
        ],
        renderTo: 'content'
    });
});