/** @module xnode/manager/NodeServiceManager **/
define([
    "dcl/dcl",
    'xide/encoding/MD5',
    'xide/types',
    'xide/utils',
    "dojo/cookie",
    "dojo/json",
    "xide/lodash",
    'xdojo/has!xnode-ui?xide/views/ConsoleView',
    'xdojo/has!xnode-ui?xnode/views/NodeServiceView'
], function (dcl,MD5, types, utils,cookie, json,_,ConsoleView,NodeServiceView) {
    /**
     * Manager dealing with Node-Services though PHP shell (XPHP). This is is a typical
     * 'bean-manager' implementation.
     *
     * @class module: xnode/manager/NodeServiceManager
     */
    return dcl(null, {
        declaredClass:"xnode.manager.NodeServiceManagerUI",
        /**
         * Bean protocol implementation, only getViewId gets managed through here, the rest
         * Override getViewId in bean protocol
         * @param item
         * @returns {string}
         */
        getViewId: function (item) {
            var data = {
                info: item.info
            };
            return this.beanNamespace + MD5(JSON.stringify(data), 1);
        },
        onConsoleEnter: function (evt, what) {
            if (what.length == 0) {
                return;
            }
            var view = evt.view;
            var client = view.client;
            if (_.isString(what)) {
                client.emit(null, what);
            }
        },
        createConsole: function (what, parentContainer, client) {
            var viewId = this.getViewId(what);
            var view = utils.addWidget(ConsoleView, {
                delegate: this,
                title: what.name,
                closable: true,
                style: 'padding:0px;margin:0px;height:inherit',
                className: 'runView',
                client: client,
                item: what
            }, this, parentContainer, true);
            this.consoles[viewId] = view;
            client.delegate = view;
            return view;
        },
        openConsole: function (item) {
            var view = this.getView(item);
            view = this.createConsole(item, this.getViewTarget(), this.createClient(item));
        },
        onReload: function () {
            this.ls(function () {
                this.serviceView.refresh(this.store);
            }.bind(this));
        },
        /////////////////////////////////////////////////////////////////////////////////////
        //
        //  Storage & Persistence
        //
        /////////////////////////////////////////////////////////////////////////////////////
        loadPreferences: function () {
            var _cookie = this.cookiePrefix + '_debug_settings';
            var settings = cookie(_cookie);

            settings = settings ? json.parse(settings) : {};
            return settings;
        },
        savePreferences: function (settings) {
            var _cookie = this.cookiePrefix + '_debug_settings';
            cookie(_cookie, json.stringify(settings));
        },
        getViewTarget: function () {
            var mainView = this.ctx.getApplication().mainView;
            return mainView.getNewAlternateTarget();
        },
        /////////////////////////////////////////////////////////////////////////////////////
        //
        //  UX factory and utils
        // @TODO : move it to somewhere else
        //
        /////////////////////////////////////////////////////////////////////////////////////
        /***
         *
         * @param store
         * @param where
         */
        createServiceView: function (store, where) {
            var parent = where || this.getViewTarget();
            this.serviceView = utils.addWidget(NodeServiceView, {
                delegate: this,
                store: store,
                title: 'Services',
                closable: true,
                style:'padding:0px'
            }, this, parent, true);
        },
        openServiceView: function () {
            if (!this.isValid()) {
                var thiz = this;
                var _cb = function () {
                    thiz.createServiceView(thiz.store);
                };
                this.ls(_cb);
            } else {
                this.createServiceView(this.store);
            }
        },
        /////////////////////////////////////////////////////////////////////////////////////
        //
        //  UX Callbacks
        //
        /////////////////////////////////////////////////////////////////////////////////////
        onStart: function (command, items, owner) {
            var itemsOut = [];
            for (var i = 0; i < items.length; i++) {
                itemsOut.push(items[i].name);
            }
            this.startServer(itemsOut, function () {
                this.onReload();
            }.bind(this));
        },
        onStop: function (command, items, owner) {
            var itemsOut = [];
            for (var i = 0; i < items.length; i++) {
                itemsOut.push(items[i].name);
            }
            this.stopServer(itemsOut, function () {
                this.onReload();
            }.bind(this));
        },
        openServices:function(){
            this.openServiceView();
        },
        getActions:function(){
            return [];
        },
        init:function(){
            var ctx = this.ctx;
            ctx.addActions(this.getActions());
        }
    });
});
