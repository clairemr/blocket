let colours = ['#ff99ff', '#66ff66', '#9933ff', '#ffff66'];
let score = 0;
//Add blocks

var gameDiv = document.getElementById('game');
for(var i= 1; i <= 120; i++){//var i=120-1; i>=0; i-- to go backwards
    var newDiv = document.createElement('div');
    newDiv.id = i;
    newDiv.className = 'block';
    gameDiv.appendChild(newDiv);
}

//Select block colours
const blocks = document.querySelectorAll(".block");
for(i=0; i < blocks.length; i++){
    blocks[i].style.backgroundColor = colours[Math.floor(Math.random() * colours.length)];
}
function clickAction(){//process click action
    matchingBlocks = [this];
    match(this);
    matchingBlocks = matchingBlocks.sort((a, b) => (Number(a.id) > Number(b.id)) ? 1 : -1);//give property to sort by, convert id from string to number to sort properly
    //console.log(matchingBlocks);
    if(matchingBlocks.length > 1){
        for(i=0; i < matchingBlocks.length; i++){
            shuffleBlocks(matchingBlocks[i]);
        }
        newScore = calculateScore(matchingBlocks.length);
        console.log("Score: " +score);
    }
}
function shuffleBlocks(thisBlock){
    let pos = thisBlock.getBoundingClientRect();//selected block from matching array
    let shuffle = false;
    let lastBlock = false;
    let count = 0;
    for(let i=0; i < blocks.length; i++){
        blockPos = blocks[i].getBoundingClientRect(); 
        /*if(blockPos.x == pos.x && blockPos.y > pos.y){//something below it
            lastBlock = false;
            //console.log("false");
        }else if(blockPos.x != pos.x){//another column
            lastBlock = false;
        }else{
            lastBlock = true;
        }  */ 
        
        if(blockPos.x == pos.x && blockPos.y <= pos.y){//same column, but higher. include current block to change to that colour
            //console.log(lastBlock + blocks[i].id);
            colour = blocks[i].style.backgroundColor;
            if(shuffle == false && blocks[i].style.backgroundColor != 'rgb(51, 204, 255)'){//apply to top visible block, rgb(51, 204, 255) = #33ccff
                blocks[i].style.backgroundColor = '#33ccff';
                blocks[i].style.borderColor = '#33ccff';
                blocks[i].removeEventListener('click', clickAction);//so people can't click on hidden divs to increase score
                shuffle = true;
            }else if(shuffle == false && blocks[i].style.backgroundColor == 'rgb(51, 204, 255)'){//do nothing
            }else{
                blocks[i].style.backgroundColor = nextColour;
            }
            nextColour = colour;
            //add check for last block in row
            currentBlock = blocks[i];
            count ++;
        }
        
    }
    /*if(lastBlock == true){
        console.log("true");
        currentBlock.style.backgroundColor = '#33ccff';
        currentBlock.style.borderColor = '#33ccff';
        blocks[i].removeEventListener('click', clickAction);
    }*/
}
function match(thisBlock){//create array of matching colours
    let pos = thisBlock.getBoundingClientRect();//have to use let, otherwise pos gets reset and this doesn't work
    for(let i=0; i < blocks.length; i++){
        blockPos = blocks[i].getBoundingClientRect();
        if(blockPos.right == pos.left && blockPos.y == pos.y || blockPos.left == pos.right && blockPos.y == pos.y){//check whether there's a block on left or right
            if(blocks[i].style.backgroundColor == thisBlock.style.backgroundColor){//check colour of matching block
                if(!matchingBlocks.includes(blocks[i])){
                    matchingBlocks.push(blocks[i]);
                    match(blocks[i]);
                }   
            }
        }
        if(blockPos.bottom == pos.top && blockPos.x == pos.x || blockPos.top == pos.bottom && blockPos.x == pos.x){//check whether there's a block on left or right
            if(blocks[i].style.backgroundColor == thisBlock.style.backgroundColor){//check colour of matching block
                if(!matchingBlocks.includes(blocks[i])){
                    matchingBlocks.push(blocks[i]);
                    match(blocks[i]);
                }   
            }
        }
    }
}

function calculateScore(addScore){
    let totalScore = addScore;
    if(addScore >= 5){totalScore += 2;}//cumulative bonuses
    if(addScore >= 10){totalScore += 3;}
    if(addScore >= 15){totalScore += 5;}
    score += totalScore;
    document.getElementById("score").innerHTML="<h2>Score: " + score + "</h2>";
}

blocks.forEach(block => block.addEventListener('click', clickAction));