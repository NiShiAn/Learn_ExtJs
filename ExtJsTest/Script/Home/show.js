var selectData;
var appView;
Ext.onReady(function () {
    selectData = new SelectData();
    var control = new AppController(); 
    control.onInit();
    control.GridView.render(Ext.getElementById('content'));
});

Ext.define('CityModel', {
    extend: "Ext.data.Model",
    fields: ['CityId', 'ParentId', 'CityName', 'CreateBy', 'UpdateBy', 'ParentCity']
})
Ext.define('SelectList', {
    extend: 'Ext.data.Model',
    fields: ['Name', 'Status']
})
Ext.define('CityList', {
    extend: 'Ext.data.Model',
    fields: [
        'Name',
        { name: 'Id', mapping: 'Status' }
    ]
})

var SelectData = function () {
    var cityDown = Ext.create('Ext.data.Store', {
        model: 'SelectList'
    });

    Ext.Ajax.request({
        url: '/Home/GetSelectCity',
        method: 'GET',
        async: false,
        success: function (response) {
            var usrData = Ext.util.JSON.decode(response.responseText);
            cityDown.loadData(usrData.items);
        }
    });

    this.data = {
        CityDowm: cityDown,
    }

    this.getData = function () {
        return this.data;
    }
}


Ext.define('AppView', {
    extend: 'Ext.app.ViewModel',
    stores: {
        appStore: {
            model: 'CityModel',
            pageSize: 20,
            proxy: {
                type: 'rest',
                extraParams: '{autoParams}',
                url: '/Home/GetCity',
                reader: {
                    type: 'json',
                    rootProperty: 'items',
                    totalProperty: 'tc'
                }
            },
            autoLoad: true
        },
        ParentCitys: {
            model: 'SelectList',
            autoLoad: false
        },
        ChildCitys: {
            model: 'SelectList',
            autoLoad: false
        }
    },
    data: {
        autoParams: null,
    }
});
Ext.define('MainPanel', {
    extend: 'Ext.form.Panel',
    title: '地区信息',
    buttonAlign: 'center',
    defaultAlign: 'center',
    items: [
        {
            layout: 'form',
            id: "mainForm",
            border: false,
            items: [
                {
                    layout: 'column',
                    border: false,
                    defaults: {
                        labelAlign: 'right',
                        labelWidth: 60,
                        disabled: false,
                        fixed: true,
                        margin: 3
                    },
                    items: [
                        {
                            columnWidth: 0.2,
                            xtype: 'combobox',
                            id: 'qParentId',
                            name: 'parentId',
                            fieldLabel: '所属区域',
                            bind: { store: '{ParentCitys}', value: '{0}' },
                            selectOnFocus: true,
                            typeAhead: false,
                            editable: false,
                            queryMode: 'local',
                            valueField: 'Status',
                            emptyText: '--请选择角色--',
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Name}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Name},',
                                '</tpl>'
                            ),
                        },
                        {
                            columnWidth: 0.2,
                            xtype: 'combobox',
                            id: 'qCityId',
                            name: 'cityId',
                            fieldLabel: '子地区',
                            bind: { store: '{ChildCitys}', value: '{0}' },
                            selectOnFocus: true,
                            typeAhead: false,
                            editable: false,
                            queryMode: 'local',
                            valueField: 'Id',
                            //emptyText: '--请选择--',
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Name}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Name}',
                                '</tpl>'
                            ),
                        },
                        
                    ]
                }
            ],
            buttons: [
                {
                    xtype: 'button',
                    text: '查询',
                    handler: ''
                },
                {
                    xtype: 'button',
                    text: '添加',
                    handler: ''
                },
                {
                    xtype: 'button',
                    text: '花瓣',
                    handler: 'Shjk'
                }
            ]
        },
        {
            xtype: 'grid',
            bind: { store: '{appStore}' },
            columns: [
                { header: "地区编号", dataIndex: 'CityId', sortable: true, flex: 1 },
                { header: "地区名", dataIndex: 'CityName', sortable: true, flex: 1 },
                { header: "所属区域编号", dataIndex: 'ParentId', sortable: true, flex: 1, hidden: true },
                { header: "所属区域", dataIndex: 'ParentCity', sortable: true, flex: 1 },
                { header: "创建人", dataIndex: 'CreateBy', sortable: true, flex: 1 },
                { header: "更新人", dataIndex: 'UpdateBy', sortable: true, flex: 1 },
            ],
            bbar: new Ext.PagingToolbar(
                {
                    bind: { store: '{appStore}' },
                    pageSize: 20,
                    dock: 'bottom',
                    displayInfo: true,
                    displayMsg: '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
                    emptyMsg: "没有记录"
                }
            ),
        }
    ]
});


