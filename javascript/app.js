const readLine = require("readline");
const sound = require('sound-play');
const colors = require('colors');

readLine.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const audio = {
    "n1": "audio/0.mp3",
    "n2": "audio/1.mp3",
    "n3": "audio/2.mp3",
    "n4": "audio/3.mp3",
    "n5": "audio/4.mp3",
    "n6": "audio/5.mp3",
    "n7": "audio/6.mp3",
    "n8": "audio/7.mp3",
    "n9": "audio/8.mp3",
    "complete": "audio/complete.mp3",
    "fail": "audio/fail.mp3",
    "start": "audio/start.mp3",
    play: async (key) => {

        if (audio[key]) {
            await sound.play(audio[key]);
        }
    }
};

const SPEED = 300;

function print(text) {
    
    if (!(text instanceof String)) {
        text = text.toString();
    }

    process.stdout.write(text);
}

function println(text) {
    
    if (text) {
        console.log(text);
    } else {
        console.log();
    }
}

// function println() {
    
// }

function printLogo() {

    println("  _____ _             _     _____                 _                   ".green);
    println(" / ____| |           | |   |  __ \\               | |                 ".green);
    println("| (___ | |_ __ _ _ __| |_  | |__) |___  __ _  ___| |_ ___  _ __       ".green);
    println(" \\___ \\| __/ _` | '__| __| |  _  // _ \\/ _` |/ __| __/ _ \\| '__|  ".green);
    println(" ____) | || (_| | |  | |_  | | \\ \\  __/ (_| | (__| || (_) | |       ".green);
    println("|_____/ \\__\\__,_|_|   \\__| |_|  \\_\\___|\\__,_|\\___|\\__\\___/|_|".green);

    println();
}

function printHeader() {

    println("Contribute at https://github.com/thiagodnf/start-reactor-for-console");
    println();
}

function pressEnterToStart() {

    println("Press any key to start...");
   
    return getInputKeyAsChar();
}

function clearScreen() {
    console.clear();
    printLogo();
}

async function getInputKeyAsChar() {

    return await new Promise(function (resolve, reject) {

        var key_listen = function (str, key) {

            if (key.ctrl && key.name === 'c') {
                process.exit();
            }

            process.stdin.removeListener('keypress', key_listen);

            resolve(str);
        }

        process.stdin.on('keypress', key_listen);
    });
}

async function getInputKeyAsInteger() {

    const key = await getInputKeyAsChar();
    
    const x = key;
    
    return x;
}

/**
 * Returns a random number between
 * min (inclusive) and max (exclusive)
 */
function randInteger(min, max) {

    return Math.floor(
        Math.random() * (max - min) + min
    );
}

function randIndex(array, size) {
    return randInteger(0, size);;
}

function randElement(array, size) {

    let index = randIndex(array, size);

    return array[index]
}

function toString(num){
    return num.toString();
}

function drawLine(lineId, number) {

    const p1 = lineId == number ? "X" : " ";
    const p2 = lineId + 1 == number ? "X" : " ";
    const p3 = lineId + 2 == number ? "X" : " ";

    const l1 = toString(lineId);
    const l2 = toString(lineId + 1);
    const l3 = toString(lineId + 2);

    println("|       |       |       |     |       |       |       |");
    println("|   "+p1+"   |   "+p2+"   |   "+p3+"   |     |   "+l1+"   |   "+l2+"   |   "+l3+"   |");
    println("|       |       |       |     |       |       |       |");
    println("+-------+-------+-------+     +-------+-------+-------+");
}

function drawKeyPad(number) {

    println("Computer                      You".red);
    println("+-------+-------+-------+     +-------+-------+-------+");
    drawLine(1, number);
    drawLine(4, number);
    drawLine(7, number);
}

function drawEmptyKeyPad() {
    
    drawKeyPad(0);
}

function sleep(time){
    
    return new Promise(resolve => {
        setTimeout(resolve, time)
    });
}

async function play(key){
    await audio.play(key);
}

function playNumber(number){

    audio.play("n" + number);
}

function equals(array1, array2, index){
    
    for (let i = 0; i <= index; i++) {
    
        const a = array1[i];
        const b = array2[i];

        if (a != b) {
            return false;
        }
    }

    return true;
}

function printFail() {
    
    clearScreen();
    play("fail");

    println("+-----------------------+");
    println("|         Fail          |");
    println("+-----------------------+");
    println();
}

function printComplete() {
    
    clearScreen();
    play("complete");

    println("+-----------------------+");
    println("|       Complete        |");
    println("+-----------------------+");
    println();
}

async function turn() {

    clearScreen();
    drawEmptyKeyPad();
    await play("start");
    
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const pcSequence = new Array(5);
    let pcIndex = 0;
    
    pcSequence[pcIndex] = randElement(numbers, 9);
    pcIndex++;

    while (true) {

        clearScreen();
        drawEmptyKeyPad();
        await sleep(SPEED);
        
        for (let i = 0; i < pcIndex; i++) {
            clearScreen();
            drawKeyPad(pcSequence[i]);
            playNumber(pcSequence[i]); 
            await sleep(SPEED);

            clearScreen();
            drawEmptyKeyPad();
            await sleep(SPEED);
        }
        
        const userSequence = new Array(5);
        let userIndex = 0;

        for (let i = 0; i < pcIndex; i++) {

            const pressedKey = await getInputKeyAsInteger();
            
            playNumber(pressedKey);

            userSequence[userIndex] = pressedKey;
            userIndex++;

            if (equals(pcSequence, userSequence, i)) {

                if (userIndex == 5) {
                    printComplete();
                    return;
                }

            } else {
                printFail();
                return;
            }
        }

        pcSequence[pcIndex] = randElement(numbers, 9);
        pcIndex++;
    }
}

function init(){
    
}

async function main(){

    init();
	
    clearScreen();

    printHeader();

    await pressEnterToStart();

    while (true) {

        await turn();

        println("Do you want to continue?");
        println("  1 - Yes");
        println("  2 - No");
        println("Option: ");

        const pressedKey = await getInputKeyAsChar();

        // If the user type any other key other 
        // than 2, the game will restart
        if (pressedKey == '2') {
            break;
        }
    }
}

main();