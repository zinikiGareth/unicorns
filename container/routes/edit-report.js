var EditReportRoute = Ember.Route.extend({
  beforeModel: function() {
    var container = this.get('container');
    var rs = container.lookup('unicorn:expenseReport/basic');
    return rs.promise;
  },
  model: function() {
    var store = this.get('container').lookup('store:main');
    return new Ember.RSVP.Promise(function(resolve) {
      resolve(store.find('report', 17));
    });
  },
  renderTemplate: function() {
    this.render('showUnicorn');
  }
});

export default EditReportRoute;