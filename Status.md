Current Status
--------------

(As of 10/23/2013)

I think I've managed to encapsulate the basic value proposition of unicorns in a relatively simple example, and a number of the
desired features are working.

I have specifically avoided trying to do any of the more complex things that we could want to do to avoid cluttering up this
example.  So specifically I have not:

 * Attempted to integrate with Ziniki or any other backend store
 * Tried to make over-advanced tooling or serve from Ziniki
 * Tried to indirect where the unicorns load from (i.e. no cardalog)

In lieu of all of that, I have used very, very simple node-based tooling which I am (eventually) going to check in to a
separate project.

I modelled unicorns primarily as DS.Model subclasses - the idea is that each of these would literally contain the "unicorn model
data" along with the notion of which "unicorn" should ideally be used to render that.  That is not happening yet.

What I would like you to look at
--------------------------------

1. The core code for doing the unicorn rendering is in the pair of "container/views/unicorn.js" and
"container/controller/unicorn.js".  I think this is actually all stuff that should be pulled out into the "unicorn" library
(vendor/unicorn - not yet populated), but that's a refactoring.  I'm not at all sure this is the best way to do it,
but hopefully the code makes it clear what I'm trying to do.

2. There is magic involved in creating sandboxed "cards" which I'm unclear on and has to do with Oasis (and possibly conductor).
Based on the conversation we had on Friday with David, I'm assuming we want to start with Oasis only.  There are two spots in
views/unicorn.js which would like to do this: one to do the sandbox-on-this-page and one to do the modal-sandbox-thing.  I would
appreciate it if you could add these.

3. I took the resolver.js code from Glazier and modified it in a couple of places to try and asynchronously load the unicorn
code.  I tried to use the best lessons of promises et al that you had imbued me with last week, but no guarantees.  This may
or may not be in line with best practices.  Basically, it's only needed in the "carpet-pooping" or "goring" mode, in lieu of
doing proper Oasis containers.

4. Because of all the various delay things here (i.e. because we may need to asynchronously load the unicorn code), the "goring"
mode does not work.  It would seem that if you assume it's synchronous, and try and apply the template directly, you are too late,
but if you add a "then()" you are too early (i.e. before the node is attached to the DOM).  I'm sure there's something you can
do with run loops or delays or promises that I can't that will make all this happen in the right order.

5. Generally review everything around here and offer comments (given that's its wildly incomplete; see below)

Not yet done
--------

The other things which are not done which I do care about in this example are:

 * Contracts
   I have sort-of-hinted at where the contracts would fit into this, but haven't actually implemented anything.  I think that
   having working contracts is vitally important to everything else we do.
 * Running in node
   I am using node for my simple tooling, but I am not attempting (yet) to run these cards in node.

It's my plan to come back to these in a little while, but I have other concerns to wrap my head around and Ember is blowing my
mind right now.
