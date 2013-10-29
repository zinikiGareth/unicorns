define("resolver",
  [],
  function() {
    "use strict";
  /*
   * This module defines a subclass of Ember.DefaultResolver that adds two
   * important features:
   *
   *  1) The resolver makes the container aware of es6 modules via the AMD
   *     output. The loader's _seen is consulted so that classes can be
   *     resolved directly via the module loader, without needing a manual
   *     `import`.
   *  2) is able provide injections to classes that implement `extend`
   *     (as is typical with Ember).
   */

  function classFactory(klass) {
    return {
      create: function (injections) {
        if (typeof klass.extend === 'function') {
          return klass.extend(injections);
        } else {
          return klass;
        }
      }
    };
  }

  var underscore = Ember.String.underscore;
  var classify = Ember.String.classify;
  var get = Ember.get;
  var unicorns = {};

  function parseName(fullName) {
    var nameParts = fullName.split(":"),
        type = nameParts[0], fullNameWithoutType = nameParts[1],
        name = fullNameWithoutType,
        namespace = get(this, 'namespace'),
        root = namespace;

    return {
      fullName: fullName,
      type: type,
      fullNameWithoutType: fullNameWithoutType,
      name: name,
      root: root,
      resolveMethodName: "resolve" + classify(type)
    };
  }

  function chooseModuleName(seen, moduleName) {
    var underscoredModuleName = Ember.String.underscore(moduleName);

    if (moduleName !== underscoredModuleName && seen[moduleName] && seen[underscoredModuleName]) {
      throw new TypeError("Ambigous module names: `" + moduleName + "` and `" + underscoredModuleName + "`");
    }

    if (seen[moduleName]) {
      return moduleName;
    } else if (seen[underscoredModuleName]) {
      return underscoredModuleName;
    } else {
      return moduleName;
    }
  }

  function resolveRouter(parsedName) {
//    console.log(parsedName);
    var prefix = this.namespace.modulePrefix;
    if (parsedName.fullName === 'router:main') {
      // for now, lets keep the router at app/router.js
      if (requirejs._eak_seen[prefix + '/router']) {
        return require(prefix + '/router');
      }
    }
  }

  function resolveOther(parsedName) {
    console.log("resolveOther:", parsedName);
    var prefix = this.namespace.modulePrefix;
    Ember.assert('module prefix must be defined', prefix);

    var pluralizedType = parsedName.type + 's';
    var name = parsedName.fullNameWithoutType;

    var moduleName = prefix + '/' +  pluralizedType + '/' + name;
    if (parsedName.type == 'template' && name.indexOf('unicorn/') === 0) {
      moduleName = name;
    } else if (parsedName.type == 'component' && name.indexOf('unicorn-') === 0) {
      moduleName = 'archetypes/' + name;
    } else if (parsedName.type == 'template' && name.indexOf('components/unicorn-') === 0) {
      moduleName = 'archetypes/' + name.substring(11) + "-template";
    }
    
    // allow treat all dashed and all underscored as the same thing
    // supports components with dashes and other stuff with underscores.
    var normalizedModuleName = chooseModuleName(requirejs._eak_seen, moduleName);

    // TODO: I think we should pass down longer names (e.g. receipt/whotels/expense/member) and just prepend "unicorn/" and append "/unicorn"
    if (parsedName.type == 'unicorn') {
      var unicorn = parsedName.fullNameWithoutType;
      var path = "unicorn/receipt/whotels/expense/" + unicorn;
      console.log("Unicorn " + unicorn + " requested");
      if (unicorns[unicorn])
        return unicorns[unicorn];
      var value = new Ember.RSVP.Promise(function(resolve, reject) {
        $.getScript("/" + unicorn + "-amd.js").done(function(script, textStatus) {
          resolve(require(path + "/unicorn", null, null, true));
        }).fail(function() {
          console.log("could not resolve unicorn " + unicorn);
          throw new Error("could not resolve unicorn " + unicorn);
        });
      });
      var ret = { create: function() { console.log("injections = " + arguments); return { path: path, promise: value, injections: arguments }; }};
      unicorns[unicorn] = ret;
      return ret;
    }

    if (requirejs._eak_seen[normalizedModuleName]) {
      var module = require(normalizedModuleName, null, null, true /* force sync */);

      if (module === undefined) {
        throw new Error(" Expected to find: '" + parsedName.fullName + "' within '" + normalizedModuleName + "' but got 'undefined'. Did you forget to `export default` within '" + normalizedModuleName + "'?");
      }

      if (this.shouldWrapInClassFactory(module, parsedName)) {
        module = classFactory(module);
      }

      if (Ember.ENV.LOG_MODULE_RESOLVER) {
        Ember.Logger.info('hit', moduleName);
      }

      return module;
    } else {
      if (Ember.ENV.LOG_MODULE_RESOLVER) {
        Ember.Logger.info('miss', moduleName);
      }
      return this._super(parsedName);
    }
  }
  // Ember.DefaultResolver docs:
  //   https://github.com/emberjs/ember.js/blob/master/packages/ember-application/lib/system/resolver.js
  var Resolver = Ember.DefaultResolver.extend({
    resolveTemplate: resolveOther,
    resolveOther: resolveOther,
    resolveRouter: resolveRouter,
    parseName: parseName,
    shouldWrapInClassFactory: function(module, parsedName){
      return false;
    },
    normalize: function(fullName) {
      // replace `.` with `/` in order to make nested controllers work in the following cases
      // 1. `needs: ['posts/post']`
      // 2. `{{render "posts/post"}}`
      // 3. `this.render('posts/post')` from Route
      return Ember.String.dasherize(fullName.replace(/\./g, '/'));
    }
  });

  return Resolver;
});
