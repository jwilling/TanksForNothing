var util = require("util");
var io = require("socket.io");

var socket;
var clients = {};
var players = {}; //maps player ids to player;
var sessions = {};

var SPAWN = [
    [90, 90],
    [934, 90],
    [90, 678],
    [934, 678],
]

//helper func to count actual size of object. 
//taken from http://stackoverflow.com/a/6700
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

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
	this.playerNum = 0;
	this.locX = 90;
	this.locY = 90;
	this.bodyDirection = 0;
	this.turretDirection = 0;
	this.HP = 100;
	this.inv = 0;
	this.kills = 0;
	this.deaths = 0;
	this.chargeShotStart = 0;
	this.ready = false;
	this.sessionID = 0;
};

function Shot(playerID){
	this.locX = players[playerID].locX;
	this.locY = players[playerID].locY;
	this.playerID = playerID;
	this.damage = 10;
	this.direction = direction;
};


function GameEnv(sessionID){
	this.players = {};
	this.shots = {};
	this.sessionID = sessionID;
	this.lastEmit = Date.now();
};

GameEnv.prototype.addPlayer = function(playerID){
	this.players[playerID] = new Player(playerID);
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

GameEnv.prototype.shoot = function(playerID, directionInDegrees, chargeLength){
	var shot = new Shot(playerID, direction, chargeLength);
	this.shots.push(shot);
};
GameEnv.prototype.addShot = function(shot){
	this.shots.push(shot);
};

var sessionStates = {"acceptingPlayers":0 , "waitingStart":1, "waitingAllReady":2, "inGame":3, "displayingScores": 4 };

function Session(sessionOwner, settings){
	if(settings != {}){
		settings = {
			"numPlayers":1,
			"matchLength": 300,
		};
	}
	this.sessionID = makeid();
	this.sessionOwner = 0;
	this.settings = settings;
	this.gameEnv = new GameEnv(this.sessionID);
	this.state = sessionStates["acceptingPlayers"];
};

Session.prototype.newGame = function(){
	this.gameEnv = new GameEnv();
	this.gameEnv.sessionID = this.sessionID;
};

Session.prototype.setState = function(state_name){
	this.state = sessionStates[state_name];
};

var ses;

function init(){
	socket = io.listen(50505);
	socket.configure(function() {
		socket.set("transports", ["websocket"]);
		socket.set("log level", 2);
	});
	setEventHandlers();
}

var setEventHandlers = function() { 
	socket.sockets.on("connection", function(client){
		clients[client.id] = client;
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
		client.on("start_game", function(data){
			onClientStartGame(client, data);
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
			onClientEndCharge(client, data);
		});
		client.on("request_game_env", function(data){
			onClientRequestGameEnv(client, data);
		});
		client.on("request_session", function(data){
			onClientRequestSession(client, data);
		});
		client.on("request_playerID", function(data){
			onClientRequestPlayerID(client, data);
		});
		client.on("update_player", function(data){
			onClientUpdatePlayer(client, data);
		});
		client.on("update_shots", function(data){
                        onClientUpdateShots(client, data);
                });
		client.on("player_hit", function(data){
			onClientPlayerHit(client, data);
		});
	});
	socket.sockets.on("disconnect", function(client){
		onClientExitGame(client, {});
	});
};


function onClientUpdatePlayer(client, data){
	var player = players[client.id];
	if(player == undefined) return null;
	var sessionID = players[client.id].sessionID;
	if(sessionID == undefined) return null;
	var session = sessions[sessionID];
	var player = session.gameEnv.players[client.id];
	player.locX = data.locX;
	player.locY = data.locY;
	player.bodyDirection = data.bodyDirection;
	player.turretDirection = data.turretDirection;
	updateGameEnvironmentsForSession(sessionID);	
}

function onClientUpdateShots(client, data){
	if(players[client.id] == undefined) return null;
        var sessionID = players[client.id].sessionID;
        var session = sessions[sessionID];
	session.gameEnv.shots[client.id] = data
        updateGameEnvironmentsForSession(sessionID);
}

function distance(x1, y1, x2, y2){
	var xs = 0;
	var ys = 0;

	xs = x2 - x1;
	xs = xs * xs;
	
	ys = y2 - y1;
	ys = ys * ys;

	return Math.sqrt(xs + ys);
}

function spawnPlayerAway(player){
	//Set player x & y to farthest point away from average. 

	
	avgX = 0;
        avgY = 0;
	var session = sessions[player.sessionID];
	count = 0.00;
	for( var pID in session.gameEnv.players){
		p = session.gameEnv.players[pID]
		if (p.playerID == player.playerID) continue;
		count = count + 1;
		avgX = avgX + parseInt(p["locX"]);
		avgY = avgY + parseInt(p["locY"]);
	}
	if(count == 0) count = count + 1;
	avgX = avgX/count;
	avgY = avgY/count;
	spawn = 0;
        maxDist = 0;

	for(var i = 0; i < SPAWN.length; i++){
		var d = distance(avgX, avgY, SPAWN[i][0], SPAWN[i][1]);
		if(d > maxDist){ 
			spawn = i;
			maxDist = d;
		}
	}
	player.locX = SPAWN[spawn][0];
	player.locY = SPAWN[spawn][1];

	return player;

}

function onClientPlayerHit(client, data){ //bad name...client indicating player is hit...
	if (players[client.id] == undefined) return null;
	var sessionID = players[client.id].sessionID;
        var session = sessions[sessionID];
	var gameEnv = session.gameEnv
	var playerHitID = data["hit"];
	var shooting = gameEnv.players[client.id];
	var hit = gameEnv.players[playerHitID];

	var SHOT_DAMAGE = 25;

	hit.HP = hit.HP - SHOT_DAMAGE;
        if (hit.HP <= 0) {
		shooting.kills = shooting.kills + 1;
		hit.deaths = hit.deaths + 1;
		hit.HP = 100;
		hit = spawnPlayerAway(hit);
		clients[hit.playerID].emit("move_to", {"locX":hit.locX, "locY": hit.locY})	
	}

	gameEnv.players[client.id] = shooting;
	gameEnv.players[playerHitID] = hit
	session.gameEnv = gameEnv;
	sessions[sessionID] = session;
        updateGameEnvironmentsForSession(sessionID);
}

function updateGameEnvironmentsForSession(sessionID){
	var session = sessions[sessionID];
	var now = Date.now();
	var timeSinceLastEmit = now - session.gameEnv.lastEmit;
	if (timeSinceLastEmit > 17) {
		session.gameEnv.lastEmit = now;
		for (clientID in sessions[sessionID].gameEnv.players) {
			clients[clientID].emit("update_game_env", sessions[sessionID].gameEnv);
		}
	}
}

function onClientStartGame(client, data){
	console.log("Client Starting Game");
	var player = players[client.id];
	var session = sessions[player.sessionID];
	var player = session.gameEnv.players[client.id];
	if(session.sessionOwner == client.id){
		session.setState("inGame");
		for(clientID in session.gameEnv.players){
			clients[clientID].emit("start_game", session.gameEnv);
		}
	}
}

function onClientReadyGame(client, data){
	console.log("Client Starting Game");
	var sessionID = data.sessionID;
	var session = sessions[data.sessionID];
	var player = session.gameEnv.players[client.id];
	player.ready = true;
	for(clientID in sessions[sessionID].gameEnv.players){
		socket.sockets.socket(clientID).emit("update_session", sessions[sessionID].gameEnv);
	}
}

/*
 * Create and store new session. Send new session to host.
 */
function onClientHostGame(client, data){
	console.log("Client Hosting Game");
	var newSession = new Session(client.id, data);
	newSession.newGame();
	sessions[newSession.sessionID] = newSession;
	ses = newSession;
	players[client.id] = new Player(client.id);
	players[client.id].playerNum = 0;
	players[client.id].sessionID = ses.sessionID;
	newSession.gameEnv.players[client.id] = players[client.id];
	newSession.sessionOwner = client.id
	client.emit("update_game_session", newSession);
}

function onClientExitGame(client, data){
	console.log("Client Exiting Game");
	var player = players[client.id] 
	var session = sessions[player.sessionID];
	delete session.gameEnv.players[playerID];
	for(clientID in session.gameEnv.players){
		socket.sockets.socket(clientID).emit("update_game_env", session.gameEnv);
	}
}


/*
 * Look for open game and send back a session if there is one available.
 * If one is available, also send updated gameEnv to all players in session.
 * 
 */
function onClientJoinGame(client, data){
	console.log("Client Joining Game");
	empty = true;
	for(var session_id in sessions){
		empty = false;
		if(sessions[session_id].state == sessionStates["acceptingPlayers"]){
			var session = sessions[session_id];
			var gameEnv = session.gameEnv;
			players[client.id] = new Player(client.id);
			players[client.id].sessionID = session_id;
			var playerNum = 0;
			for(var id in gameEnv.players){ playerNum = playerNum + 1; }
				
			gameEnv.addPlayer(client.id);
			
			players[client.id].playerNum = playerNum;
			gameEnv.players[client.id].playerNum = playerNum;
			players[client.id].sessionID = session_id;			
			gameEnv.players[client.id].sessionID = session_id;
			players[client.id].locX = SPAWN[playerNum % 4][0];
			players[client.id].locY = SPAWN[playerNum % 4][1];

                        gameEnv.players[client.id].locX = SPAWN[playerNum][0];
                        gameEnv.players[client.id].locY = SPAWN[playerNum][1];

			session.gamEnv = gameEnv;
			var player_count = 0;
			for(var pid in gameEnv.players){
				player_count++;
			}
			if(session.settings["numPlayers"] == player_count){
				session.setState = sessionStates["waitingStart"];
			} 
			for(clientID in session.gameEnv.players){
				clients[clientID].emit("update_game_env", session.gameEnv);
			}
			client.emit("update_game_session", session);
		}
	}
	//if(empty){
	//	onClientHostGame(client,data);
	//}
}

function onClientMoveBody(client, data){
	console.log("Client Moving Body");
	var sessionID = players[client.id].sessionID;
	var session = sessions[sessionID];
	var player = session.gameEnv.players[client.id];
	player.locX = data.locX;
	player.locY = data.locY;
	updateGameEnvironmentsForSession(sessionID);	
}

function onClientRotateBody(client, data){
	console.log("Client Rotating Body");
	var sessionID = data.sessionID;
	var session = sessions[sessionID];
	var player = session.gameEnv.players[client.id];
	player.bodyDirection = data.bodyDirection;
	//updateGameEnvironmentsForSession(sessionID);
}

function onClientRotateTurret(client, data){
	console.log("Client Rotating Turret");
	var sessionID = data.sessionID;
	var session = sessions[sessionID];
	var player = session.gameEnv.players[client.id];
	player.turretDirection = data.turretDirection;
	//updateGameEnvironmentsForSession(sessionID);
}

function onClientStartCharge(client, data){
	console.log("Client Starting Charge");
	var sessionID = data.sessionID;
	var session = sessions[sessionID];
	var player = session.gameEnv.players[client.id];
	player.chargeShotStart = new Date().getTime();
}

function onClientEndCharge(client, data){
	console.log("Client Ending Charge");
	var sessionID = data.sessionID;
	var session = sessions[sessionID];
	var player = session.gameEnv.players[client.id];
	var shot = new Shot(data.direction, (player.chargeShotStart - new Date().getTime()));
	session.gameEnv.addShot(shot);
	
}

function onClientRequestGameEnv(client, data){
	console.log("Client requesting game");
	var sessionID = players[client.id].sessionID;
	var session = sessions[sessionID];
	client.emit("update_game_env", session.gameEnv);
}

function onClientRequestPlayerID(client, data){
	client.emit("update_playerID", {playerID: client.id});
}

function onClientRequestSession(client, data){
	var player = players[client.id];
	var session = sessions[player.sessionID];
	client.emit("update_session", session);
}

init();
