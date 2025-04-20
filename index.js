class GameBoard {
    constructor(handlePlayerMove) {
        this.board = document.querySelector('.board')
        this.squares = document.querySelectorAll('.square')
        this.handlePlayerMove = handlePlayerMove

        this.addEventListeners();
    }

    addEventListeners() {
        this.board.addEventListener('click', e => {
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
    constructor(handlePlayerSymbols, resetBoard, resetGame) {
        this.player1Symbol = document.querySelector('#player-1-symbol')
        this.player2Symbol = document.querySelector('#player-2-symbol')
        this.currentPlayerText = document.querySelectorAll('#player-num, #player-symbol')
        this.currentPlayerP = document.querySelector('#current-player')
        this.gameOverP = document.querySelector('#game-over')
        this.player1WinsSpan = document.querySelector('#player-1-wins')
        this.player2WinsSpan = document.querySelector('#player-2-wins')
        this.resetBoard = document.querySelector('#reset-board')
        this.resetGame = document.querySelector('#reset-game')
        this.handlePlayerSymbols = handlePlayerSymbols
        this.handleResetBoard = resetBoard
        this.handleResetGame = resetGame

        this.addEventListeners()
    }

    showResultsBanner(winner) {
        const body = document.querySelector('body')
        const bannerDiv = document.querySelector('#banner')
        bannerDiv.innerHTML = ''

        const p = document.createElement('p')

        if(winner) {
            let player = winner === this.player1Symbol.value ? 'Player 1' : 'Player 2'
            let symbol = winner === this.player1Symbol.value ? this.player1Symbol.value : this.player2Symbol.value
            p.textContent = `${symbol.repeat(3)} ${player} Wins! ${symbol.repeat(3)}`
        } else {
            p.textContent = `${this.player1Symbol.value.repeat(3)} It's a Draw! ${this.player2Symbol.value.repeat(3)}`
        }

        bannerDiv.append(p)
        body.append(bannerDiv)
        if(bannerDiv.classList.contains('hide')) bannerDiv.classList.remove('hide')
    }

    toggleGameOverText() {
        this.gameOverP.classList.toggle('hide')
        this.currentPlayerP.classList.toggle('hide')
    }

    removeResultsBanner() {
        const bannerDiv = document.querySelector('#banner')
        if(!bannerDiv.classList.contains('hide')) bannerDiv.classList.add('hide')
    }

    handleWinsCounter(winsArray) {
        const [player1Wins, player2Wins] = winsArray

        this.player1WinsSpan.textContent = player1Wins
        this.player2WinsSpan.textContent = player2Wins
    }

    handleCurrentPlayerText(currentPlayer) {
        if(currentPlayer === this.player1Symbol.value) {
            this.currentPlayerText[0].textContent = '1'
            this.currentPlayerText[1].textContent = this.player1Symbol.value
        } else {
            this.currentPlayerText[0].textContent = '2'
            this.currentPlayerText[1].textContent = this.player2Symbol.value
        }
        
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

        this.resetBoard.addEventListener('click', () => {
            this.handleResetBoard()
        })

        this.resetGame.addEventListener('click', () => {
            this.handleResetGame()
        })
    }
}


class Game {
    constructor() {
        this.gameControls = new GameControls(
            this.handlePlayerSymbols.bind(this), 
            this.handleResetBoard.bind(this),
            this.handleResetGame.bind(this)
        );
        this.gameBoard = new GameBoard(this.handlePlayerMove.bind(this));
        this.players = [this.gameControls.player1Symbol.value, this.gameControls.player2Symbol.value]
        this.wins = [0, 0]
        this.currentPlayer = this.players[0];
        this.winner = '';

        this.gameControls.handleCurrentPlayerText(this.currentPlayer)
        this.gameControls.handleWinsCounter(this.wins)

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

        if(this.winner) {
            this.removeWinningLine()
            this.winner = ''
        }

        this.currentPlayer = this.players[0]
        this.gameControls.handleCurrentPlayerText(this.currentPlayer)

    }

    handlePlayerMove(target) {
        if (this.winner) return true;

        target.textContent = this.currentPlayer;
        if (this.checkForWinner()) {
            this.winner = this.currentPlayer;
            this.winner === this.players[0] ? this.wins[0] += 1 : this.wins[1] += 1
            this.gameControls.handleWinsCounter(this.wins)
            this.gameControls.showResultsBanner(this.winner)
            this.gameControls.toggleGameOverText()
            return true;
        }
        if (this.checkForTie()) {
            this.gameControls.showResultsBanner(this.winner)
            this.gameControls.toggleGameOverText()
            return true; // Indicate game is over
        }

        this.changePlayer();
        return false; // Game continues
    }

    changePlayer() {
        this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1] : this.players[0];
        this.gameControls.handleCurrentPlayerText(this.currentPlayer)
    }

    checkForTie() {
        return Array.from(this.gameBoard.squares).every(square => square.textContent !== '')
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

    removeWinningLine() {
        let svg = document.querySelector('svg')
        svg.style = 'display: none;'
    }

    handleResetBoard() {
        this.gameControls.toggleGameOverText()
        this.removeWinningLine()
        this.gameControls.removeResultsBanner()
        this.winner = ''
        for(let square of this.gameBoard.squares) {
            square.textContent = '';
        }
        this.currentPlayer = this.players[0]
        this.gameControls.handleCurrentPlayerText(this.currentPlayer);
    }

    handleResetGame() {
        this.handleResetBoard()
        this.gameControls.removeResultsBanner()
        this.wins = [0,0];
        this.gameControls.handleWinsCounter(this.wins);
    }
}

const game = new Game