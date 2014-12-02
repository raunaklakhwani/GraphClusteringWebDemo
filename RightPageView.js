/**
 * Created by ronaklakhwani on 11/27/14.
 */
(function (nx) {
    nx.define('RightPageView', nx.ui.Component, {
        view : {
            content : [
                {
                    name : 'clusteredData',
                    type: 'nx.graphic.Topology',
                    props: {
                        width:800,
                        height:800,
                        adaptive:true,
                        showIcon: true,
                        theme: 'green',
                        identityKey: 'id',
                        data: '{topologyData}',
                        nodeConfig: {
                            label: 'model.id'
                        }
                    }
                }
            ]
        },
        properties: {

        },
        methods : {
            init: function(options) {
                this.inherited(options);
                //console.log('Ronak')
            }
        }
    })
})(nx);