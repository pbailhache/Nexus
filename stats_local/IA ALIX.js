(function () { "use strict";
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { }
HxOverrides.__name__ = true;
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IMap = function() { }
IMap.__name__ = true;
var com = {}
com.tamina = {}
com.tamina.planetwars = {}
com.tamina.planetwars.data = {}
com.tamina.planetwars.data.IPlayer = function() { }
com.tamina.planetwars.data.IPlayer.__name__ = true;
com.tamina.planetwars.data.IPlayer.prototype = {
	__class__: com.tamina.planetwars.data.IPlayer
}
var WorkerIA = function(name,color) {
	if(color == null) color = 0;
	if(name == null) name = "";
	this.name = name;
	this.color = color;
	this.debugMessage = "";
};
WorkerIA.__name__ = true;
WorkerIA.__interfaces__ = [com.tamina.planetwars.data.IPlayer];
WorkerIA.prototype = {
	postMessage: function(message) {
	}
	,messageHandler: function(event) {
		if(event.data != null) {
			var turnMessage = event.data;
			WorkerIA.instance.id = turnMessage.playerId;
			this.postMessage(new com.tamina.planetwars.data.TurnResult(WorkerIA.instance.getOrders(turnMessage.galaxy),WorkerIA.instance.debugMessage));
		} else this.postMessage("data null");
	}
	,getOrders: function(context) {
		var result = new Array();
		return result;
	}
	,__class__: WorkerIA
}
var MyIA = function() {
	this.strategies = [new strategy.StraightToCore(this),new strategy.Germany(this),new strategy.Spread(this),new strategy.Expand(this),new strategy.Random(this),new strategy.Focus(this)];
	WorkerIA.call(this,"Stellae#1",8447);
	this.strat = 5;
};
MyIA.__name__ = true;
MyIA.main = function() {
	WorkerIA.instance = new MyIA();
}
MyIA.__super__ = WorkerIA;
MyIA.prototype = $extend(WorkerIA.prototype,{
	getOrders: function(context) {
		return this.strategies[this.strat].getOrders(context,this.id);
	}
	,__class__: MyIA
});
var Std = function() { }
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std.random = function(x) {
	return x <= 0?0:Math.floor(Math.random() * x);
}
com.tamina.planetwars.data.Galaxy = function(width,height) {
	this.width = width;
	this.height = height;
	this.content = new Array();
	this.fleet = new Array();
};
com.tamina.planetwars.data.Galaxy.__name__ = true;
com.tamina.planetwars.data.Galaxy.prototype = {
	contains: function(planetId) {
		var result = false;
		var _g1 = 0, _g = this.content.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.content[i].id == planetId) {
				result = true;
				break;
			}
		}
		return result;
	}
	,__class__: com.tamina.planetwars.data.Galaxy
}
com.tamina.planetwars.data.Game = function() { }
com.tamina.planetwars.data.Game.__name__ = true;
com.tamina.planetwars.data.Game.get_NUM_PLANET = function() {
	if(com.tamina.planetwars.data.Game.NUM_PLANET == null) com.tamina.planetwars.data.Game.NUM_PLANET = new com.tamina.planetwars.data.Range(5,10);
	return com.tamina.planetwars.data.Game.NUM_PLANET;
}
com.tamina.planetwars.data.Game.get_NEUTRAL_PLAYER = function() {
	if(com.tamina.planetwars.data.Game._NEUTRAL_PLAYER == null) com.tamina.planetwars.data.Game._NEUTRAL_PLAYER = new com.tamina.planetwars.data.Player("neutre",13421772);
	return com.tamina.planetwars.data.Game._NEUTRAL_PLAYER;
}
com.tamina.planetwars.data.Order = function(sourceID,targetID,numUnits) {
	this.sourceID = sourceID;
	this.targetID = targetID;
	this.numUnits = numUnits;
};
com.tamina.planetwars.data.Order.__name__ = true;
com.tamina.planetwars.data.Order.prototype = {
	__class__: com.tamina.planetwars.data.Order
}
com.tamina.planetwars.data.Planet = function(x,y,size,owner) {
	if(size == null) size = 2;
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
	this.size = size;
	this.owner = owner;
	this.population = com.tamina.planetwars.data.PlanetPopulation.getDefaultPopulation(size);
	this.id = Std.string(com.tamina.planetwars.utils.UID.get());
};
com.tamina.planetwars.data.Planet.__name__ = true;
com.tamina.planetwars.data.Planet.prototype = {
	__class__: com.tamina.planetwars.data.Planet
}
com.tamina.planetwars.data.PlanetPopulation = function() { }
com.tamina.planetwars.data.PlanetPopulation.__name__ = true;
com.tamina.planetwars.data.PlanetPopulation.getMaxPopulation = function(planetSize) {
	var result = 1;
	switch(planetSize) {
	case 1:
		result = com.tamina.planetwars.data.PlanetPopulation.MAX_SMALL;
		break;
	case 2:
		result = com.tamina.planetwars.data.PlanetPopulation.MAX_NORMAL;
		break;
	case 3:
		result = com.tamina.planetwars.data.PlanetPopulation.MAX_BIG;
		break;
	case 4:
		result = com.tamina.planetwars.data.PlanetPopulation.MAX_HUGE;
		break;
	}
	return result;
}
com.tamina.planetwars.data.PlanetPopulation.getDefaultPopulation = function(planetSize) {
	var result = 1;
	switch(planetSize) {
	case 1:
		result = com.tamina.planetwars.data.PlanetPopulation.DEFAULT_SMALL;
		break;
	case 2:
		result = com.tamina.planetwars.data.PlanetPopulation.DEFAULT_NORMAL;
		break;
	case 3:
		result = com.tamina.planetwars.data.PlanetPopulation.DEFAULT_BIG;
		break;
	case 4:
		result = com.tamina.planetwars.data.PlanetPopulation.DEFAULT_HUGE;
		break;
	}
	return result;
}
com.tamina.planetwars.data.PlanetSize = function() { }
com.tamina.planetwars.data.PlanetSize.__name__ = true;
com.tamina.planetwars.data.PlanetSize.getWidthBySize = function(size) {
	var result = 50;
	switch(size) {
	case 1:
		result = 20;
		break;
	case 2:
		result = 30;
		break;
	case 3:
		result = 50;
		break;
	case 4:
		result = 70;
		break;
	default:
		throw "Taille inconnue : " + Std.string(size);
	}
	return result;
}
com.tamina.planetwars.data.PlanetSize.getExtensionBySize = function(size) {
	var result = "_big";
	switch(size) {
	case 1:
		result = "_small";
		break;
	case 2:
		result = "_normal";
		break;
	case 3:
		result = "_big";
		break;
	case 4:
		result = "_huge";
		break;
	default:
		throw "Taille inconnue : " + Std.string(size);
	}
	return result;
}
com.tamina.planetwars.data.PlanetSize.getRandomPlanetImageURL = function(size) {
	var result = "";
	var rdn = Math.round(Math.random() * 4);
	switch(rdn) {
	case 0:
		result = "images/jupiter" + com.tamina.planetwars.data.PlanetSize.getExtensionBySize(size) + ".png";
		break;
	case 1:
		result = "images/lune" + com.tamina.planetwars.data.PlanetSize.getExtensionBySize(size) + ".png";
		break;
	case 2:
		result = "images/mars" + com.tamina.planetwars.data.PlanetSize.getExtensionBySize(size) + ".png";
		break;
	case 3:
		result = "images/neptune" + com.tamina.planetwars.data.PlanetSize.getExtensionBySize(size) + ".png";
		break;
	case 4:
		result = "images/terre" + com.tamina.planetwars.data.PlanetSize.getExtensionBySize(size) + ".png";
		break;
	}
	return result;
}
com.tamina.planetwars.data.Player = function(name,color,script) {
	if(script == null) script = "";
	if(color == null) color = 0;
	if(name == null) name = "";
	this.name = name;
	this.color = color;
	this.script = script;
	this.id = Std.string(com.tamina.planetwars.utils.UID.get());
};
com.tamina.planetwars.data.Player.__name__ = true;
com.tamina.planetwars.data.Player.__interfaces__ = [com.tamina.planetwars.data.IPlayer];
com.tamina.planetwars.data.Player.prototype = {
	getOrders: function(context) {
		var result = new Array();
		return result;
	}
	,__class__: com.tamina.planetwars.data.Player
}
com.tamina.planetwars.data.Range = function(from,to) {
	if(to == null) to = 1;
	if(from == null) from = 0;
	this.from = from;
	this.to = to;
};
com.tamina.planetwars.data.Range.__name__ = true;
com.tamina.planetwars.data.Range.prototype = {
	__class__: com.tamina.planetwars.data.Range
}
com.tamina.planetwars.data.Ship = function(crew,source,target,creationTurn) {
	this.crew = crew;
	this.source = source;
	this.target = target;
	this.owner = source.owner;
	this.creationTurn = creationTurn;
	this.travelDuration = Math.ceil(com.tamina.planetwars.utils.GameUtil.getDistanceBetween(new com.tamina.planetwars.geom.Point(source.x,source.y),new com.tamina.planetwars.geom.Point(target.x,target.y)) / 60);
};
com.tamina.planetwars.data.Ship.__name__ = true;
com.tamina.planetwars.data.Ship.prototype = {
	__class__: com.tamina.planetwars.data.Ship
}
com.tamina.planetwars.data.TurnMessage = function(playerId,galaxy) {
	this.playerId = playerId;
	this.galaxy = galaxy;
};
com.tamina.planetwars.data.TurnMessage.__name__ = true;
com.tamina.planetwars.data.TurnMessage.prototype = {
	__class__: com.tamina.planetwars.data.TurnMessage
}
com.tamina.planetwars.data.TurnResult = function(orders,message) {
	if(message == null) message = "";
	this.orders = orders;
	this.consoleMessage = message;
	this.error = "";
};
com.tamina.planetwars.data.TurnResult.__name__ = true;
com.tamina.planetwars.data.TurnResult.prototype = {
	__class__: com.tamina.planetwars.data.TurnResult
}
com.tamina.planetwars.geom = {}
com.tamina.planetwars.geom.Point = function(x,y) {
	this.x = x;
	this.y = y;
};
com.tamina.planetwars.geom.Point.__name__ = true;
com.tamina.planetwars.geom.Point.prototype = {
	__class__: com.tamina.planetwars.geom.Point
}
com.tamina.planetwars.utils = {}
com.tamina.planetwars.utils.GameUtil = function() { }
com.tamina.planetwars.utils.GameUtil.__name__ = true;
com.tamina.planetwars.utils.GameUtil.getDistanceBetween = function(p1,p2) {
	return Math.sqrt(Math.pow(p2.x - p1.x,2) + Math.pow(p2.y - p1.y,2));
}
com.tamina.planetwars.utils.GameUtil.getDistanceBetweenPlanets = function(p1,p2) {
	return com.tamina.planetwars.utils.GameUtil.getDistanceBetween(new com.tamina.planetwars.geom.Point(p1.x,p1.y),new com.tamina.planetwars.geom.Point(p2.x,p2.y));
}
com.tamina.planetwars.utils.GameUtil.getTravelNumTurn = function(source,target) {
	return Math.ceil(com.tamina.planetwars.utils.GameUtil.getDistanceBetween(new com.tamina.planetwars.geom.Point(source.x,source.y),new com.tamina.planetwars.geom.Point(target.x,target.y)) / 60);
}
com.tamina.planetwars.utils.GameUtil.getPlayerPlanets = function(planetOwnerId,context) {
	var result = new Array();
	var _g = 0, _g1 = context.content;
	while(_g < _g1.length) {
		var planet = _g1[_g];
		++_g;
		if(planet.owner.id == planetOwnerId) result.push(planet);
	}
	return result;
}
com.tamina.planetwars.utils.GameUtil.getEnemyPlanets = function(planetOwnerId,context) {
	var result = new Array();
	var _g = 0, _g1 = context.content;
	while(_g < _g1.length) {
		var planet = _g1[_g];
		++_g;
		if(planet.owner.id != planetOwnerId) result.push(planet);
	}
	return result;
}
com.tamina.planetwars.utils.GameUtil.getPlayerShips = function(playerId,context) {
	var result = new Array();
	var _g = 0, _g1 = context.fleet;
	while(_g < _g1.length) {
		var ship = _g1[_g];
		++_g;
		if(ship.owner.id == playerId) result.push(ship);
	}
	return result;
}
com.tamina.planetwars.utils.GameUtil.getEnemyShips = function(playerId,context) {
	var result = new Array();
	var _g = 0, _g1 = context.fleet;
	while(_g < _g1.length) {
		var ship = _g1[_g];
		++_g;
		if(ship.owner.id != playerId) result.push(ship);
	}
	return result;
}
com.tamina.planetwars.utils.GameUtil.getNearestPlanet = function(source,candidats) {
	var result = candidats[0];
	var currentDist = com.tamina.planetwars.utils.GameUtil.getDistanceBetweenPlanets(source,result);
	var _g1 = 0, _g = candidats.length;
	while(_g1 < _g) {
		var i = _g1++;
		var element = candidats[i];
		if(currentDist > com.tamina.planetwars.utils.GameUtil.getDistanceBetweenPlanets(source,element)) {
			currentDist = com.tamina.planetwars.utils.GameUtil.getDistanceBetweenPlanets(source,element);
			result = element;
		}
	}
	return result;
}
com.tamina.planetwars.utils.GameUtil.getEnnemyName = function(others) {
	var first = others[0].owner;
	var second = others[1].owner;
	return first == others[others.length - 1].owner?second:first;
}
com.tamina.planetwars.utils.GameUtil.createRandomGalaxy = function(width,height,padding,playerOne,playerTwo) {
	var result = new com.tamina.planetwars.data.Galaxy(width,height);
	if(playerOne != null) {
		result.firstPlayerHome = new com.tamina.planetwars.data.Planet(padding * 2,padding * 2,3,playerOne);
		result.firstPlayerHome.population = 100;
		result.content.push(result.firstPlayerHome);
	}
	if(playerTwo != null) {
		result.secondPlayerHome = new com.tamina.planetwars.data.Planet(width - padding * 2,height - padding * 2,3,playerTwo);
		result.secondPlayerHome.population = 100;
		result.content.push(result.secondPlayerHome);
	}
	var numPlanet = Math.floor(com.tamina.planetwars.data.Game.get_NUM_PLANET().from + Math.floor(Math.random() * (com.tamina.planetwars.data.Game.get_NUM_PLANET().to - com.tamina.planetwars.data.Game.get_NUM_PLANET().from)));
	var colNumber = Math.floor((result.width - 280) / 70);
	var rawNumber = Math.floor((result.height - 140) / 70);
	var avaiblePositions = new Array();
	var _g1 = 0, _g = colNumber * rawNumber;
	while(_g1 < _g) {
		var i = _g1++;
		avaiblePositions.push(i);
	}
	var _g = 0;
	while(_g < numPlanet) {
		var i = _g++;
		var pos = com.tamina.planetwars.utils.GameUtil.getNewPosition(result,avaiblePositions,colNumber);
		var p = new com.tamina.planetwars.data.Planet(pos.x,pos.y,Math.ceil(Math.random() * 4),com.tamina.planetwars.data.Game.get_NEUTRAL_PLAYER());
		result.content.push(p);
	}
	return result;
}
com.tamina.planetwars.utils.GameUtil.getNewPosition = function(currentGalaxy,avaiblePositions,colNumber) {
	var result;
	var index = Math.floor(Math.random() * avaiblePositions.length);
	var caseNumber = avaiblePositions[index];
	avaiblePositions.splice(index,1);
	var columIndex = caseNumber % colNumber;
	var rawIndex = Math.ceil(caseNumber / colNumber);
	result = new com.tamina.planetwars.geom.Point((columIndex + 2) * 70,(rawIndex + 1) * 70);
	return result;
}
com.tamina.planetwars.utils.UID = function() { }
com.tamina.planetwars.utils.UID.__name__ = true;
com.tamina.planetwars.utils.UID.get = function() {
	if(com.tamina.planetwars.utils.UID._lastUID == null) com.tamina.planetwars.utils.UID._lastUID = 0;
	com.tamina.planetwars.utils.UID._lastUID++;
	return com.tamina.planetwars.utils.UID._lastUID;
}
var haxe = {}
haxe.ds = {}
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
haxe.ds.ObjectMap.__name__ = true;
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.prototype = {
	keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,set: function(key,value) {
		var id = key.__id__ != null?key.__id__:key.__id__ = ++haxe.ds.ObjectMap.count;
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,__class__: haxe.ds.ObjectMap
}
var js = {}
js.Boot = function() { }
js.Boot.__name__ = true;
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
var strategy = {}
strategy.Strategy = function() { }
strategy.Strategy.__name__ = true;
strategy.Strategy.prototype = {
	__class__: strategy.Strategy
}
strategy.Expand = function(ia,distance,marge,level) {
	if(level == null) level = 30;
	if(marge == null) marge = 100;
	if(distance == null) distance = 500;
	this.distance = distance;
	this.marge = marge;
	this.level = level;
	this.ia = ia;
};
strategy.Expand.__name__ = true;
strategy.Expand.__interfaces__ = [strategy.Strategy];
strategy.Expand.prototype = {
	getPlanetsAround: function(source,distance,marge,candidats) {
		var result = new Array();
		var _g = 0;
		while(_g < candidats.length) {
			var planet = candidats[_g];
			++_g;
			if(com.tamina.planetwars.utils.GameUtil.getDistanceBetweenPlanets(source,planet) >= distance - marge && com.tamina.planetwars.utils.GameUtil.getDistanceBetweenPlanets(source,planet) <= distance + marge) result.push(planet);
		}
		return result;
	}
	,getOrders: function(context,id) {
		var result = new Array();
		var myPlanets = com.tamina.planetwars.utils.GameUtil.getPlayerPlanets(id,context);
		var otherPlanets = com.tamina.planetwars.utils.GameUtil.getEnemyPlanets(id,context);
		if(otherPlanets != null && otherPlanets.length > 0) {
			var _g = 0;
			while(_g < myPlanets.length) {
				var myPlanet = [myPlanets[_g]];
				++_g;
				otherPlanets.sort((function(myPlanet) {
					return function(a,b) {
						return com.tamina.planetwars.utils.GameUtil.getDistanceBetweenPlanets(a,myPlanet[0]) - com.tamina.planetwars.utils.GameUtil.getDistanceBetweenPlanets(b,myPlanet[0]) | 0;
					};
				})(myPlanet));
				var planetsAround = [];
				var quant = [];
				var acc = 0;
				var sum = 0;
				while(planetsAround.length == 0) {
					this.distance = com.tamina.planetwars.utils.GameUtil.getDistanceBetweenPlanets(myPlanet[0],otherPlanets[0]);
					planetsAround = this.getPlanetsAround(myPlanet[0],this.distance,this.marge,otherPlanets);
				}
				var _g1 = 0;
				while(_g1 < planetsAround.length) {
					var planet = planetsAround[_g1];
					++_g1;
					sum += planet.size;
					quant.push(0);
				}
				var modif = true;
				var listDone = [];
				var listToDo = planetsAround.slice();
				while(modif) {
					modif = false;
					if(myPlanet[0].population >= this.level) {
						var _g2 = 0, _g1 = planetsAround.length;
						while(_g2 < _g1) {
							var i = _g2++;
							var evenpop = Math.floor(myPlanet[0].population / sum * planetsAround[i].size);
							var maxpop = com.tamina.planetwars.data.PlanetPopulation.getMaxPopulation(planetsAround[i].size) < planetsAround[i].population + com.tamina.planetwars.utils.GameUtil.getTravelNumTurn(myPlanet[0],planetsAround[i]) * 5?com.tamina.planetwars.data.PlanetPopulation.getMaxPopulation(planetsAround[i].size):planetsAround[i].population + com.tamina.planetwars.utils.GameUtil.getTravelNumTurn(myPlanet[0],planetsAround[i]) * 5;
							if(maxpop < evenpop && (function($this) {
								var $r;
								{
									var _g3 = 0;
									while(_g3 < listDone.length) {
										var j = listDone[_g3];
										++_g3;
										if(planetsAround[i] == j) false;
									}
								}
								$r = true;
								return $r;
							}(this))) {
								quant[i] = maxpop;
								listDone.push(planetsAround[i]);
								HxOverrides.remove(listToDo,planetsAround[i]);
								modif = true;
							} else quant[i] = evenpop;
						}
					}
				}
				var _g2 = 0, _g1 = planetsAround.length;
				while(_g2 < _g1) {
					var i = _g2++;
					if(quant[i] != 0) result.push(new com.tamina.planetwars.data.Order(myPlanet[0].id,planetsAround[i].id,quant[i]));
				}
			}
		}
		return result;
	}
	,__class__: strategy.Expand
}
strategy.Focus = function(ia) {
	this.ia = ia;
	this.PlanetsData = new haxe.ds.ObjectMap();
};
strategy.Focus.__name__ = true;
strategy.Focus.__interfaces__ = [strategy.Strategy];
strategy.Focus.prototype = {
	createOrders: function(data) {
		var orders = new Array();
		var dataTuple;
		var $it0 = data.keys();
		while( $it0.hasNext() ) {
			var planet = $it0.next();
			dataTuple = data.h[planet.__id__];
			var _g1 = 0, _g = data.h[planet.__id__].getTargets().length;
			while(_g1 < _g) {
				var i = _g1++;
				if(dataTuple.getTurnsLeft()[i] == 0) {
					orders.push(new com.tamina.planetwars.data.Order(planet.id,dataTuple.getTargets()[i].id,dataTuple.getPopReserved()[i]));
					dataTuple.remove(i);
				}
			}
			dataTuple.decrease();
		}
		return orders;
	}
	,canConquer: function(source,target) {
		return target.population + com.tamina.planetwars.utils.GameUtil.getTravelNumTurn(source,target) * 5 < this.PlanetsData.h[source.__id__].getPopLeft();
	}
	,getOrders: function(context,id) {
		var myPlanets = com.tamina.planetwars.utils.GameUtil.getPlayerPlanets(id,context);
		var enemyPlanets = com.tamina.planetwars.utils.GameUtil.getEnemyPlanets(id,context);
		var enemyShips = com.tamina.planetwars.utils.GameUtil.getEnemyShips(id,context);
		var toSend = new Array();
		var _g = 0;
		while(_g < myPlanets.length) {
			var planet = myPlanets[_g];
			++_g;
			if(!this.PlanetsData.h.hasOwnProperty(planet.__id__)) this.PlanetsData.set(planet,new strategy.DataPlanet(planet.population));
		}
		var _g = 0;
		while(_g < myPlanets.length) {
			var myPlanet = myPlanets[_g];
			++_g;
			var plan = 0;
			var _g1 = 0;
			while(_g1 < enemyPlanets.length) {
				var enemyPlanet = enemyPlanets[_g1];
				++_g1;
				if(this.canConquer(myPlanet,enemyPlanet)) {
					var popByLanding = enemyPlanet.population + com.tamina.planetwars.utils.GameUtil.getTravelNumTurn(myPlanet,enemyPlanet) * 5;
					this.PlanetsData.h[myPlanet.__id__].updateData(enemyPlanet,popByLanding + 1,0);
				}
			}
		}
		return this.createOrders(this.PlanetsData);
	}
	,__class__: strategy.Focus
}
strategy.DataPlanet = function(pop) {
	this.targets = new Array();
	this.popReserved = new Array();
	this.turnsLeft = new Array();
	this.popLeft = pop;
};
strategy.DataPlanet.__name__ = true;
strategy.DataPlanet.prototype = {
	decrease: function() {
		var _g = 0, _g1 = this.turnsLeft;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			i--;
		}
	}
	,remove: function(order) {
		this.targets.splice(order,1);
		this.popReserved.splice(order,1);
		this.turnsLeft.splice(order,1);
	}
	,getPopLeft: function() {
		return this.popLeft;
	}
	,getTurnsLeft: function() {
		return this.turnsLeft;
	}
	,getPopReserved: function() {
		return this.popReserved;
	}
	,getTargets: function() {
		return this.targets;
	}
	,updateData: function(target,pop,turns) {
		this.targets.push(target);
		this.popReserved.push(pop);
		this.turnsLeft.push(turns);
		this.popLeft -= pop;
	}
	,__class__: strategy.DataPlanet
}
strategy.Germany = function(ia,level,quant) {
	if(quant == null) quant = 40;
	if(level == null) level = 50;
	this.ia = ia;
	this.level = level;
	this.quant = quant;
};
strategy.Germany.__name__ = true;
strategy.Germany.__interfaces__ = [strategy.Strategy];
strategy.Germany.prototype = {
	getOrders: function(context,id) {
		var result = new Array();
		var myPlanets = com.tamina.planetwars.utils.GameUtil.getPlayerPlanets(id,context);
		var otherPlanets = com.tamina.planetwars.utils.GameUtil.getEnemyPlanets(id,context);
		if(otherPlanets != null && otherPlanets.length > 0) {
			var _g = 0;
			while(_g < myPlanets.length) {
				var myPlanet = myPlanets[_g];
				++_g;
				var target = com.tamina.planetwars.utils.GameUtil.getNearestPlanet(myPlanet,otherPlanets);
				if(myPlanet.population >= this.level) result.push(new com.tamina.planetwars.data.Order(myPlanet.id,target.id,this.quant));
			}
		}
		return result;
	}
	,__class__: strategy.Germany
}
strategy.Random = function(ia) {
	this.ia = ia;
};
strategy.Random.__name__ = true;
strategy.Random.__interfaces__ = [strategy.Strategy];
strategy.Random.prototype = {
	getOrders: function(context,id) {
		var orders = new Array();
		var myPlanets = com.tamina.planetwars.utils.GameUtil.getPlayerPlanets(id,context);
		var myShips = com.tamina.planetwars.utils.GameUtil.getPlayerShips(id,context);
		var enemyPlanets = com.tamina.planetwars.utils.GameUtil.getEnemyPlanets(id,context);
		var enemyShips = com.tamina.planetwars.utils.GameUtil.getEnemyShips(id,context);
		var toSend = new Array();
		var _g1 = 0, _g = enemyPlanets.length;
		while(_g1 < _g) {
			var i = _g1++;
			toSend.push(0);
		}
		var totalPopulation = 0;
		var _g = 0;
		while(_g < myPlanets.length) {
			var planet = myPlanets[_g];
			++_g;
			totalPopulation += planet.population;
		}
		var _g = 0;
		while(_g < myPlanets.length) {
			var source = myPlanets[_g];
			++_g;
			var _g2 = 0, _g1 = source.population - 1;
			while(_g2 < _g1) {
				var i = _g2++;
				toSend[Std.random(enemyPlanets.length)] += 1;
			}
			var _g2 = 0, _g1 = toSend.length;
			while(_g2 < _g1) {
				var i = _g2++;
				if(toSend[i] != 0) orders.push(new com.tamina.planetwars.data.Order(source.id,enemyPlanets[i].id,toSend[i]));
			}
		}
		return orders;
	}
	,__class__: strategy.Random
}
strategy.Spread = function(ia) {
	this.ia = ia;
};
strategy.Spread.__name__ = true;
strategy.Spread.__interfaces__ = [strategy.Strategy];
strategy.Spread.prototype = {
	newOrder: function(source,target,population) {
		if(source.population >= population) return new com.tamina.planetwars.data.Order(source.id,target.id,population);
		return null;
	}
	,getOrders: function(context,id) {
		var orders = new Array();
		var myPlanets = com.tamina.planetwars.utils.GameUtil.getPlayerPlanets(id,context);
		var myShips = com.tamina.planetwars.utils.GameUtil.getPlayerShips(id,context);
		var enemyPlanets = com.tamina.planetwars.utils.GameUtil.getEnemyPlanets(id,context);
		var enemyShips = com.tamina.planetwars.utils.GameUtil.getEnemyShips(id,context);
		var totalPopulation = 0;
		var _g = 0;
		while(_g < myPlanets.length) {
			var planet = myPlanets[_g];
			++_g;
			totalPopulation += planet.population;
		}
		var _g = 0;
		while(_g < myPlanets.length) {
			var source = [myPlanets[_g]];
			++_g;
			if(source[0].population == com.tamina.planetwars.data.PlanetPopulation.getMaxPopulation(source[0].size)) {
				enemyPlanets.sort((function(source) {
					return function(a,b) {
						return com.tamina.planetwars.utils.GameUtil.getDistanceBetweenPlanets(a,source[0]) - com.tamina.planetwars.utils.GameUtil.getDistanceBetweenPlanets(b,source[0]) | 0;
					};
				})(source));
				var _g1 = 0;
				while(_g1 < enemyPlanets.length) {
					var target = enemyPlanets[_g1];
					++_g1;
					var populationByLanding = target.population + com.tamina.planetwars.utils.GameUtil.getTravelNumTurn(source[0],target) * 5;
					if(source[0].population > populationByLanding) {
						var order = this.newOrder(source[0],target,populationByLanding + 1);
						if(order != null) orders.push(order);
					}
				}
			}
		}
		return orders;
	}
	,__class__: strategy.Spread
}
strategy.StraightToCore = function(ia,percentage) {
	if(percentage == null) percentage = 100;
	this.ia = ia;
	this.percent = percentage;
};
strategy.StraightToCore.__name__ = true;
strategy.StraightToCore.__interfaces__ = [strategy.Strategy];
strategy.StraightToCore.prototype = {
	getOrders: function(context,id) {
		var result = new Array();
		var myPlanets = com.tamina.planetwars.utils.GameUtil.getPlayerPlanets(id,context);
		var otherPlanets = com.tamina.planetwars.utils.GameUtil.getEnemyPlanets(id,context);
		if(this.ennemy == null) this.ennemy = com.tamina.planetwars.utils.GameUtil.getEnnemyName(otherPlanets);
		var ennemyPlanets = com.tamina.planetwars.utils.GameUtil.getPlayerPlanets(this.ennemy.id,context);
		if(ennemyPlanets != null && ennemyPlanets.length > 0) {
			var _g = 0;
			while(_g < myPlanets.length) {
				var myPlanet = myPlanets[_g];
				++_g;
				var pop = Math.ceil(myPlanet.population * this.percent / 100);
				result.push(new com.tamina.planetwars.data.Order(myPlanet.id,ennemyPlanets[0].id,pop));
			}
		}
		return result;
	}
	,__class__: strategy.StraightToCore
}
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
onmessage = WorkerIA.prototype.messageHandler;
String.prototype.__class__ = String;
String.__name__ = true;
Array.prototype.__class__ = Array;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
com.tamina.planetwars.data.Game.DEFAULT_PLAYER_POPULATION = 100;
com.tamina.planetwars.data.Game.PLANET_GROWTH = 5;
com.tamina.planetwars.data.Game.SHIP_SPEED = 60;
com.tamina.planetwars.data.Game.MAX_TURN_DURATION = 1000;
com.tamina.planetwars.data.Game.GAME_SPEED = 500;
com.tamina.planetwars.data.Game.GAME_DURATION = 240;
com.tamina.planetwars.data.Game.GAME_MAX_NUM_TURN = 500;
com.tamina.planetwars.data.PlanetPopulation.DEFAULT_SMALL = 20;
com.tamina.planetwars.data.PlanetPopulation.DEFAULT_NORMAL = 30;
com.tamina.planetwars.data.PlanetPopulation.DEFAULT_BIG = 40;
com.tamina.planetwars.data.PlanetPopulation.DEFAULT_HUGE = 50;
com.tamina.planetwars.data.PlanetPopulation.MAX_SMALL = 50;
com.tamina.planetwars.data.PlanetPopulation.MAX_NORMAL = 100;
com.tamina.planetwars.data.PlanetPopulation.MAX_BIG = 200;
com.tamina.planetwars.data.PlanetPopulation.MAX_HUGE = 300;
com.tamina.planetwars.data.PlanetSize.SMALL = 1;
com.tamina.planetwars.data.PlanetSize.NORMAL = 2;
com.tamina.planetwars.data.PlanetSize.BIG = 3;
com.tamina.planetwars.data.PlanetSize.HUGE = 4;
com.tamina.planetwars.data.PlanetSize.SMALL_WIDTH = 20;
com.tamina.planetwars.data.PlanetSize.NORMAL_WIDTH = 30;
com.tamina.planetwars.data.PlanetSize.BIG_WIDTH = 50;
com.tamina.planetwars.data.PlanetSize.HUGE_WIDTH = 70;
com.tamina.planetwars.data.PlanetSize.SMALL_EXTENSION = "_small";
com.tamina.planetwars.data.PlanetSize.NORMAL_EXTENSION = "_normal";
com.tamina.planetwars.data.PlanetSize.BIG_EXTENSION = "_big";
com.tamina.planetwars.data.PlanetSize.HUGE_EXTENSION = "_huge";
haxe.ds.ObjectMap.count = 0;
MyIA.main();
})();