Ext.define('QueryWindow', {
    extend: 'Ext.window.Window',
    title: '用户查询',
    closeAction: 'hide',
    width: 830,
    height: 420,
    resizable: true,
    autoScroll: true,
    layout: 'form',
    buttons: [{
        text: '确定',
        handler: 'SelectUser'
    }, {
        text: '取消',
        handler: 'CancelSelect'
    }],
    items: [
        {
            xtype: 'fieldset',
            title: '一个',
            checkboxToggle: true,
            width: 800,
            height: 160,
            listeners: {
                beforecollapse: function (e, eOpt) {
                    //e.items.each(function (i) {
                    //    i.items.each(function (i) {
                    //        i.setValue(false);
                    //    });
                    //});
                    e.checkboxCmp.getValue();
                    alert("取消");
                    return false;
                },
                beforeexpand: function (e, eOpt) {
                    //e.items.each(function (i) {
                    //    i.items.each(function (j) {
                    //        j.setValue(true);
                    //    });
                    //});
                    e.checkboxCmp.getValue();
                    alert("全选");
                    return false; 
                }
            },
        },
        {
            xtype: 'fieldset',
            title: '两个',
            checkboxToggle: true,
            width: 800,
            height: 160,
            items: [
                {
                    xtype: "checkboxgroup",
                    id: 'group',
                    columns: 3,
                    allowBlank: false,
                    items:
                    [
                        {
                            name: "cb-auto-1",
                            id: 'cb1',
                            boxLabel: "档案编号",
                            inputValue: 1,
                            checked: true
                        }
                        ,
                        {
                            name: "cb-auto-2",
                            id: 'cb2',
                            boxLabel: "负 责 人",
                            inputValue: 2
                        },
                        {
                            name: "cb-auto-3",
                            id: 'cb3',
                            boxLabel: "参 加 人",
                            inputValue: 3
                        },
                        {
                            name: "cb-auto-4",
                            id: 'cb4',
                            boxLabel: "经费预算",
                            inputValue: 4
                        }
                    ],
                }
            ],
            listeners: {
                beforecollapse: function (e, eOpt) {
                    Ext.getCmp('group').items.each(function (cmp) {
                        cmp.setValue(e.checkboxCmp.getValue());
                    })
                    //e.items.each(function (i) {
                    //    i.items.each(function (i) {
                    //        i.setValue(false);
                    //    });
                    //});
                    //alert("取消");
                    return false;
                },
                beforeexpand: function (e, eOpt) {
                    Ext.getCmp('group').items.each(function (cmp) {
                        cmp.setValue(e.checkboxCmp.getValue());
                    })
                    //e.items.each(function (i) {
                    //    i.items.each(function (j) {
                    //        j.setValue(true);
                    //    });
                    //});
                    //alert("全选");
                    return false;
                }
            },

        }
    ]
});
Ext.define('SelectWindow', {
    extend: 'Ext.window.Window',
    title: '用户查询',
    closeAction: 'hide',
    width: 500,
    height: 260,
    resizable: true,
    autoScroll: true,
    layout: 'form',
    buttons: [{
        text: '确定',
        handler: ''
    }, {
        text: '取消',
        handler: ''
    }],
    items: [
        {
            xtype: 'combobox',
            id: 'EditState',
            columnWidth: 0.8,
            fieldLabel: '用户状态',
            bind: { store: '{SelectList}', value: '{0}' },
            selectOnFocus: true,
            editable: false,
            queryMode: 'local',
            valueField: 'Status',
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '<div class="x-boundlist-item">{Name}</div>',
                '</tpl>'
            ),
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '{Name}',
                '</tpl>'
            )
        }
    ]
});


Ext.define('AppController', {
    extend: 'Ext.app.ViewController',
    GridView: null,
    Windows: null,
    onInit: function () {
        //主页面实例化
        appView = new AppView();
        this.GridView = new MainPanel({
            controller: this,
            viewModel: appView
        });
        appView.get('ParentCitys').loadData(selectData.getData().CityDowm.getRange());

        this.Windows = new SelectWindow({
            controller: this,
            viewModel: null
        });
    },
    Shjk: function () {
        this.Windows.show();
    },
    CityOnChange: function (combo, record, eOpts) {
        var cid = record[0].data.Status;
        if (cid && cid != 0) {
            Ext.Ajax.request({
                url: '/Home/GetCityByParentId?pid=' + cid,
                method: 'GET',
                success: function (response) {
                    var usr_data = Ext.util.JSON.decode(response.responseText);
                    appView.get('ChildCitys').loadData(usr_data.items);
                    Ext.getCmp('qParentId').setValue(cid);
                }
            });
        }
    }
});

