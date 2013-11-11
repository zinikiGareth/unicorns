Current Status
--------------

(Updated 11/11/2013)

I think I've managed to encapsulate the basic value proposition of unicorns in a relatively simple example, and a number of the
desired features are working.

I have specifically avoided trying to do any of the more complex things that we could want to do to avoid cluttering up this
example.  So specifically I have not:

 * Attempted to integrate with Ziniki or any other backend store
 * Tried to make over-advanced tooling or serve from Ziniki
 * Tried to indirect where the unicorns load from (i.e. no cardalog)

In lieu of all of that, I have used very, very simple node-based tooling (see unicornTooling)

There are, sadly, now several different things called "unicorn" in the repository, each of which is potentially a different
aspect of what a "unicorn" is.

 * Personally, I think of unicorns as the basic "data" elements.  I've modeled these as DS.Model subclasses, and the key
   things here are the model class (container/models/receipt.js) and the instance creation (container/routes/receipt.js).
 * There is the idea of the "code for" a unicorn, which is searched for and found based on a file called "unicorn.js"
   which should be in the "top level" of a unicorn code repository.  It's not exactly clear what this will ultimately mean
   in the real packaging world, but for now, you can find the only example at unicorn/receipt/whotels/expense/member/unicorn.js.
 * There is the "Unicorn" class, in vendor/unicornlib/unicorn.js, which is the class that gets extended to apply all the
   contracts.

The way in which I'm (trying to) construct a Unicorn is to basically have a simple set of fields that pull other things in.
The idea here would be that you pass to Unicorn.create() a hash of such things.  So far, I've only done this with the set
of contracts you implement.

To implement a contract, you need to have a handle to "the contract object" (defined currently in container/contracts, but I
feel that's too tied to the container).  This is an object of type "Contract" which is an Ember class defined in
vendor/unicornlib/contract.js.  Basically, this is something that is supposed to be meta-information about the contract.

In order to render the unicorn, it's necessary to put it in a container.  These can be found in "archetypes" at the very top
level, and are ultimately intended to correspond to Chris' six archetypes.  I've vaguely modelled our current need as a "list"
of receipts, and thus I've created an Ember.Component and called it "unicorn-list".  This takes a "mode" parameter which says
how you want the unicorns to be rendered, and I've already implemented "envelope" and "goring" (hopefully correctly).

In the process of doing this, I have hacked the resolver mercilessly to get the functionality I want.  I don't apologize for
this; part of what I think I need to do is to change the naming conventions to match my world-view of what "units" are.

I have Oasis integrated in at some level.  As yet, I am not really "thinking" about where things will appear or how, but am
just allowing the code to specify the nesting mode (sandbox, goring or envelope).  In the fulness of time, this needs to be
sorted onut.

I haven't yet touched the "modal" case - but I'm guessing that's just a different way of presenting the sandbox, and I'm not
sure it really applies for a "list" of sandboxes, but rather just for a single sandbox.

What I'm doing next
-------------------

I am currently working on drag-n-drop.  The most simple case here works, but not in the way that it is intended to (i.e.
with unicornlib facilitated communication).

What I would like you to look at
--------------------------------

Not yet done
------------

The other things which are not done which I do care about in this example are:

 * Running in node
   I am using node for my simple tooling, but I am not attempting (yet) to run these cards in node.
 * Getting anything working server side

It's my plan to come back to these in a little while, but I have other concerns to wrap my head around and Ember is blowing my
mind right now.
