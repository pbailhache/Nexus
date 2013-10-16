/*!
* PlanetWars Javascript Basic IA exemple
* http://www.tamina-online.com/expantionreloded/
*
*
* Copyright 2013 Tamina
* Released under the MIT license
* http://opensource.org/licenses/MIT
*
* author : david mouton
*/

/**
* nom de l'IA
*/
var name = "Nexus";

/**
* couleur d'affichage
*/
var color = 0;

/** message de debugage
* utilisé par le systeme et affiché dans la trace à chaque tour du combat
*/
var debugMessage="";

/* Id de l'IA */
var id = 0;

var ennemy_id = -1;

var DANGER_RANGE = 50;

var current_turn = 0;

var crash = 0;

/**
* @internal method
*/
onmessage = function(event)
{
	if(event.data != null) {
		var turnMessage = event.data;
		id = turnMessage.playerId;
		postMessage(new TurnResult( getOrders(turnMessage.galaxy), '<div style="margin-left:4em"><br/>' + debugMessage + "</div>"));
	}
	else postMessage("data null");
};

var objectToHTML = function(object)
{
	string = "";
	for(var data in object)
	{
		switch(typeof object[data])
		{
			case "string":
				string += data + ' : "' + object[data] + '"<br/>';
				break;
			case "boolean":
				string += data + " : " + object[data] ? "TRUE" : "FALSE" + "<br/>";
				break;
			case "function":
				string += data + " : function : " + object[data] + "<br/>";
				break;
			case "object":
				string += object[data] + " " + data + ' : <div style="margin-left:4em">'  + objectToHTML(object[data])+  "</div>";
				break;
			case "number":
			default:
				string += data + " : " + object[data] + "<br/>";
				break;
		}
	}
	return string
};

var setMessage = function(object)
{
	debugMessage = "";
	if(object != null && object != "")
	{
		switch(typeof object)
		{
			case "boolean":
				debugMessage = object ? "TRUE" : "FALSE";
				break;
			case "function":
				debugMessage = "function : " + object;
				break;
			case "object":
				debugMessage = objectToHTML(object);
				break;
			case "string":
			case "number":
			default:
				debugMessage = object;
				break;
		}			
	}
};

/**
* Invoquée tous les tours pour recuperer la liste des ordres à exécuter.
* C'est la methode à modifier pour cabler son IA.
* @param context:Galaxy
* @return result:Array<Order>
*/
var getOrders = function(context) 
{
	if (crash)
	{
		sfdoksigjdfkglj;
	}
	current_turn++;
	var result = new Array();
	var my_planets = GameUtil.getPlayerPlanets( id, context );
	var other_planets = GameUtil.getEnnemyPlanets(id, context);

	//RECUP DE l'ID DE L'ENNEMY

	if (context.fleet !=null && ennemy_id == -1)
	{
		for (var i = context.fleet.length - 1; i >= 0; i--) 
		{
			if(context.fleet[i].owner.id != id)
			{
				ennemy_id = context.fleet[i].owner.id;
				//setMessage(context.fleet[i].owner);
			}
		};
	}

	//END


	if ( other_planets != null && other_planets.length > 0 )
	{
		for ( var i = 0; i<my_planets.length; i++ )
		{
			//ICI demande d'aide de la part des planètes pour éviter que chaque planète envoie ses ordres puis qu'une planète demande de l'aide  
			//et se retrouve donc sans aide vu que les ordres d'attaques sont partis

			var PlanetPrevData = inDanger(my_planets[i],context);
			if (PlanetPrevData[0] ) //DANGER (inDanger retourne true avec la pop prévu et le tour prévu de l'attaque)
			{
				crash = 1
				result = result.concat(getHelp(my_planets[i],context,my_planets,PlanetPrevData[1],PlanetPrevData[2]));
				setMessage("HELP ME  ="+objectToHTML(my_planets[i])+"IN TURN = "+PlanetPrevData[2]+"|POP ="+(PlanetPrevData[1]+objectToHTML(result)));
			}

			result = result.concat(getOrderFromPlanet(my_planets[i],context,my_planets,other_planets));

			//MANAGE SURPLUS

			result = result.concat(manageOverPop(my_planets[i],context,my_planets));

			//END
		}
	}

	return result;
};

