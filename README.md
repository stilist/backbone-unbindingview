# Backbone.UnbindingView

`Backbone.UnbindingView` improves on the default `Backbone.View` by making it
easy to clean up event listeners that aren't set up with declarative `events`.

## Normal `Backbone.View`

    class Foo.Views.Main extends Backbone.View
      initialize: ->
        _.bindAll @, "render"

        @collection.on "reset", @render

      render: ->
        bar = new Foo.Views.Bar
        @$el.append bar.render().el

        @

In this version, every time a new `Foo.Views.Main` is instantiated,
`@collection` will gain an additional listener — i.e., on the fifth instance,
`render` will run five times. The problem gets even worse if `Foo.Views.Bar`
binds to a model or collection.

## `Backbone.UnbindingView`

    class Foo.Views.Main extends Backbone.UnbindingView
      initialize: ->
        _.bindAll @, "render"

        @bindings = []
        @bindTo @collection, "reset", @render

      render: ->
        @cleanUp()

        bar = new Foo.Views.Bar
        @$el.append bar.render().el

        @

Here, `@bindTo` takes a slightly less direct route than `.on`, pushing the
event binding into the `@bindings` `Array` set up by `initialize`. `@cleanUp`
clears the binding from `@collection`, so the `reset` event will only fire
once. Hooray!

This example also demonstrates the support for automatic subview cleanup. Just
add two lines: add `@child_views = []` to `initialize`, and push in the
subview:

    render: ->
      @cleanUp()

      bar = new Foo.Views.Bar
      @$el.append bar.render().el
      @child_views.push bar

      @

**Important note:** Using `Backbone.UnbindingView` for a view means that all
its subviews will also need to use `UnbindingView`.

## Contributing

Issues and patches welcome!
