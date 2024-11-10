import React, {useEffect, useState} from 'react';

const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];
const rows = [1, 2, 3, 4, 5, 6, 7, 8]
let whiteTurn = true;
let newestBoardData = {};
let target = null;


class Piece {
    id: number;
    pieceType: string;
    col: number;
    row: number;
    isBlack: boolean;
    isTarget: boolean;

    constructor(id: number, pieceType: string, isBlack: boolean, col: number, row: number) {
        this.id = id;
        this.pieceType = pieceType;
        this.isBlack = isBlack;
        this.row = row;
        this.col = col;
        this.isTarget = false;
    }

    cords() {
        return [cols[this.col], rows[this.row]];
    }

    checkCords(cords) {
        return (cords.split("")[0] == cols[this.col] && cords.split("")[1] == rows[this.row])
    }

    getVision() {
        let moveVisionCoordinates = [];
        let attackVisionCoordinates = [];

        function addTooVisionIfAvailable(cord) {
            if (typeof cord == "string" && cord[1] != "u") {
            if (newestBoardData[cord[0]][cord[1] - 1] == "" || newestBoardData[cord[0]][cord[1] - 1] == "z") {
                moveVisionCoordinates.push(cord[0] + cord[1]);
                return true;
            }}
            return false
        }

        function addTooVisionIfEnemy(cord) {
            if (typeof cord == "string" && cord[1] != "u") {
            if (newestBoardData[cord[0]][cord[1] - 1] != "" && newestBoardData[cord[0]][cord[1] - 1] != "z") {
                if (getPiece(cord[0] + [cord[1]]).isBlack == whiteTurn) {
                    attackVisionCoordinates.push(cord[0] + cord[1]);
                    return true;
                }
            }}
            return false
        }

        function addTooVision(cord) {
            if (typeof cord == "string" && cord[1] != "u") {
                addTooVisionIfAvailable(cord);
                addTooVisionIfEnemy(cord);
                return true;
            }
            return false
        }

        switch (this.pieceType) {
            case "pawn": {
                if (this.isBlack) {
                    addTooVisionIfEnemy(cols[this.col - 1] + rows[this.row - 1])
                    addTooVisionIfEnemy(cols[this.col + 1] + rows[this.row - 1])
                    if (addTooVisionIfAvailable(cols[this.col] + rows[this.row - 1]) && this.row == 6 ) {
                        addTooVisionIfAvailable(cols[this.col] + rows[this.row - 2])
                    }
                } else {
                    addTooVisionIfEnemy(cols[this.col - 1] + rows[this.row + 1])
                    addTooVisionIfEnemy(cols[this.col + 1] + rows[this.row + 1])
                    if (addTooVisionIfAvailable(cols[this.col] + rows[this.row + 1]) &&  this.row == 1) {
                        addTooVisionIfAvailable(cols[this.col] + rows[this.row + 2])
                    }
                }
                break;
            }
            case "knight": {
                addTooVision(cols[this.col + 2] + rows[this.row + 1]);
                addTooVision(cols[this.col + 2] + rows[this.row - 1]);
                addTooVision(cols[this.col - 2] + rows[this.row + 1]);
                addTooVision(cols[this.col - 2] + rows[this.row - 1]);
                addTooVision(cols[this.col + 1] + rows[this.row + 2]);
                addTooVision(cols[this.col + 1] + rows[this.row - 2]);
                addTooVision(cols[this.col - 1] + rows[this.row + 2]);
                addTooVision(cols[this.col - 1] + rows[this.row - 2]);
                break;
            }
            case "king": {
                addTooVision(cols[this.col + 1] + rows[this.row]);
                addTooVision(cols[this.col + 1] + rows[this.row - 1]);
                addTooVision(cols[this.col + 1] + rows[this.row + 1]);
                addTooVision(cols[this.col] + rows[this.row - 1]);
                addTooVision(cols[this.col] + rows[this.row + 1]);
                addTooVision(cols[this.col - 1] + rows[this.row]);
                addTooVision(cols[this.col - 1] + rows[this.row + 1]);
                addTooVision(cols[this.col - 1] + rows[this.row - 1]);
                break;
            }
            case "queen":{
                let i = this.row+1;
                while(addTooVisionIfEnemy(cols[this.col] + rows[i]) || addTooVisionIfAvailable(cols[this.col] + rows[i])){
                    if(addTooVisionIfEnemy(cols[this.col] + rows[i])){
                        break;
                    }
                    i++;
                }
                i=this.row-1
                while(addTooVisionIfEnemy(cols[this.col] + rows[i]) || addTooVisionIfAvailable(cols[this.col] + rows[i])){
                    if(addTooVisionIfEnemy(cols[this.col] + rows[i])){
                        break;
                    }
                    i--;
                }
                i=this.col+1
                while(addTooVisionIfEnemy(cols[i] + rows[this.row]) || addTooVisionIfAvailable(cols[i] + rows[this.row])){
                    if(addTooVisionIfEnemy(cols[i] + rows[this.row])){
                        break;
                    }
                    i++;
                }
                i=this.col-1
                while(addTooVisionIfEnemy(cols[i] + rows[this.row]) || addTooVisionIfAvailable(cols[i] + rows[this.row])){
                    if(addTooVisionIfEnemy(cols[i] + rows[this.row])){
                        break;
                    }
                    i--;
                }
                i = this.col + 1;
                let j = this.row + 1
                while (addTooVisionIfEnemy(cols[i] + rows[j]) || addTooVisionIfAvailable(cols[i] + rows[j])) {
                    if (addTooVisionIfEnemy(cols[i] + rows[j])) {
                        break;
                    }
                    i++;
                    j++;
                }
                i = this.col - 1;
                j = this.row + 1
                while (addTooVisionIfEnemy(cols[i] + rows[j]) || addTooVisionIfAvailable(cols[i] + rows[j])) {
                    if (addTooVisionIfEnemy(cols[i] + rows[j])) {
                        break;
                    }
                    i--;
                    j++;
                }
                i = this.col + 1;
                j = this.row - 1
                while (addTooVisionIfEnemy(cols[i] + rows[j]) || addTooVisionIfAvailable(cols[i] + rows[j])) {
                    if (addTooVisionIfEnemy(cols[i] + rows[j])) {
                        break;
                    }
                    i++;
                    j--;
                }
                i = this.col - 1;
                j = this.row - 1
                while (addTooVisionIfEnemy(cols[i] + rows[j]) || addTooVisionIfAvailable(cols[i] + rows[j])) {
                    if (addTooVisionIfEnemy(cols[i] + rows[j])) {
                        break;
                    }
                    i--;
                    j--;
                }
                break;
            }
            case "rook":{
                let i = this.row+1;
                while(addTooVisionIfEnemy(cols[this.col] + rows[i]) || addTooVisionIfAvailable(cols[this.col] + rows[i])){
                    if(addTooVisionIfEnemy(cols[this.col] + rows[i])){
                        break;
                    }
                    i++;
                }
                i=this.row-1
                while(addTooVisionIfEnemy(cols[this.col] + rows[i]) || addTooVisionIfAvailable(cols[this.col] + rows[i])){
                    if(addTooVisionIfEnemy(cols[this.col] + rows[i])){
                        break;
                    }
                    i--;
                }
                i=this.col+1
                while(addTooVisionIfEnemy(cols[i] + rows[this.row]) || addTooVisionIfAvailable(cols[i] + rows[this.row])){
                    if(addTooVisionIfEnemy(cols[i] + rows[this.row])){
                        break;
                    }
                    i++;
                }
                i=this.col-1
                while(addTooVisionIfEnemy(cols[i] + rows[this.row]) || addTooVisionIfAvailable(cols[i] + rows[this.row])){
                    if(addTooVisionIfEnemy(cols[i] + rows[this.row])){
                        break;
                    }
                    i--;
                }
                break;
            }
            case "bishop": {
                let i = this.col + 1;
                let j = this.row + 1
                while (addTooVisionIfEnemy(cols[i] + rows[j]) || addTooVisionIfAvailable(cols[i] + rows[j])) {
                    if (addTooVisionIfEnemy(cols[i] + rows[j])) {
                        break;
                    }
                    i++;
                    j++;
                }
                i = this.col - 1;
                j = this.row + 1
                while (addTooVisionIfEnemy(cols[i] + rows[j]) || addTooVisionIfAvailable(cols[i] + rows[j])) {
                    if (addTooVisionIfEnemy(cols[i] + rows[j])) {
                        break;
                    }
                    i--;
                    j++;
                }
                i = this.col + 1;
                j = this.row - 1
                while (addTooVisionIfEnemy(cols[i] + rows[j]) || addTooVisionIfAvailable(cols[i] + rows[j])) {
                    if (addTooVisionIfEnemy(cols[i] + rows[j])) {
                        break;
                    }
                    i++;
                    j--;
                }
                i = this.col - 1;
                j = this.row - 1
                while (addTooVisionIfEnemy(cols[i] + rows[j]) || addTooVisionIfAvailable(cols[i] + rows[j])) {
                    if (addTooVisionIfEnemy(cols[i] + rows[j])) {
                        break;
                    }
                    i--;
                    j--;
                }
                break;
            }
        }
        return [moveVisionCoordinates.sort(), attackVisionCoordinates.sort()];
    }
}

