import Oasis from 'oasis';

var Unicorn = Ember.Object.extend({
  init: function() {
    var implArr = this.get('implements');
    for (var i=0;i<implArr.length;i++) {
      var item = implArr[i];
      this[item._name] = item;
    }
  }
});

export default Unicorn;
