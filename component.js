define([
    "dojo/_base/declare",
    "xide/model/Component"
], function (declare,Component) {
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

