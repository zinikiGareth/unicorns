import Oasis from 'oasis';

var Util = {
    // TODO: this is way too many parameters, reflecting a poor separation of concerns
    // from where I moved it.
    
    // In particular, it feels like "oasis" is nearer to here than it should be to there :-)
  createOasisSandbox: function(container, oasis, name, unicorn, caps) {
    var LoadService = Oasis.Service.extend({
      initialize: function() {
        // TODO: we should probably use the serializer ...
        console.log("sending load");
        this.send('load', {module:name, id: unicorn.get('id')});
      }
    });
    
    var RenderContract = require('contract/render');
    var rshash = RenderContract.oasisService();
    var sandbox = oasis.createSandbox({
      type: 'html',
      url: 'unicornSandbox.html?unicorn=' + name,
      capabilities: ['_load','_render'],
      services: {
        _load: LoadService,
        _render: rshash.service
      }
    });

    var rc = RenderContract.clientProxy(rshash.instance);
    var horn = { render: rc };

    return { sandbox: sandbox, horn: horn };
  }
};

export default Util;