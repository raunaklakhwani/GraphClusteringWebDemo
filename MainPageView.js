/**
 * Created by ronaklakhwani on 11/27/14.
 */
(function (nx) {
    nx.define('MainPageView', nx.ui.Component, {
        view : {
            content : {
                tag : 'div',
                content : [
                    {
                        //Left Page View (Sample Data)
                        tag : 'div',
                        props : {
                            'class' : 'sampleData'
                        },
                        content : [
                            {
                                name : 'leftPageData',
                                type : 'LeftPageView'
                            }
                        ]
                    },
                    {
                        //Button
                        tag : 'div',
                        props : {
                            'class' : 'buttonStyle'
                        },
                        content : [
                            {
                                tag : 'button',
                                props : {
                                    'type' : 'button',
                                    'class' : 'clusterButton'
                                },
                                content : ' = ',
                                events : {
                                    click : '{#_cluster}'
                                }
                            }
                        ]
                    },
                    {
                        //Right page View (Clustered Data)
                        tag : 'div',
                        props : {
                            'class' : 'clusteredData'
                        },
                        content : [
                            {
                                name : 'RightPageData',
                                type : 'RightPageView'
                            }
                        ]
                    }
                ]
            }
        },
        methods : {
            _cluster : function() {
                data = this.view('leftPageData').view('LeftPageTopology').view('sampleData').data()
                //console.log(data)
                this.model().cluster(data)
            }
        }
    })
})(nx)