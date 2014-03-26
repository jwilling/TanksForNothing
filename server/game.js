var util = require("util");
var io = require("socket.io");

var socket;
var players; //maps player ids to player;
var sessions;

function makeid()
{
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function Player(playerID){
	this.playerID = playerID;
	this.locX = 0;
	this.locY = 0;
	this.bodyDirection = 0;
	this.turretDirection = 0;
	this.HP = 100;
	this.inv = new Date().getTime() + 3000;
	this.kills = 0;
	this.deaths = 0;
	this.chargeShotStart = 0;
	this.ready = false;
};

function Shot(playerID, damage, direction){
	this.locX = players.playerID.locX;
	this.locY = players.playerID.locY;
	this.playerID = playerID;
	this.damage = damage;
	this.direction = direction;
};

function GameEnv(){
	this.players = {};
	this.shots = [];
};

GameEnv.prototype.addPlayer = function(playerID){
	this.players[playerID] = Player();
};

GameEnv.prototype.removePlayer = function(playerID){
	delete players[playerID];
};

GameEnv.prototype.moveBody = function(playerID, locX, locY){
	this.players[playerID].locx = locX;
	this.players[playerID].locy = locY;
};

GameEnv.prototype.rotateBody = function(playerID, newDegreeDirection){
	var oldDirection = this.players[playerID].bodyDirection;
	this.players[playerID].bodyDirection = rads;
	this.players[playerID].turretDirection = this.players[playerID].turretDirection - (rads-oldDirection);
};

GameEnv.prototype.rotateTurret = function(playerID, newDegreeDirection){
	this.players[playerID].turretDirection = rads;
};

GameEnv.prototype.shoot = function(playerID, directionInDegrees){
	var shot = new Shot(playerID, 10, directionInDegrees);
	this.shots.push(shot);
};

var sessionStates = {"acceptingPlayers":0 , "waitingStart":1, "waitingAllReady":2, "inGame":3, "displayingScores": 4 };

function Session(settings){
	this.sessionID = makeid();
	this.settings = settings;
	this.gameEnv = new GameEnv();
	this.state = sessionStates["acceptingPlayers"];
};

Session.prototype.newGame = function(){
	this.gameEnv = new GameEnv();
};

var testSession = Session({});

function init(){
	players = [];
	socket = io.listen(50505);
	socket.configure(function() {
		socket.set("transports", ["websocket"]);
		socket.set("log level", 2);
	});
	setEventHandlers();
}

var setEventHandlers = function() { 
	socket.sockets.on("connection", function(client){
		client.on("host_game", function(data){
			onClientHostGame(client, data);
		});	
		client.on("ready_game", function(data){
			onClientReadyGame(client, data);
		});
		client.on("exit_game", function(data){
			onClientExitGame(client, data);
		});
		client.on("join_game", function(data){
			onClientJoinGame(client, data);
		});
		client.on("move_body", function(data){
			onClientMoveBody(client, data);
		});
		client.on("rotate_body", function(data){
			onClientRotateBody(client, data);
		});
		client.on("rotate_turret", function(data){
			onClientRotateTurret(client, data);
		});
		client.on("start_charge", function(data){
			onClientStartCharge(client, data);
		});
		client.on("end_charge", function(data){
			onClientEndCharge(client, data)
		});
	});
	//socket.sockets.on("disconnection", onSocketDisconnect);
};


function onClientStartGame(client, data){
	console.log("Client Starting Game");
}

function onClientReadyGame(client, data){
	console.log("Client Starting Game");
}

function onClientHostGame(client, data){
	console.log("Client Hosting Game");
	client.emit("hello", data);
}

function onClientExitGame(client, data){
	console.log("Client Exiting Game");
}

function onClientJoinGame(client, data){
	console.log("Client Joining Game");
}

function onClientMoveBody(client, data){
	console.log("Client Moving Body");
}

function onClientRotateBody(client, data){
	console.log("Client Rotating Body");
}

function onClientRotateTurret(client, data){
	console.log("Client Rotating Turret");
}

function onClientStartCharge(client, data){
	console.log("Client Starting Charge");
}

function onClientEndCharge(client, data){
	console.log("Client Ending Charge");
}

init();





