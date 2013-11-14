import Oasis from 'oasis';
import Resolver from 'resolver';
import UnicornLib from 'unicornlib/unicornlib';
import Router from 'container/router';

import RenderContract from 'contract/render';
import EnvelopeReceiptContract from 'contract/envelope/envelopeReceipt';
import CardMix from 'container/models/cardmix';

//import HackedAccessToReportModel from 'unicorn/expenseReport/basic/actor/report';
//import HackedAccessToReceiptModel from 'unicorn/receipt/whotels/expense/member/actor/receipt';

var Application = Ember.Application.extend({
  modulePrefix: 'container',
  Resolver: Resolver,
  UnicornLib : UnicornLib.create()
});

Application.initializer({
  name: 'expenses',
  after: 'store',
  initialize: function(container, application) {
    application.get('UnicornLib').get('registry').set('container', container);
    application.get('UnicornLib').get('registry').set('serializer', container.lookup('serializer:-default'));
//    container.register('model:receipt', HackedAccessToReceiptModel);
//    container.register('model:report', HackedAccessToReportModel);
    var store = container.lookup('store:main');

    store.push("cardmix", {id: '1001', unicorn: 'receipt/whotels/expense/member', data: "14"});
    store.push("cardmix", {id: '1002', unicorn: 'receipt/whotels/expense/member', data: "19"});
    store.push("cardmix", {id: '1003', unicorn: 'receipt/whotels/expense/member', data: "22"});
    store.push("cardmix", {id: '1004', unicorn: 'expenseReport/basic', data: "17"});

    // application.deferReadiness();
    // application.deferReadiness();
    store.find('cardmix', 1004).then(function (rep) {
      store.find('cardmix', 1001).then(function(r) {
        rep.get('children').addObject(r);
        // application.advancedReadiness();
      });

      store.find('cardmix', 1003).then(function(r) {
        // application.advancedReadiness();
        rep.get('children').addObject(r);
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
