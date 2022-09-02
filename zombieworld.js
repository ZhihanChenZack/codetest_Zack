//author:Zhihan Chen
//Wechat name: Zack
//Email: zackchen5813@gmail.com


//Variables
let grid = 0;
let edge = 0;
let zombieList = {};
let creatureList = {};
let movements = "";


const stepLen = 0;

// ---------------initialize properties-----------------
/**
 * Initalize variables base on user input
 *
 * @param {obj} userInput the Object contains all initialization information
 */
function initalize(userInput) {
    grid = userInput.gridSize;
    edge = grid - 1;
    console.log("Grid:",grid )
    movements = userInput.commands;
    zombieList[0] = {"position":userInput.zombie, "movement":movements};
    for (let creature = 0; creature< userInput.creatures.length; creature++){
        creatureList[creature] = {"position":userInput.creatures[creature]};
    }

}

/**
 * Single step of all zombie movements
 *
 * @param {obj} zombies the list of all zombies on the map
 * @param {obj} creatures the list of all creatures on the map
 * @param {string} movement the default movement of all zombies
 */

function zombieMove(zombies, creatures, movement) {
    let zombieNum = Object.keys(zombies).length
    for (let zombieI = 0; zombieI< zombieNum; zombieI++){


        let zombieCurrent = zombies[zombieI];
        if (zombieCurrent.movement !== '') {
            move(zombieCurrent.movement[0], zombieCurrent);
            let zombPositionX = zombieCurrent.position.x;
            let zombPositionY = zombieCurrent.position.y;
            zombieCurrent.movement = zombieCurrent.movement.substring(1);
    
            console.log(`\nzombie ${zombieI} moved to (${zombPositionX},${zombPositionY})`)
            let infectNum = infection(zombieCurrent, creatures, movement, zombieNum);
            for(let infect = 0; infect < infectNum; infect++) {
                console.log(`\nzombie ${zombieI} infected creature at (${zombPositionX},${zombPositionY})`)
            }
        
        }      
    }

}


const axisChange = {
    "R": function shift(zombie){
        if (zombie.position.x === edge) {
            zombie.position.x = 0;
        }else{
            zombie.position.x += 1;
        }
    }, 
    "U": function shift(zombie){
        if (zombie.position.y === 0){
            zombie.position.y = edge;
        }else{
            zombie.position.y -= 1;
        }
    }, 
    "D": function shift(zombie){
        if (zombie.position.y === edge){
            zombie.position.y = 0;
        }else{
            zombie.position.y += 1;
        }
    }, 
    "L": function shift(zombie){
        if (zombie.position.x === 0) {
            zombie.position.x = edge;
        }else{
            zombie.position.x -= 1;
        }
    }}

/**
 * Zombie's movement control
 *
 * @param {string} direction the moving direction
 * @param {obj} zombie the relative zombie that moves 
 */
function move(direction, zombie) {
    axisChange[direction](zombie);
}

/**
 * Infection when zombie move on the creature's spot
 *
 * @param {obj} currentZombie the target zombie
 * @param {obj} creatures the target creature
 * @param {string} movement the default movement
 * @param {number} zombieNum the number of all zombies
 * @return {number} number of creatures infected.
 */

function infection(currentZombie, creatures,movement, zombieNum){
    let infectTime = 0;
    let infected = [];
    let zombieNumber = zombieNum;
    let creatureNum = Object.keys(creatures).length;
    for (let creatureI = 0; creatureI< creatureNum; creatureI++){
        let creatureKey = Object.keys(creatures)[creatureI];
        let creaturePos = creatures[creatureKey].position;
        let zombiePos = currentZombie.position;
        if(JSON.stringify(creaturePos) === JSON.stringify(zombiePos)){
            infected.push({"creatureID": creatureKey,"position":creatures[creatureKey].position})
        }
    }

    for (newZombie in infected) {
        zombieList[zombieNumber] = {"position":infected[newZombie].position, "movement":movement};
        zombieNumber += 1;
        delete creatureList[infected[newZombie].creatureID];
        infectTime += 1;
    }
    return infectTime;
}



// Main function
function main(input){
    initalize(input);

    while(Object.values(zombieList).pop().movement !== ''){
        zombieMove(zombieList, creatureList, movements);
    }

    let resultZombie = []
    let resultCreature = []

    for (zombie in zombieList){
        resultZombie.push(zombieList[zombie].position);
    }

    for (creature in creatureList){
        resultCreature.push(creatureList[creature].position);
    }

    resultFinal = {"zombies":resultZombie, "creatures":resultCreature};

    console.log(resultFinal)

    return resultFinal; 
}


//----------Task start-----------

//User input
const initalSet = {"gridSize": 4,
    "zombie": {
    "x": 3,
    "y": 1
    },
    "creatures": [
    {
    "x": 0,
    "y": 1
    },
    {
    "x": 1,
    "y": 2
    },
    {
    "x": 1,
    "y": 1
    }
    ],
    "commands": "RDRU"
}

//Start program
main(initalSet);





