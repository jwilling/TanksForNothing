//var util = require("util");
//var io = require("socket.io");

var socket;
var myPlayerID;
var session = null;
var gameEnv;

var gameEnvUpdateCallback = function(data){};
var sessionUpdateCallback = function(data){};
var startGameCallback = function(data){};


//Function that client calls to being hosting game.
function clientHostGame(callback){
	sessionUpdateCallback = callback;
	socket.emit("host_game", {});
}

//Client uses this to join an open game. 
function clientJoinGame(callback){
	sessionUpdateCallback = callback;
	socket.emit("join_game", {});
}

function clientStartHostedGame(){
	socket.emit("start_game", {});
}

function clientWaitForStartGame(callback){
	startGameCallback = callback;
}

//Returns session update callback a function with no global effect.
function removeSessionUpdateCallback(){
	sessionUpdateCallback = new function(data){};
}

function removeStartGameCallback(){
	removeStartGameCallback = new function(data){};
}



//Update Server Game Env
function updatePlayerOnServer(){
	socket.emit("update_player", gameEnv.players[myPlayerID]);
}

function requestGameEnv(){
	//("requesting game env");
	socket.emit("request_game_env", {});
}

function updateShots(listOfShots){
	socket.emit("update_shots", listOfShots);
}

function updatePlayerPositionOnServer(x, y, bodyDirection, turretDirection){
	socket.emit("update_player", {locX:x, locY:y, 
		bodyDirection: bodyDirection, turretDirection: turretDirection});
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

function Shot(playerID, x, y){
	this.locX = x || players[playerID].locX;
	this.locY = y || players[playerID].locY;
	this.playerID = playerID;
}

function GameEnv(sessionID){
	this.players = {}; //maps id assigned by server to players. 
	this.shots = {};
	this.sessionID = sessionID;
}

function Session(sessionOwner, settings){
	if(!settings){
		settings = {
			"numPlayers":4,
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
	socket = io.connect("127.0.0.1:50505");
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
		client.on("start_game", function(data){
			onServerStartGame(client, data);
		});
		client.emit("request_playerID",{});
		//client.emit("join_game", {});
		//client.on("player_left_game", function(data){
		//	onServerUpdateGameEnv(client, data);
		//});
	//});
	//socket.sockets.on("disconnection", onSocketDisconnect);
};

function onServerUpdateGameEnv(client, data){
	GameIsInSession = true;
	gameEnv = data;
	//console.log("game Env Recieved");
	gameEnvUpdateCallback(gameEnv);
}

function onServerUpdatePlayerID(client, data){
	console.log("Setting Player ID");
	myPlayerID = data.playerID;
	console.log("myPlayerID="+myPlayerID);
}

function onServerUpdateGameSession(client, data){
	session = data;	
	gameEnv = data.gameEnv;
	sessionUpdateCallback(data);
	//console.log(session);
}

function onServerStartGame(client, data){
	console.log("Client recieved start game.");
	gameEnv = data;
	session.gameEnv = data;
	startGameCallback();
	
}


//var GameIsInSession = false;
//window.setInterval(function(){
//	if(GameIsInSession){ //client/js/play.js
		//console.log("Requesting Game Env");
//		requestGameEnv();
//	}
//}, 50);

initSocket();
