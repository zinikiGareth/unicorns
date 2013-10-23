var UnicornView = Ember.View.extend({
  classNames: ['unicornHere'],
  
  template: function(template, options) {
    console.log(template);
    console.log(options)
    // By the time we get here, we know that we want to (internally) render something known only to be a unicorn
    // We have four options:
    // 1. Render it in a sandbox locally
    // 2. Create a popover to render in a sandbox
    // 3. Render its envelope data in some pre-defined template
    // 4. Take a chance on being gored, and allow the native unicorn code to render in this context
    
    // Option 3 in particular implies that we have a "handle" to the card (or its data) separate from the card itself
    var mode = template.get('mode');
    var model = template.get('content');
    var container = template.get('container');
    console.log("The mode is " + mode);
    if (mode == 'sandbox') {
      options.data.buffer.push("<div>Sandbox case -- too hard for me</div>");
    } else if (mode == 'modal') {
      options.data.buffer.push("<div>Modal case -- too hard for me</div>");
    } else if (mode == 'envelope') {
      var envtemplate = container.lookup("template:envelopes/" + model.constructor.typeKey);
      envtemplate(template, options);
    } else if (mode == 'goring') {
      var goring = container.lookup("unicorn:member");
      var tmp = {};
      var guid = Ember.guidFor(tmp);
      options.data.buffer.push("<div id='unicorn-" + guid + "'></div>");
      goring.promise.then(function(member) {
        console.log("member = ", member);
        var unicornTemplate = container.lookup('template:' + goring.path + '/template');
        var view = Ember.View.create({
          template: unicornTemplate,
          model: template
        });
        view.appendTo('#' + guid);
      })
    } else
      options.data.buffer.push("<div class='unicorn'>This is where we need to render unicorn #" + model.get('id') + "</div>");
  }
});

export default UnicornView;