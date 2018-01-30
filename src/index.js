import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        const squares = Array(9).fill(null)
        this.state = {
            moves: [squares.slice()],
            squares: squares,
            isXNext: true,
            isFinished: false,
            status: ''
        };
    }

    handleClick(square) {
        const squares = this.state.squares.slice();
        if (!this.isGameFinished() && (squares[square] === null)) {
            squares[square] = this.state.isXNext ? 'X' : 'O'
            const moves = this.state.moves.slice()
            moves.push(squares.slice())
            this.setState({
                squares: squares,
                isXNext: !this.state.isXNext,
                moves: moves
            });
            this.setState({
                status: getStatus(squares, this.state.isXNext)
            })
        }
    }

    undo() {
        if (this.state.moves.length > 1) {
            let moves = this.state.moves.slice()
            moves.pop()
            let squares = moves[moves.length-1]
            let isXNext = !this.state.isXNext
            this.setState({
                squares: squares,
                moves: moves,
                isXNext: isXNext
            })
            this.setState({
                status: getStatus(squares, isXNext)
            })
        }
    }

    isGameFinished() {
        return getStatus(this.state.squares, this.state.isXNext).indexOf("Next player") === -1
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={this.state.squares} onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{this.state.status}</div>
                    <ol>
                        <li>
                            <button className="undo" onClick={() => this.undo()} disabled={this.state.moves.length <= 1}>Undo
                            </button>
                        </li>
                    </ol>
                </div>
            </div>
        );
    }
}

function getStatus(squares, isXNext) {
    const winner = calculateWinner(squares)
    if (winner === null) {
        return 'Next player: ' + (isXNext ? 'X' : 'O')
    } else if (winner === 'draw') {
        return 'Draw!'
    } else {
        return 'Player ' + winner + ' wins!'
    }
}

function calculateWinner(squares) {
    if (squares.indexOf(null) === -1) {
        return 'draw'
    } else {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }
}


// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);


