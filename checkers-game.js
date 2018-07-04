

const game =()=>{
    "use strict";

    $('#gameOver').hide('fast', 'linear');
    document.getElementById('button').addEventListener('click', (e)=>{
        e.preventDefault();
        let node = document.getElementById('gameBoard')
        while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
        }
        
        $('gameOver').hide()
        game();
    })
let firstMove = 0;
let playerOne = prompt('Please type your name (player 1)');
let playerTwo = prompt('Please type your name (player 2)');

const gameBoard =()=>{
    const myBoard = document.getElementById('gameBoard');

    for (let y = 0; y < 10; y += 1){
        let row = document.createElement('div');
        row.classList.add('row');
        myBoard.appendChild(row);

        for(let x = 0; x < 10; x += 1){
            let square = document.createElement('div');
            square.id =   (x +1).toString() + String.fromCharCode(65 + y) ;
            ((x + y) % 2) ? square.className = "bblack" : square.className = "bwhite";
      
            if((x + y) %2 != 0 && y != 4 && y != 5){
                let img = document.createElement('img');
                if(y < 4){
                    img.id = "w" + square.id; 
                    img.src = "img/white_piece.png";
                } else {
                    img.id = "b" + square.id;
                    img.src = "img/black_piece.png";
                }
                img.className = 'piece';
                img.setAttribute('draggable', 'true');
                square.appendChild(img);
            }

            square.setAttribute('draggable', 'false');
            row.appendChild(square);

        }
    }
}

gameBoard();


const isValidMove =(source, target, drop)=>{
    let startPos = source.id.length === 3 ? source.id.substr(1,2) : source.id.length === 4 ? source.id.substr(1,3) : null;
    console.log(startPos)
    let prefix = source.id.substr(0,1);

    let endPos = target.id;
    if(endPos.length === 4){
        endpos = endPos.substr(1,3);
    }


    if(endPos.length > 2){
        endPos = endPos.substr(1,2);
    }

 
    if(startPos === endPos){
        return false;
    }

    if(target.childElementCount != 0){
        return false;
    }

    let jumpOnly = false;
    if(source.classList.contains('jumpOnly')){
        jumpOnly = true;
    }

    const dictionary = {
        A: 0, B: 1, C: 2, D: 3, E: 4,
        F: 5, G: 6, H: 7, I: 8, J: 9
    }

    let xStart =  parseInt(startPos.substr(0,1));
    let yStart = dictionary[startPos.substr(1,1)];
    let xEnd =  parseInt(endPos.substr(0,1));
    let yEnd = dictionary[endPos.substr(1,1)];

    switch(prefix){
        case 'w': if(yEnd <= yStart)
            return false;
            break;
        
            case 'b': if(yEnd >= yStart)
            return false;
            break;
    }

    if(yStart === yEnd || xStart === xEnd){
        return false;
    }

    let jumped = false;
    

    if(Math.abs(xEnd - xStart) === 2){
        let key = Object.keys(dictionary).find(key => dictionary[key] === ((yStart + yEnd)/2));
        let x = ((xStart + xEnd)/2).toString()
        
        
        let pos = x + key.toString();
       
        let div = document.getElementById(pos);
       
     
        if(div.childElementCount === 0)
        return false;

        let img = div.children[0];
        if(img.id.toLowerCase() === prefix.toLowerCase())
        return false;

        if(drop){
            div.removeChild(img);
            jumped = true;
            
            
            
        }
    }
    
    if(drop){
        firstMove += 1;
        let all_pieces = [].slice.call(document.querySelectorAll("img")); 
        let black_pieces = all_pieces.filter(item => item.id.substr(0,1).toLowerCase() ==='b')
        let white_pieces = all_pieces.filter(item => item.id.substr(0,1).toLowerCase() ==='w')
        
       if (white_pieces.length < 1){

        $('.p').remove(); 
        let msg = document.createElement('p');
        msg.innerHTML = playerTwo + " wins this game!";
        $(msg).addClass('p')
        $('#gameOver').append(msg);
       
        $('#gameOver').show('slow', 'swing');
           gameBoard();
       };

       if (black_pieces.length < 1){

        $('.p').remove(); 
        let msg = document.createElement('p');
        msg.innerHTML = playerOne + " wins this game!";
        $(msg).addClass('p')
        $('#gameOver').append(msg);
       
        $('#gameOver').show('slow', 'swing');
           gameBoard();
       };
        enableNextPlayer(source);
        if(jumped){
            source.draggable = true;
            source.classList.add('jumpOnly');
        }
    }
    
    return true
    

}


