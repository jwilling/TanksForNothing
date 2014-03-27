//var util = require("util");
var io = require("socket.io");

var socket;
var playerID;
var session;
var gameEnv;

//Player Object Constructor
function Player(playerID){
	this.playerID = playerID;
	this.locX = 0;
	this.locY = 0;
	this.bodyDirection = 0;
	this.turretDirection = 0;
	this.HP = 100;
	this.inv = 0;
	this.kills = 0;
	this.deaths = 0;
	this.chargeShotStart = 0;
	this.ready = false;
	this.sessionID = 0;
}

function Shot(playerID, direction, chargeLength){
	this.locX = players[playerID].locX;
	this.locY = players[playerID].locY;
	this.playerID = playerID;
	//TODO set damage using charge length;
	this.damage = 10;
	this.direction = direction;
	this.chargeLength = chargeLength;
}

function GameEnv(sessionID){
	this.players = {};
	this.shots = [];
	this.sessionID = sessionID;
}

function Session(sessionOwner, settings){
	if(!settings){
		settings = {
			"numPlayers":2,
			"matchLength": 300,
		};
	}
	this.sessionID = makeid();
	this.sessionOwner = 0;
	this.settings = settings;
	this.gameEnv = new GameEnv(this.sessionID);
	this.state = sessionStates["acceptingPlayers"];
}

function init(){
	socket = io.listen(50505);
	socket.configure(function() {
		socket.set("transports", ["websocket"]);
		socket.set("log level", 1);
	});
	setEventHandlers();
}

var setEventHandlers = function() { 
	socket.sockets.on("connection", function(client){
		client.on("update_game_env", function(data){
			onServerUpdateGameEnv(client, data);
		});	
		client.on("update_playerID", function(data){
			onServerUpdatePlayerID(client, data);
		});	
		client.on("update_game_session", function(data){
			onServerUpdateGameSession(client, data);
		});	
		client.on("playerDeath", function(data){
			onServerUpdateGameEnv(client, data);
		});	
		//client.on("player_left_game", function(data){
		//	onServerUpdateGameEnv(client, data);
		//});
	});
	//socket.sockets.on("disconnection", onSocketDisconnect);
};

function onServerUpdateGameEnv(client, data){
	gameEnv = data;
}

function onServerUpdatePlayerID(client, data){
	playerID = data.playerID;
}

function onServerUpdateGameSession(client, data){
	session = data;	
}