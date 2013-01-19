if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to smang.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
		var Dragbox = function(str) {
			ret = document.createElement("div");
			ret.setAttribute("class", "draggable");
			anc = document.createElement("a");
			anc.setAttribute("href", str);
			anc.innerHTML = str;
			ret.appendChild(anc);;
			return ret;
		}
		
		function addDraggable(target, drag) {
			target.appendChild(drag);
			$(function() {
				$(".draggable").draggable({containment:'parent'});
			});
		}