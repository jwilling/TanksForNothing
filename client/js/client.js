//var util = require("util");
//var io = require("socket.io");

var socket;
var myPlayerID;
var session = null;
var gameEnv;

var gameEnvUpdateCallback = function(data){};

//Update Server Game Env
function updatePlayerOnServer(){
	socket.emit("update_player", gameEnv.players[myPlayerID]);
}

function requestGameEnv(){
	socket.emit("request_game_env", {});
}

function updatePlayerPositionOnServer(x, y, bodyDirection, turretDirection){
	socket.emit("update_player", {locX:x, locY:y, 
		bodyDirection: bodyDirection, turretDirection: turretDirection});
}

function joinGame(){
	socket.emit("join_game", {});
}

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

var client = null;

function initSocket(){
	socket = io.connect("54.186.46.19:50505");
	client = socket;
	setEventHandlers();
}

var setEventHandlers = function() { 
	//socket.on("connection", function(client){
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
		client.emit("request_playerID",{});
		client.emit("join_game", {});
		//client.on("player_left_game", function(data){
		//	onServerUpdateGameEnv(client, data);
		//});
	//});
	//socket.sockets.on("disconnection", onSocketDisconnect);
};

function onServerUpdateGameEnv(client, data){
	GameIsInSession = true;
	gameEnv = data;
	gameEnvUpdateCallback(gameEnv);
}

function onServerUpdatePlayerID(client, data){
	console.log("Setting Player ID");
	myPlayerID = data.playerID;
	console.log("myPlayerID="+myPlayerID);
}

function onServerUpdateGameSession(client, data){
	console.log(JSON.stringify(data.gameEnv));
	session = data;	
	gameEnv = data.gameEnv;
	console.log(session);
}

var GameIsInSession = false;
window.setInterval(function(){
	if(GameIsInSession){ //client/js/play.js
		console.log("Requesting Game Env");
		requestGameEnv();
	}
}, 5000);

initSocket();
