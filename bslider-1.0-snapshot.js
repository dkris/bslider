(function (window) {
    var slider = { 
        cachedViews: [],
        create : function () {
            var theView = Backbone.View.extend();
            return this;
        },
        add: function (view) {
            if (view instanceof Backbone.View) {
                this.cachedViews.push(view);
            }
        },
        getTotalCachedViews: function () {
            return this.cachedViews.length;
        }
    };

    window.BSlider = slider;
})(window);
