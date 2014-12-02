/**
 * Created by ronaklakhwani on 11/27/14.
 */
(function (nx) {
    nx.define('LeftPageView', nx.ui.Component, {
        view : {
            content : [
                {
                    name : 'ActionPanel',
                    type : 'ActionPanelView'
                },
                {
                    name : 'LeftPageTopology',
                    type : 'LeftPageTopologyView',
                    props : {
                        newNode : '{newNode}',
                        newLink : '{newLink}',
                        deleteNodeById : '{deleteNodeById}'
                    }
                },
                {
                    tag : 'div',
                    props : {
                        'class' : 'leftSaveJsonDiv'
                    },
                    content : [
                        {
                            tag : 'button',
                            props : {
                                'type' : 'button',
                                'class' : 'leftSaveJsonButton'
                            },
                            content : 'Save Json',
                            events : {
                                click : '{#_saveJsonData}'
                            }
                        }
                    ]
                }
            ]
        },
        methods : {
            _saveJsonData : function() {
                console.log('saveJsonData')
                p = new JsonPageView()
                p.attach(this)
            }
        }
    })
})(nx);