(function () {
    __hasProp = {}.hasOwnProperty,
    __extend_parent__ = function(child, parent) { 
        for (var key in parent) { 
            if (__hasProp.call(parent, key)) 
                child[key] = parent[key]; 
        } 
        function ctor() { 
            this.constructor = child; 
        } 
        ctor.prototype = parent.prototype; 
        child.prototype = new ctor(); 
        child.__super__ = parent.prototype; 
        return child; 
    },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

    if (typeof Backbone === "undefined" || Backbone === null) {
        throw new Error('Need the latest version of Backbone. Can be found at http://documentcloud.github.com/backbone/backbone.js');
    }

    Backbone.Slider = (function(_super) {
        __extend_parent__(Slider, _super);

        var __reference;

        function Slider() {
            __reference = this; //TODO find a better way

            this.args = Array.prototype.slice.apply(arguments);
            Backbone.View.prototype.constructor.apply(this, this.args);
            Backbone.View.prototype.delegateEvents.apply(this, this.args);
            this.initialize();
        }

        Slider.prototype.events = {
            'click .easy-slider-nav-left' : 'navigateLeft',
            'click .easy-slider-nav-right' : 'navigateRight'
        };

        Slider.prototype.initialize = function () {
            this.views = this.views || [];

            this.currentIndex = -1;

            return this;
        };

        Slider.prototype.addView = function(viewsToAdd) {
            var self = this;

            if (!_.isArray(viewsToAdd) || viewsToAdd === null || viewsToAdd === 'undefined') {
                throw new Error('Error adding views ' + views);
            }
            _.each(viewsToAdd, function (view) {
                self.views.push(view);
            });

            return this;
        };

        Slider.prototype.delegateEvents = function () {
            this.$('.easy-slider-nav-left').on('click', this.navigateLeft);
            this.$('.easy-slider-nav-right').on('click', this.navigateRight);
        };

        Slider.prototype.render = function (options) {
            var parentData;

            if (options === null) {
                options = {};
            }

            parentData = this.getData();

            this.sliderContainer = $('<div></div>').addClass('easy-slider');
            this.navLeft = $('<div />').addClass('easy-slider-nav-left');
            this.navRight = $('<div />').addClass('easy-slider-nav-right');

            if (this.template) {
                this.sliderContainer.html(this.template());
            }

            this.$el.html(this.sliderContainer);

            //TODO not the best way to do this. Find a better way
            this.$el.prepend(this.navLeft);
            this.$el.append(this.navRight);

            if (this.initialViewToBeRendered) {
                this.renderViewAt(this.initialViewToBeRendered);
            } else {
                this.renderFirstView();
            }


            return this;
        };

        Slider.prototype.navigateLeft = function () {
            var viewToRender = __reference.getViewAt(--__reference.currentIndex);
            if (typeof viewToRender !== 'undefined') {
                __reference.sliderContainer.empty();
                __reference.sliderContainer.append(viewToRender.el);
            }
        };

        Slider.prototype.navigateRight = function () {
            var viewToRender = __reference.getViewAt(++__reference.currentIndex);
            if (typeof viewToRender !== 'undefined') {
                __reference.sliderContainer.empty();
                __reference.sliderContainer.append(viewToRender.el);
            }
        };

        Slider.prototype.renderViewAt = function (index) {
            var viewToBeRendered = this.getViewAt(index);
            if (viewToBeRendered) {
                this.sliderContainer.append(viewToBeRendered.el);
            }
        };

        Slider.prototype.getViewAt = function(index) {
            if (!this.views.length || index > this.views.length || index < 0) {
                return undefined;
            }

            this.currentIndex = index;
            return this.views[index];
        };

        Slider.prototype.renderFirstView = function renderFirstView() {
            var self = this;

            if (!this.views.length) {
                throw new Error('Cannot render the slider. Need at least one view');
            }

            this.sliderContainer.append(this.getViewAt(0).el);

            return this;
        };

        Slider.prototype.getData = function() {
            var data = {};
            if (this.model) {
                data = _.extend(data, this.model.toJSON());
            }

            if (this.collection) {
                data = _.extend(data, {
                    items: this.collection.toJSON()
                });
            }

            return data;
        };

        return Slider;
    })(Backbone.View);
}).call(this);
