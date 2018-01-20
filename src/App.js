import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(){
        super();
        this.state = {
            players:'1',
            no_rolled:{
                '1':0
            },
            playerList:{
                '1':[]
            }
        }
        this.squares = {};
        this.rollADice = this.rollADice.bind(this); 
    }
    componentDidMount(){
        var canvas = document.getElementById("board");
        var context = canvas.getContext("2d");
        var squareSize = 65; 
        var colorA = "white";
        var colorB = "red";

        var initRow = 1; var totalRows = 10; var initcolumn = 1; var totalColumns = 10;

        var x = 0; var y = canvas.height - squareSize;

        var columnNr = 1; var leftToRight = true;
        for (var row = initRow; row <= totalRows; row++) 
        {
            if (leftToRight) 
                x = 0;
            else 
                x = canvas.width - squareSize;

            for (var column = initcolumn; column <= totalColumns; column++) 
            {
                if (columnNr % 2 === 0) 
                    context.fillStyle = colorA;
                else 
                    context.fillStyle = colorB;
                
                context.fillRect(x, y, squareSize, squareSize);

                this.squares[columnNr] = x.toString() + ',' + y.toString();

                context.font = "15px tahoma";
                context.fillStyle = "black";
                context.fillText(columnNr, x+25, y + squareSize-25);

                var x1, y1
                if (leftToRight) 
                {
                    x += squareSize;
                    x1 = x + (squareSize / 2);
                }
                else 
                {
                    x -= squareSize;
                    x1 = x - (squareSize / 2);
                }

                y1 = y - (squareSize / 2);

                columnNr++;
            }

            y -= squareSize;
            leftToRight = !leftToRight;
        }
        console.log(this.squares);
    }
    _runDice(arr,no){
        let prev_no = arr.reduce((a, b) => a + b, 0);
        let new_no = prev_no+no;
        let canvas = document.getElementById("board");
        let context = canvas.getContext("2d");
        if(prev_no){
            let prev_coord = this.squares[prev_no].split(',').map(el=>parseInt(el));
            context.fillStyle = prev_no % 2 === 0 ? "white" : "red";
            context.fillText('P1',prev_coord[0],prev_coord[1]+65);
        }
        let new_coord = this.squares[new_no].split(',').map(el=>parseInt(el));;
        if(prev_no > 0)
            context.fillStyle = "black";
        context.fillText('P1',new_coord[0],new_coord[1]+65);
    }
    rollADice(pl_no){
        let {no_rolled,playerList} = this.state;
        let no = Math.floor(Math.random() * 6) + 1;
        let sum = playerList[pl_no].reduce((a, b) => a + b, 0);
        if(sum+no > 100){
            alert('Not a possible move');
            return false;
        }
        no_rolled[pl_no] = no;
        let prev_list = JSON.parse(JSON.stringify(playerList[pl_no]));
        playerList[pl_no].push(no);
        this.setState({no_rolled,playerList},()=>{
            this._runDice(prev_list,no);
        });
    }
    _populateStatistics(pl_no){
        let {playerList} = this.state;
        return (
            <div>
                Statistics<br/>
                <div>No of throws done: {playerList[pl_no].length} times</div>
                <div>No of times six was rolled : {playerList[pl_no].filter(el=>el===6).length}</div>
            </div>
        );
    }
    _populateRollADice(){
        let {playerList,no_rolled} = this.state;
        return Object.keys(playerList).map(el=>{
            let disabled = playerList[el].reduce((a, b) => a + b, 0);
            return (
                <div>
                    <button disabled={disabled === 100 ? true: false} onClick={this.rollADice.bind(this,el)}>Player {el} -  {disabled !== 100 ? `Roll the Dice` : `Game Over`}</button>
                    {disabled === 100 ? 
                        this._populateStatistics(el)
                    :
                        <span>Number Rolled : {no_rolled[el]||null}</span>
                    }
                </div>
            );
        });
    }
    _playerChange(value){
        let {playerList,no_rolled} = this.state;
        if(value === '1'){
            no_rolled={'1':0}
            playerList={'1':[]}
        } else {
            no_rolled={'1':0,'2':0}
            playerList={'1':[],'2':[]}
        }
        this.setState({
            players:value,
            playerList,no_rolled
        });
    }
    render() {
        let {players} = this.state;
        return (
            <div>
                <div>
                    <input type="radio" onChange={this._playerChange.bind(this,'1')} name="player" value="1" checked={players === '1'? true : false}/> Single Player
                    <input type="radio" onChange={this._playerChange.bind(this,'2')} name="player" value="2" checked={players === '2'? true : false}/> Multi Player
                </div>
                <canvas id="board" width="650" height="650"></canvas>
                <div>
                    {this._populateRollADice()}
                </div>
            </div>
        );
    }
}

export default App;
