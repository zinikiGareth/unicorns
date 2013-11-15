/** Because of the distributed nature of the unicorns we're building,
 * there is a need for general "coordination" between them.  This happens here.
 */
var Coordinator = Ember.Object.extend({
  /** Upon completion of a drag motion, do all the logic associated with it.
   * This may involve delegating operations to the sandboxes because only they have the views
   */
  dragItem: function(type, itemId, from, to) {
    var registry = this.get('registry');
    var fromS = registry.get('objectRegister')['archetype'][from];
    var toS = registry.get('objectRegister')['archetype'][from];
    if (fromS != null)
      throw new Error("Need to be able to delegate dragging to a sandbox");
    else
      this.removeFrom(from, itemId);
    if (toS != null)
      throw new Error("Need to be able to delegate dragging to a sandbox");
    else
      this.addTo(to, type, itemId);
  },
  
  /** This method should only be called in the appropriate sandbox context
   */
  removeFrom: function(archetypeId, itemId) {
    Ember.View.views[archetypeId].removeItem(itemId);
  },
  
  /** This method should only be called in the appropriate sandbox context
   */
  addTo: function(archetypeId, type, itemId) {
    Ember.View.views[archetypeId].addItem(type, itemId);
  }
});

export default Coordinator;
