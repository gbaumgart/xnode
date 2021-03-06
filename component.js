define([
    "dcl/dcl",
    "xide/model/Component"
], function (dcl,Component) {
    /**
     * @class xnode.component
     * @inheritDoc
     */
    return dcl(Component, {
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

