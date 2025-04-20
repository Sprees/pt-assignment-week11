class GameBoard {
    // Grab board and squares to work with
    constructor(handlePlayerMove) {
        this.board = document.querySelector('.board')
        this.squares = document.querySelectorAll('.square')
        // Give GameBoard access to 'handlePlayerMove' from Game class.
        this.handlePlayerMove = handlePlayerMove

        this.addEventListeners();
    }

    // Add event listener on the board 
    addEventListeners() {
        this.board.addEventListener('click', e => {
            // If a square is clicked and it has nothing inside, provide that square
            // to handlePlayerMove
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
        // Grab all relevant DOM elements that I need to work with
        this.player1Symbol = document.querySelector('#player-1-symbol')
        this.player2Symbol = document.querySelector('#player-2-symbol')
        this.currentPlayerText = document.querySelectorAll('#player-num, #player-symbol')
        this.currentPlayerP = document.querySelector('#current-player')
        this.gameOverP = document.querySelector('#game-over')
        this.player1WinsSpan = document.querySelector('#player-1-wins')
        this.player2WinsSpan = document.querySelector('#player-2-wins')
        this.resetBoard = document.querySelector('#reset-board')
        this.resetGame = document.querySelector('#reset-game')

        // Give GameControls access to Game methods
        this.handlePlayerSymbols = handlePlayerSymbols
        this.handleResetBoard = resetBoard
        this.handleResetGame = resetGame

        this.addEventListeners()
    }

    // When there is a winner or a draw, display banner across the top of the window.
    showResultsBanner(winner) {
        const body = document.querySelector('body')
        const bannerDiv = document.querySelector('#banner')
        bannerDiv.innerHTML = ''

        const p = document.createElement('p')

        // If there is a winner, match the winner to the symbol and display text
        if(winner) {
            let player = winner === this.player1Symbol.value ? 'Player 1' : 'Player 2'
            let symbol = winner === this.player1Symbol.value ? this.player1Symbol.value : this.player2Symbol.value
            p.textContent = `${symbol.repeat(3)} ${player} Wins! ${symbol.repeat(3)}`
            // Otherwise, it's a draw. 
        } else {
            p.textContent = `${this.player1Symbol.value.repeat(3)} It's a Draw! ${this.player2Symbol.value.repeat(3)}`
        }

        bannerDiv.append(p)
        body.append(bannerDiv)
        // Remove 'hide' class from Banner div
        if(bannerDiv.classList.contains('hide')) bannerDiv.classList.remove('hide')
    }

    hideResultsBanner() {
        // Add 'hide' class to Banner div
        const bannerDiv = document.querySelector('#banner')
        if(!bannerDiv.classList.contains('hide')) bannerDiv.classList.add('hide')
    }

    // When a round/game is over, remove player turn text.
    // replace with simple 'Game Over'
    toggleGameOverText() {
        this.gameOverP.classList.toggle('hide')
        this.currentPlayerP.classList.toggle('hide')
    }


    handleWinsCounter(winsArray) {
        // Wins are tracked in Game. Use the values to update the DOM 
        const [player1Wins, player2Wins] = winsArray

        this.player1WinsSpan.textContent = player1Wins
        this.player2WinsSpan.textContent = player2Wins
    }

    handleCurrentPlayerText(currentPlayer) {
        // currentPlayer is their symbol, match the symbol to get player number
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

                // When one player chooses a non-default symbol, it will automatically switch the other player's symbol to match
                this.player1Symbol.value = this.player1Symbol.options[optionIndex].value
                this.player2Symbol.value = this.player2Symbol.options[optionIndex].value

                this.handlePlayerSymbols(this.player1Symbol.value, this.player2Symbol.value)    
            })
        }

        // Reset buttons click event listeners
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
        // GameControls has symbols, establish starting symbols
        this.players = [this.gameControls.player1Symbol.value, this.gameControls.player2Symbol.value]
        // Wins [player1, player2] start at 0
        this.wins = [0, 0]
        // currentPlayer starts as player1.
        this.currentPlayer = this.players[0];
        this.winner = '';

        // Show the user the the the current player
        this.gameControls.handleCurrentPlayerText(this.currentPlayer)
        this.gameControls.handleWinsCounter(this.wins)

        // All of the winning combos in Tic Tac Toe
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
        // set this.players to the chosen symbols
        this.players = [player1Symbol, player2Symbol]

        // reset board when a player changes symbol
        this.handleResetBoard()
    }

    handlePlayerMove(target) {
        // If there is already a winner, do nothing
        if (this.winner) return

        // update square to have currentPlayer symbol
        target.textContent = this.currentPlayer;
        // If there is a winnner
        if (this.checkForWinner()) {
            // change winner to currentPlayer symbol
            this.winner = this.currentPlayer;
            // update wins counter
            this.winner === this.players[0] ? this.wins[0] += 1 : this.wins[1] += 1
            // display wins
            this.gameControls.handleWinsCounter(this.wins)
            // display winner banner
            this.gameControls.showResultsBanner(this.winner)
            // show Game Over
            this.gameControls.toggleGameOverText()
        }
        // If there is a tie
        if (this.checkForTie()) {
            // show tie banner
            this.gameControls.showResultsBanner(this.winner)
            // show Game Over
            this.gameControls.toggleGameOverText()
        }

        // Change to other player
        this.changePlayer();
    }

    changePlayer() {
        // change currentPlayer to the opposite symbol
        this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1] : this.players[0];
        // update current player text in DOM
        this.gameControls.handleCurrentPlayerText(this.currentPlayer)
    }

    checkForTie() {
        // if all squares have content, it's a tie.
        return Array.from(this.gameBoard.squares).every(square => square.textContent !== '')
    }

    checkForWinner() {
        // grab all squares
        const squares = this.gameBoard.squares;
        // loop through winning combos (index numbers for 0 - 8 grid 012 345 678)
        for (let combination of this.winningCombinations) {
            // set each array value in the selected combination to a variable 
            const [a, b, c] = combination;
            if (
                // if all squares at the winning combination indicies match, there is a winner 
                squares[a].textContent &&
                squares[a].textContent === squares[b].textContent &&
                squares[a].textContent === squares[c].textContent
            ) {
                // draw line through the winning combo
                this.drawWinningLine(squares[a], squares[c])
                return true;
            }
        }
        return false;
    }

    // provide outside squares 
    drawWinningLine(square1, square2) {
        // grab svg and line
        let svg = document.querySelector('svg')
        let line = document.querySelector('#line')
        
        // if both square top coordinates are equal, its horizontal
        if(square1.offsetTop === square2.offsetTop) {
            // Horizontal Line
            // find center of square and extend line 33% past center for better looks
            line.setAttribute('x1', square1.offsetLeft + (square1.offsetWidth / 2) - (square1.offsetWidth * .33))
            line.setAttribute('x2', square2.offsetLeft + (square2.offsetWidth / 2) + (square2.offsetWidth * .33))
            line.setAttribute('y1', square1.offsetTop + (square1.offsetHeight / 2))
            line.setAttribute('y2', square2.offsetTop + (square2.offsetHeight / 2))
            // if both square left coordinates are equal, its vertical
        } else if (square1.offsetLeft === square2.offsetLeft) {
            // Vertical Line
            line.setAttribute('x1', square1.offsetLeft + (square1.offsetWidth / 2))
            line.setAttribute('x2', square2.offsetLeft + (square2.offsetWidth / 2))
            line.setAttribute('y1', square1.offsetTop + (square1.offsetHeight / 2) - (square1.offsetHeight * .33))
            line.setAttribute('y2', square2.offsetTop + (square2.offsetHeight / 2) + (square2.offsetHeight * .33))
            // if 1st left square is less than the 2nd square, its moving left to right
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
        // set all aspects of board and controls (- wins) back to default
        this.gameControls.toggleGameOverText()
        this.removeWinningLine()
        this.gameControls.hideResultsBanner()
        this.winner = ''
        for(let square of this.gameBoard.squares) {
            square.textContent = '';
        }
        this.currentPlayer = this.players[0]
        this.gameControls.handleCurrentPlayerText(this.currentPlayer);
    }

    handleResetGame() {
        // set everything back to default
        this.handleResetBoard()
        this.gameControls.hideResultsBanner()
        this.wins = [0,0];
        this.gameControls.handleWinsCounter(this.wins);
    }
}

const game = new Game