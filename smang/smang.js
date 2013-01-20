Links = new Meteor.Collection("links");
Chats = new Meteor.Collection("chats");

if (Meteor.isClient) {
	Template.input.events = {
		"click input.add": function(event) {
			Links.insert({urltext: document.getElementById("entry").value, owner: Meteor.call('plainUserId'),x: 0, y: 0});
		}
	}
	Template.chat.events = {
		"click input.speak": function(event) {
			var ownerName = new String(Meteor.user().emails[0].address);
			Chats.insert({message: document.getElementById("chatentry").value, owner: ownerName});
		}
	}
	Template.chat.chats = function() {
		return Chats.find();
	}
	Template.chatmessage.owner = function() {
		return this.owner;
	}
	Template.chatmessage.message = function() {
		return this.message;
	}
	Template.link.events = {
		"click .delete": function(event) {
			Links.remove(this._id)
		}
	}
	
	Template.link.soundcloud = function() {
		var re = new RegExp("^http://([a-z0-9]*.)?soundcloud.com/([a-z0-9]/)*");
		return re.test(this.urltext);
	}
	Template.link.youtube = function() {
		var re = new RegExp("^https?://(www.)?youtube.com/[a-z0-9.?&=]*");
		return re.test(this.urltext);
	}
	Template.link.gist = function() {
		var re = new RegExp("^https?://gist.github.com/[a-z0-9.?&=]*");
		return re.test(this.urltext);

	}
	Template.link.twitter = function() {
		var re = new RegExp("^https?://(www.)?twitter.com/[a-z0-9]+/status/[0-9]+$");
		return re.test(this.urltext);
	}
	Template.link.image = function() {
		var re = new RegExp(".+\\.(jpg|png|gif|bmp)$","i");
		return re.test(this.urltext);
	}	
	Template.link.dragtext = function() {
		return this.urltext;	
	}
	Template.display.links = function() {
		return Links.find();
	}
	Template.link.user = function() {
		var user = Meteor.user();
		if (user != null) {
			return new String(user.emails[0].address);
		}
		return "Anonymous";
	}
	Template.link.dragx = function() {
		return this.x;	
	}
	Template.link.dragy = function() {
		return this.y;	
	}
	Template.link.id = function() {
		return this._id;
	}
	Template.link.rendered = function() {
		var tid = this.data._id;
		$("#"+tid).draggable({drag: function (event, ui) {
			var update = {$set: {x:ui.position.left, y:ui.position.top}};
			Links.update(tid, update,{multi:true}, function(err) {
				err;//debug	
			});
		}, stop: function(event, ui) {
			var update = {$set: {x:ui.position.left, y:ui.position.top}};
			Links.update(tid, update, {multi:true}, function(err){err;});
		}, containment:"parent", refreshPositions: true});
	}
	Template.sclink.created = function() {
		var tid = this.data._id;
		var target = "sc_"+tid;
		SC.oEmbed(this.data.urltext, {auto_play: false}, function(oEmbed) {document.getElementById(target).innerHTML = oEmbed.html;});
	}
	Template.ytlink.rendered = function() {
		var tid = this.data._id;
		var target = "yt_"+tid;

		var video_id = this.data.urltext.split('v=')[1];
		var ampersandPosition = video_id.indexOf('&');
		if(ampersandPosition != -1) {
		  video_id = video_id.substring(0, ampersandPosition);
		}

		var uri = "<iframe width=\"560\" height=\"315\" src=\"http://www.youtube.com/embed/" + video_id + "\" frameborder=\"0\"></iframe>";
		document.getElementById(target).innerHTML = uri;
	}
	Template.ghlink.rendered = function() {
		var tid = this.data._id;
		var target = "gh_"+tid;
		var url = "https://github.com/api/oembed?format=json&url="+this.data.urltext+"&callback=?";
		var linkURL= this.data.urltext;
		$.getJSON(url, null, function(data) {
			document.getElementById(target).innerHTML="<span style=\"font-size:10px\">Snippet of <a href=\""+linkURL+"\">this gist</a></span>"
			document.getElementById(target).innerHTML+=data.html;	
		});
		
	}
	Template.twlink.rendered = function() {
		var tid = this.data._id;
		var target = "tw_"+tid;
		$.getJSON("https://api.twitter.com/1/statuses/oembed.json?url="+this.data.urltext+"&callback=?", null, function(data) {
			document.getElementById(target).innerHTML = data.html;
		});
	}
}

if (Meteor.isServer) {
  Meteor.methods({
	plainUserId: function() {
		return this.userId;
	}
  });
  Meteor.startup(function () {
    if (Links.find().count() === 0) {
      var urls = ["http://jhu.edu",
                   "http://youtube.com"];
      for (var i = 0; i < urls.length; i++)
        Links.insert({urltext: urls[i], owner: null,x: Math.floor(Math.random()*10)*5, y: Math.floor(Math.random()*10)*5});

	}

   }); 
}
/*
// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

if (Meteor.isClient) {
  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Math.random()*10)*5});
    }
  });
}
*/
