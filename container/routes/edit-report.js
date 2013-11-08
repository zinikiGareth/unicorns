var EditReportRoute = Ember.Route.extend({
  beforeModel: function() {
    var container = this.get('container');
    var rs = container.lookup('unicorn:expenseReport/basic');
    return rs.promise;
  },
  model: function() {
    var store = this.store;

    return {
      report: store.find('report', 17),
      receipts: [
        store.find('receipt', 19)
      ]
    };
  },
  renderTemplate: function() {
    this.render('show-unicorn', {outlet: 'main'});
    this.render('rightnav', {outlet: 'rightnav'});
  }
});

export default EditReportRoute;
