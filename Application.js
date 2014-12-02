(function(nx) {
    var App = nx.define(nx.ui.Application, {
        methods: {
            start: function() {
                var mainPageView = new MainPageView();
                var mainViewModel = new MainViewModel();
                mainPageView.model(mainViewModel)
                mainPageView.attach(this);
            }
        }
    });

    new App().start();

})(nx);
