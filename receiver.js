// JavaScript Document
console.log("begin");

var socket = io.connect();
var localStream = null;
var pc = null;
//var servers = null;

var servers = {"iceServers": 
	    [
            {"url": "stun:stun.l.google.com:19302"}
	    ]
        };

navigator.getUserMedia = (
	navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia
);

RTCPeerConnection = (
	RTCPeerConnection ||
	webkitRTCPeerConnection ||
	mozRTCPeerConnection ||
	msRTCPeerConnection
);

RTCSessionDescription = (
	RTCSessionDescription ||
	webkitRTCSessionDescription ||
	mozRTCSessionDescription ||
	msRTCSessionDescription
);

RTCIceCandidate = (
	RTCIceCandidate ||
	webkitRTCIceCandidate ||
	mozRTCIceCandidate ||
	msRTCIceCandidate
);

if(!RTCPeerConnection) {console.log ('Your browser doesn\'t support WebRTC');}


//main ();

///////////////////////
function main (){
pc = new RTCPeerConnection(servers);
if (pc) {
	console.log('pc is created');
	console.log(pc);

	pc.onaddstream = function(e) {
		console.log("Stream received!");
		console.log(e.stream);

		var video = document.getElementById('remoteVideo');
		video.srcObject = e.stream; 
	};


	pc.oniceconnectionstatechange = function (e)
	{
	console.log('oniceconnectionstatechange');
	console.log(e.target);
	};


	}
	else console.log('error: pc is not created');
}
//socket.emit("message", {type: "newreceiver", text: 'newreceiver'});


function createConnection_click(){
	console.log('createConnection_click');
	main();
	socket.emit("message", {type: "createConnection", text: 'on'});
}

///////////////////
socket.on('success', function ()
{
	console.log("socket.on connected");
	socket.emit("message", {type: "testmessage", text: 'receiver'});

});

socket.on('error', function(err)
{
	console.log("Error!");
	console.error(err);
});

socket.on('message', function(msg)
{
	console.log("Message from server:");
	console.log(msg);
		switch (msg.type)
	{
		case "offer":
			console.log('offer is received:');
			console.log(msg);
			if(pc){
				pc.setRemoteDescription(new RTCSessionDescription(msg.offer));
				console.log('setRemoteDescription');
				console.log('createAnswer');
				pc.createAnswer
				(function(desc)
				{
					pc.setLocalDescription(desc)
					console.log('setLocalDescription');
					socket.emit("message", {type: "answer", answer: desc});
				}, 
				function(err)
				{
					console.error(err);
				}
			);
			}
			break;
	

		case "candidate":
			if (msg.candidate)
			{
				console.log('IceCandidate is receved:');
				console.log(msg.candidate);
				if (pc) {
					pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
					console.log('new IceCandidate is added');
					}
			}
			break;
			
		case "testmessage":
				console.log('server is received test message');
			break;

	}

});
