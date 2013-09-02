module('BSlider Test');

test('create a slider', function() {
    var slider = Backbone.Slider.extend();

    ok(slider, 'a slider should be created');
});

test('slides cannot be anything other than backbone views', function () {
    var viewOne = new Backbone.View({className: 'test-view', id: 'one'}),
        viewTwo = {},
        MySlider = Backbone.Slider.extend({
            views : [viewOne, viewTwo]
        }),
        MyOtherSlider = Backbone.Slider.extend({});

        throws(function () {
            new MySlider();
        }, 'This should raise an exception since viewTwo is not a backbone view');

        throws(function () {
           var slider = new MyOtherSlider();
           slider.addView([viewOne, viewTwo]);
        }, 'This should also raise an exception since viewTwo is not a backbone view');
});

test('when two backbone views are given to the slider, and the slider is rendered, the first view should be shown', function () {
    var viewOne = new Backbone.View({className: 'test-view', id: 'one'}),
        viewTwo = new Backbone.View({className: 'test-view', id: 'two'}),
        MySlider = Backbone.Slider.extend({}),
        slider = new MySlider();

        slider.addView([viewOne, viewTwo]);
        slider.render();
        equal(slider.$('.test-view').length, 1, 'Only one view should be visible');
        equal(slider.$('#one').length, 1, 'The first view should be visible');
        equal(slider.$('#two').length, 0, 'The second view should not be visible');
});

test('views can also be initialized as an extended property', function () {
    var viewOne = new Backbone.View({className: 'test-view', id: 'one'}),
        MySlider = Backbone.Slider.extend({
            views : [viewOne]
        }),
        slider = new MySlider();

        slider.render();
        equal(slider.$('#one').length, 1);
});

test('initial view to be rendered can be an option', function () {
    var viewOne = new Backbone.View({className: 'test-view', id: 'one'}),
        viewTwo = new Backbone.View({className: 'test-view', id: 'two'}),
        MySlider = Backbone.Slider.extend({
            initialViewToBeRendered: 1
        }),
        slider = new MySlider();

        slider.addView([viewOne, viewTwo]);
        slider.render();

        equal(slider.$('#one').length, 0, 'The first view should not be visible');
        equal(slider.$('#two').length, 1, 'The second view should be visible');
});

test('clicking the right arrow on the slider slides the view on the right in', function () {
    var viewOne = new Backbone.View({className: 'test-view', id: 'one'}),
        viewTwo = new Backbone.View({className: 'test-view', id: 'two'}),
        MySlider = Backbone.Slider.extend({}),
        slider = new MySlider();

        slider.addView([viewOne, viewTwo]);
        slider.render();

        equal(slider.$('#two').length, 0, 'The second view should not be visible');
        
        slider.$('.bslider-nav-right').trigger('click');

        equal(slider.$('#two').length, 1, 'The second view should be visible');
});

test('clicking the left arrow on the slider slides the view on the left in', function () {
    var viewOne = new Backbone.View({className: 'test-view', id: 'one'}),
        viewTwo = new Backbone.View({className: 'test-view', id: 'two'}),
        MySlider = Backbone.Slider.extend({
            initialViewToBeRendered: 1
        }),
        slider = new MySlider();

        slider.addView([viewOne, viewTwo]);
        slider.render();

        equal(slider.$('#two').length, 1, 'The second view should be visible');
        equal(slider.$('#one').length, 0, 'The first view should not be visible');
        
        slider.$('.bslider-nav-left').trigger('click');

        equal(slider.$('#two').length, 0, 'The second view should be visible');
        equal(slider.$('#one').length, 1, 'The first view should be visible');
});

test('when there are no other views on the left or right, the navs do not change the existing view', function () {
    var viewOne = new Backbone.View({className: 'test-view', id: 'one'}),
        MySlider = Backbone.Slider.extend({}),
        slider = new MySlider();

        slider.addView([viewOne]);
        slider.render();

        equal(slider.$('#one').length, 1);
        
        slider.$('.bslider-nav-left').trigger('click');
        equal(slider.$('#one').length, 1);

        slider.$('.bslider-nav-left').trigger('click');
        equal(slider.$('#one').length, 1);
});

test('create crosslinks if enabled while extending', function () {
    var viewOne = new Backbone.View({className: 'test-view', id: 'one'}),
        viewTwo = new Backbone.View({className: 'test-view', id: 'two'}),
        MySlider = Backbone.Slider.extend({
            enableCrossLinks: true,
            views : [viewOne, viewTwo]
        }),
        slider = new MySlider();

        slider.render();
        equal(slider.$('.cross-links').length, 1);
        equal(slider.$('.cross-link').length, 2);
        
        //TODO A little redundant probably. Better way?
        equal(slider.$('#bsliderCrossLink0').length, 1);
        equal(slider.$('#bsliderCrossLink1').length, 1);
});

test('clicking on a crosslink navigates to the right view', function () {
    var viewOne = new Backbone.View({className: 'test-view', id: 'one'}),
        viewTwo = new Backbone.View({className: 'test-view', id: 'two'}),
        MySlider = Backbone.Slider.extend({
            enableCrossLinks: true,
            views : [viewOne, viewTwo]
        }),
        slider = new MySlider();
        
        jQuery.fx.off = true;

        slider.render();

        equal(slider.$('#one').length, 1, 'The first view should be visible initially');

        slider.$('#bsliderCrossLink1').click();

        equal(slider.$('#one').length, 0, 'The first view should not be visible');
        equal(slider.$('#two').length, 1, 'The second view should now be visible');

        slider.$('#bsliderCrossLink1').click();

        equal(slider.$('#one').length, 0, 'The first view should not be visible');
        equal(slider.$('#two').length, 1, 'The second view should now be visible');

        slider.$('#bsliderCrossLink0').click();

        equal(slider.$('#one').length, 1, 'The first view should now be visible');
        equal(slider.$('#two').length, 0, 'The second view should not be visible');
});
