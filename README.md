unicorns
========

This is an attempt to work out how to do "real" cards in the land of unicorns and blueberries.

It starts from Chris Tse's original deck about cards and expense reports from Sep 2012.

It uses the full conductor/ember/Ziniki stack in both Chrome and node.js to deliver the value.


Project Layout
--------------

In reality, this project should be split into multiple repositories.
However, to make my life simple, it is all in sub-areas of the one repository
and I am getting Ziniki/cardalog to do all the heavy lifting to make it seem
multiple projects.

The project structure is thus like this:


container/
  the main application container; this is what would be the "application" repository
  
contracts/
  contract declarations; these are the declarations of what the contract pairs need to conform to,
  and possibly the "contract tests" as well

unicorns/
  the modular card-pieces of content and functionality
  this is divided up into "areas" for the different unicorn types
  receipts/**/
    where unicorns for different receipt types live
  reports/**/
    where unicorns for different report types live

  each sub-directory of receipts/ and reports/ containing a "unicorn.js" is the root of a mythical "unicorn" repository;
    the intervening directories are for namespace purposes.

vendor/
  libraries we depend on
  unicornlib/
    the base unicorn library in module form
    archetypes/
      code for the six layout archetypes

The "repositories" under "container/" and the "unicorns/area/name" follow the same basic format:

  actor/
    modules that make up the core "actor" of the unicorn or container
  implements/
    modules that "implement" the "child" or "consumer" side of the contract
  provides/
    modules that "implement" the "provider" or "parent" side of the contract
  templates/
    template files to be rendered
  unicorn.js/application.js
    the top level module that contains whatever else may be needed to tie it together
    this is not dissimilar to the remaining information needed to build the manifest

Contracts
---------

In order to communicate, the unicorns and the containing environment need to agree on a set of contracts.
Each contract is a statement between two parties to mutually provide the other with certain services.
This gets confusing, since in every case one side sees itself as fulfilling some portions of the contract
while depending on the other side to fulfill its needs.

However, in order for the contract to come into being, one side must be the code that
causes the other side to come into being, and it is thus possible to view this as a parent-child relationship,
which will also generally be reflected visually by containment in some form.

Assembly and Introspection
--------------------------

Each of the unicorns (and the container) should be built using the ES6 module transpiler
to come up with a single block of code which can be introspected to see what needs to be loaded
and how it needs to be assembled.

The top-most level object is the "unicorn.js" or "application.js" file, which imports all the others
by implied reference.  It does not need to specifically include the others.  It just has one responsibility,
which is to create and export a single hash object with appropriate information about the unicorn.  As yet,
I have not seen any information which actually needs to be stored here.
