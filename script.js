let colours = ['#ff99ff', '#66ff66', '#9933ff', '#ffff66'];
let score = 0;
//Add blocks
var toAdd = document.createDocumentFragment();
for(var i= 1; i < 120; i++){
    var newDiv = document.createElement('div');
    newDiv.id = i;
    newDiv.className = 'block';
    toAdd.appendChild(newDiv);
}
document.body.appendChild(toAdd);

//Select block colours
const blocks = document.querySelectorAll(".block");
for(i=0; i < blocks.length; i++){
    blocks[i].style.backgroundColor = colours[Math.floor(Math.random() * colours.length)];
}

//process click action
function clickAction(){
    matchingBlocks = [this];
    match(this);
    shuffleBlocks(this);
    //console.log(matchingBlocks);
    if(matchingBlocks.length > 1){
        for(i=0; i < matchingBlocks.length; i++){
            matchingBlocks[i].style.backgroundColor = '#ffffff';
            //shuffleBlocks();
            /*matchingBlocks[i].style.height = '0px';
            matchingBlocks[i].style.padding = '0px';
            matchingBlocks[i].style.border = '0px';*/
        }
        score += matchingBlocks.length;
        console.log("Score: " +score);
    }
}
function shuffleBlocks(thisBlock){
    let pos = thisBlock.getBoundingClientRect();
    shuffle = 0;
    for(let i=0; i < blocks.length; i++){//compare to all other blocks
        blockPos = blocks[i].getBoundingClientRect();  //get block location            
        if(blockPos.x == pos.x && blockPos.y < pos.y){//if in same column, but higher
            colour = blocks[i].style.backgroundColor;//get current colour. Not currently working
            console.log(colour);
            if(shuffle == 0){
                blocks[i].style.backgroundColor = '#33ccff';
                blocks[i].style.border = '0px';
            }else{
                blocks[i].style.backgroundColor = nextColour;
            }
            nextColour = colour;
            console.log(nextColour);
            shuffle ++;
        }
    }
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

blocks.forEach(block => block.addEventListener('click', clickAction));