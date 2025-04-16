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
        let pos1 = square1.getBoundingClientRect(),  
            pos2 = square2.getBoundingClientRect(),
            posX1, posX2, posY1, posY2

        if(pos1.top === pos2.top) {
            // Horizontal Line
            posX1 = (pos1.left + pos1.right)/2 - (pos1.width * .33)
            posY1 = (pos1.top + pos1.bottom)/2
            posX2 = (pos2.left + pos2.right)/2 + (pos1.width * .33)    
            posY2 = (pos2.top + pos2.bottom)/2
        } else if (pos1.left === pos2.left) {
            // Vertical Line
            posX1 = (pos1.left + pos1.right)/2
            posY1 = (pos1.top + pos1.bottom)/2  - (pos1.height * .33)
            posX2 = (pos2.left + pos2.right)/2    
            posY2 = (pos2.top + pos2.bottom)/2  + (pos1.height * .33)
        } else if (pos1.left < pos2.left) {
            // Backslash Diagonal --- \
            posX1 = (pos1.left + pos1.right)/2 - (pos1.width * .33)
            posY1 = (pos1.top + pos1.bottom)/2 - (pos1.height * .33)
            posX2 = (pos2.left + pos2.right)/2 + (pos1.width * .33)   
            posY2 = (pos2.top + pos2.bottom)/2 + (pos1.height * .33)
        } else {
            // Forwardslash Diagonal --- /
            posX1 = (pos1.left + pos1.right)/2 + (pos1.width * .33)
            posY1 = (pos1.top + pos1.bottom)/2 - (pos1.height * .33)
            posX2 = (pos2.left + pos2.right)/2 - (pos2.width * .33) 
            posY2 = (pos2.top + pos2.bottom)/2 + (pos2.height * .33)
        }

        let svg = document.querySelector('svg')
        let line = document.querySelector('#line')
        
        line.setAttribute('x1', posX1)
        line.setAttribute('x2', posX2)
        line.setAttribute('y1', posY1)
        line.setAttribute('y2', posY2)

        svg.style = 'display: block;'
    }

}

const game = new Game