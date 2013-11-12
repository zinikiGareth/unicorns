/* This is the bridge into the sandbox from the containing
 * environment.
 * 
 * On arrival here, we need to connect back to the original
 * service once the code is loaded.
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
  
  /** This method is called when the code has been loaded.
   * The "thing that is loaded" should result in an object that was created
   * using "Unicorn.create(...)", thus the argument here should be a unicorn.
   */
  this.setup = function(module) {
    this.torso = module;
    this.oasis.connect(module.oasisSandboxConnector(this));
  };
  
  this.getNamedParameter = function(href, param) {
    var pos = href.indexOf('?' + param + '=');
    if (pos === -1)
      pos = href.indexOf('&' + param + '=');
    if (pos === -1)
      return null;
    var value = href.substring(pos+param.length+2);
    pos = value.indexOf('&');
    if (pos > 0)
      value = value.substring(0, pos);
    return value;
  };
}

export default Bridge;