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
    'xnode/views/NodeServiceView',
    'xide/client/WebSocket',
    'xide/views/ConsoleView'
], function (declare, lang, ServerActionBase, BeanManager, MD5, types, utils,Memory,cookie, json,NodeServiceView, WebSocket, ConsoleView) {

    /**
     * Manager dealing with Node-Services though PHP shell (XPHP). This is is a typical
     * 'bean-manager' implementation.
     *
     * @class module: xnode/manager/NodeServiceManager
     */
    return declare("xnode.manager.NodeServiceManager", [ServerActionBase, BeanManager], {

        serviceClass: 'XIDE_NodeJS_Service',
        cookiePrefix: 'nodeJSServices',
        singleton: true,
        serviceView: null,
        clients: null,
        beanNamespace: 'serviceConsoleView',
        consoles: {},
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
        /**
         * Create a socket client to the service (service shell) if applicaple.
         * @param item
         * @returns {*}
         */
        createClient: function (item) {

            if (!item.info) {
                console.error('NodeJs service has no host infos');
                return;
            }

            if (!this.clients)this.clients = {};
            var hash = this.getViewId(item);

            if (this.clients[hash]) {
                return this.clients[hash];
            }
            var client = new WebSocket({});
            this.clients[hash] = client;
            client.init({
                options: {
                    host: item.info.host,
                    port: item.info.port,
                    debug: {
                        "all": false,
                        "protocol_connection": true,
                        "protocol_messages": true,
                        "socket_server": true,
                        "socket_client": true,
                        "socket_messages": true,
                        "main": true
                    }
                }
            });
            client.connect();
            return client;
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
        /////////////////////////////////////////////////////////////////////////////////////
        //
        //  Public API
        //
        /////////////////////////////////////////////////////////////////////////////////////
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
        getStore: function () {
            return this.store;
        },
        /***
         * Common function that this instance is in a valid state
         * @returns {boolean}
         */
        isValid: function () {
            return this.store != null;
        },
        /***
         * Init our store
         * @param data
         * @returns {xide.data.Memory}
         */
        initStore: function (data) {

            var sdata = {
                identifier: "name",
                label: "Name",
                items: data
            };

            this.store = new Memory({
                data: sdata,
                idProperty:'name'
            });
            return this.store;
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
                closable: true
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
        /////////////////////////////////////////////////////////////////////////////////////
        //
        //  Main entries, called by the context
        //
        /////////////////////////////////////////////////////////////////////////////////////
        init: function () {

            this.inherited(arguments);
            this.subscribe([types.EVENTS.ON_MAIN_MENU_OPEN, types.EVENTS.ON_CONTAINER_REMOVED]);
            return this.ls();
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
        },
        /////////////////////////////////////////////////////////////////////////////////////
        //
        //  Server methods
        //
        /////////////////////////////////////////////////////////////////////////////////////
        getDefaults: function (readyCB) {
            return this.callMethodEx(null, 'getDefaults', null, readyCB, true);
        },
        checkServer: function (settings, readyCB) {
            return this.callMethodEx(null, 'checkServer', [settings], readyCB, true);
        },

        runServer: function (settings, readyCB) {
            return this.callMethodEx(null, 'runDebugServer', [settings], readyCB, true);
        },

        runDebug: function (settings, readyCB) {
            return this.callMethodEx(null, 'run', [settings], readyCB, true);
        },
        stopServer: function (services, readyCB) {
            return this.callMethodEx(null, 'stop', [services], readyCB, true);
        },
        startServer: function (services, readyCB) {
            return this.callMethodEx(null, 'start', [services], readyCB, true);
        },
        /***
         * ls is enumerating all drivers in a given scope
         * @param readyCB   {function}
         * @param errorCB   {function}
         * @param emit   {Boolean}
         * @returns {*}
         */
        ls: function (readyCB, errorCB, emit) {

            var thiz = this,
                dfd = null;
            dfd = this.runDeferred(null, 'ls');
            dfd.then(function(data){
                thiz.rawData = data;
                thiz.initStore(data);
                if (emit !== false) {
                    thiz.publish(types.EVENTS.ON_NODE_SERVICE_STORE_READY, {store: thiz.store});
                }
                if (readyCB) {
                    readyCB(data);
                }
            });
            return dfd;

        }
    });
});
