define([
    "dojo/_base/declare",
    "dojo/_base/Deferred",
    "dojo/has",
    "xide/model/Component",
    "xide/types",
    "require"
], function (declare,Deferred,has,Component,types,require) {
    /**
     * @class xnode.component
     * @inheritDoc
     */
    return declare([Component], {
        /**
         * @inheritDoc
         */
        beanType:'NODE_SERVICE',
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        //  Implement base interface
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        hasEditors:function(){
            return ['xnode'];
        },
        getDependencies:function(){
            return [
                'xide/xide',
                'xnode/types',
                'xnode/manager/NodeServiceManager',
                'xnode/views/NodeServiceView'
            ];
        },
        /**
         * @inheritDoc
         */
        getLabel: function () {
            return 'xnode';
        },
        /**
         * @inheritDoc
         */
        getBeanType:function(){
            return this.beanType;
        }
    });
});

