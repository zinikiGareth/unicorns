var EditReportRoute = Ember.Route.extend({
  beforeModel: function() {
    var container = this.get('container');
    var rs = container.lookup('unicorn:expenseReport/basic');
    return rs.promise;
  },
  model: function() {
    var store = this.get('container').lookup('store:main');
    return new Ember.RSVP.Promise(function(resolve) {
      resolve({report: store.find('report', 17), receipts: Em.A([store.find('receipt', 19)])});
    });
  },
  renderTemplate: function() {
    this.render('show-unicorn', {outlet: 'main'});
    this.render('rightnav', {outlet: 'rightnav'});
  }
});

export default EditReportRoute;