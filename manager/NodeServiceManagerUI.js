/** @module xnode/manager/NodeServiceManager **/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "xide/manager/ServerActionBase",
    "xide/manager/BeanManager",
    'dojox/encoding/digests/MD5',
    'xide/types',
    'xide/utils',
    'xide/data/Memory',
    "dojo/cookie",
    "dojo/json",
    'xide/client/WebSocket',
    'xdojo/has!xnode-ui?xide/views/ConsoleView',
    'xdojo/has!xnode-ui?xnode/views/NodeServiceView'


], function (declare, lang, ServerActionBase, BeanManager, MD5, types, utils,Memory,cookie, json,WebSocket, ConsoleView,NodeServiceView) {


    /**
     * Manager dealing with Node-Services though PHP shell (XPHP). This is is a typical
     * 'bean-manager' implementation.
     *
     * @class module: xnode/manager/NodeServiceManager
     */
    return declare("xnode.manager.NodeServiceManagerUI", null, {
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
            var console = evt.console;
            var client = view.client;

            if (lang.isString(what)) {
                client.emit(null, what);
            }
        },
        createConsole: function (what, parentContainer, client) {

            var viewId = this.getViewId(what);
            try {
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
            } catch (e) {
                console.error(e);
            }

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
        onContainerRemoved: function (evt) {

        },
        initUI:function(){
            this.subscribe([types.EVENTS.ON_MAIN_MENU_OPEN, types.EVENTS.ON_CONTAINER_REMOVED]);
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
        /**
         * @deprecated:
         * @param evt
         */
        onMainMenuOpen: function (evt) {

            var menu = evt['menu'];


            //add 'Services' to MainMenu->Views
            if (!menu['serviceMenuItem'] &&
                menu['name'] == types.MAIN_MENU_KEYS.VIEWS) {
                menu['serviceMenuItem'] = new dijit.MenuItem({
                    label: "Services",
                    onClick: lang.hitch(this, 'openServiceView')
                });
                menu.addChild(menu['serviceMenuItem']);
            }
        }
    });
});