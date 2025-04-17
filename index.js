class GameBoard {
    constructor(handlePlayerMove) {
        this.board = document.querySelector('.board')
        this.squares = document.querySelectorAll('.square')
        this.handlePlayerMove = handlePlayerMove

        this.addEventListeners();
    }

    addEventListeners() {
        this.board.addEventListener('click', (e) => {
            if(
                e.target.classList.contains('square') && 
                !e.target.textContent
            ) {
                this.handlePlayerMove(e.target)
            }
        })
    }
}

class GameControls {
    constructor(handlePlayerSymbols) {
        this.player1Symbol = document.querySelector('#player-1-symbol')
        this.player2Symbol = document.querySelector('#player-2-symbol')
        this.handlePlayerSymbols = handlePlayerSymbols

        this.addEventListeners()
    }

    addEventListeners() {
        let playerSymbolSelects = [this.player1Symbol, this.player2Symbol]

        for(let select of playerSymbolSelects) {
            select.addEventListener('change', e => {
                let optionIndex = e.target.options.selectedIndex

                this.player1Symbol.value = this.player1Symbol.options[optionIndex].value
                this.player2Symbol.value = this.player2Symbol.options[optionIndex].value

                this.handlePlayerSymbols(this.player1Symbol.value, this.player2Symbol.value)    
            })
        }
    }
}


class Game {
    constructor() {
        this.gameControls = new GameControls(this.handlePlayerSymbols.bind(this));
        this.gameBoard = new GameBoard(this.handlePlayerMove.bind(this));
        this.players = [this.gameControls.player1Symbol.value, this.gameControls.player2Symbol.value]
        this.currentPlayer = this.players[0];
        this.winner = '';

        this.winningCombinations = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ]
    }

    handlePlayerSymbols(player1Symbol, player2Symbol) {
        // console.log(squares)
        this.players = [player1Symbol, player2Symbol]
        for(let square of this.gameBoard.squares) {
            square.textContent = ''
        }
        this.currentPlayer = this.players[0]
    }

    handlePlayerMove(target) {
        if (this.winner) return true; // Game is over if there's a winner
        target.textContent = this.currentPlayer; // Place the current player's symbol
        if (this.checkForWinner()) {
            this.winner = this.currentPlayer;
            console.log(`Winner: ${this.winner}`);
            return true; // Indicate game is over
        }
        if (this.checkForTie()) {
            console.log("It's a tie!");
            return true; // Indicate game is over
        }

        this.changePlayer();
        return false; // Game continues
    }

    changePlayer() {
        this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1] : this.players[0];
    }

    checkForTie() {
        return Array.from(this.gameBoard.squares).every(square => square.textContent !== '');
    }

    checkForWinner() {
        const squares = this.gameBoard.squares;
        for (let combination of this.winningCombinations) {
            const [a, b, c] = combination;
            if (
                squares[a].textContent &&
                squares[a].textContent === squares[b].textContent &&
                squares[a].textContent === squares[c].textContent
            ) {
                this.drawWinningLine(squares[a], squares[c])
                return true;
            }
        }
        return false;
    }

    drawWinningLine(square1, square2) {
        let svg = document.querySelector('svg')
        let line = document.querySelector('#line')
        
        if(square1.offsetTop === square2.offsetTop) {
            // Horizontal Line
            line.setAttribute('x1', square1.offsetLeft + (square1.offsetWidth / 2) - (square1.offsetWidth * .33))
            line.setAttribute('x2', square2.offsetLeft + (square2.offsetWidth / 2) + (square2.offsetWidth * .33))
            line.setAttribute('y1', square1.offsetTop + (square1.offsetHeight / 2))
            line.setAttribute('y2', square2.offsetTop + (square2.offsetHeight / 2))
        } else if (square1.offsetLeft === square2.offsetLeft) {
            // Vertical Line
            line.setAttribute('x1', square1.offsetLeft + (square1.offsetWidth / 2))
            line.setAttribute('x2', square2.offsetLeft + (square2.offsetWidth / 2))
            line.setAttribute('y1', square1.offsetTop + (square1.offsetHeight / 2) - (square1.offsetHeight * .33))
            line.setAttribute('y2', square2.offsetTop + (square2.offsetHeight / 2) + (square2.offsetHeight * .33))
        } else if (square1.offsetLeft < square2.offsetLeft) {
            // Backslash Diagonal --- \
            line.setAttribute('x1', square1.offsetLeft + (square1.offsetWidth / 2) - (square1.offsetWidth * .33))
            line.setAttribute('x2', square2.offsetLeft + (square2.offsetWidth / 2) + (square2.offsetWidth * .33))
            line.setAttribute('y1', square1.offsetTop + (square1.offsetHeight / 2) - (square1.offsetHeight * .33))
            line.setAttribute('y2', square2.offsetTop + (square2.offsetHeight / 2) + (square2.offsetHeight * .33))
        } else {
            // Forwardslash Diagonal --- /
            line.setAttribute('x1', square1.offsetLeft + (square1.offsetWidth / 2) + (square1.offsetWidth * .33))
            line.setAttribute('x2', square2.offsetLeft + (square2.offsetWidth / 2) - (square2.offsetWidth * .33))
            line.setAttribute('y1', square1.offsetTop + (square1.offsetHeight / 2) - (square1.offsetHeight * .33))
            line.setAttribute('y2', square2.offsetTop + (square2.offsetHeight / 2) + (square2.offsetHeight * .33))
        }

        svg.style = 'display: block;'
    }

}

const game = new Game