var score = 0;
var level = 1;
function construct(score, level){
    switch(level) {
        case 1:
            width = 10;
            height = 12;
          break;
        case 2:
            width = 12;
            height = 14;
          break;
        case 3:
            width = 15;
            height = 15;
          break;
        default:
            width = 10;
            height = 12;
      }
    document.getElementById("level").innerHTML="<h2>Level: " + level + "</h2>";
    colours = ['#ff99ff', '#66ff66', '#9933ff', '#ffff66'];
    
    //Add blocks
    var gameDiv = document.getElementById('game');
    table = document.createElement('table')
    blockCount = 1;
    for(var x=1; x <= height; x++){
        row = table.insertRow();
        for(var i= 1; i <= width; i++){//var i=120-1; i>=0; i-- to go backwards
            cell = row.insertCell();
            cell.id = blockCount;
            cell.setAttribute("class", "block");
            blockCount ++;
        }
    }
    document.getElementById('game').appendChild(table);


    //Select block colours
    blocks = document.querySelectorAll(".block");
    for(i=0; i < blocks.length; i++){
        blocks[i].style.backgroundColor = colours[Math.floor(Math.random() * colours.length)];
    }

    //Add event listener, tied to clickAction() function
    blocks.forEach(block => block.addEventListener('click', clickAction));
}

construct(0, 1);
console.log(score);


//Process click action
function clickAction(){
    matchingBlocks = [this];
    lastRow = blockCount - width;
    console.log(lastRow);
    match(this);//run match function to get array of all blocks in the same colour
    matchingBlocks = matchingBlocks.sort((a, b) => (Number(a.id) > Number(b.id)) ? 1 : -1);//give property to sort by, convert id from string to number to sort properly
    if(matchingBlocks.length > 1){//don't count single blocks
        for(i=0; i < matchingBlocks.length; i++){
            shuffleBlocks(matchingBlocks[i]);
            lastRow = blockCount - width;
            if(matchingBlocks[i].id >= lastRow){
                shrinkColumns(matchingBlocks[i]);
                console.log("columns to shrink" + matchingBlocks[i].id);
            }
        }
        //newScore = calculateScore(matchingBlocks.length);
        calculateScore(matchingBlocks.length);
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
            //check row
            if(blockPos.right == pos.left && blockPos.y == pos.y || blockPos.left == pos.right && blockPos.y == pos.y){
                if(blocks[i].style.backgroundColor == thisBlock.style.backgroundColor){//check colour of matching block
                    if(!matchingBlocks.includes(blocks[i])){
                        matchingBlocks.push(blocks[i]);
                        match(blocks[i]);//check for that block too
                    }   
                }
            }
            //check column
            if(blockPos.bottom == pos.top && blockPos.x == pos.x || blockPos.top == pos.bottom && blockPos.x == pos.x){
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
    if(score >= (110*level)){
        levelUpButton = document.getElementById("levelUp");
        if(levelUpButton.style.display === ""){
            if(level < 3){//Display unchanged level up button
            }else{//show win button
                levelUpButton.onclick = function () { completeGame() };
                document.querySelector('#levelUp').innerText = 'Complete Game';//for some reason levelUPButton didn't work
            }
            levelUpButton.style.display = "block";
        } 
        
              
    }
}

function completeGame(){
    levelUpButton.style.display = "";
    document.getElementById("game").innerHTML = "<img src='Congratulations.gif'>";
    document.getElementById("game").innerHTML += "<h2>You win!<br/>Score: "+score+"</h2>";
}

function shrinkColumns(matchedBlock){
    let pos = matchedBlock.getBoundingClientRect();
    let columnBlocks = [];
    let count = 0;
    for(let i=0; i < blocks.length; i++){
        if(blocks[i].id == "inactive"){//do nothing
        }else{
            blockPos = blocks[i].getBoundingClientRect();
            if(blockPos.x == pos.x){//get all blocks in the column
                columnBlocks.push(blocks[i]); 
                if(blocks[i].style.backgroundColor == 'rgb(51, 204, 255)'){
                    count ++;
                }
            }
        }
    }
    columnBlocks = columnBlocks.sort((a, b) => (Number(a.id) > Number(b.id)) ? -1 : 1);//reverse sort order
    if(count == height){//not yet working
        for(let i=0; i < columnBlocks.length; i++){
            columnBlocks[i].id = "inactive";
        }
    }
}

function reloadPage(){
    //window.location.reload(true)//true = reload from server, false = from cache
    document.getElementById("game").innerHTML = "";
    construct(0,1);
}

function levelUp(totalScore){
    level++;
    document.getElementById("game").innerHTML = "";
    levelUpButton = document.getElementById("levelUp");
    levelUpButton.style.display = "";
    construct(score,level);
}