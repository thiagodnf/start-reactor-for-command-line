#include <iostream>
#include <cstring>
#include <chrono>
#include <thread>
#include <ncurses.h>

using namespace std;

const int SPEED = 300;

void print(string text) {
    
    // We need to convert from std::string to 'const char*'
    printw("%s", text.c_str());
    refresh();
}

void println(string text) {
    
    // We need to convert from std::string to 'const char*'
    printw("%s\n", text.c_str());
    refresh();
}

void println() {

    println("");
}

void printLogo() {

    println("  _____ _             _     _____                 _                   ");
    println(" / ____| |           | |   |  __ \\               | |                 ");
    println("| (___ | |_ __ _ _ __| |_  | |__) |___  __ _  ___| |_ ___  _ __       ");
    println(" \\___ \\| __/ _` | '__| __| |  _  // _ \\/ _` |/ __| __/ _ \\| '__|  ");
    println(" ____) | || (_| | |  | |_  | | \\ \\  __/ (_| | (__| || (_) | |       ");
    println("|_____/ \\__\\__,_|_|   \\__| |_|  \\_\\___|\\__,_|\\___|\\__\\___/|_|");

    println();
}

void printHeader() {

    println("Contribute at https://github.com/thiagodnf/start-reactor-for-console");
    println();
}

void pressEnterToStart() {

    println("Press any key to start...");

    cbreak();
    getchar();
}

void clearScreen() {

    clear();
    printLogo();
}

char getInputKeyAsChar() {

    cbreak();
    noecho();

    return getch();
}

int getInputKeyAsInteger() {

    char key = getInputKeyAsChar();
    
    int x = (int) key - 48;
    
    return x;
}

/**
 * Returns a random number between
 * min (inclusive) and max (exclusive)
 */
int randInteger(int min, int max) {
    return rand() % (max - 1) + min;
}

int randIndex(int array[], int size) {
    return randInteger(0, size);
}

int randElement(int array[], int size) {

    int index = randIndex(array, size);

    return array[index];
}

void drawLine(int lineId, int number) {

    string p1 = lineId == number ? "X" : " ";
    string p2 = lineId + 1 == number ? "X" : " ";
    string p3 = lineId + 2 == number ? "X" : " ";

    string l1 = to_string(lineId);
    string l2 = to_string(lineId + 1);
    string l3 = to_string(lineId + 2);

    println("|       |       |       |     |       |       |       |");
    println("|   "+p1+"   |   "+p2+"   |   "+p3+"   |     |   "+l1+"   |   "+l2+"   |   "+l3+"   |");
    println("|       |       |       |     |       |       |       |");
    println("+-------+-------+-------+     +-------+-------+-------+");
}

void drawKeyPad(int number) {

    println("Computer                      You");
    println("+-------+-------+-------+     +-------+-------+-------+");
    drawLine(1, number);
    drawLine(4, number);
    drawLine(7, number);
}

void drawEmptyKeyPad() {
    
    drawKeyPad(0);
}

void sleep(int time){
    
    std::this_thread::sleep_for(std::chrono::milliseconds(time));
}

void play(string key){
    // Not implemented it. Please contribute!
}

void playNumber(int number){
    // Not implemented it. Please contribute!
}

bool equals(int array1[], int array2[], int index){
    
    for (int i = 0; i <= index; i++) {

        int a = array1[i];
        int b = array2[i];

        if (a != b) { 
            return false;
        }
    }

    return true;
}

void printFail() {
    
    clearScreen();
    play("fail");

    println("+-----------------------+");
    println("|         Fail          |");
    println("+-----------------------+");
    println();
}

void printComplete() {
    
    clearScreen();
    play("complete");

    println("+-----------------------+");
    println("|       Complete        |");
    println("+-----------------------+");
    println();
}

void turn() {

    clearScreen();
    drawEmptyKeyPad();
    play("start");
    
    int numbers[9] = {1, 2, 3, 4, 5, 6, 7, 8, 9};

    int pcSequence[5];
    int pcIndex = 0;
    
    pcSequence[pcIndex] = randElement(numbers, 9);
    pcIndex++;

    while (true) {

        clearScreen();
        drawEmptyKeyPad();
        sleep(SPEED);
        
        for (int i = 0; i < pcIndex; i++) {
            clearScreen();
            drawKeyPad(pcSequence[i]);
            playNumber(pcSequence[i]); 
            sleep(SPEED);

            clearScreen();
            drawEmptyKeyPad();
            sleep(SPEED);
        }
        
        int userSequence[5];
        int userIndex = 0;

        for (int i = 0; i < pcIndex; i++) {

            int pressedKey = getInputKeyAsInteger();
            
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

void init(){
    initscr();
}

int main(){

    init();
	
    clearScreen();

    printHeader();

    pressEnterToStart();

    while (true) {

        turn();

        println("Do you want to continue?");
        println("  1 - Yes");
        println("  2 - No");
        println("Option: ");

        char pressedKey = getInputKeyAsChar();

        // If the user type any other key other 
        // than 2, the game will restart
        if (pressedKey == '2') {
            break;
        }
    }
}
