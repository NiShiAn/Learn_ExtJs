var queryModel;
var attricutes;
//#region 数据模型
Ext.define('UserInfo', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'UserNo', type: 'int', mapping: 'USR_ID' },
        { name: 'UserName', type: 'string', mapping: 'USR_LOGIN_NAME' },
        { name: 'UserState', type: 'boolean', mapping: 'USR_FLAG', convert: function (v) { return v ? '在职' : '离职' } },
        { name: 'CreateBy', type: 'string', mapping: 'USR_CREATIONUID' },
        { name: 'CreateDate', type: 'date', mapping: 'USR_CREATIONI_DT', convert: function (v) { return formatDate(v); } },
        { name: 'UpdateBy', type: 'string', mapping: 'USR_UPDATEUID' },
        { name: 'UpdateDate', type: 'date', mapping: 'USR_UPDATE_DT', convert: function (v) { return formatDate(v); } }
    ]
});
Ext.define('UserFlag', {
    extend: 'Ext.data.Model',
    fields: ['Name', 'Status']
})

var userAttribute = function () {
    var userState = Ext.create('Ext.data.Store', {
        model: 'UserFlag'
    });

    var userPolity = Ext.create('Ext.data.Store', {
        model: 'UserFlag'
    });

    Ext.Ajax.request({
        url: '/Home/GetUserAttribute',                
        method: 'GET',
        async: false,
        success: function (response) {
            var usrData = Ext.util.JSON.decode(response.responseText);
            userState.loadData(usrData.StateList);
            userPolity.loadData(usrData.PolityList);
        }
    });

    this.data = {
        UserState: userState,
        UserPolity: userPolity
    }     

    this.getData = function () {
        return this.data;
    }
}
//userAttribute.prototype.getData = function () {
//    return this.data;
//}
//#endregion

//#region 主页版
Ext.define('MainView', {
    extend: 'Ext.app.ViewModel',
    stores: {
        myStore: {
            model: 'UserInfo',
            pageSize: 10,
            proxy: {
                type: 'rest',
                extraParams: '{autoParams}',
                url: '/Home/GetUser',
                reader: {
                    type: 'json',
                    rootProperty: 'items',
                    totalProperty: 'tc'
                }
            },
            autoLoad: true
        }
    },
    data: {
        autoParams: null,
    }
});

Ext.define('UserViewModel', {
    extend: 'Ext.app.ViewModel',
    stores: {
        Flags: {
            model: 'UserFlag',
            autoLoad: false
        },
        Politys: {
            model: 'UserFlag',
            autoLoad: false,
        }
    }
})
var com_political = Ext.create('Ext.form.ComboBox', {
    columnWidth: 0.30,
    fieldLabel: '政治面貌',
    id: 'Political',
    labelWidth: 60,
    labelAlign: 'right',
    bind: { store: '{Politys}', value: '{0}' },
    queryMode: 'local',
    emptyText: '--未选择--',
    displayField: 'Name',
    valueField: 'Id'
});
        
Ext.define('MainForm', {
    extend: 'Ext.form.Panel',
    title: '人员信息',
    buttonAlign: 'center',
    defaultAlign: 'center',
    items: [
        {
            id: 'mainGrid',
            xtype: 'grid',
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [
                        {
                            xtype: 'button',
                            text: '查询',
                            handler: 'QueryUser'
                        }, '-',
                        {
                            xtype: 'button',
                            text: '添加',
                            handler: 'AddUser'
                        }, '-',
                        {
                            xtype: 'button',
                            text: '布局',
                            handler: 'UserLayout'
                        }
                    ]
                }
            ],
            bind: {
                store: '{myStore}'
            },
            columns: [
                { header: "用户编号", dataIndex: 'UserNo', sortable: true, flex: 1 },
                { header: "用户名", dataIndex: 'UserName', sortable: true, flex: 1 },
                { header: "用户状态", dataIndex: 'UserState', sortable: true, flex: 1 },
                { header: "创建人", dataIndex: 'CreateBy', sortable: true, flex: 1 },
                { header: "创建时间", dataIndex: 'CreateDate', sortable: true, flex: 1 },
                { header: "更新人", dataIndex: 'UpdateBy', sortable: true, flex: 1 },
                { header: "更新时间", dataIndex: 'UpdateDate', sortable: true, flex: 1 },
                {
                    header: '操作', dataIndex: 'UserNo', sortable: false, align: 'center', flex: 0.5, renderer: function (val) {
                        return '<a style="cursor: pointer; color: blue;">删除</a>';
                    }
                }
            ],
            listeners: {
                itemdblclick: 'EditUser',
                cellClick: 'DelUser'
            },
            bbar: new Ext.PagingToolbar(
                {
                    bind: { store: '{myStore}' },
                    pageSize: 10,
                    dock: 'bottom',
                    displayInfo: true,
                    displayMsg: '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
                    emptyMsg: "没有记录"
                }),
        }
    ]
});
//#endregion

