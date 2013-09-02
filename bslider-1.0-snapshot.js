(function () {
    __extend_parent__ = function(child, parent) { 
        _.each(_.keys(parent), function (key) {
            if (_.has(parent, key)) {
                child[key] = parent[key];
            }
        });

        function konstructor() { 
            this.constructor = child; 
        } 
        konstructor.prototype = parent.prototype; 
        child.prototype = new konstructor(); 
        child.__super__ = parent.prototype; 
        return child; 
    };

    if (typeof Backbone === "undefined" || Backbone === null) {
        throw new Error('This plugin requires the latest version of Backbone. Can be found at http://documentcloud.github.com/backbone/backbone.js');
    }

    if (typeof jQuery === "undefined") {
        throw new Error('This plugin requires jQuery version 1.10.2 and above. Can be found at http://jquery.com');
    }
    
    if (typeof $.ui === "undefined") {
        throw new Error('This plugin requires jQuery-ui version 1.10.3. Can be found at http://jqueryui.com');
    }

    Backbone.Slider = (function(_super) {
        __extend_parent__(Slider, _super);

        var __reference;

        Slider.prototype.className = 'bslider';

        function Slider() {
            __reference = this;

            __reference.args = Array.prototype.slice.apply(arguments);
            Backbone.View.prototype.constructor.apply(__reference, __reference.args);
            Backbone.View.prototype.delegateEvents.apply(__reference, __reference.args);
            __reference.initialize();
        }

        Slider.prototype.events = {
            'click .bslider-nav-left' : 'navigateLeft',
            'click .bslider-nav-right' : 'navigateRight'
        };

        Slider.prototype.initialize = function () {
            __reference.views = __reference.views || [];
            if (_.some(__reference.views, function (view) {
                return !(view instanceof Backbone.View);
            })) {
                throw new Error('Cannot initialize slider. Nothing other than backbone views are supported for now');
            }
            __reference.currentIndex = -1;
            __reference.currentView = -1;
        };

        Slider.prototype.addView = function(viewsToAdd) {
            if (!_.isArray(viewsToAdd) || viewsToAdd === null || viewsToAdd === 'undefined') {
                throw new Error('Error adding views ' + views);
            }
            _.each(viewsToAdd, function (view) {
                if (!(view instanceof Backbone.View)) {
                    throw new Error('One of the added views is not a backbone view');
                }
                __reference.views.push(view);
            });
        };

        Slider.prototype.delegateEvents = function () {
            __reference.$('.bslider-nav-left').on('click', __reference.navigateLeft);
            __reference.$('.bslider-nav-right').on('click', __reference.navigateRight);
        };

        Slider.prototype.render = function (options) {
            var navContainerLeft = $('<div />').addClass('bslider-nav-container-left');
                navContainerRight = $('<div />').addClass('bslider-nav-container-right');

            if (options === null) {
                options = {};
            }

            __reference.sliderContainer = $('<div></div>').addClass('bslider-container');
            __reference.navLeft = $('<i />').addClass('bslider-nav-left').addClass('icon-circle-arrow-left');
            __reference.navRight = $('<i />').addClass('bslider-nav-right').addClass('icon-circle-arrow-right');

            __reference.$el.html(__reference.sliderContainer);

            //TODO not the best way to do this. Find a better way
            __reference.$el.prepend(navContainerLeft.append(__reference.navLeft));
            __reference.$el.append(navContainerRight.append(__reference.navRight));

            if (__reference.enableCrossLinks) {
                __reference.createCrossLinks();
            }

            if (__reference.initialViewToBeRendered) {
                __reference.renderViewAt(__reference.initialViewToBeRendered);
            } else {
                __reference.renderFirstView();
            }


            return __reference;
        };

        Slider.prototype.createCrossLinks = function () {
            var crossLinkCount = 0;
            __reference.crossLinksContainer = $('<div />').addClass('cross-links');
            __reference.$el.append(__reference.crossLinksContainer),
            __reference.viewCrossLinkMap = {},
            __reference.crossLinks = [];
            _.each(__reference.views, function (view) {
                var crossLinkId = 'bsliderCrossLink' + crossLinkCount++,
                    crossLink = $('<div />').addClass('cross-link').attr('id', crossLinkId).text('View ' + (crossLinkCount)).addClass('unselected');
                __reference.crossLinksContainer.append(crossLink);
                __reference.crossLinks.push(crossLink);
                _.extend(__reference.viewCrossLinkMap, _.object([crossLinkId], [view]));
            });

            __reference.$('.cross-link').on('click', __reference.navigateTo);

        };
        
        Slider.prototype.navigateTo = function(e) {
            var viewId = e.currentTarget.id,
                viewToRender = _.result(__reference.viewCrossLinkMap, viewId);

            if (typeof viewToRender !== 'undefined') {
                var viewToRemove = __reference.getCurrentView();

                //Animate like nav left
                if (__reference.views.indexOf(viewToRender) < __reference.views.indexOf(viewToRemove)) {
                    $(viewToRender.$el).css('display', 'none');
                    $(viewToRender.$el).insertAfter($(viewToRemove.$el));
                    $(viewToRemove.$el).remove();
                    $(viewToRender.$el).show('slide', {direction: 'left'}, 500, function () {
                        __reference.currentView = _.indexOf(__reference.views, viewToRender);
                        __reference.currentIndex = _.indexOf(__reference.views, __reference.getCurrentView());
                        __reference.updateCrossLinks();
                    });
                }

                //Animate like nav right
                else if (__reference.views.indexOf(viewToRender) > __reference.views.indexOf(viewToRemove)) {
                    $(viewToRender.$el).css('display', 'none');
                    $(viewToRender.$el).insertAfter($(viewToRemove.$el));
                    $(viewToRemove.$el).remove();
                    $(viewToRender.$el).show('slide', {direction: 'right'}, 500, function () {
                        __reference.currentView = _.indexOf(__reference.views, viewToRender);
                        __reference.currentIndex = _.indexOf(__reference.views, __reference.getCurrentView());
                        __reference.updateCrossLinks();
                    });
                }

            }
        };

        Slider.prototype.updateCrossLinks = function () {
            if (__reference.enableCrossLinks) {
                var currentCrossLink = __reference.crossLinks[_.indexOf(__reference.views, __reference.getCurrentView())];
                _.each(__reference.crossLinks, function (link) {
                    if (link === currentCrossLink) {
                        link.addClass('selected');
                        link.removeClass('unselected');
                    } else {
                        link.addClass('unselected');
                        link.removeClass('selected');
                    }
                });
            }
        };

        Slider.prototype.navigateLeft = function () {
            var viewToRender = __reference.getViewAt(--__reference.currentIndex);
            if (typeof viewToRender !== 'undefined') {
                var viewToRemove = __reference.getCurrentView();
                $(viewToRender.$el).css('display', 'none');
                $(viewToRender.$el).insertAfter($(viewToRemove.$el));
                $(viewToRemove.$el).remove();
                $(viewToRender.$el).show('slide', {direction: 'left'}, 500, function () {
                    __reference.currentView = __reference.currentIndex;
                    __reference.updateCrossLinks();
                });
            }
        };

        Slider.prototype.navigateRight = function () {
            var viewToRender = __reference.getViewAt(++__reference.currentIndex);
            if (typeof viewToRender !== 'undefined') {
                var viewToRemove = __reference.getCurrentView();
                $(viewToRender.$el).css('display', 'none');
                $(viewToRender.$el).insertAfter($(viewToRemove.$el));
                $(viewToRemove.$el).remove();
                $(viewToRender.$el).show('slide', {direction: 'right'}, 500, function () {
                    __reference.currentView = __reference.currentIndex;
                    __reference.updateCrossLinks();
                });
            }
        };

        Slider.prototype.renderViewAt = function (index) {
            var viewToBeRendered = __reference.getViewAt(index);
            if (viewToBeRendered) {
                __reference.currentView = index;
                __reference.sliderContainer.append(viewToBeRendered.el);
                __reference.updateCrossLinks();
            }
        };

        Slider.prototype.getCurrentView = function () {
            return __reference.views[__reference.currentView];
        };

        Slider.prototype.getViewAt = function(index) {
            if (!__reference.views.length || index >= __reference.views.length || index < 0) {
                if (index >= __reference.views.length) {
                    __reference.currentIndex = __reference.views.length - 1;
                    __reference.currentView = __reference.currentIndex;
                } else if (index < 0){
                    __reference.currentIndex = 0;
                    __reference.currentView = __reference.currentIndex;
                }
                return undefined;
            }

            __reference.currentIndex = index;
            return __reference.views[index];
        };

        Slider.prototype.renderFirstView = function renderFirstView() {
            if (!__reference.views.length) {
                throw new Error('Cannot render the slider. Need at least one view');
            }

            __reference.currentView = 0;
            __reference.sliderContainer.append(__reference.getViewAt(0).el);
            __reference.updateCrossLinks();
        };

        return Slider;
    })(Backbone.View);
}).call(this);
