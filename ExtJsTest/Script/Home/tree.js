var control;

Ext.define('StoreTypeModelGlobal', {
    extend: 'Ext.data.Model',
    fields: [
        { name: "id", type: "string" },
        { name: "text", type: "string" },
        { name: "leaf", type: "boolean" },
        { name: "checked", type: "boolean", mapping: 'check'}
    ]
});
Ext.define('PVE.form.ComboGrid', {
    extend: 'Ext.form.ComboBox',
    requires: [
        'Ext.grid.Panel'
    ],
    alias: ['widget.PVE.form.ComboGrid'],

    // copied from ComboBox 
    createPicker: function () {
        var me = this,
            picker,
            menuCls = Ext.baseCSSPrefix + 'menu',
            opts = Ext.apply({
                selModel: {
                    mode: me.multiSelect ? 'SIMPLE' : 'SINGLE'
                },
                floating: true,
                hidden: true,
                ownerCt: me.ownerCt,
                cls: me.el.up('.' + menuCls) ? menuCls : '',
                store: me.store,
                displayField: me.displayField,
                focusOnToFront: false,
                pageSize: me.pageSize
            }, me.listConfig, me.defaultListConfig);

        // NOTE: we simply use a grid panel
        //picker = me.picker = Ext.create('Ext.view.BoundList', opts);
        picker = me.picker = Ext.create('Ext.grid.Panel', opts);

        // hack: pass getNode() to the view
        picker.getNode = function () {
            picker.getView().getNode(arguments);
        };

        me.mon(picker, {
            itemclick: me.onItemClick,
            refresh: me.onListRefresh,
            scope: me
        });

        me.mon(picker.getSelectionModel(), {
            selectionChange: me.onListSelectionChange,
            scope: me
        });

        return picker;
    }
});

function treedata() {
    var _sttStore = Ext.create('Ext.data.TreeStore', {
        model: 'StoreTypeModelGlobal',
        root: { //定义根节点，此处当做tree标题
            text: '所有城市',
            checked: false,
            expanded: true
        }
    });
    Ext.Ajax.request({
        url: '/Home/GetTreeNode',
        params: {},
        async: false,//是否异步
        success: function (response) {
            var usr_data = Ext.util.JSON.decode(response.responseText);

            for (var i in usr_data.root.children) {
                _sttStore.root.appendChild(usr_data.root.children[i]);
            }
        }
    });

    return _sttStore;
}

Ext.define('MainPanel', {
    extend: 'Ext.form.Panel',
    title: '用户权限管理',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    width: 1200,
    height: 500,
    style: 'border-style: none;',
    items: [
        {
            flex: 0.15,
            items: [
                {
                    xtype: 'treepanel',
                    id: 'tree1',
                    animate: true,//展开,收缩动画,false时,则没有动画效果
                    useArrows: true, //小箭头
                    height: 250,
                    autoScroll: true,
                    store: treedata(),
                    autoEncode: true, //提交时是否自动编码 
                    listeners: {
                        checkchange: 'ontreeChange',
                        render: function (ethis) {
                            //MouseMove(ethis, '');
                        },
                    }
                },
                {
                    xtype: 'treepanel',
                    id: 'tree2',
                    animate: true,//展开,收缩动画,false时,则没有动画效果
                    useArrows: true, //小箭头
                    height: 250,
                    autoScroll: true,
                    store: treedata(),
                    autoEncode: true, //提交时是否自动编码   
                    listeners: {
                        checkchange: 'ontreeChange',
                        render: function (ethis) {
                            //MouseMove(ethis, '');
                        },
                    }
                }
            ]
        },
        {
            flex: 0.85,
            html: "sdfasdfa"
        }
    ]
});

