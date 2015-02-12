define([
    "dojo/_base/declare",
    "dojo/_base/Deferred",
    "dojo/has",
    "xide/model/Component",
    "xide/types",
    "require"
], function (declare,Deferred,has,Component,types,require) {
    /**
     * @class xblox.component
     * @inheritDoc
     */
    return declare([Component], {
        /**
         * @inheritDoc
         */
        beanType:'BLOCK',
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        //  Implement base interface
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////

        _load:function(){
            /*
            var dfd = new Deferred();
            var _re = require,
                thiz = this;//hide from gcc
            _re('xblox/xblox', function () {
                thiz.inherited(arguments).then(function(){
                    dfd.resolve();
                })
            });
            return dfd.promise;
            */
        },
        hasEditors:function(){
            return ['xblox'];
        },
        getDependencies:function(){

            if(has('xblox-ui')) {

                return [
                    'xide/xide',
                    'xblox/types/Types',
                    'xblox/manager/BlockManager',
                    'xblox/manager/BlockManagerUI',
                    'xblox/embedded_ui',
                    'xfile/manager/BlockManager',
                    'xfile/views/BlocksFileEditor',
                    'xide/widgets/ExpressionJavaScript',
                    'xide/widgets/ImageWidget',
                    'xide/widgets/Expression',
                    'xide/widgets/ArgumentsWidget',
                    'xide/widgets/RichTextWidget',
                    'xide/widgets/JSONEditorWidget',
                    'xide/widgets/ExpressionEditor',
                    'xide/widgets/WidgetReference',
                    'xide/widgets/DomStyleProperties',
                    'xide/widgets/BlockPickerWidget',
                    'xide/widgets/BlockSettingsWidget',
                    'xblox/RunScript'
                ];
            }else{
                return [
                    'xide/xide',
                    'xblox/types/Types',
                    'xblox/manager/BlockManager',
                    'xblox/embedded'
                ];
            }
        },
        /**
         * @inheritDoc
         */
        getLabel: function () {
            return 'xblox';
        },
        /**
         * @inheritDoc
         */
        getBeanType:function(){
            return this.beanType;
        }
    });
});