function getPiece(cords) {
    let foundPiece;
    Object.keys(players).forEach((colorKey) => {
        players[colorKey].forEach((piece) => {
            if (piece != null) {
                if (piece.checkCords(cords)) {
                    foundPiece = piece;
                }
            }
        });
    });
    return foundPiece;
}

function getTarget(cords, targetHasVision, targetHasAttackVision) {
    if (target != null && targetHasVision) {
        moveTarget(cords)
        return 0;
    }
    if (target != null && targetHasAttackVision) {
        attackTarget(cords)
        return 0;
    }
    let piece = getPiece(cords);
    if (typeof piece != "undefined") {
        if (piece.isBlack != whiteTurn) {
            piece.isTarget = true;
            target = piece;
        }
    }
}

function moveTarget(cords) {
    let newCol;
    for (const col in cols) {
        if (cols[col] == cords[0]) {
            newCol = col;
        }
    }
    target.col = parseInt(newCol);
    target.row = cords[1] - 1
    target.isTarget = false;
    whiteTurn = !whiteTurn;
    target = null;
}

function attackTarget(cords) {
    const id = getPiece(cords).id;
    if (id <= 16) {
        players.white[id - 1] = null;
    } else {
        players.black[id % 17 ] = null;
    }
    let newCol;
    for (const col in cols) {
        if (cols[col] == cords[0]) {
            newCol = col;
        }
    }
    target.col = parseInt(newCol);
    target.row = cords[1] - 1
    target.isTarget = false;
    whiteTurn = !whiteTurn;
    target = null;
}

