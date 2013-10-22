var UnicornView = Ember.View.extend({
  classNames: ['unicornHere'],
  
  template: function(template, options) {
    console.log(template);
    console.log(options)
    // By the time we get here, we know that we want to (internally) render something known only to be a unicorn
    // We have three options:
    // 1. Render it in a sandbox locally
    // 2. Render its envelope data in some pre-defined template
    // 3. Take a chance on being gored, and allow the native unicorn code to render in this context
    
    // Option 2 in particular implies that we have a "handle" to the card (or its data) separate from the card itself
    var model = template.get('content');
    options.data.buffer.push("<div width='25' height='50' style='background-color: blue'>" + model.get('id') + "</div>");
  }
});

export default UnicornView;