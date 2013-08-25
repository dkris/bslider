/* global $, jQuery */
var TestView;

module('create slider', {
    setup: function () {
        TestView = Backbone.View.extend();
    },
    teardown: function () {
        //Do nothing for now
    }
});

test('create the slider', function () {
    var theSlider = BSlider.create();
    ok(theSlider, 'create should return a backbone view');
});

test('only backbone views can be added', function () {
    var dummyView = 'Ha! This one should not be added',
        //view = new TestView(), 
        slider = BSlider.create();

    slider.add(dummyView);
    slider.add(new TestView());
    equal(slider.getTotalCachedViews(), 1);
});
