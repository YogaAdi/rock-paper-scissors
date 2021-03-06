import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	private socket: any;

	scores:any = [0 , 0];
	weapons:any = [
	'rock',
	'paper',
	'scissors'
	];
	isPlay: boolean = false;
	matchRound: number = 1;
	matchStart:boolean = false;
	matchEnd:boolean = false;

	// 0 Player 1 Win
	// 1 Player 2 Win
	// 2 Tie
	theResult:number = 0 ;
	theWinner:number = -1;

	playerOneWeapon:number = -1;
	playerTwoWeapon:number = -1;
	playerOneSelected:boolean = false;
	playerTwoSelected:boolean = false;

	playerPickWeaponTimer: string = '';

	isResultMatch:boolean = false;

	referee: string = 'Ready....';



	public ngOnInit(): void {
		this.socket = io('http://localhost:3000');
	}

	public ngAfterViewInit() {
		this.socket.on('weapons', weapons => {
			this.playerOneWeapon = weapons.playerOne;
			this.playerTwoWeapon = weapons.playerTwo;
		});
		this.socket.on('scores', scores => {
			this.scores = scores;
		});
		this.socket.on('isPlay', isPlay => {
			this.isPlay = isPlay;
		});
		this.socket.on('matchStart', matchStart => {
			this.matchStart = matchStart;
		});
	}

	start(): void {
		// this.isPlay = true;
		this.socket.emit('isPlay', true);
		this.prepareMatch(4);
	}

	nextRound(): void {
		this.isResultMatch = false;
		this.matchStart = false;
		this.prepareMatch(4);
	}

	playerOnePick(weapon: number): void {
		this.playerOneSelected = true;
		this.playerOneWeapon = weapon;
		this.isResultMatch = false;
		this.socket.emit('playerOnePick', weapon);
		this.checkResult();
	}

	playerTwoPick(weapon: number): void {
		this.playerTwoSelected = true;
		this.playerTwoWeapon = weapon;
		this.isResultMatch = false;
		this.socket.emit('playerTwoPick', weapon);
		this.checkResult();
	}

	reset(): void {
		this.scores = [0,0];
		this.matchRound = 1;
		this.theWinner = -1;
		this.matchEnd = false;
		this.matchStart = false;
		this.isResultMatch = false;
		this.prepareMatch(4);
	}

	exit(): void {
		this.scores = [0,0];
		this.isPlay = false;
		this.matchRound = 1;
		this.matchStart = false;
		this.matchEnd = false;
		this.theResult = 0 ;
		this.theWinner = -1;
		this.playerOneWeapon = -1;
		this.playerTwoWeapon = -1;
		this.playerOneSelected = false;
		this.playerTwoSelected = false;
		this.isResultMatch = false;
		this.referee = 'Ready....';
	}

	checkResult(): void {
		const playerOnePick = this.playerOneWeapon;
		const playerTwoPick = this.playerTwoWeapon;

		if (this.playerOneSelected == true && this.playerTwoSelected == true) {
			// TIE
			if( playerOnePick ==  playerTwoPick)
			{
				this.theResult = 2;
			}
			else if ( (playerOnePick - playerTwoPick + 3)% 3 == 1)    {
				// PLAYER ONE WIN
				this.theResult = 0;
				this.scores[0] = this.scores[0]+1;
				this.matchRound++;

				if (this.matchRound > 5) {
					if (this.scores[0] > this.scores[1]) {
						this.theWinner = 0;
						this.matchEnd = true;
					}
				} else if (this.scores[0] == 3) {
					this.theWinner = 0;
					this.matchEnd = true;
				}
				else if ((this.scores[0] - this.scores[1]) == 3) {
					this.theWinner = 0;
					this.matchEnd = true;
				}
			}
			else{
				// PLAYER TWO WIN
				this.theResult = 1;
				this.scores[1] = this.scores[1]+1;
				this.matchRound++;

				if (this.matchRound > 5) {
					if (this.scores[0] < this.scores[1]) {
						this.theWinner = 1;
						this.matchEnd = true;
					}
				} else if (this.scores[1] == 3) {
					this.theWinner = 1;
					this.matchEnd = true;
				}
				else if ((this.scores[1] - this.scores[0]) == 3) {
					this.theWinner = 1;
					this.matchEnd = true;
				}
			}

			this.playerOneSelected = false;
			this.playerTwoSelected = false;
			this.isResultMatch = true;
			this.referee = 'Ready....';
		}
	}


	prepareMatch(seconds) {
	  let counter = seconds;	    
	  const interval = setInterval(() => {
	    counter--;
	    if (counter == 0 ) {
	      clearInterval(interval);
	      this.referee = 'Start!!!';
		  this.matchStart = true;
		  this.socket.emit('referee', this.referee);
		  this.socket.emit('matchStart', this.matchStart);
		  this.startCountdown(4);
	    }
		this.referee = counter;
		this.socket.emit('referee', this.referee);
	  }, 1000);
	}


	startCountdown(seconds) {
	  let counter = seconds;
	  const interval = setInterval(() => {
	    counter--;
	    if (counter == 0 ) {
		  clearInterval(interval);
		  if(this.playerOneSelected === false && this.isResultMatch === false) {
			this.playerOneSelected = true;
			const randomNum =  Math.floor(Math.random() * 3 ) ;
			this.playerOneWeapon = randomNum;
			this.isResultMatch = false;
			this.checkResult();
		  }
		  if(this.playerTwoSelected === false && this.isResultMatch === false) {
			this.playerTwoSelected = true;
			const randomNum =  Math.floor(Math.random() * 3 ) ;
			this.playerTwoWeapon = randomNum;
			this.isResultMatch = false;
			this.checkResult();
		  }
		}
		this.playerPickWeaponTimer = counter;
	  }, 1000);
	}

}