var getTravelDistanceBetween = function(planet1,planet2)
{
	return Math.ceil(GameUtil.getDistanceBetween(new Point(planet1.x,planet1.y),new Point(planet2.x,planet2.y)) / Game.SHIP_SPEED);
}

var manageOverPop = function(planet,context,my_planets)
{
	var result = new Array();
	if(popInTurn(planet,context,1) > PlanetPopulation.getMaxPopulation(planet.size))
	{
		//ICI on cherche parmi nos planètes celle qui est le plus en danger --ie la planète qui a la pop la plus basse pour la distance entre les deux planètes.
		// Exemple avec une planète qui recoit un vaisseau de 40 et se retrouve en surplus de 30.
		// Elle cherche parmi les autres planètes et trouve une planète qui est à 5 de range avec une pop prévu de 10
		// Une autre à 8 de range avec une pop prévu de 5
		// Elle envoie le surplus à celle à 9 de distance 
		// a tuner je pense pour voir ce qui martche le mieux sur le rapport pop/distance
		var min = 500;
		var result_planet;
		var candidat;
		var candidatPop;

		for (var i = my_planets.length - 1; i >= 0; i--) 
		{
			candidat = my_planets[i] ;
			candidatPop = popInTurn(candidat,context,getTravelDistanceBetween(planet,candidat));

			if(candidat != planet && candidatPop<min)
			{
				min = candidatPop;
				result_planet = candidat;
			}
		};

		var pop = popInTurn(planet,context,1) - PlanetPopulation.getMaxPopulation(planet.size);
		result.push(new Order(planet.id, candidat.id, pop));
	}
	return result;
}


var getOrderFromPlanet = function(planet,context,my_planets,other_planets)
{
	var result = new Array();
	var PlanetPrevData = inDanger(planet,context);

	if(true)
	{
		var target = getNearestPlanet(planet,other_planets);
		if (target.owner.id != id && target.owner.id != ennemy_id)
		{
			//setMessage("|ID CIBLE|"+target.id+"|MY ID|"+id+"|ID ENEMY|"+ennemy_id);
			result.push(new Order( planet.id, getNearestPlanet(planet,other_planets).id, planet.population ));
			planet.population = 0;
		}
	}
	else
	{
		result.push(new Order( planet.id, getNearestPlanet(planet,other_planets).id, 0));
	}
	//setMessage(planet);

	return result ;
};

var getHelp = function(planet, context, my_planets, amount,turn)
{
	var cpt = 0;
	var friends = new Array();
	var result = new Array();
	var tmpPlanet;
	var totalHelp = 0;
	var totalPossible = 0;

	for (var i = my_planets.length - 1; i >= 0; i--) { //Boucle pour chercher les planètes dispo pour aider, maybe mettre une condition sur la distance ou le type de planète (border ou core).
		tmpPlanet = my_planets[i];
		if (tmpPlanet != planet && tmpPlanet.population > 10 && getTravelDistanceBetween(tmpPlanet,planet) <= turn)
		{
			totalPossible += tmpPlanet.population;
			cpt++;
			friends.push(tmpPlanet); //Ajout dans la liste d'amis pour aider la planète
		}
	};

	if (amount <= totalPossible) 
	{
		while (totalHelp <= amount)
		{
			for (var i = friends.length - 1; i >= 0; i--) 
			{
				tmpPlanet = friends[i];
				tmpPlanet.population--;
				result.push(new Order(tmpPlanet.id,planet.id,1));
				totalHelp++;
			};
		};
	}
	return result;
}

