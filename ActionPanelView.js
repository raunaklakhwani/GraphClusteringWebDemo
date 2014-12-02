/**
 * Created by ronaklakhwani on 11/27/14.
 */
(function (nx) {
    nx.define('ActionPanelView',nx.ui.Component, {
        view : {
            content : [
                {
                    name : 'msg',
                    tag : 'h5',
                    content : '{msg}',
                    props : {
                        'class' : '{msgClass}'
                    }
                },
                {
                    tag : 'div',
                    props : {
                        'class' : 'nodeDiv'
                    },
                    content : [
                        {
                            tag : 'button',
                            props: {
                                type: 'button',
                                'class': 'btn btn-default addNodeButton'
                            },
                            content: 'Add Node',
                            events : {
                                click : '{createNode}'
                            }
                        },
                        {
                            tag : 'div',
                            props : {
                                'class' : 'deleteDiv'
                            },
                            content : [
                                {
                                    name: '_delete',
                                    tag: 'input',
                                    props : {
                                        'class' : 'textBox',
                                        placeholder : 'Enter Delete node id'
                                    }
                                },
                                {
                                    tag : 'button',
                                    props: {
                                        type: 'button',
                                        'class': 'btn btn-default'
                                    },
                                    content: 'Delete Node',
                                    events: {
                                        click: '{#_onDeleteNode}'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    tag : 'div',
                    props : {
                        'class' : 'addLinkDiv'
                    },
                    content: [
                        {
                            tag: 'label',
                            content: 'Source ID:'
                        },
                        {
                            name: '_source',
                            tag: 'input',
                            props : {
                                'class' : 'textBox',
                                placeholder : 'Enter source node id'
                            }

                        },
                        {
                            tag: 'label',
                            content: 'Target ID:'
                        },
                        {
                            name: '_target',
                            tag: 'input',
                            props : {
                                'class' : 'textBox',
                                placeholder : 'Enter target node id'
                            }
                        },
                        {
                            tag : 'button',
                            props: {
                                type: 'button',
                                'class': 'btn btn-default'
                            },
                            content: 'Add Link',
                            events: {
                                click: '{#_onAddLink}'
                            }
                        }
                    ]
                }
            ]
        },
        methods: {
            _onAddLink: function (inSender, inEvent) {
                var source = this.view('_source');
                var target = this.view('_target');
                var sourceId = source.get('value').trim()
                var targetId = target.get('value').trim()
                var validData = true
                if (!sourceId) {
                    source.dom().focus();
                    validData = false
                }
                if (!targetId) {
                    target.dom().focus();
                    validData = false
                }

                if(validData) {
                    this.model().createLink({
                        source: parseInt(sourceId),
                        target: parseInt(targetId)
                    });
                    source.set('value','')
                    target.set('value','')
                } else {
                    this.model().msg('Error in Adding Link')
                    this.model().msgClass('msgErrorStyle')
                }
            },
            _onDeleteNode : function(inSender, inEvent) {
                var deleteButton = this.view('_delete')
                var deleteId = deleteButton.get('value').trim()
                var validData = true
                if (!deleteId) {
                    deleteButton.dom().focus();
                    validData = false
                }
                if(validData) {
                    this.model().deleteNode(deleteId)
                    deleteButton.set('value','')
                } else {
                    this.model().msg('Error in Deleting Node')
                    this.model().msgClass('msgErrorStyle')
                }
            }
        }
    })
})(nx)