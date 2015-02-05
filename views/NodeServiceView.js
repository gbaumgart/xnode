define([
    "dojo/_base/declare",
    'xide/views/BeanView',
    "dgrid/OnDemandGrid",
    "dgrid/Selection",
    "dgrid/Keyboard",
    "xide/views/GridView",
    'xide/types',
    'xide/utils'
], function (declare, BeanView, OnDemandGrid, Selection, Keyboard, GridView, types, utils) {

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
                    store: store,
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

                grid.sort("name");
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

                var actions = [];

                var thiz = this.delegate;//make the delegate deal with the actions. That is done in

                /***
                 *  Service commands : stop & start
                 */
                var isOnline = currentItem.status === types.SERVICE_STATUS.ONLINE;
                var dstCommand = currentItem.status == types.SERVICE_STATUS.OFFLINE ? 'start' : 'stop';
                var canServiceAction = currentItem.can[dstCommand] !== false;
                var serviceActionFunction = canServiceAction ? dstCommand == 'start' ? function (command, item, owner) {
                    thiz.onStart(command, item, owner)
                } : function (command, item, owner) {
                    thiz.onStop(command, item, owner);
                } : null;

                var title = currentItem.status == types.SERVICE_STATUS.OFFLINE ? 'Start' : 'Stop';
                var command = currentItem.status == types.SERVICE_STATUS.OFFLINE ? 'Start' : 'Stop';
                var icon = currentItem.status == types.SERVICE_STATUS.OFFLINE ? 'el-icon-play' : 'el-icon-stop';

                actions.push({
                    title: title,
                    icon: icon,
                    disabled: !canServiceAction,
                    command: command,
                    place: 'last',
                    emit: false,
                    style: '',
                    handler: serviceActionFunction
                });


                actions.push({
                    title: 'Console',
                    icon: 'el-icon-indent-left',
                    disabled: !isOnline,
                    command: 'Console',
                    place: 'last',
                    emit: false,
                    style: '',
                    handler: function () {
                        thiz.openConsole(currentItem);
                    }
                });

                /***
                 *  General actions
                 */
                //reload
                actions.push({
                    title: 'Reload',
                    icon: 'el-icon-refresh',
                    disabled: false,
                    command: 'Reload',
                    place: 'last',
                    emit: false,
                    style: '',
                    handler: function () {
                        thiz.onReload();
                    }
                });

                if (actions.length == 0) {
                    return null;
                }
                return actions;
            }

        });
});
