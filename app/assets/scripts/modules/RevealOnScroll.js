import $ from "jquery"; 
// imported object: Waypoint
import "waypoints/lib/noframework.waypoints";


export default class RevealOnScroll {
  constructor(itemsToReveal, offset) {
    this.itemsToReveal = itemsToReveal;
    this.offset = offset;
    this.hideInitially();
    this.createWayPoints();
  }
  hideInitially() {
    this.itemsToReveal.addClass("reveal-item");
  }
  createWayPoints() {
    const that = this;
    this.itemsToReveal.each(function() { 
      const currentItem = this;
      new Waypoint({
        element: currentItem,
        handler: function() {
          $(currentItem).addClass("reveal-item--is-visible");
        },
        offset: that.offset
      });
    });
  }
}
