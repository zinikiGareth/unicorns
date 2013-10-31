/* This is starting out as the basic "pingpong" Oasis
 * example.  It needs to morph to:
 * 
 * 1. A bridge to the whotels receipt card
 * 2. A general purpose unicorn-as-card environment
 * 
 * This means it needs to become steadily more aware of both contracts
 * and the overall approach we're taking 
 */

import Oasis from 'oasis';
import Logger from 'oasis/logger';
import Resolver from 'resolver';

function Bridge() {
  this.init = function() {
    Logger.enable();
    
    this.oasis = new Oasis();
    this.oasis.autoInitializeSandbox();

    this.app = Ember.Application.create({
      Resolver: Resolver,
      modulePrefix: 'container',
      LOG_TRANSITIONS: true,
      LOG_MODULE_RESOLVER: true
    });
    
    this.container = this.app.__container__;
    this.whenReady = Oasis.RSVP.defer();
  };
  
  this.setup = function(module) {
    this.torso = module;
    this.oasis.connect(module.oasisSandboxConnector(this));
  };
  
  this.getModuleNameFromLocation = function(href, param) {
    var href = window.location.href;
    var param = href.indexOf('?' + param + '='); // should also check for '&='
    var moduleName = href.substring(param+9);
    param = moduleName.indexOf('&');
    if (param > 0)
      moduleName = moduleName.substring(0, param);
    return moduleName;
  };
}
export default Bridge;