/** @module xnode/manager/NodeServiceManager **/
define([
    "dojo/_base/declare",
    "xide/manager/ServerActionBase",
    "xide/manager/BeanManager",
    'xide/types',
    'xide/data/Memory',
    'xide/client/WebSocket',
    'xdojo/has',
    'xdojo/has!xnode-ui?./NodeServiceManagerUI'
], function (declare, ServerActionBase, BeanManager, types, Memory,WebSocket,has,NodeServiceManagerUI) {

    var bases = [ServerActionBase, BeanManager];

    if(NodeServiceManagerUI){
        bases.push(NodeServiceManagerUI);
    }


    /**
     * Manager dealing with Node-Services though PHP shell (XPHP). This is is a typical
     * 'bean-manager' implementation.
     *
     * @class module: xnode/manager/NodeServiceManager
     */
    var NodeServiceManager = declare("xnode.manager.NodeServiceManager", bases, {

        serviceClass: 'XIDE_NodeJS_Service',
        cookiePrefix: 'nodeJSServices',
        singleton: true,
        serviceView: null,
        clients: null,
        beanNamespace: 'serviceConsoleView',
        consoles: {},
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

        /////////////////////////////////////////////////////////////////////////////////////
        //
        //  Public API
        //
        /////////////////////////////////////////////////////////////////////////////////////
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
        //  Main entries, called by the context
        //
        /////////////////////////////////////////////////////////////////////////////////////
        init: function () {
            this.inherited(arguments);
            return this.ls();
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

    return NodeServiceManager;
});
