// # Backbone.UnbindingView
//
// `Backbone.UnbindingView` improves on the default `Backbone.View` by making
// it easy to clean up event listeners that aren't set up with declarative
// `events`.
Backbone.UnbindingView = Backbone.View.extend({
	// ## `initialize`
	//
	// Set up the instance variables used by `bindTo`/`cleanUp`.
	//
	// Overriding `initialize` will also remove these variables, due to the
	// mechanics of how JavaScript works. (See:
	// http://stackoverflow.com/a/8944696/672403)
	//
	// There are two options: calling `Backbone.UnbindingView`'s
	// `initialize` method, or providing custom instances.
	//
	// Calling to the prototype can be done with
	// `this.prototype.initialize.call(this)` (JavaScript) or
	// `super.initialize.call @` (CoffeeScript).
	//
	// Providing custom instances is as simple as duplicating the `initialize`
	// method below, and may be beneficial in its own right--e.g. if the
	// application tracks state.
	initialize: function () {
		// Tracks the event listeners created by `bindTo`.
		this.bindings = [];

		// When rendering subviews, push them into the `this.child_views` `Array`
		// for automatic handling when `cleanUp` is run:
		//
		//     var foo = new Bar();
		//     this.$el.append(foo.render().el);
		//     this.child_views.push(foo);
		//
		// **Note:** These views will also need to extend `Backbone.UnbindingView`
		this.child_views = [];
	},

	// ## `bindTo`
	//
	// Rather than the default approach of binding directly to a `collection` or
	// `model`...
	//
	//     initialize: function () {
	//       _.bindAll(this, "render");
	//
	//       this.collection.on("reset", this.render);
	//     }
	//
	// ... use `bindTo`, which will put the event into the view's `bindings`
	// `Array`.
	//
	//     initialize: function () {
	//       _.bindAll(this, "render");
	//
	//       this.bindTo(collection, "reset", this.render);
	//     }
	bindTo: function (source, event, callback) {
		// Actual `event` binding.
		source.on(event, callback, this);

		// Track this for later use by `cleanUp`.
		this.bindings.push({
			source: source,
			event: event,
			callback: callback
		});
	},

	// ## `cleanUp`
	//
	// `cleanUp` runs through the `this.bindings` `Array` populated by `bindTo`
	// and unbinds all the listeners.
	//
	//     render: function () {
	//       this.cleanUp();
	//
	//       ...
	//     }
	cleanUp: function () {
		if ("undefined" !== typeof this.child_views) {
			this._clean_up_child_views();
		}

		this.$el.children().empty().remove();

		// Clean up listeners created via `bindTo`.
		_.each(this.bindings, function (binding) {
			binding.source.off(binding.event, binding.callback);
		});

		// Reset `bindings`.
		this.bindings = [];
	},

	// ## `render`
	//
	// Backbone's default `render` is `function () { return this; }`; this simply
	// adds a `cleanUp` call.
	//
	// When overriding the `render` method, be sure to call `this.cleanUp()`
	// manually.
	render: function () {
		this.cleanUp();

		return this;
	},

	_clean_up_child_views: function () {
		_.each(this.child_views, function (view) {
			view.cleanUp();
		});

		// Reset `child_views`.
		this.child_views = [];
	}
});
