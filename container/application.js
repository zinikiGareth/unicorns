import Oasis from 'oasis';
import Resolver from 'resolver';
import UnicornLib from 'unicornlib/unicornlib';
import Router from 'container/router';

import RenderContract from 'contract/render';
import EnvelopeReceiptContract from 'contract/envelope/envelopeReceipt';

var Application = Ember.Application.extend({
  modulePrefix: 'container',
  Resolver: Resolver,
  UnicornLib : UnicornLib.create()
});

Application.initializer({
  name: 'expenses',
  after: 'store',
  initialize: function(container, application) {
    var store = container.lookup('store:main');

    store.push("receipt", {id: 14, unicorn: 'receipt/whotels/expense/member'});
    store.push("receipt", {id: 19, unicorn: 'receipt/whotels/expense/member'});
    store.push("receipt", {id: 22, unicorn: 'receipt/whotels/expense/member'});
    store.push("report", {id: 17, unicorn: 'expenseReport/basic'});

    // application.deferReadiness();
    // application.deferReadiness();
    store.find('report', 17).then(function (rep) {
      store.find('receipt', 14).then(function(r) {
        rep.get('contains').addObject(r);
        // application.advancedReadiness();
      });

      store.find('receipt', 22).then(function(r) {
        // application.advancedReadiness();
        rep.get('contains').addObject(r);
      });
    });
    
    var registry = application.UnicornLib.registry;

    // I think the second argument here should be the object that is being proxied
    registry.registerService(RenderContract, null);
    registry.registerService(EnvelopeReceiptContract, null);
  }
})

var App = Application.create({
  LOG_ACTIVE_GENERATION: true,
  LOG_MODULE_RESOLVER: true,
  LOG_TRANSITIONS: true,
  LOG_TRANSITIONS_INTERNAL: true,
  LOG_VIEW_LOOKUPS: true
});

App.IndexController = Ember.ObjectController.extend({
  init: function() {
    console.log("hello");
  }
});

Ember.RSVP.configure('onerror', function(error) {
  // ensure unhandled promises raise awareness.
  // may result in false negatives, but visibility is more imporant
  if (error instanceof Error) {
    console.assert(false, error);
    console.error(error.stack);
  }
});

export { App };
