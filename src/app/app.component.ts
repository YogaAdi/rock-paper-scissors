import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	scores = [0 , 0];
	weapons = [
	'rock',
	'paper',
	'scissors'
	];
	matchRound = 1;
	matchEnd = false;

	// 0 Player 1 Win
	// 1 Player 2 Win
	// 2 Tie
	theResult = 0 ;
	theWinner = -1;

	playerOneWeapon = -1;
	playerTwoWeapon = -1;
	playerOneSelected = false;
	playerTwoSelected = false;

	isResultMatch = false;

	playerOnePick(weapon: number): void {
		console.log('player one', weapon)
		this.playerOneSelected = true;
		this.playerOneWeapon = weapon;
		this.isResultMatch = false;
		this.checkResult();

		/*if (this.playerTwoWeapon != -1 && this.playerOneSelected == true) {

			setTimeout( () => {
				const randomNum =  Math.floor(Math.random() * 3 ) ;
				this.playerOneWeapon = randomNum;
				this.checkResult();
			},  Math.floor(Math.random()  * 500 ) +200);
		}	*/
	}

	playerTwoPick(weapon: number): void {
		console.log('player two', weapon)
		this.playerTwoSelected = true;
		this.playerTwoWeapon = weapon;
		this.isResultMatch = false;
		this.checkResult();

		/*if (this.playerOneWeapon != -1 && this.playerTwoSelected == true) {

			setTimeout( () => {
				const randomNum =  Math.floor(Math.random() * 3 ) ;
				this.playerTwoWeapon = randomNum;
				this.checkResult();
			},  Math.floor(Math.random()  * 500 ) +200);
		}	*/
	}

	reset(): void {
		this.scores = [0,0];
		this.matchRound = 1;
		this.matchEnd = false;
	}

	checkResult(): void {
		const playerOnePick = this.playerOneWeapon;
		const playerTwoPick = this.playerTwoWeapon;
		console.log('player one selected', this.playerOneSelected);
		console.log('player two selected', this.playerTwoSelected);

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

				if ((this.scores[0] - this.scores[1]) == 3) {
					this.theWinner = 0;
					this.matchEnd = true;
				}

				if (this.matchRound === 5) {
					if (this.scores[0] > this.scores[1]) {
						this.theWinner = 0;
						this.matchEnd = true;
					}
				}
			}
			else{
				// PLAYER TWO WIN
				this.theResult = 1;
				this.scores[1] = this.scores[1]+1;
				this.matchRound++;

				if ((this.scores[1] - this.scores[0]) == 3) {
					this.theWinner = 1;
					this.matchEnd = true;
				}

				if (this.matchRound === 5) {
					if (this.scores[0] < this.scores[1]) {
						this.theWinner = 1;
						this.matchEnd = true;
					}
				}
			}

			this.playerOneSelected = false;
			this.playerTwoSelected = false;
			this.isResultMatch = true;	
		}
	}

}
