import { useState } from "react";

const cols = ["a","b","c","d","e","f","g","h"];
const rows = [1,2,3,4,5,6,7,8]
const emptyBoard={
    a: ["", "", "", "", "", "", "", ""],
    b: ["", "", "", "", "", "", "", ""],
    c: ["", "", "", "", "", "", "", ""],
    d: ["", "", "", "", "", "", "", ""],
    e: ["", "", "", "", "", "", "", ""],
    f: ["", "", "", "", "", "", "", ""],
    g: ["", "", "", "", "", "", "", ""],
    h: ["", "", "", "", "", "", "", ""]
}

function createBoardData(players){
    let newBoard = {...emptyBoard};
    Object.keys(players).forEach((colorKey)=>{
        let pieceType;
        let pieceColor;
        players[colorKey].forEach((piece)=>{
            switch (piece.cords()[2]){
                case "pawn": pieceType = "P"; break;
                case "rook": pieceType = "R"; break;
                case "knight": pieceType = "N"; break;
                case "bishop": pieceType = "B"; break;
                case "queen": pieceType = "Q"; break;
                case "king": pieceType = "K"; break;
            }
            if(piece.cords()[3]){
                pieceColor = "b";
            }else{
                pieceColor = "w";
            }
            // console.log(piece.cords()[0]);
            newBoard[piece.cords()[0]][(piece.cords()[1]-1)] = (pieceType+pieceColor);
            // setBoardData({...emptyBoard, piece.cords[0]:[piece.cords[1]] : pieceType+pieceColor});

        });
    });
    return(newBoard);
}

class Piece{
    pieceType:string;
    col:number;
    row:number;
    isBlack:boolean;
    constructor(pieceType:string,isBlack:boolean,col:number,row:number){
        this.pieceType = pieceType;
        this.isBlack = isBlack;
        this.row = row;
        this.col = col;
    }

    cords(){
        return [cols[this.col],rows[this.row],this.pieceType,this.isBlack];
    }
}

const players={
    white:[
        //pawns
        new Piece("pawn",false,0,1),
        new Piece("pawn",false,1,1),
        new Piece("pawn",false,2,1),
        new Piece("pawn",false,3,1),
        new Piece("pawn",false,4,1),
        new Piece("pawn",false,5,1),
        new Piece("pawn",false,6,1),
        new Piece("pawn",false,7,1),
        //rest
        new Piece("rook",false,0,0),
        new Piece("knight",false,1,0),
        new Piece("bishop",false,2,0),
        new Piece("queen",false,3,0),
        new Piece("king",false,4,0),
        new Piece("bishop",false,5,0),
        new Piece("knight",false,6,0),
        new Piece("rook",false,7,0)
    ],
    black:[
        //pawns
        new Piece("pawn",true,0,6),
        new Piece("pawn",true,1,6),
        new Piece("pawn",true,2,6),
        new Piece("pawn",true,3,6),
        new Piece("pawn",true,4,6),
        new Piece("pawn",true,5,6),
        new Piece("pawn",true,6,6),
        new Piece("pawn",true,7,6),
        //rest
        new Piece("rook",true,0,7),
        new Piece("knight",true,1,7),
        new Piece("bishop",true,2,7),
        new Piece("queen",true,3,7),
        new Piece("king",true,4,7),
        new Piece("bishop",true,5,7),
        new Piece("knight",true,6,7),
        new Piece("rook",true,7,7)
    ]
}


export default function ChessBoard() {

    const [boardData, setBoardData] = useState(createBoardData(players));



    // Generator for alternating colors
    const squareColor = (function* () {
        let toggle = true;
        let toggleCounter = 0;
        while (true) {
            yield toggle;
            if(toggleCounter!=7){
                toggle = !toggle;
            }else{
                toggleCounter = -1;
            }
            toggleCounter++;
        }
    })();

    return (
        <div className="grid grid-rows-8 grid-flow-col">
            {Object.keys(boardData).map((rowKey, rowIndex) =>
                boardData[rowKey].reverse().map((piece, colIndex) => (
                    <ChessSquare
                        key={`${rowKey}-${colIndex}`}
                        piece={piece.split("")[0]}
                        color={squareColor.next().value}
                        pieceColor={piece.split("")[1]}
                    />
                ))
            )
            }
        </div>
    );
}

function ChessSquare({ piece, color, pieceColor}) {
    return (
        <div className={`w-24 h-24 ${color ? "bg-amber-200" : "bg-blue-300"} ${pieceColor =="w" ? "text-white" : "text-black"}`}>
            {piece}
        </div>
    );
}
