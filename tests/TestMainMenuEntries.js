/** @module xgrid/Base **/
define([
    "xdojo/declare",
    "dcl/dcl",
    'xide/types',
    'xide/utils',
    'xgrid/Grid',
    "xide/widgets/TemplatedWidgetBase",
    "xide/mixins/EventedMixin",
    "./TestUtils",
    "xfile/tests/TestUtils",
    "xide/widgets/_Widget",
    "dijit/registry",
    "module",
    "dojo/cache",	// dojo.cache
    "dojo/dom-construct", // domConstruct.destroy, domConstruct.toDom
    "dojo/_base/lang", // lang.getObject
    // has("ie")
    "dojo/string",
    "xide/_base/_Widget"


], function (declare,dcl,types,
             utils, Grid, TemplatedWidgetBase,EventedMixin,
             TestUtils,FTestUtils,_Widget,registry,module,
             cache,domConstruct, lang, string,_XWidget
) {




    console.clear();

    console.log('--do-tests');

    var actions = [],
        thiz = this,
        ACTION_TYPE = types.ACTION,
        ACTION_ICON = types.ACTION_ICON,
        grid,
        ribbon,
        CIS;



    function doTests(tab){

    }

    var ctx = window.sctx,
        ACTION = types.ACTION,
        root;


    var _actions = [
        ACTION.RENAME
    ];

    if (ctx) {



        var parent = TestUtils.createTab(null,null,module.id);

        doTests(parent);

        return declare('a',null,{});

    }

    return Grid;

});