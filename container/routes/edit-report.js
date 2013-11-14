var EditReportRoute = Ember.Route.extend({
  beforeModel: function() {
    return App.UnicornLib.registry.find('expenseReport/basic');
  },
  model: function() {
    var store = this.store;

    // sync report model find + summon unicorns
    // - this likely replaces beforeModel, and augments
    //   this model code below
    //
    // store.find('report', 17).then(function(model){
    //   return fetchUncironFor(model.name).then(function(){
    //     return model;
    //   });
    // })

    return {
      report: store.find('cardmix', 1004),
      receipts: [
        store.find('cardmix', 1002)
      ]
    };
  },
  renderTemplate: function() {
    this.render('show-unicorn', {outlet: 'main'});
    this.render('rightnav', {outlet: 'rightnav'});
  }
});

export default EditReportRoute;
