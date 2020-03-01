var static = require('node-static');
var http = require('http');
var file = new(static.Server)();
const PORT = process.env.PORT || 5000;

var app = http.createServer(function (req, res) {
	file.serve(req, res);
}).listen(PORT);

var io = require('socket.io').listen(app);
console.log('begin');
console.log('listening on port: ' + PORT );

var messageN = 0;
var messageOffer;
var candidates = new Array();


io.sockets.on('connection', function (socket){
	console.log('an user connected');
	socket.emit('success');

	socket.on('message', function (message) {
		messageN=messageN+1;
		console.log('message ' + messageN);		
		console.log(message);
		
		if (message.type == "testmessage")
		{
			console.log('test message is coming from user');
			socket.emit("message", message);
				if (message.text == "sender"){
					candidates.splice(0);
					console.log('candidates is nulled');
					console.log(candidates.length);
					socket.emit("message", 'Candidates ' + candidates.length);
					messageOffer = '';
					socket.emit("message", 'messageN ' + messageN);
					socket.emit("message", 'messageOffer ' + messageOffer);
					
				}


		}

		if (message.type == "offer")
		{
			console.log('offer is received');
			socket.broadcast.emit('message', message); 
			console.log('offer is sended');
			messageOffer = message;
			//console.log('messageOffer');
			//console.log(messageOffer);
			//console.log(messageOffer.offer);
		}

		if (message.type == "answer")
		{
			console.log('answer is received');
			socket.broadcast.emit('message', message); 
			console.log('answer is sended');
		}
		
		if (message.type == "candidate")
		{
			socket.broadcast.emit("message", message);
			candidates.push(message);
			console.log(candidates.length);
			console.log('candidate emitted');
		}

		if (message.type == "newreceiver")
		{
			console.log('newreceiver');
			//socket.broadcast.emit('message', messageOffer);

		}

		if (message.type == "createConnection")
		{
			console.log('creatConnection');
			if (messageOffer){
				socket.emit('message', messageOffer);
				console.log(messageOffer);
				console.log('offer is sended');
				for (var i = 0; i < candidates.length; i++){
					//socket.emit('message', {type: 'candidate', candidate: candidates[i]});
					socket.emit('message', candidates[i]);
					//console.log({type: 'candidate', candidate: candidates[i]});
					}
			} else {console.log('messageOffer not yet');}

		}


		
	});


});



