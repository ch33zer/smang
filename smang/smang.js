Links = new Meteor.Collection("links");

if (Meteor.isClient) {
	Template.input.events = {
		"click input.add": function(event) {
			Links.insert({urltext: document.getElementById("entry").value, owner: Meteor.userId(),x: 0, y: 0});
		}
	}
	
	Template.link.soundcloud = function() {
		var re = new RegExp("^http://([a-z0-9]*.)?soundcloud.com/([a-z0-9]/)*");
		return re.test(this.urltext);
	}
	
	Template.link.dragtext = function() {
		return this.urltext;	
	}
	Template.link.sc_embed = function() {
		var target = "sc_"+this._id;
		ret = SC.oEmbed(this.urltext, {auto_play: true}, function(oEmbed) {document.getElementById(target).appendChild(oEmbed.html);});
		return null;
	}
	Template.display.links = function() {
		return Links.find();
	}
	Template.link.user = function() {
		var user = Meteor.users.findOne(this.owner);
		if (user != null) {
			return user.emails.address;
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
		}, containment:"parent", refreshPositions:true});
		var target = "sc_"+tid;
		SC.oEmbed(this.data.urltext, {auto_play: true}, function(oEmbed) {document.getElementById(target).innerHTML = oEmbed.html;});
	}
}

if (Meteor.isServer) {
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