Ext.define('AppController', {
    extend: 'Ext.app.ViewController',
    GridView: null,
    onInit: function () {
        //主页面实例化
        this.GridView = new MainPanel({
            controller: this,
            viewModel: null
        });
    },
    ontreeChange: function (node, checked, eOpts) {
        //子节点全部未选中时，父节点未选中，否则父节点选中 lxyin 20160128
        var _checkParent = function (node) {
            var parentNodes = node.parentNode;
            if (parentNodes != null) {
                var checkPNode = false;
                for (var i = 0; i < parentNodes.childNodes.length; i++) {
                    var pChildNodeCheck = parentNodes.childNodes[i].data.checked;
                    if (pChildNodeCheck == true)
                        checkPNode = true;
                }
                if (checkPNode)
                    parentNodes.updateInfo(true, { checked: true });
                else
                    parentNodes.updateInfo(true, { checked: false });

                if (parentNodes.parentNode != null)
                    _checkParent(parentNodes);
            }
        }
        //子父节点选中
        var _checkChildren = function (node, checked) {
            _checkParent(node);
            node.eachChild(function (child) {
                child.updateInfo(true, { checked: checked });
                if (child.hasChildNodes()) {
                    _checkChildren(child, checked);
                }
            });
            node.expand(recursive = true);
        }

        _checkChildren(node, checked);

        //paraTree = new Object();
        //paraTree.CNL_IDS = ALL_CNL_IDS;
        //paraTree.CNL_CLT_IDS = '';
        //paraTree.CNL_STT_IDS = '';
        //paraTree.CNL_STL_IDS = '';
        //paraTree.CNL_CTY_IDS = '';
        //paraTree.LCC_CTV_IDS = '';

        ////#region 生成筛选条件
        //var cltIds = '';
        //var fs_Parent = selectCnlView_global.query("fieldset")[1];
        //for (var q = 0; q < fs_Parent.items.length; q++) {
        //    var lst = fs_Parent.items.get(q);
        //    if (lst.checked) {
        //        cltIds += lst.id.split(parentdesc)[1] + ',';
        //    }
        //}
        //if (cltIds.length > 0) {
        //    cltIds = cltIds.substring(0, cltIds.length - 1);
        //    paraTree.CNL_CLT_IDS = cltIds;
        //}

        //var _tp_stt = Ext.getCmp('tp_stt').getRootNode().childNodes;
        //ErgodicTreeNodes(_tp_stt, 'CNL_STT_IDS');

        //var _tp_stl = Ext.getCmp('tp_stl').getRootNode().childNodes;
        //ErgodicTreeNodes(_tp_stl, 'CNL_STL_IDS');

        //var _tp_cty = Ext.getCmp('tp_cty').getRootNode().childNodes;
        //ErgodicTreeNodes(_tp_cty, 'CNL_CTY_IDS');

        //var _tp_ctv = Ext.getCmp('tp_ctv').getRootNode().childNodes;
        //ErgodicTreeNodes(_tp_ctv, 'LCC_CTV_IDS');

        //paraTree.CNL_DESC = ''; // Ext.getCmp('txt_cnlDesc').value;
        ////#endregion

        ////先删除全部已选门店
        //var fs_Son = selectCnlView_global.query("fieldset")[4];
        //for (var q = 0; q < fs_Son.items.length; q++) {
        //    fs_Son.remove(fs_Son.items.get(q));
        //    q--;
        //}

        ////生成渠道
        //var isNull = true;
        //for (var item in paraTree) {
        //    if (item != 'CNL_IDS' && paraTree[item] != undefined && paraTree[item] != '') {
        //        isNull = false;
        //        break;
        //    }
        //}
        //if (isNull) //当条件全为空，后台默认查询全部，这里需要指定无数据条件
        //    paraTree.CNL_CLT_IDS = '-1';

        //var typeSon = GetChannel(paraTree);
        //for (var j = 0; j < typeSon.length; j++) {
        //    var sonsData = typeSon[j];
        //    createControllerSon(sonsData);
        //}
    }
});


Ext.onReady(function () {
    control = new AppController();
    control.onInit();
    control.GridView.render(Ext.getElementById('content'));
});
