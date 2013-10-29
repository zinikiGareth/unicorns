import Resolver from 'resolver';
import UnicornLib from 'unicornlib/unicornlib';
import Router from 'container/router';

var Application = Ember.Application.extend({
  modulePrefix: 'container',
  Resolver: Resolver,
  Unicorn : UnicornLib
});

var App = Application.create({ LOG_TRANSITIONS: true });

App.IndexController = Ember.ObjectController.extend({
  init: function() {
    console.log("hello");
  }
});

export { App };