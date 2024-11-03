import React, { useEffect, useState } from 'react';

const cols = ["a","b","c","d","e","f","g","h"];
const rows = [1,2,3,4,5,6,7,8]
let whiteTurn = true;
let newestBoardData = {};
let target = null;
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


class Piece{
    pieceType:string;
    col:number;
    row:number;
    isBlack:boolean;
    isTarget:boolean;
    constructor(pieceType:string,isBlack:boolean,col:number,row:number){
        this.pieceType = pieceType;
        this.isBlack = isBlack;
        this.row = row;
        this.col = col;
        this.isTarget = false;
    }

    cords(){
        return [cols[this.col],rows[this.row]];
    }

    checkCords(cords){
        return (cords.split("")[0]==cols[this.col] && cords.split("")[1]==rows[this.row])
    }

    getVision(){
        let moveVisionCoordinates =[];
        function addTooVisionIfAvailable(cord){
            if(newestBoardData[cord[0]][cord[1]-1]==""){
                moveVisionCoordinates.push(cord[0]+cord[1]);
            }
        }
        switch(this.pieceType){
            case "pawn":{
                if(this.isBlack){
                    addTooVisionIfAvailable(cols[this.col]+ rows[this.row-1])
                    if(this.row==6){
                        addTooVisionIfAvailable(cols[this.col]+ rows[this.row-2])
                    }
                }else{
                    addTooVisionIfAvailable(cols[this.col]+ rows[this.row+1])
                    if(this.row==1){
                        addTooVisionIfAvailable(cols[this.col]+ rows[this.row+2])
                    }
                }
            }
        }
        return moveVisionCoordinates.sort();
    }
}

function getPiece(cords){
    let foundPiece;
    Object.keys(players).forEach((colorKey)=>{
        players[colorKey].forEach((piece)=>{
            if(piece.checkCords(cords)){
                foundPiece = piece;
            }
        });
    });
    return foundPiece;
}

function getTarget(cords,targetHasVision){
    if(target != null && targetHasVision){
        moveTarget(cords)
        return 0;
    }
    let piece = getPiece(cords);
    if(piece.isBlack!=whiteTurn){
        piece.isTarget = true;
        target = piece;
    }
}

function moveTarget(cords){
    let newCol;
    for(const col in cols){
        if(cols[col] == cords[0]){
            newCol = col;
        }
    }
    target.col = parseInt(newCol);
    target.row = cords[1]-1
    target.isTarget = false;
    whiteTurn = !whiteTurn;
}
const players={
    // white:[
    //     //pawns
    //     new Piece("pawn",false,0,1),
    //     new Piece("pawn",false,1,1),
    //     new Piece("pawn",false,2,1),
    //     new Piece("pawn",false,3,1),
    //     new Piece("pawn",false,4,1),
    //     new Piece("pawn",false,5,1),
    //     new Piece("pawn",false,6,1),
    //     new Piece("pawn",false,7,1),
    //     //rest
    //     new Piece("rook",false,0,0),
    //     new Piece("knight",false,1,0),
    //     new Piece("bishop",false,2,0),
    //     new Piece("queen",false,3,0),
    //     new Piece("king",false,4,0),
    //     new Piece("bishop",false,5,0),
    //     new Piece("knight",false,6,0),
    //     new Piece("rook",false,7,0)
    // ],
    // black:[
    //     //pawns
    //     new Piece("pawn",true,0,6),
    //     new Piece("pawn",true,1,6),
    //     new Piece("pawn",true,2,6),
    //     new Piece("pawn",true,3,6),
    //     new Piece("pawn",true,4,6),
    //     new Piece("pawn",true,5,6),
    //     new Piece("pawn",true,6,6),
    //     new Piece("pawn",true,7,6),
    //     //rest
    //     new Piece("rook",true,0,7),
    //     new Piece("knight",true,1,7),
    //     new Piece("bishop",true,2,7),
    //     new Piece("queen",true,3,7),
    //     new Piece("king",true,4,7),
    //     new Piece("bishop",true,5,7),
    //     new Piece("knight",true,6,7),
    //     new Piece("rook",true,7,7)
    // ]

    white:[
        new Piece("pawn",false,0,1),
    ],
    black:[
        new Piece("pawn",true,0,6),
    ]
}
function createBoardData(){
    let newBoard = {
        a: ["", "", "", "", "", "", "", ""],
        b: ["", "", "", "", "", "", "", ""],
        c: ["", "", "", "", "", "", "", ""],
        d: ["", "", "", "", "", "", "", ""],
        e: ["", "", "", "", "", "", "", ""],
        f: ["", "", "", "", "", "", "", ""],
        g: ["", "", "", "", "", "", "", ""],
        h: ["", "", "", "", "", "", "", ""]};
    Object.keys(players).forEach((colorKey)=>{
        let pieceType;
        let pieceColor;
        players[colorKey].forEach((piece)=>{
            console.log(piece);
            switch (piece.pieceType){
                case "pawn": pieceType = "P"; break;
                case "rook": pieceType = "R"; break;
                case "knight": pieceType = "N"; break;
                case "bishop": pieceType = "B"; break;
                case "queen": pieceType = "Q"; break;
                case "king": pieceType = "K"; break;
                default: pieceType = " ";
            }
            if(piece.isBlack){
                pieceColor = "b";
            }else{
                pieceColor = "w";
            }
            newBoard[piece.cords()[0]][(piece.cords()[1]-1)] = (pieceType+pieceColor);
            if(piece.isTarget){
                newBoard[piece.cords()[0]][(piece.cords()[1]-1)]+="t";
                for(const visionCord of piece.getVision()){
                    newBoard[visionCord[0]][visionCord[1]-1]+="z";
                }
            }
        });
    });

    newestBoardData = newBoard;
    console.log(newBoard);
    return(newBoard);
}


export default function ChessBoard() {

    const [boardData, setBoardData] = useState(createBoardData());



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
            {Object.keys(boardData).map((rowKey) =>
                boardData[rowKey].slice().reverse().map((piece, colIndex) => {
                    return(<ChessSquare
                        key={`${rowKey}${8-colIndex}`}
                        piece={piece[0]!="z"?piece[0]:""}
                        color={squareColor.next().value}
                        pieceColor={piece[1]}
                        cord={`${rowKey}${8-colIndex}`}
                        setBoardData={setBoardData}
                        pieceIsTargeted={piece[2] == "t"}
                        targetHasVision={piece[0]=="z"}
                    />)
                })
            )
            }
        </div>
    );
}
// bg-[url('./assets/${piece+pieceColor}')]
function ChessSquare({ piece, color, pieceColor, cord, setBoardData,pieceIsTargeted,targetHasVision}) {
    const [bgImage, setBgImage] = useState("");

    useEffect(() => {
        if (piece && pieceColor) {
            setBgImage(`url('../public/${piece}${pieceColor}.svg')`);
        }
    }, [piece, pieceColor]);

    return (
        <button
            onClick={() => {getTarget(cord, targetHasVision); setBoardData(createBoardData())}}
            className={`w-24 h-24 ${color ? "bg-amber-200" : "bg-blue-300"}
             ${piece ? "cursor-pointer" : "cursor-default"}
             ${pieceIsTargeted ? "bg-red-700": ""}
             ${targetHasVision ? "bg-yellow-400": ""}`}
            style={{ backgroundImage: bgImage, backgroundPosition: "center", backgroundSize: "contain" }}
        >
        </button>
    );
}
