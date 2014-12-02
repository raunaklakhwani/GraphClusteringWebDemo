(function(nx, global) {
    nx.define('demo.TopologyViaApi', nx.ui.Component, {
        view: {
            content: {
                name: 'topology',
                type: 'nx.graphic.Topology',
                props: {
                    width:1200,
                    height:1200,
                    adaptive:true,
                    showIcon: true,
                    theme: 'green',
                    identityKey: 'id',
                    data: '{#topologyData}',
                    nodeConfig: {
                        label: 'model.id'
                    }
                }
            }
        },
        properties: {
            topologyData: {}
        },
        methods: {
            init: function(options) {
                this.inherited(options);
                this.loadRemoteData();
            },
            loadRemoteData: function() {
                // CAUTION you must resolve the cross-domain problem in you own environment!
                var URL_TOPOLOGY = 'data/data_800.json';
                $.ajax({
                    url: URL_TOPOLOGY,
                    success: function(data) {
                        console.log(data)
                        this.topologyData(data);
                    }.bind(this)
                });
            }
        }
    });
})(nx, nx.global);
