import $ from "jquery";
import "waypoints/lib/noframework.waypoints";
import smoothScroll from "jquery-smooth-scroll";

export default class StickyHeader {
  constructor() {
    this.siteHeader = $(".site-header");
    this.headerTriggerElement = $(".headline");
    this.pageSections = $(".page-section");
    this.headerLinks = $(".primary-nav a");
    this.createHeaderWaypoint();
    this.createPageSectionWaypoint();
    this.addSmoothScrolling();
  }
  addSmoothScrolling() {
    this.headerLinks.smoothScroll();
  }
  createHeaderWaypoint() {
    const that = this;
    new Waypoint({
      element: that.headerTriggerElement[0],
      handler: function(direction) {
        if (direction === "down") {
          that.siteHeader.addClass("site-header--dark");
        } else {
          that.siteHeader.removeClass("site-header--dark");
        }
      }
    });
  }
  createPageSectionWaypoint() {
    this.pageSections.each(function() {
      const currentItem = this;
      new Waypoint({
        element: currentItem,
        handler: function(direction) {
          const matchingSectionLink = currentItem.getAttribute(
            "data-matching-link"
          );
          if (direction === "down") {
            $(matchingSectionLink)
              .parent()
              .siblings()
              .each(function() {
                $(this.children[0]).removeClass("is-current-link");
              });
            $(matchingSectionLink).addClass("is-current-link"); 
          }
        },
        // when top of the element is 18% below the viewport point
        offset: "18%"
      });

      new Waypoint({
        element: currentItem,
        handler: function(direction) {
          const matchingSectionLink = currentItem.getAttribute(
            "data-matching-link"
          );
          if (direction === "up") {
            $(matchingSectionLink)
              .parent()
              .siblings()
              .each(function() {
                $(this.children[0]).removeClass("is-current-link");
              });
            $(matchingSectionLink).addClass("is-current-link"); 
          }
        },
        // when top of the element is 40% above the viewport point
        offset: "-40%"
      });
    });
  }
}
