/**
 * Created by ronaklakhwani on 11/27/14.
 */
(function (nx) {
    nx.define('LeftPageTopologyView',nx.ui.Component, {
        view : {
            content : [
                {
                    name: 'sampleData',
                    type: 'nx.graphic.Topology',
                    props: {
                        width: 800,
                        height: 800,
                        adaptive: true,
                        showIcon: true,
                        theme: 'green',
                        identityKey: 'id',
                        nodeConfig: {
                            label: 'model.id'
                        }
                    }
                }
            ],
            props : {
                'class' : 'leftPageTopology'
            }
        },
        properties: {
            topologyData: {},
            newNode : {
                set : function(inNode) {
                    if (inNode) {

                        var topology = this.view('sampleData')
                        topology.addNode(inNode)
                        console.log(topology.data())
                    }
                }
            },
            newLink: {
                set: function (inLink) {
                    if (inLink) {
                        var topology = this.view('sampleData');
                        var sourceNode = topology.getNode(inLink['source'])
                        var targetNode = topology.getNode(inLink['target'])
                        if (sourceNode && targetNode) {
                            topology.addLink(inLink);
                            this.model().msg('Successfully added link')
                            this.model().msgClass('msgSuccessStyle')
                        } else {
                            this.model().msg('Error in addinglink')
                            this.model().msgClass('msgErrorStyle')
                        }

                    }
                }
            },
            deleteNodeById : {
                set : function(nodeId) {
                    if(nodeId) {
                        var topology = this.view('sampleData')
                        var node = topology.getNode(nodeId)
                        topology.eachLink(function(link) {
                            console.log(link)
                            console.log(link['id'])
                        })
                        console.log('Deleted')
                        topology.removeNode(node)
                        console.log(topology.data())
                    }
                }
            }
        }
    })
})(nx)