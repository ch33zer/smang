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