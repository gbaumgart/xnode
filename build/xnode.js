//>>built
require({cache:{"xnode/main":function(){define(["dojo/_base/kernel","xnode/manager/NodeServiceManager","xnode/manager/NodeServiceManagerUI","xnode/views/NodeServiceView","xnode/component"],function(d){return d.xnode})},"xnode/manager/NodeServiceManager":function(){define("dcl/dcl xide/manager/ServerActionBase xide/manager/BeanManager xide/types xide/data/Memory xide/client/WebSocket xdojo/has xdojo/has!xnode-ui?./NodeServiceManagerUI".split(" "),function(d,e,m,n,f,g,k,l){e=[e,m];l&&e.push(l);return d(e,
{declaredClass:"xnode.manager.NodeServiceManager",serviceClass:"XIDE_NodeJS_Service",cookiePrefix:"nodeJSServices",singleton:!0,serviceView:null,clients:null,beanNamespace:"serviceConsoleView",consoles:{},createClient:function(b){if(b.info){this.clients||(this.clients={});var a=this.getViewId(b);if(this.clients[a])return this.clients[a];var h=new g({});this.clients[a]=h;h.init({options:{host:b.info.host,port:b.info.port,debug:{all:!1,protocol_connection:!0,protocol_messages:!0,socket_server:!0,socket_client:!0,
socket_messages:!0,main:!0}}});h.connect();return h}console.error("NodeJs service has no host infos")},getStore:function(){return this.store},isValid:function(){return null!=this.store},initStore:function(b){return this.store=new f({data:{identifier:"name",label:"Name",items:b},idProperty:"name"})},init:function(){return this.ls()},getDefaults:function(b){return this.callMethodEx(null,"getDefaults",null,b,!0)},checkServer:function(b,a){return this.callMethodEx(null,"checkServer",[b],a,!0)},runServer:function(b,
a){return this.callMethodEx(null,"runDebugServer",[b],a,!0)},runDebug:function(b,a){return this.callMethodEx(null,"run",[b],a,!0)},stopServer:function(b,a){return this.callMethodEx(null,"stop",[b],a,!0)},startServer:function(b,a){return this.callMethodEx(null,"start",[b],a,!0)},ls:function(b,a,h){var c=this;a=this.runDeferred(null,"ls");a.then(function(a){c.rawData=a;c.initStore(a);!1!==h&&c.publish(n.EVENTS.ON_NODE_SERVICE_STORE_READY,{store:c.store});b&&b(a)});return a}})})},"xnode/manager/NodeServiceManagerUI":function(){define("dcl/dcl dojo/_base/lang xide/encoding/MD5 xide/types xide/utils dojo/cookie dojo/json xdojo/has!xnode-ui?xide/views/ConsoleView xdojo/has!xnode-ui?xnode/views/NodeServiceView".split(" "),
function(d,e,m,n,f,g,k,l,b){return d(null,{declaredClass:"xnode.manager.NodeServiceManagerUI",getViewId:function(a){return this.beanNamespace+m(JSON.stringify({info:a.info}),1)},onConsoleEnter:function(a,b){if(0!=b.length){var c=a.view.client;e.isString(b)&&c.emit(null,b)}},createConsole:function(a,b,c){var e=this.getViewId(a);try{var d=f.addWidget(l,{delegate:this,title:a.name,closable:!0,style:"padding:0px;margin:0px;height:inherit",className:"runView",client:c,item:a},this,b,!0);this.consoles[e]=
d;return c.delegate=d}catch(g){console.error(g)}},openConsole:function(a){this.getView(a);this.createConsole(a,this.getViewTarget(),this.createClient(a))},onReload:function(){this.ls(function(){this.serviceView.refresh(this.store)}.bind(this))},loadPreferences:function(){var a=g(this.cookiePrefix+"_debug_settings");return a=a?k.parse(a):{}},savePreferences:function(a){g(this.cookiePrefix+"_debug_settings",k.stringify(a))},getViewTarget:function(){return this.ctx.getApplication().mainView.getNewAlternateTarget()},
createServiceView:function(a,h){var c=h||this.getViewTarget();this.serviceView=f.addWidget(b,{delegate:this,store:a,title:"Services",closable:!0,style:"padding:0px"},this,c,!0)},openServiceView:function(){if(this.isValid())this.createServiceView(this.store);else{var a=this;this.ls(function(){a.createServiceView(a.store)})}},onStart:function(a,b,c){a=[];for(c=0;c<b.length;c++)a.push(b[c].name);this.startServer(a,function(){this.onReload()}.bind(this))},onStop:function(a,b,c){a=[];for(c=0;c<b.length;c++)a.push(b[c].name);
this.stopServer(a,function(){this.onReload()}.bind(this))},onMainMenuOpen:function(a){a=a.menu;a.serviceMenuItem||a.name!=n.MAIN_MENU_KEYS.VIEWS||(a.serviceMenuItem=new dijit.MenuItem({label:"Services",onClick:e.hitch(this,"openServiceView")}),a.addChild(a.serviceMenuItem))},openServices:function(){this.openServiceView()},getActions:function(){return[]},init:function(){this.ctx.addActions(this.getActions())}})})},"xnode/views/NodeServiceView":function(){define("dcl/dcl dojo/_base/declare dgrid/OnDemandGrid dgrid/Selection xide/types xide/utils xaction/Action xide/layout/Container".split(" "),
function(d,e,m,n,f,g,k,l){return d(l,{declaredClass:"xide.views.NodeServiceView",delegate:null,store:null,cssClass:"layoutContainer normalizedGridView",createWidgets:function(b){b=new (e([m,n,"Keyboard"]))({collection:b,columns:{Name:{field:"name",label:"Name",sortable:!0},Status:{field:"status",label:"Status",sortable:!0,formatter:function(a){var b='\x3cdiv style\x3d"color:${color}"\x3e'+g.capitalize(a)+"\x3c/div\x3e";return g.substituteString(b,{color:"offline"==a?"red":"green"})}},Clients:{field:"clients",
label:"Clients",sortable:!0}}},this.containerNode);b.refresh();this.grid=b;this.onGridCreated(b)},startup:function(){this.inherited(arguments);this.store&&this.createWidgets(this.store)},hasItemActions:function(){return null!=this.getCurrentSelection(!0)},getItem:function(){return this.getCurrentSelection(!0)},getItemActions:function(){var b=this.getItem()[0],a=[],e=this.delegate,c=b.status===f.SERVICE_STATUS.ONLINE,d=b.status==f.SERVICE_STATUS.OFFLINE?"start":"stop",g=b.status==f.SERVICE_STATUS.OFFLINE?
"Start":"Stop",d=k.createDefault(g,b.status==f.SERVICE_STATUS.OFFLINE?"el-icon-play":"el-icon-stop","Edit/"+g,"xnode",null,{handler:!1!==b.can[d]?"start"==d?function(a,c,d){e.onStart(a,[b],d)}:function(a,c,d){e.onStop(a,[b],d)}:null}).setVisibility(f.ACTION_VISIBILITY.ACTION_TOOLBAR,{label:""}).setVisibility(f.ACTION_VISIBILITY.MAIN_MENU,{}).setVisibility(f.ACTION_VISIBILITY.CONTEXT_MENU,{});a.push(d);d=k.createDefault("Reload","fa-refresh","Edit/Reload","xnode",null,{handler:function(){e.onReload()}}).setVisibility(f.ACTION_VISIBILITY.ACTION_TOOLBAR,
{label:""}).setVisibility(f.ACTION_VISIBILITY.MAIN_MENU,{}).setVisibility(f.ACTION_VISIBILITY.CONTEXT_MENU,{});a.push(d);c=k.createDefault("Console","el-icon-indent-left","View/Console","xnode",null,{handler:function(){e.openConsole(b)},widgetArgs:{disabled:!c}}).setVisibility(f.ACTION_VISIBILITY.ACTION_TOOLBAR,{label:""}).setVisibility(f.ACTION_VISIBILITY.MAIN_MENU,{}).setVisibility(f.ACTION_VISIBILITY.CONTEXT_MENU,{});a.push(c);return 0==a.length?null:a}})})},"xnode/component":function(){define(["dojo/_base/declare",
"xide/model/Component"],function(d,e){return d([e],{beanType:"NODE_SERVICE",hasEditors:function(){return["xnode"]},getDependencies:function(){return["xide/xide","xnode/types","xnode/manager/NodeServiceManager","xnode/views/NodeServiceView"]},getLabel:function(){return"xnode"},getBeanType:function(){return this.beanType}})})},"xnode/types":function(){define([],function(){return null})}}});
//# sourceMappingURL=xnode.js.map