const players = {
    white: [
        //pawns
        new Piece(1, "pawn", false, 0, 1,),
        new Piece(2, "pawn", false, 1, 1),
        new Piece(3, "pawn", false, 2, 1),
        new Piece(4, "pawn", false, 3, 1),
        new Piece(5, "pawn", false, 4, 1),
        new Piece(6, "pawn", false, 5, 1),
        new Piece(7, "pawn", false, 6, 1),
        new Piece(8, "pawn", false, 7, 1),
        //rest
        new Piece(9, "rook", false, 0, 0),
        new Piece(10, "knight", false, 1, 0),
        new Piece(11, "bishop", false, 2, 0),
        new Piece(12, "queen", false, 3, 0),
        new Piece(13, "king", false, 4, 0),
        new Piece(14, "bishop", false, 5, 0),
        new Piece(15, "knight", false, 6, 0),
        new Piece(16, "rook", false, 7, 0)
    ],
    black: [
        //pawns
        new Piece(17, "pawn", true, 0, 6),
        new Piece(18, "pawn", true, 1, 6),
        new Piece(19, "pawn", true, 2, 6),
        new Piece(20, "pawn", true, 3, 6),
        new Piece(21, "pawn", true, 4, 6),
        new Piece(22, "pawn", true, 5, 6),
        new Piece(23, "pawn", true, 6, 6),
        new Piece(24, "pawn", true, 7, 6),
        //rest
        new Piece(25, "rook", true, 0, 7),
        new Piece(26, "knight", true, 1, 7),
        new Piece(27, "bishop", true, 2, 7),
        new Piece(28, "queen", true, 3, 7),
        new Piece(29, "king", true, 4, 7),
        new Piece(30, "bishop", true, 5, 7),
        new Piece(31, "knight", true, 6, 7),
        new Piece(32, "rook", true, 7, 7)
    ]
}

