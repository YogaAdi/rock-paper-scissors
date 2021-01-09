const Express = require('express')();
const Http = require('http').Server(Express);
const Socketio = require('socket.io')(Http);

var scores = [0 , 0];
var weapons = {
    playerOne: -1,
    playerTwo: -1
}
var isPlay = false;
var matchRound = 1;
var matchStart = false;
var matchEnd = false;
var theResult = 0;
var theWinner = -1;
var playerOneSelected = false;
var playerTwoSelected = false;
var playerPickWeaponTimer = '';
var isResultMatch = false;
var referee = '';
var playerSelected = {
    playerOne: false,
    playerTwo: false
}

Socketio.on('connection', socket => {
    socket.emit('weapons', weapons);
    socket.emit('scores', scores);
    socket.emit('isPlay', isPlay);
    socket.emit('matchStart', matchStart);
    socket.emit('referee', referee);

    socket.on('playerOnePick', weapon => {
        weapon.playerOne = weapon;
        console.log(weapon);
    });
    socket.on('playerTwoPick', weapon => {
        weapon.playerTwo = weapon;
    });
    socket.on('isPlay', isPlay => {
        isPlay = isPlay;
        socket.emit('isPlay', isPlay);
    });
    socket.on('matchStart', matchStart => {
        matchStart = matchStart;
        socket.emit('matchStart', matchStart);
    });
    socket.on('referee', referee => {
        referee = referee;
        socket.emit('referee', referee);
    });
});

Http.listen(3000, () => {
    console.log('Listening at:3000...');
    console.log(isPlay);
});