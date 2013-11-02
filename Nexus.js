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
var neutral_id = -1;

var debug = false;


// CONSTANTES DE GESTION DE l'IA
var DANGER_RANGE = 50;
var REST_POP = 90;
var BORDER_POP = 100;
var BORDER_RANGE = 4;
var PERCENT_POP = 50/100;
var PERCENT_REST = 25/100;
var COEFF_RANGE = 2; //Poids de la range dans le choix de la planète à attack
var COEFF_POP = 1; //Poids de la pop dans la planète à attaquer




// si InBorder() enoyer une fortification et pas 1 de plus.


// Choisir la cible la plus faible.


// planètes neutres.
// prévision de l'attaque de l'ennemi.
// si InBorder() enoyer une fortification et pas 1 de plus.

// Planètes adverses
// if !notInBorder() envoyer +1 et 


var current_turn = -1;

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
			case "number":
				string += data + " : " + object[data] + "<br/>";
				break;
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
			default:
				break;
		}
	}
	return string
};

var arrayToHTML = function(array)
{
	var result ='<br/><div style="margin-left:4em">';

	if (array.length == 0)
	{
		result += "null";
	}

	for (var i = 0; i <= array.length - 1; i++) {
		result+= objectToHTML(array[i]);
		result+= "<br/>";
	};

	result += "</div>";

	return result;
}

var setMessage = function(object)
{
	if(object != null && object != "")
	{
		switch(typeof object)
		{
			case "string":
			case "number":
				debugMessage += object;
				break;
			case "boolean":
				debugMessage += object ? "TRUE" : "FALSE";
				break;
			case "function":
				debugMessage += "function : " + object;
				break;
			case "object":
				debugMessage += objectToHTML(object);
				break;
			default:
				break;
		}			
	}
};

var resetMessage = function ()
{
	debugMessage = "";
};

/**
* Invoquée tous les tours pour recuperer la liste des ordres à exécuter.
* C'est la methode à modifier pour cabler son IA.
* @param context:Galaxy
* @return result:Array<Order>
*/
var getOrders = function(context) 
{
	if (crash || (current_turn == 50 && debug))
	{
		sfdoksigjdfkglj;
	}
	resetMessage();
	if (debug)
	{
		setMessage("Tour = "+current_turn+"<br/><br/>");
		setMessage("=============================================");
		setMessage("<br/>")
		setMessage("my_planets = "+arrayToHTML(my_planets)+"<br/>");
		setMessage("=============================================");
		setMessage("<br/>")
		setMessage("other_planets = "+arrayToHTML(other_planets)+"<br/>");
		setMessage("=============================================");
		setMessage("<br/>")
		setMessage("inBorder = <br/>");
		for ( var i = 0; i<my_planets.length; i++ )
		{
			if (inBorder(my_planets[i],context))
			{
				setMessage(arrayToHTML(my_planets[i]));
			}
		}
		setMessage("=============================================");
		setMessage("<br/>")

	}

	current_turn++;
	//setMessage(context);
	var result = new Array();
	var my_planets = shuffleArray(GameUtil.getPlayerPlanets( id, context ));
	var other_planets = GameUtil.getEnnemyPlanets(id, context);

	//RECUP DE l'ID DE L'ENNEMY ET DU NEUTRE

	if (ennemy_id == -1)
	{
		neutral_id = getNearestPlanet(my_planets[0],other_planets).owner.id;

		for (var i = other_planets.length - 1; i >= 0; i--) {
			if (other_planets[i].owner.id != neutral_id)
			{
				ennemy_id = other_planets[i].owner.id;
			}
		};
	}

	//END

	if ( other_planets != null && other_planets.length > 0 )
	{
		for ( var i = 0; i<my_planets.length; i++ )
		{
			var PlanetPrevData = inDanger(my_planets[i],context);
			if (PlanetPrevData[0] ) //DANGER (inDanger retourne true avec la pop prévu et le tour prévu de l'attaque)
			{
				result = result.concat(getHelp(my_planets[i],context,my_planets,PlanetPrevData[1],PlanetPrevData[2]));
			}
		}

		tmp_result = AttackWeakestPlanet(context,my_planets);

		while(tmp_result.length != 0)
		{
			result = result.concat(tmp_result);
			tmp_result = AttackWeakestPlanet(context,my_planets);
		}

		/*for ( var i = 0; i<my_planets.length; i++ )
		{
			result = result.concat(getOrderFromPlanet(my_planets[i],context,my_planets,other_planets,PlanetPrevData));
		}*/

		for ( var i = 0; i<my_planets.length; i++ )
		{
			result = result.concat(manageOverPop(my_planets[i],context,my_planets));
		}
	}

	if (debug) {setMessage("END of Tour = "+current_turn+"<br/><br/>");};
	return result;
};

