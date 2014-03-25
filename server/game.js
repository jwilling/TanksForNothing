var util = require("util");
var io = require("socket.io");

var socket;
var players;

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
	socket.sockets.on("connect", onSocketConnection);
	socket.sockets.on("disconnect", onSocketDisconnect);
}
	
function onSocketConnection(client) {
    util.log("New player has connected: "+client.id);
    client.on("disconnect", onClientDisconnect);
	client.on("host_game", onClientHostGame);
	client.on("start_game", onClientStartGame);
	client.on("ready_game", onClientReadyGame);
	client.on("exit_game", onClientExitGame);
	client.on("join_game", onClientJoinGame);
	client.on("move_body", onClientMoveBody);
	client.on("rotate_body", onClientRotateBody);
	client.on("rotate_turret", onClientRotateTurret);
	client.on("start_charge", onClientStartCharge);
	client.on("end_charge", onClientEndCharge);
}

function onSocketConnected() {
    console.log("Connected to socket server");
}

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
}

function onClientHostGame(data){
	console.log("Client Hosting Game");
}

function onClientExitGame(data){
	console.log("Client Exiting Game");
}

function onClientJoinGame(data){
	console.log("Client Joining Game");
}

function onClientMoveBody(data){
	console.log("Client Moving Body");
}

function onClientRotateBody(data){
	console.log("Client Rotating Body");
}

function onClientRotateTurret(data){
	console.log("Client Rotating Turret");
}

function onClientStartCharge(data){
	console.log("Client Starting Charge");
}

function onClientEndCharge(data){
	console.log("Client Ending Charge");
}

init();





