define([
    "dojo/_base/declare",
    'xide/views/BeanView',
    "dgrid/OnDemandGrid",
    "dgrid/Selection",
    "dgrid/Keyboard",
    "xide/views/GridView",
    'xide/types',
    'xide/utils',
    'xide/bean/Action'
], function (declare, BeanView, OnDemandGrid, Selection, Keyboard, GridView, types, utils,Action) {

    return declare('xide.views.NodeServiceView', [BeanView, GridView],
        {
            delegate: null,
            store: null,
            cssClass: "layoutContainer normalizedGridView",
            /**
             *
             * @param store
             */
            createWidgets: function (store) {

                var grid = new (declare([OnDemandGrid, Selection, Keyboard]))({
                    collection: store,
                    columns: {
                        Name: {
                            field: "name", // get whole item for use by formatter
                            label: "Name",
                            sortable: true
                        },
                        Status: {
                            field: "status", // get whole item for use by formatter
                            label: "Status",
                            sortable: true,
                            formatter: function (status) {
                                var tpl = '<div style=\"color:${color}\">' + utils.capitalize(status) + '</div>';
                                return utils.substituteString(tpl, {
                                    color: status == 'offline' ? 'red' : 'green'
                                });
                            }
                        },
                        Clients: {
                            field: "clients", // get whole item for use by formatter
                            label: "Clients",
                            sortable: true
                        }
                    }
                }, this.containerNode);

                //grid.sort("name");
                grid.refresh();
                this.grid = grid;
                this.onGridCreated(grid);

            },
            startup: function () {
                this.inherited(arguments);
                if (this.store) {
                    this.createWidgets(this.store);
                }
            },
            //////////////////////////////////////////////////////////////
            //
            //  Bean protocol implementation
            //
            //////////////////////////////////////////////////////////////
            hasItemActions: function () {
                return this.getCurrentSelection(true) != null;
            },
            getItem: function () {
                return this.getCurrentSelection(true);
            },
            getItemActions: function () {
                var currentItem = this.getItem()[0];

                var actions = [],
                    thiz = this.delegate;//forward to owner
                    

                /***
                 *  Service commands : stop & start
                 */
                var isOnline = currentItem.status === types.SERVICE_STATUS.ONLINE;
                var dstCommand = currentItem.status == types.SERVICE_STATUS.OFFLINE ? 'start' : 'stop';
                var canServiceAction = currentItem.can[dstCommand] !== false;
                var serviceActionFunction = canServiceAction ? dstCommand == 'start' ? function (command, item, owner) {
                    thiz.onStart(command, [currentItem], owner)
                } : function (command, item, owner) {
                    thiz.onStop(command, [currentItem], owner);
                } : null;

                var title = currentItem.status == types.SERVICE_STATUS.OFFLINE ? 'Start' : 'Stop';
                var command = currentItem.status == types.SERVICE_STATUS.OFFLINE ? 'Start' : 'Stop';
                var icon = currentItem.status == types.SERVICE_STATUS.OFFLINE ? 'el-icon-play' : 'el-icon-stop';


                var _controlAction = Action.createDefault(title,icon,'Edit/' + title,'xnode',null,{
                    handler:serviceActionFunction,
                    widgetArgs:{
                        disabled: !isOnline
                    }
                }).setVisibility(types.ACTION_VISIBILITY.ACTION_TOOLBAR,{label:''}).
                    setVisibility(types.ACTION_VISIBILITY.MAIN_MENU,{}).
                    setVisibility(types.ACTION_VISIBILITY.CONTEXT_MENU,{});

                actions.push(_controlAction);


                var _reloadAction = Action.createDefault('Reload','el-icon-refresh','Edit/Reload','xnode',null,{
                    handler: function () {
                        thiz.onReload();
                    }
                }).setVisibility(types.ACTION_VISIBILITY.ACTION_TOOLBAR,{label:''}).
                    setVisibility(types.ACTION_VISIBILITY.MAIN_MENU,{}).
                    setVisibility(types.ACTION_VISIBILITY.CONTEXT_MENU,{});

                actions.push(_reloadAction);

                var _consoleAction = Action.createDefault('Console','el-icon-indent-left','View/Console','xnode',null,{
                    handler: function () {
                        thiz.openConsole(currentItem);
                    },
                    widgetArgs:{
                        disabled: !isOnline
                    }
                }).setVisibility(types.ACTION_VISIBILITY.ACTION_TOOLBAR,{label:''}).
                    setVisibility(types.ACTION_VISIBILITY.MAIN_MENU,{}).
                    setVisibility(types.ACTION_VISIBILITY.CONTEXT_MENU,{});

                actions.push(_consoleAction);

                if (actions.length == 0) {
                    return null;
                }
                return actions;
            }

        });
});