var popInTurn = function(planet, context, turn)
{
	var result = planet.population + turn * Game.PLANET_GROWTH;

	if (context.fleet != null)
	{
		for (var i = context.fleet.length - 1; i >= 0; i--) 
		{
			var ship = context.fleet[i];
			if (ship.target == planet && ship.creationTurn + ship.travelDuration - current_turn <= turn )
			{
				if (ship.owner.id == id)
				{
					result += ship.crew;
				}
				else
				{
					result -= ship.crew;
				}
			}
		};
	}

	return result;
}

var inDanger = function(planet, context)
{
	var result = Array();

	result.push(false);
	for (var i = 0 ; i <= DANGER_RANGE ;i++)
	{
		var pop = popInTurn(planet,context,i);
		if (pop <= 10)
		{
			result[0] = true;
			result[1] = pop-1;
			result[2] = i;
		}
	};
	return result;
}

var getNearestPlanet = function( source, candidats )
{
	var result = candidats[ 0 ];
	var currentDist = GameUtil.getDistanceBetween( new Point( source.x, source.y ), new Point( result.x, result.y ) );
	for ( var i = 0; i<candidats.length; i++ )
	{
		var element = candidats[ i ];
		if ( currentDist > GameUtil.getDistanceBetween( new Point( source.x, source.y ), new Point( element.x, element.y ) ) )
		{
			currentDist = GameUtil.getDistanceBetween( new Point( source.x, source.y ), new Point( element.x, element.y ) );
			result = element;
		}

	}
	return result;
}


/**
* @model Galaxy
* @param width:Number largeur de la galaxy
* @param height:Number hauteur de la galaxy
*/
var Galaxy = function(width,height) {
// largeur
this.width = width;
// hauteur
this.height = height;
// contenu : liste Planet
this.content = new Array();
// flote : liste de Ship
this.fleet = new Array();
};

/**
* @model Range
* @param from:Number début de l'intervale
* @param to:Number fin de l'intervale
*/
var Range = function(from,to) {
	if(to == null) to = 1;
	if(from == null) from = 0;
// début de l'intervale
this.from = from;
// fin de l'intervale
this.to = to;
};

/**
* @model Order
* @param sourceID:Number id de la planete d'origine
* @param targetID:Number id de la planete cible
* @param numUnits:Number nombre d'unité à déplacer
*/
var Order = function(sourceID,targetID,numUnits) {
// id de la planete d'origine
this.sourceID = sourceID;
// id de la planete cible
this.targetID = targetID;
// nombre d'unité à déplacer
this.numUnits = numUnits;
};

/**
* @model Planet
* @param x:Number position en x
* @param y:Number position en y
* @param size:Number taille
* @param owner:Player proprietaire
*/
var Planet = function(x,y,size,owner) {
	if(size == null) size = 2;
	if(y == null) y = 0;
	if(x == null) x = 0;
// position en x
this.x = x;
// position en y
this.y = y;
// taille
this.size = size;
// proprietaire
this.owner = owner;
// population
this.population = PlanetPopulation.getDefaultPopulation(size);
// id
this.id = UID.get();
};

/**
* @model Ship
* @param crew:Number equipage
* @param source:Planet origine
* @param target:Planet cible
* @param creationTurn:Number numero du tour de creation du vaisseau
*/
var Ship = function(crew,source,target,creationTurn) {
// equipage
this.crew = crew;
// planete d'origine
this.source = source;
// planete de destination
this.target = target;
// proprietaire du vaisseau
this.owner = source.owner;
// numero du tour de creation
this.creationTurn = creationTurn;
// duree du voyage en nombre de tour
this.travelDuration = Math.ceil(GameUtil.getDistanceBetween(new Point(source.x,source.y),new Point(target.x,target.y)) / Game.SHIP_SPEED);
};

/**
* @internal model
*/
var TurnMessage = function(playerId,galaxy) {
	this.playerId = playerId;
	this.galaxy = galaxy;
};

/**
* @internal model
*/
var TurnResult = function(orders,message) {
	if(message == null) message = "";
	this.orders = orders;
	this.consoleMessage = message;
	this.error = "";
};

