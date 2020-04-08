let colours = ['#ff99ff', '#66ff66', '#9933ff', '#ffff66'];
const blocks = document.querySelectorAll(".block");
for(i=0; i < blocks.length; i++){
    blocks[i].style.backgroundColor = colours[Math.floor(Math.random() * colours.length)];
}

function match(){//create array of matching colours
    matchingBlocks = [this.id];
    if((Number(this.id) - 1) >= 1 && (Number(this.id) - 1) <= 12){
        leftBlock = document.getElementById(this.id - 1);
        if(leftBlock.style.backgroundColor == this.style.backgroundColor){
            matchingBlocks.push(leftBlock.id);
        }
        console.log(matchingBlocks);
    }
    if((Number(this.id) + 1) >= 1 && (Number(this.id) + 1) <= 12){
        rightBlock = document.getElementById(Number(this.id) + 1);
        if(rightBlock.style.backgroundColor == this.style.backgroundColor){
            matchingBlocks.push(rightBlock.id);
        }
        console.log(matchingBlocks);
    }
}

blocks.forEach(block => block.addEventListener('click', match));