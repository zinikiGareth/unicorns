import Resolver from 'resolver';
import Router from 'container/router';

var Application = Ember.Application.extend({
  modulePrefix: 'container',
  Resolver: Resolver
});

var App = Application.create({ LOG_TRANSITIONS: true });

App.IndexController = Ember.ObjectController.extend({
  init: function() {
    console.log("hello");
  }
});

export { App };