/**
* @model Point
* @param x:Number
* @param y:Number
*/
var Point = function(x,y) {
	this.x = x;
	this.y = y;
};

/**
* Classe utilitaire
*/
var GameUtil = {} ;
/**
* @param p1:Point
* @param p2:Point
* @return result:Number la distance entre deux points
*/
GameUtil.getDistanceBetween = function(p1,p2) {
	return Math.sqrt(Math.pow(p2.x - p1.x,2) + Math.pow(p2.y - p1.y,2));
}
/**
* @param planetOwnerId:Number
* @param context:Galaxy
* @return result:Array<Planet> la liste des planetes appartenants à un joueur en particulier
*/
GameUtil.getPlayerPlanets = function(planetOwnerId,context) {
	var result = new Array();
	var _g1 = 0, _g = context.content.length;
	while(_g1 < _g) {
		var i = _g1++;
		var p = context.content[i];
		if(p.owner.id == planetOwnerId) result.push(p);
	}
	return result;
}

/**
* @param planetOwnerId:Number
* @param context:Galaxy
* @return result:Array<Planet> la liste des planetes ennemies et neutres
*/
GameUtil.getEnnemyPlanets = function(planetOwnerId,context) {
	var result = new Array();
	var _g1 = 0, _g = context.content.length;
	while(_g1 < _g) {
		var i = _g1++;
		var p = context.content[i];
		if(p.owner.id != planetOwnerId) result.push(p);
	}
	return result;
}

/**
* Classe utilitaire
* @internal
*/
var UID = {};
UID.lastUID = 0;
UID.get = function()
{
	UID.lastUID++;
	return UID.lastUID;
}

/**
* Constantes
*/
var Game = {};
Game.DEFAULT_PLAYER_POPULATION = 100;
Game.NUM_PLANET = new Range(5,10);
Game.PLANET_GROWTH = 5;
Game.SHIP_SPEED = 60;
Game.GAME_SPEED = 500;
Game.GAME_DURATION = 240;
Game.GAME_MAX_NUM_TURN = 500;

var PlanetPopulation = {};
PlanetPopulation.DEFAULT_SMALL = 20;
PlanetPopulation.DEFAULT_NORMAL = 30;
PlanetPopulation.DEFAULT_BIG = 40;
PlanetPopulation.DEFAULT_HUGE = 50;
PlanetPopulation.MAX_SMALL = 50;
PlanetPopulation.MAX_NORMAL = 100;
PlanetPopulation.MAX_BIG = 200;
PlanetPopulation.MAX_HUGE = 300;
PlanetPopulation.getMaxPopulation = function(planetSize) {
	var result = 1;
	switch(planetSize) {
		case PlanetSize.SMALL:
		result = PlanetPopulation.MAX_SMALL;
		break;
		case PlanetSize.NORMAL:
		result = PlanetPopulation.MAX_NORMAL;
		break;
		case PlanetSize.BIG:
		result = PlanetPopulation.MAX_BIG;
		break;
		case PlanetSize.HUGE:
		result = PlanetPopulation.MAX_HUGE;
		break;
	}
	return result;
}
PlanetPopulation.getDefaultPopulation = function(planetSize) {
	var result = 1;
	switch(planetSize) {
		case PlanetSize.SMALL:
		result = PlanetPopulation.DEFAULT_SMALL;
		break;
		case PlanetSize.NORMAL:
		result = PlanetPopulation.DEFAULT_NORMAL;
		break;
		case PlanetSize.BIG:
		result = PlanetPopulation.DEFAULT_BIG;
		break;
		case PlanetSize.HUGE:
		result = PlanetPopulation.DEFAULT_HUGE;
		break;
	}
	return result;
}


var PlanetSize = {};
PlanetSize.SMALL = 1;
PlanetSize.NORMAL = 2;
PlanetSize.BIG = 3;
PlanetSize.HUGE = 4;