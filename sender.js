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

function getUserMedia_click(){
PeerConnection_click();

	navigator.getUserMedia(
		{
			audio: false,
			video: true
		},
		function (stream)
		{
			console.log("MediaStream is created");
			console.log(stream);

			var video = document.getElementById('localVideo');
			video.srcObject = stream; 
			
//			if(!localStream)
//				{
				localStream = stream;
				pc.addStream(localStream);
				console.log("MediaStream is added");
//				}
//				else {console.log("MediaStream was added at last time");}


		},
		function (err)
		{
			console.error(err);
		}
	);

}

function PeerConnection_click(){
pc = new RTCPeerConnection(servers);
if (pc) {
	console.log('pc is created');
	console.log(pc);

		pc.onicecandidate = function (e)
		{
			console.log("ICE candidate:");
			console.log(e.candidate);
			socket.emit("message", {type: "candidate", candidate: e.candidate});
		};

			pc.oniceconnectionstatechange = function (e)
		{
			console.log('oniceconnectionstatechange');
			console.log(e.target);
		};
	
		}
	else console.log('error: pc is not created. please creat pc.');
}

function addStream (){
	if (!pc) {
		console.log("please create PeerConnection");		
	}
	
	if (!localStream) {
		console.log("please create MediaStream");		
	}
	if (pc) {
		if (localStream) {
			pc.addStream(localStream);
			console.log("MediaStream is added");
		}
	}
	
}

function createOffer_click(){	
if (pc)	{
		pc.createOffer(
			function(desc)
			{
				console.log('createOffer');
				pc.setLocalDescription(desc);
				console.log('setLocalDescription');
				console.log(desc);
				socket.emit("message", {type: "offer", offer: desc});
			},
			function(err)
			{
				console.error(err);
			}
		);
		}
		else console.log('error: pc is not created. please creat pc.');

		
}



///////////////////
socket.on('success', function ()
{
	console.log("socket.on connected");
	socket.emit("message", {type: "testmessage", text: 'sender'});

});


socket.on('message', function(msg)
{
	console.log("Message from server:");
	console.log(msg);
	if (msg.type == "answer")
	{
		if (pc){
			pc.setRemoteDescription(new RTCSessionDescription(msg.answer));
			console.log('setRemoteDescription');
			}
	}
	
	if (msg.type == "testmessage")
	{
		console.log('server is received test message');
	}
	
	
});

socket.on('error', function(err)
{
	console.log("Error!");
	console.error(err);
});