function createBoardData() {
    let newBoard = {
        a: ["", "", "", "", "", "", "", ""],
        b: ["", "", "", "", "", "", "", ""],
        c: ["", "", "", "", "", "", "", ""],
        d: ["", "", "", "", "", "", "", ""],
        e: ["", "", "", "", "", "", "", ""],
        f: ["", "", "", "", "", "", "", ""],
        g: ["", "", "", "", "", "", "", ""],
        h: ["", "", "", "", "", "", "", ""]
    };
    Object.keys(players).forEach((colorKey) => {
        let pieceType;
        let pieceColor;
        players[colorKey].forEach((piece) => {
            if (piece != null) {
                switch (piece.pieceType) {
                    case "pawn":
                        pieceType = "P";
                        break;
                    case "rook":
                        pieceType = "R";
                        break;
                    case "knight":
                        pieceType = "N";
                        break;
                    case "bishop":
                        pieceType = "B";
                        break;
                    case "queen":
                        pieceType = "Q";
                        break;
                    case "king":
                        pieceType = "K";
                        break;
                    default:
                        pieceType = " ";
                }
                if (piece.isBlack) {
                    pieceColor = "b";
                } else {
                    pieceColor = "w";
                }
                newBoard[piece.cords()[0]][(piece.cords()[1] - 1)] = (pieceType + pieceColor);
            }
        });
    });

    if (target != null) {
        newBoard[target.cords()[0]][(target.cords()[1] - 1)] += "t";
        for (const visionCord of target.getVision()[0]) {
            newBoard[visionCord[0]][visionCord[1] - 1] += "z";
        }
        for (const visionCord of target.getVision()[1]) {
            newBoard[visionCord[0]][visionCord[1] - 1] += "y";
        }
    }
    newestBoardData = newBoard;
    return (newBoard);
}


export default function ChessBoard() {

    const [boardData, setBoardData] = useState(createBoardData());

    // Generator for alternating colors
    const squareColor = (function* () {
        let toggle = true;
        let toggleCounter = 0;
        while (true) {
            yield toggle;
            if (toggleCounter != 7) {
                toggle = !toggle;
            } else {
                toggleCounter = -1;
            }
            toggleCounter++;
        }
    })();

    console.log(boardData);
    return (
        <div className="grid grid-rows-8 grid-flow-col">
            {Object.keys(boardData).map((rowKey) =>
                boardData[rowKey].slice().reverse().map((piece, colIndex) => {
                    return (<ChessSquare
                        key={`${rowKey}${8 - colIndex}`}
                        piece={piece[0] != "z" ? piece[0] : ""}
                        color={squareColor.next().value}
                        pieceColor={piece[1]}
                        cord={`${rowKey}${8 - colIndex}`}
                        setBoardData={setBoardData}
                        pieceIsTargeted={piece[2] == "t"}
                        targetHasVision={piece[0] == "z"}
                        targetHasAttackVision={piece[2] == "y"}
                    />)
                })
            )
            }
        </div>
    );
}

// bg-[url('./assets/${piece+pieceColor}')]
function ChessSquare({
                         piece,
                         color,
                         pieceColor,
                         cord,
                         setBoardData,
                         pieceIsTargeted,
                         targetHasVision,
                         targetHasAttackVision
                     }) {
    const [bgImage, setBgImage] = useState("");

    useEffect(() => {
        if (piece && pieceColor) {
            setBgImage(`url('../public/${piece}${pieceColor}.svg')`);
        } else {
            setBgImage("");
        }
    }, [piece, pieceColor]);

    return (
        <button
            onClick={() => {
                getTarget(cord, targetHasVision, targetHasAttackVision);
                setBoardData(createBoardData())
            }}
            className={`w-24 h-24 ${color ? "bg-amber-200" : "bg-blue-300"}
             ${piece ? "cursor-pointer" : "cursor-default"}
             ${pieceIsTargeted ? "bg-red-700" : ""}
             ${targetHasVision ? "bg-yellow-400" : ""}
             ${targetHasAttackVision ? "bg-yellow-600" : ""}`}
            style={{backgroundImage: bgImage, backgroundPosition: "center", backgroundSize: "contain"}}
        >
        </button>
    );
}