//#region 查询弹窗
Ext.define('QueryWindow', {
    extend: 'Ext.window.Window',
    title: '用户查询',
    closeAction: 'hide',
    width: 400,
    height: 160,
    resizable: false,
    layout: 'column',
    defaults: {
        xtype: 'textfield',
        labelAlign: 'right',
        align: 'center',
        margin: '5 0 5 0'
    },
    buttons: [{
        text: '查询',
        handler: 'SelectUser'
    }, {
        text: '取消',
        handler: 'CancelSelect'
    }],
    items: [
        {
            xtype: 'textfield',
            id: 'QueryNo',
            columnWidth: 0.8,
            fieldLabel: '用户编号',
        },
        {
            xtype: 'textfield',
            id: 'QueryName',
            columnWidth: 0.8,
            fieldLabel: '用户名称',
        },
        {
            xtype: 'combobox',
            id: 'QueryState',
            columnWidth: 0.8,
            fieldLabel: '用户状态',
            bind: { store: '{Flags}', value: '{0}' },
            selectOnFocus: true,
            editable: false,
            emptyText: '--请选择--',
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
        //{
        //    xtype: 'checkboxfield',
        //    id: 'QueryState',
        //    columnWidth: 0.5,
        //    fieldLabel: '是否在职',
        //}
    ]
});
//#endregion

//#region 编辑弹窗
Ext.define('EditWindow', {
    extend: 'Ext.window.Window',
    title: '编辑用户',
    closeAction: 'hide',
    width: 400,
    height: 140,
    resizable: false,
    layout: 'column',
    defaults: {
        xtype: 'textfield',
        labelAlign: 'right',
        align: 'center',
        margin: '5 0 5 0',
    },
    buttons: [{
        text: '确认',
        handler: 'UpdateUser'
    }, {
        text: '取消',
        handler: 'CancelUpdate'
    }],
    items: [
        {
            xtype: 'textfield',
            id: 'EditId',
            fieldLabel: '用户编号',
            hidden: true
        },
        {
            xtype: 'textfield',
            id: 'EditName',
            columnWidth: 0.8,
            fieldLabel: '用户名称',
        },
        {
            xtype: 'combobox',
            id: 'EditState',
            columnWidth: 0.8,
            fieldLabel: '用户状态',
            bind: { store: '{Flags}', value: '{0}' },
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
//#endregion

//#region 添加弹窗
var addForm = Ext.create('Ext.form.Panel', {
    frame: true,   //frame属性
    width: 390,
    bodyPadding: 5,
    items: [
        {
            xtype: 'textfield',
            id: 'AddName',
            name: 'uName',
            columnWidth: 0.8,
            fieldLabel: '用户名称',
        },
        {
            xtype: 'combobox',
            id: 'AddState',
            name: 'uState',
            columnWidth: 0.8,
            fieldLabel: '用户状态',
            bind: { store: '{Flags}', value: '{0}' },
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

Ext.define('AddWindow', {
    extend: 'Ext.window.Window',
    title: '新增用户',
    closeAction: 'hide',
    width: 400,
    height: 140,
    resizable: false,
    layout: 'column',
    defaults: {
        xtype: 'textfield',
        labelAlign: 'right',
        align: 'center',
        margin: '5 0 5 0',
    },
    buttons: [{
        text: '确认',
        handler: 'InsertUser'
    }, {
        text: '取消',
        handler: 'CancelInsert'
    }],
    items: [addForm]
});
//#endregion

//#region 布局弹窗

var LayoutForm = Ext.create('Ext.form.Panel', {
    frame: true,
    labelWidth: 50,
    labelAlign: 'right',
    layout: 'form',
    width: 690,
    style: 'border-style: none;',
    items: [
        {
            layout: 'column',
            frame: true,
            style: 'border-style: none;',
            defaults: {
                disabled: false,
                fixed: true,
                labelWidth: 60,
                labelAlign: 'right'
            },
            items: [
                {
                    columnWidth: 0.25,
                    xtype: 'textfield',
                    fieldLabel: '姓名',
                    id: 'Name',
                    allowBlank: true,
                    anchor: '90%'
                },
                {
                    columnWidth: 0.30,
                    xtype: 'textfield',
                    fieldLabel: '手机',
                    id: 'phone',
                    allowBlank: true,
                    anchor: '90%'
                },
                {
                    columnWidth: 0.43,
                    xtype: 'textfield',
                    fieldLabel: '邮箱',
                    id: 'email',
                    allowBlank: true,
                    anchor: '90%'
                },
            ]
        },
        {
            layout: 'column',
            frame: true,
            style: 'border-style: none;',
            defaults: {
                disabled: false,
                fixed: true,
                labelWidth: 60,
                labelAlign: 'right'
            },
            items: [
                {
                    columnWidth: 0.25,
                    xtype: 'textfield',
                    fieldLabel: '民族',
                    id: 'PeoPle',
                    allowBlank: true,
                    anchor: '90%'
                },
                com_political,
                //{
                //    columnWidth: 0.30,
                //    xtype: 'textfield',
                //    fieldLabel: '政治面貌',
                //    id: 'Political',
                //    allowBlank: true,
                //    anchor: '90%'
                //},
                {
                    columnWidth: 0.43,
                    xtype: 'radiogroup',
                    fieldLabel: '婚育状况',
                    id: 'Marital',
                    allowBlank: true,
                    anchor: '90%',
                    items: [
                        {
                            name: 'marry',
                            inputValue: '0',
                            boxLabel: '未婚',
                            checked: true
                        }, {
                            name: 'marry',
                            inputValue: '1',
                            boxLabel: '已婚'
                        }, {
                            name: 'marry',
                            inputValue: '1',
                            boxLabel: '未育'
                        }, {
                            name: 'marry',
                            inputValue: '1',
                            boxLabel: '已育'
                        }
                    ]
                },
            ]
        },
        {
            layout: 'column',
            frame: true,
            style: 'border-style: none;',
            defaults: {
                disabled: false,
                fixed: true,
                labelWidth: 60,
                labelAlign: 'right'
            },
            items: [
                {
                    columnWidth: 0.72,
                    xtype: 'textfield',
                    fieldLabel: '家庭地址',
                    id: 'address',
                    allowBlank: true,
                    anchor: '90%'
                },
                {
                    columnWidth: 0.26,
                    xtype: 'textfield',
                    fieldLabel: '健康状况',
                    id: 'health',
                    allowBlank: true,
                    anchor: '90%'
                }
            ]
        },
        {
            layout: 'column',
            frame: true,
            style: 'border-style: none;',
            defaults: {
                disabled: false,
                fixed: true,
                labelWidth: 60,
                labelAlign: 'right'
            },
            items: [
                {
                    columnWidth: 0.98,
                    xtype: 'textareafield',
                    fieldLabel: '个人简介',
                    id: 'note',
                    maxLength: 1000,
                    minLength: 5,
                    allowBlank: true,
                    anchor: '90%'
                }
            ]
        }
    ]
});
Ext.define('LayoutWindow', {
    extend: 'Ext.window.Window',
    title: '布局窗口',
    width: 700,
    closeAction: 'hide',
    resizable: false,
    layout: 'column',
    buttons: [{
        text: '确认'
    }, {
        text: '取消',
        handler: 'CancleLayout'
    }],
    items: [LayoutForm]
});


//#endregion

//#region 控制器
Ext.define('MainController', {
    extend: 'Ext.app.ViewController',
    MyView: null,
    QueryView: null,
    EditView: null,
    AddView: null,
    LayoutView: null,
    onInit: function () {
        //主页面实例化
        queryModel = new MainView();
        this.MyView = new MainForm({
            controller: this,
            viewModel: queryModel
        });

        //查询弹窗实例化
        var qm = new UserViewModel();                
        this.QueryView = new QueryWindow({
            controller: this,
            viewModel: qm
        });
        qm.get('Flags').loadData(attricutes.getData().UserState.getRange());

        //编辑弹窗实例化
        var em = new UserViewModel();
        this.EditView = new EditWindow({
            controller: this,
            viewModel: em
        });
        em.get('Flags').loadData(attricutes.getData().UserState.getRange());

        //添加弹窗实例化
        var am = new UserViewModel();
        this.AddView = new AddWindow({
            controller: this,
            viewModel: am
        });
        am.get('Flags').loadData(attricutes.getData().UserState.getRange());
        //布局弹窗实例化
        var lm = new UserViewModel();
        this.LayoutView = new LayoutWindow({
            controller: this,
            viewModel: lm
        });
        lm.get('Politys').loadData(attricutes.getData().UserPolity.getRange());
    },
    QueryUser: function () {  //打开检索弹窗
        Ext.getCmp('QueryState').setValue(0);
        this.QueryView.show();
    },
    SelectUser: function () { //检索事件
        //组织检索项
        queryModel.set('autoParams', null);
        var params = new Object();

        params.userNo = Ext.getCmp("QueryNo").getValue();
        params.userName = Ext.getCmp("QueryName").getValue();
        //params.state = Ext.getCmp("QueryState").getValue();//bool
        params.state = Ext.getCmp("QueryState").getValue() == 1
            ? true : Ext.getCmp("QueryState").getValue() == 2 ? false : null;

        queryModel.set('autoParams', params);
        //重新加载列表数据
        var paramsCopy = convert.deepCopy(params);
        queryModel.get('myStore').load({
            params: paramsCopy
        });
        //关闭检索框
        this.QueryView.hide();
    },
    ClearSelect: function () {
        var paramsInit = new Object();
        paramsInit.userNo = "";
        paramsInit.userName = "";
        paramsInit.state = null;
        var paramsCopy = convert.deepCopy(paramsInit);
        queryModel.get('myStore').reload({ params: paramsCopy });
    },
    CancelSelect: function () { //关闭检索弹窗
        this.QueryView.hide();
    },
    AddUser: function () {
        Ext.getCmp('AddState').setValue(1);
        this.AddView.show();
    },
    InsertUser: function () {
        addForm.getForm().submit({
            url: '/Home/InsertUserInfo',
            success: function (fp, o) {
                if (o.result == true) {
                    Ext.MessageBox.alert('提示', '操作成功');
                } else {
                    Ext.MessageBox.alert('提示', '操作失败');
                }
            },
            failure: function () {
                Ext.MessageBox.alert('提示', '操作失败');
            }
        });
        this.ClearSelect();
        this.AddView.hide();
    },
    CancelInsert: function () {
        this.AddView.hide();
    },
    EditUser: function (dataview, record, item, index, e) {
        Ext.getCmp('EditId').setValue(record.data.UserNo);
        Ext.getCmp('EditName').setValue(record.data.UserName);
        Ext.getCmp('EditState').setValue(record.data.UserState == '在职' ? 1 : 2);

        this.EditView.show();
    },
    UpdateUser: function () {
        //组织修改项
        var params = new Object();
        params.uId = Ext.getCmp('EditId').getValue();
        params.uName = Ext.getCmp('EditName').getValue();
        params.uState = Ext.getCmp('EditState').getValue();
        //编辑用户信息
        Ext.Ajax.request({
            url: '/Home/UpdateUserInfo',
            params: params,
            method: 'POST',
            success: function (response) {
                var usr_data = Ext.util.JSON.decode(response.responseText);
                if (usr_data) {
                    Ext.MessageBox.alert('提示', '操作成功');
                } else {
                    Ext.MessageBox.alert('提示', '操作失败');
                }
            }
        });

        this.ClearSelect();
        this.EditView.hide();
    },
    CancelUpdate: function () {
        this.EditView.hide();
    },
    DelUser: function (thisTab, td, cellIndex, record) {
        if (cellIndex == 7) {
            Ext.Msg.confirm("提示:", "确认删除？", function (confirmParam) {
                if (confirmParam == 'yes') {
                    Ext.Ajax.request({
                        url: '/Home/DeleteUserInfo',
                        params: { 'uId': record.data.UserNo },
                        method: 'POST',
                        success: function (response) {
                            var usr_data = Ext.util.JSON.decode(response.responseText);
                            if (usr_data) {
                                Ext.MessageBox.alert('提示', '操作成功');

                                var paramsInit = new Object();
                                paramsInit.userNo = "";
                                paramsInit.userName = "";
                                paramsInit.state = null;
                                var paramsCopy = convert.deepCopy(paramsInit);
                                queryModel.get('myStore').reload({ params: paramsCopy });
                            } else {
                                Ext.MessageBox.alert('提示', '操作失败');
                            }
                        }
                    });
                }
            });
        }
    },
    UserLayout: function () {
        this.LayoutView.show();
    },
    CancleLayout: function () {
        this.LayoutView.hide();
    }
});
//#endregion

Ext.onReady(function () {
    attricutes = new userAttribute();

    var contro = new MainController();
    contro.onInit();
    contro.MyView.render(Ext.getElementById('content'));
});