const kingMe =(piece)=>{
    if(piece.id.substr(0,1) === 'W' || piece.id.substr(0,1) === 'B')
    return;

    let newPiece;

    if(piece.id.substr(0,1) === 'w' && piece.id.substr(2,1) === 'J'){
        newPiece = document.createElement('img');
        newPiece.src = 'img/crown_white.png';
        newPiece.id = 'W' + piece.id.substr(1,2);
    }

    if(piece.id.substr(0,1) === 'b' && piece.id.substr(3,1) === 'A' || piece.id.substr(2,1) === 'A' ){
        newPiece = document.createElement('img');
        newPiece.src = 'img/crown.png';
        newPiece.id = 'B' + piece.id.substr(1,2);
        
    }

    if(newPiece){
        newPiece.draggable = true;
        newPiece.classList.add('piece');
        newPiece.addEventListener('dragstart', dragStart, false);
        newPiece.addEventListener('dragend', dragEnd, false);
        let parent = piece.parentNode;
        parent.removeChild(piece);
        parent.appendChild(newPiece)

    }
}

const enableNextPlayer =(piece)=>{
    let pieces = document.querySelectorAll('img');
    let i = 0;
    
    
    while(i < pieces.length){
        let p = pieces[i];
        i += 1;
     
        if(p.id.substr(0,1).toUpperCase() === piece.id.substr(0,1).toUpperCase()){
            p.draggable = false;
            
        }else{
            p.draggable = true;
        }

        

        p.classList.remove('jumpOnly');
    }

    
}

const dragOver =(e)=>{
    e.preventDefault();

    let dragId = e.dataTransfer.getData('text');
    let dragPiece = document.getElementById(dragId);

    if(dragPiece){
        if(e.target.tagName === 'DIV' && isValidMove(dragPiece, e.target, false)){
            e.dataTransfer.dropEffect = 'move';
        }else{
            e.dataTransfer.dropEffect = 'none';
        }
    }
}

const dragStart =(e)=>{
    if(e.target.id.substr(0,1) === 'b' && firstMove === 0){
        e.target.draggable = false;
    }
    if(e.target.draggable){
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text', e.target.id);
        e.target.classList.add('selected');
    }
}

const dragEnd =(e)=>{
    e.target.classList.remove('selected');
}

const drop =(e)=>{
    e.stopPropagation();
    e.preventDefault();
    

    let droppedID = e.dataTransfer.getData('text');
    let droppedPiece = document.getElementById(droppedID);

    if(droppedPiece && e.target.tagName === 'DIV' && isValidMove(droppedPiece, e.target, true)){
        let newPiece = document.createElement('img');
        newPiece.src = droppedPiece.src;
        newPiece.id = droppedPiece.id.substr(0,1) + e.target.id;
        newPiece.draggable = droppedPiece.draggable;

        if(droppedPiece.draggable){
            newPiece.classList.add('jumpOnly');
        }
        newPiece.classList.add('piece');
        newPiece.addEventListener('dragstart', dragStart, false);
        newPiece.addEventListener('dragend', dragEnd, false);
        e.target.appendChild(newPiece);
        // whiteStarts(droppedPiece);
        droppedPiece.parentNode.removeChild(droppedPiece);
        e.target.classList.remove('drop');
        kingMe(newPiece);
        
        
    }
}

const dragEnter =(e)=>{
    let dragId = e.dataTransfer.getData('text');
    let dragPiece = document.getElementById(dragId);

    if(dragPiece && e.target.tagName === 'DIV' && isValidMove(dragPiece, e.target, false)){
        e.target.classList.add('drop');
    }
}

const dragLeave =(e)=>{
    e.target.classList.remove('drop');
}

const allowDrop =()=>{
    let squares = document.querySelectorAll('.bblack');
    let i = 0;
    while(i < squares.length){
        let square = squares[i];
        i += 1;
        square.addEventListener('dragover', dragOver, false);
        square.addEventListener('drop', drop, false);
        square.addEventListener('dragenter', dragEnter, false);
        square.addEventListener('dragleave', dragLeave, false);
    }

    i = 0;
    let pieces = document.querySelectorAll('img');
    while(i < pieces.length){
        let piece = pieces[i];
        i += 1;
        piece.addEventListener('dragstart', dragStart, false);
        piece.addEventListener('dragend', dragEnd, false);
    }
}

allowDrop();

}


window.onload = game();