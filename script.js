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

//Add event listener, tied to clickAction() function
blocks.forEach(block => block.addEventListener('click', clickAction));

//Process click action
function clickAction(){
    matchingBlocks = [this];
    match(this);//run match function to get array of all blocks in the same colour
    matchingBlocks = matchingBlocks.sort((a, b) => (Number(a.id) > Number(b.id)) ? 1 : -1);//give property to sort by, convert id from string to number to sort properly
    if(matchingBlocks.length > 1){//don't count single blocks
        for(i=0; i < matchingBlocks.length; i++){
            shuffleBlocks(matchingBlocks[i]);
            if(matchingBlocks[i].id > 110){shrinkColumns(matchingBlocks[i]);}
        }
        newScore = calculateScore(matchingBlocks.length);
        console.log("Score: " +score);
    }
}

//Check surrounding blocks that match the colour of the given block. Returns array of divs
function match(thisBlock){
    let pos = thisBlock.getBoundingClientRect();//have to use let, otherwise pos gets reset and this doesn't work
    for(let i=0; i < blocks.length; i++){
        if(blocks[i].id == "inactive"){//do nothing
        }else{
            blockPos = blocks[i].getBoundingClientRect();
            if(blockPos.right == pos.left && blockPos.y == pos.y || blockPos.left == pos.right && blockPos.y == pos.y){//check whether there's a block on left or right
                if(blocks[i].style.backgroundColor == thisBlock.style.backgroundColor){//check colour of matching block
                    if(!matchingBlocks.includes(blocks[i])){
                        matchingBlocks.push(blocks[i]);
                        match(blocks[i]);//check for that block too
                    }   
                }
            }
            if(blockPos.bottom == pos.top && blockPos.x == pos.x || blockPos.top == pos.bottom && blockPos.x == pos.x){//check whether there's a block above or below
                if(blocks[i].style.backgroundColor == thisBlock.style.backgroundColor){//check colour of matching block
                    if(!matchingBlocks.includes(blocks[i])){
                        matchingBlocks.push(blocks[i]);
                        match(blocks[i]);//check for that block too
                    }   
                }
            }
        } 
    }
}

//Reorders colours in that column
function shuffleBlocks(thisBlock){
    let pos = thisBlock.getBoundingClientRect();//selected block from matching array
    let shuffle = false;
    let lastBlock = false;
    let count = 0;
    for(let i=0; i < blocks.length; i++){
        if(blocks[i].id == "inactive"){//do nothing
        }else{
            blockPos = blocks[i].getBoundingClientRect(); 
            if(blockPos.x == pos.x && blockPos.y <= pos.y){//same column, but higher. include current block to change to that colour
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
                count ++;
            }
        } 
    }
}

//Calculates score, with cumulative bonuses for bigger numbers of blocks matched at a time
function calculateScore(addScore){
    let totalScore = addScore;
    if(addScore >= 5){totalScore += 2;}
    if(addScore >= 10){totalScore += 3;}
    if(addScore >= 15){totalScore += 5;}
    score += totalScore;
    document.getElementById("score").innerHTML="<h2>Score: " + score + "</h2>";
}

function shrinkColumns(matchedBlock){
    let pos = matchedBlock.getBoundingClientRect();
    let columnBlocks = [];
    let count = 0;
    for(let i=0; i < blocks.length; i++){
        blockPos = blocks[i].getBoundingClientRect();
        if(blockPos.x == pos.x){//get all blocks in the column
            columnBlocks.push(blocks[i]); 
            if(blocks[i].style.backgroundColor == 'rgb(51, 204, 255)'){
                count ++;
            }
        }
    }
    columnBlocks = columnBlocks.sort((a, b) => (Number(a.id) > Number(b.id)) ? -1 : 1);//reverse sort order
    console.log(columnBlocks);
    console.log(count);
    if(count == 12){//not yet working
        for(let i=0; i < columnBlocks.length; i++){
            columnBlocks[i].id = "inactive";
        }
    }
}