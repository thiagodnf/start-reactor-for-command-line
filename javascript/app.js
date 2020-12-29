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
        await sound.play(audio[key]);
    }
};

async function getInputKey() {

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

function clearScreen() {
    console.clear();
    printLogo();
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

function randIndex(array) {
    return randInteger(0, array.length);;
}

function randElement(array) {
    return array[randIndex(array)];
}

function pause(ms) {

    return new Promise(resolve => {
        setTimeout(resolve, ms)
    });
}

function equals(array1, array2, index) {

    for (let i = 0; i <= index; i++) {

        const a = parseInt(array1[i]);
        const b = parseInt(array2[i]);

        if (a !== b) {
            return false;
        }
    }

    return true;
}

function pressEnterToStart() {

    console.log("Press any key to start...");

    return getInputKey();
}

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

function drawLine(lineId, number) {

    const p1 = lineId == number ? "X" : " ";
    const p2 = lineId + 1 == number ? "X" : " ";
    const p3 = lineId + 2 == number ? "X" : " ";

    println("|       |       |       |     |       |       |       |");
    println(`|   ${p1}   |   ${p2}   |   ${p3}   |     |   ${lineId}   |   ${lineId + 1}   |   ${lineId + 2}   |`);
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

async function printComplete() {
    clearScreen();
    audio.play("complete");

    println("+-----------------------+");
    println("|       Complete        |")
    println("+-----------------------+");
    println();

    await getInputKey();
}

async function printFail() {
    clearScreen();
    audio.play("fail");

    println("+-----------------------+");
    println("|         Fail          |")
    println("+-------+-------+-------+");
    println();

    await getInputKey();
}

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

async function turn() {

    clearScreen();
    drawKeyPad(0);
    await audio.play("start");

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const computerSequence = [randElement(numbers)];

    while (true) {

        clearScreen();
        drawKeyPad(0);
        await pause(400);

        for (let i = 0; i < computerSequence.length; i++) {
            clearScreen();
            drawKeyPad(computerSequence[i]);
            audio.play("n" + computerSequence[i]);
            await pause(600);
        }

        clearScreen();
        drawKeyPad(0);

        const userSequence = [];

        for (let i = 0; i < computerSequence.length; i++) {

            const pressedKey = await getInputKey();

            audio.play("n" + pressedKey);

            userSequence.push(pressedKey);

            if (equals(computerSequence, userSequence, i)) {

                if (userSequence.length == 5) {
                    printComplete();
                    return;
                }

            } else {
                printFail();
                return;
            }
        }

        await pause(400);
        computerSequence.push(randElement(numbers));
    }
}

async function main() {

    clearScreen();

    printHeader();

    await pressEnterToStart();

    while (true) {

        await turn();

        println("Do you want to continue?");
        println("  1 - Yes");
        println("  2 - No");
        print("Option: ");

        const pressedKey = await getInputKey();

        // Any other typed option will lead the player to play again
        if (pressedKey === "2") {
            break;
        }
    }

    process.exit();
}

main();