var getTravelDistanceBetween = function(planet1,planet2)
{
	if (debug)
	{
		setMessage("getTravelDistanceBetween("+planet1.id+","+planet2.id+") = "+Math.ceil(GameUtil.getDistanceBetween(new Point(planet1.x,planet1.y),new Point(planet2.x,planet2.y)) / Game.SHIP_SPEED)+"<br/>");
	}
	return Math.ceil(GameUtil.getDistanceBetween(new Point(planet1.x,planet1.y),new Point(planet2.x,planet2.y)) / Game.SHIP_SPEED);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

var manageOverPop = function(planet,context,my_planets)
{
	if (debug)
	{
		setMessage("=+=+=+=+=+=+=+=+=+=+=+=+=+=++=+=+=+=+=+=+=+=+==+=+");
		setMessage("<br/>")
	}
	var result = new Array();
	var data = inDanger(planet,context);

	if(popInTurn(planet,context,1) >= PlanetPopulation.getMaxPopulation(planet.size) )
	{
		var min = 5000;
		var result_planet;
		var candidat;
		var candidatPop;
		var rand_my_planets = shuffleArray(my_planets);

		for (var i = rand_my_planets.length - 1; i >= 0; i--) 
		{
			candidat = rand_my_planets[i] ;
			candidatPop = popInTurn(candidat,context,getTravelDistanceBetween(planet,candidat));

			if(candidat != planet && candidatPop<min && candidatPop != PlanetPopulation.getMaxPopulation(candidat))
			{
				min = candidatPop;
				result_planet = candidat;
			}
		};

		var pop = Math.min((popInTurn(planet,context,1)+5 - PlanetPopulation.getMaxPopulation(planet.size)), planet.population);
		result.push(new Order(planet.id, candidat.id, pop));
		planet.population -= pop;
	}

	if (debug)
	{
		setMessage("manageOverPop("+planet.id+") = "+arrayToHTML(result)+"<br/>");
		setMessage("=+=+=+=+=+=+=+=+=+=+=+=+=+=++=+=+=+=+=+=+=+=+==+=+");
		setMessage("<br/>")

	}
	return result;
}

var AttackWeakestPlanet = function(context,my_planets)
{
	var other_planets = GameUtil.getEnnemyPlanets(id, context);
	var result = new Array();
	var potentials_targets = new Array();
	var potentials_attackers = new Array();

	var amountMaxAttack = 0;


	for (var i = my_planets.length - 1; i >= 0; i--) 
	{
		var data = inDanger(my_planets[i],context);
		if(!data[0])
		{
			potentials_attackers.push(my_planets[i]);
			amountMaxAttack += my_planets[i].population;
		}
	};

	for (var i = other_planets.length - 1; i >= 0; i--) 
	{
/*		if (inBorder(other_planets[i],context)) // Onrécupère uniquement les planètes les plus faibles
		{*/

			potentials_targets.push(other_planets[i]);
/*		}
*/	};

	var score_max = 0; // on cherche le minimum
	var planet_result ;
	var pop_result ;
	var score ;

	for (var i = potentials_targets.length - 1; i >= 0; i--) 
	{
		var max_range = getLongestRange(potentials_targets[i],potentials_attackers);
		var pop_prevu = popInTurn(potentials_targets[i],context,max_range);
		score = scorePlanet(pop_prevu,max_range);
		if(score >= score_max && pop_prevu < amountMaxAttack)
		{
			score_max = score;
			planet_result = potentials_targets[i];
			pop_result = pop_prevu;
		}
	}


	/*setMessage(potentials_targets);
	setMessage("<br/>");
	setMessage("WEAKEST IS : ");
	setMessage(planet_result);
	setMessage("<br/>");
	crash =1;*/

	if (score == 0)
	{
		return result; // On arrête si on trouve rien
	}

	var toAgglo = new Array();
	for (var i = potentials_attackers.length - 1; i >= 0; i--) 
	{
		toAgglo[i]=0;
	};

	var currentTotalAttack = 0;

	while (currentTotalAttack <= pop_result)
	{
		for (var i = potentials_attackers.length - 1; i >= 0; i--) 
		{
			tmpPlanet = potentials_attackers[i];
			if(tmpPlanet.population > 0)
			{
				tmpPlanet.population--;
				toAgglo[i] +=1;
				currentTotalAttack++;
				planet_result.population--;
			}
		};
	};

	//AGGLOMERATION DES ORDRES
	for (var i = potentials_attackers.length - 1; i >= 0; i--) 
	{
		tmpPlanet = potentials_attackers[i];
		if (toAgglo[i] != 0) 
		{
			result.push(new Order(tmpPlanet.id,planet_result.id,toAgglo[i]));
		};
	};

	return result;
}

var getLongestRange = function(planet,targets)
{
	var max = 0;
	for (var i = targets.length - 1; i >= 0; i--) 
	{
		var dist = getTravelDistanceBetween(targets[i],planet);
		if  (dist > max)
		{
			max = dist;
		}
	};
	return max;
}

var scorePlanet =  function(pop,range)
{
	var result = 10000 ;

	result = result/((pop+1)*COEFF_POP + range*COEFF_RANGE);

	return result;
}

var getOrderFromPlanet = function(planet,context,my_planets,other_planets,data)
{
	if (debug)
	{
		setMessage("/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/");
		setMessage("<br/>")
	}

	var result = new Array();

	if(!data[0])
	{
		//result.
		for (var i = other_planets.length - 1; i >= 0; i--) 
		{
			var pop = popInTurn(other_planets[i],context,getTravelDistanceBetween(planet,other_planets[i]));
			var popAvailable = Math.floor(planet.population*PERCENT_POP) ;

			if (pop - popAvailable < 0 ) 
			{
				result.push(new Order(planet.id, other_planets[i].id, popAvailable));
				planet.population -= popAvailable;
			};
		};
		/*result.push(new Order( planet.id, getNearestPlanet(planet,other_planets).id, Math.floor(planet.population*PERCENT_POP) ));
		planet.population -= Math.floor(planet.population*PERCENT_POP);*/
	}

	if (debug)
	{
		setMessage("getOrderFromPlanet("+planet.id+") = "+arrayToHTML(result)+"<br/>");
		setMessage("/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/+/");
		setMessage("<br/>")

	}
	return result ;
};

var getHelp = function(planet, context, my_planets, amount,turn)
{
	if (debug)
	{
		setMessage("/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/");
		setMessage("<br/>")
	}

	var cpt = 0;
	var friends = new Array();
	var result = new Array();
	var tmpPlanet;
	var totalHelp = 0;
	var totalPossible = 0;

	for (var i = my_planets.length - 1; i >= 0; i--) 
	{ //Boucle pour chercher les planètes dispo pour aider, maybe mettre une condition sur la distance ou le type de planète (border ou core).
		tmpPlanet = my_planets[i];
		if (tmpPlanet != planet)
		{
			var data = inDanger(tmpPlanet,context);
			if (!data[0] && tmpPlanet.population > 0 && getTravelDistanceBetween(tmpPlanet,planet) <= turn)
			{
				totalPossible += tmpPlanet.population;
				cpt++;
				friends.push(tmpPlanet); //Ajout dans la liste d'amis pour aider la planète
			}
		}
	};

	var toAgglo = new Array();
	for (var i = friends.length - 1; i >= 0; i--) 
	{
		toAgglo[i]=0;
	};

	if (amount <= totalPossible && amount <= PlanetPopulation.getMaxPopulation(planet.size)) 
	{
		while (totalHelp < amount)
		{
			for (var i = friends.length - 1; i >= 0; i--) 
			{
				tmpPlanet = friends[i];
				if(tmpPlanet.population > 0)
				{
					tmpPlanet.population--;
					toAgglo[i] +=1;
					totalHelp++;
				}
			};
		};

		//AGGLOMERATION DES ORDRES
		for (var i = friends.length - 1; i >= 0; i--) 
		{
			tmpPlanet = friends[i];
			if (toAgglo[i] != 0) 
			{
				result.push(new Order(tmpPlanet.id,planet.id,toAgglo[i]));
			};
		};
	}
	else
	{
		while (totalHelp < amount && amount <= totalPossible)
		{
			for (var i = friends.length - 1; i >= 0; i--) 
			{
				tmpPlanet = friends[i];
				if(tmpPlanet.population > 0)
				{
					tmpPlanet.population--;
					toAgglo[i] +=1;
					totalHelp++;
				}
			};
		};
		//AGGLOMERATION DES ORDRES
		for (var i = friends.length - 1; i >= 0; i--) 
		{
			tmpPlanet = friends[i];
			if (toAgglo[i] != 0) 
			{
				result.push(new Order(tmpPlanet.id,planet.id,toAgglo[i]));
			};
		};
	}

	if (debug)
	{
		setMessage("getHelp("+planet.id+","+amount+","+turn+") = "+arrayToHTML(result)+"<br/>");
		setMessage("/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/");
		setMessage("<br/>")
	}

	return result;
}


var popInTurn = function(planet, context, turn)
{
	var result =  Math.min((planet.population + turn * Game.PLANET_GROWTH),PlanetPopulation.getMaxPopulation(planet.size)); ;

	if (context.fleet != null)
	{
		for (var i = context.fleet.length - 1; i >= 0; i--) 
		{
			var ship = context.fleet[i];
			if (ship.target == planet && ship.creationTurn + ship.travelDuration - current_turn <= turn )
			{
				if (ship.owner.id == planet.owner.id)
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
	if (debug)
	{
		setMessage("popInTurn("+planet.id+","+turn+") = "+result+"<br/>");

	} 
	return result;
}

var inDanger = function(planet, context)
{
	var result = Array();

	result[0] = false;
	result[1] = 0;
	result[2] = 0;

	for (var i = 0 ; i <= DANGER_RANGE ;i++)
	{
		var pop = popInTurn(planet,context,i);
		if (pop <= 0)
		{
			result[0] = true;
			if (pop < 0)
			{
				result[1] = -pop;
				//setMessage("<br/><br/>I NEED HELP = "+objectToHTML(planet)+"AMOUNT ="+result[1])
			}
			else
			{
				result[1] = 0 - pop;
			}
			result[2] = i;
			break;
		}
		else if(inBorder(planet,context) && planet.population <= PlanetPopulation.getMaxPopulation(planet.size))
		{
			//setMessage("BORDER PROT")
			result[0] = true;
			result[1] = PlanetPopulation.getMaxPopulation(planet.size) - planet.population;
			result[2] = DANGER_RANGE; // Toutes les planètes envoient de l'aide
			break;
		}
	};

	if (debug)
	{
		setMessage("inDanger("+planet.id+") = ");

		var lol ='<br/><div style="margin-left:4em">';

		if (result.length == 0)
		{
			lol += "null";
		}

		for (var i = 0; i <= result.length - 1; i++) {
			lol+= result[i];
			lol+= "<br/>";
		};

		lol += "</div>";

		setMessage(lol);
	}
	return result;
}

var inBorder = function(planet,context)
{
	var result = true;

	var min_enemy = 50;
	var min_allié = 50;

	if (planet.owner.id != neutral_id)
	{
		var local_id = planet.owner.id;
		var other_planets = GameUtil.getEnnemyPlanets(getEnemyID(local_id), context);

		for (var i = other_planets.length - 1; i >= 0; i--) 
		{
			var dist = getTravelDistanceBetween(other_planets[i],planet);
			if(other_planets[i].owner.id == getEnemyID(local_id) && dist <= min_enemy)
			{
				min_enemy = dist
			}
		};

		var my_planets = GameUtil.getPlayerPlanets( local_id, context );

		for (var i = my_planets.length - 1; i >= 0; i--) 
		{
			var dist = getTravelDistanceBetween(my_planets[i],planet);
			if(dist < min_enemy)
			{
				result = false;
			}
		};
	}
	else
	{
		//Cas du neutre donc si la planète à capturer est plus proche de nous que des adversaires.
		var other_planets = GameUtil.getEnnemyPlanets(id, context);

		for (var i = other_planets.length - 1; i >= 0; i--) 
		{
			var dist = getTravelDistanceBetween(other_planets[i],planet);
			if(other_planets[i].owner.id == getEnemyID(id) && dist <= min_enemy)
			{
				min_enemy = dist
			}
		};

		var my_planets = GameUtil.getPlayerPlanets(id, context );

		for (var i = my_planets.length - 1; i >= 0; i--) 
		{
			var dist = getTravelDistanceBetween(my_planets[i],planet);
			if(dist < min_enemy)
			{
				result = false;
			}
		};
	}

	if (debug)
	{
		setMessage("inBorder("+planet.id+") = "+result+"<br/>");
	}

	return result;
}


var getEnemyID = function(src_id)
{
	if (src_id == id) 
	{
		return ennemy_id;
	}
	else
	{
		return id;
	}
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