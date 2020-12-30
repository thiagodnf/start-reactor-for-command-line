import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.Scanner;
import java.io.IOException;

public class Main {

    static int SPEED = 300;

    static void print(String text) {
        System.out.print(text);
    }

    static void println(String text) {
        
        System.out.println(text);
    }

    static void println() {

        println("");
    }

    static void printLogo() {

        println("  _____ _             _     _____                 _                   ");
        println(" / ____| |           | |   |  __ \\               | |                 ");
        println("| (___ | |_ __ _ _ __| |_  | |__) |___  __ _  ___| |_ ___  _ __       ");
        println(" \\___ \\| __/ _` | '__| __| |  _  // _ \\/ _` |/ __| __/ _ \\| '__|  ");
        println(" ____) | || (_| | |  | |_  | | \\ \\  __/ (_| | (__| || (_) | |       ");
        println("|_____/ \\__\\__,_|_|   \\__| |_|  \\_\\___|\\__,_|\\___|\\__\\___/|_|");

        println();
    }

    static void printHeader() {

        println("Contribute at https://github.com/thiagodnf/start-reactor-for-console");
        println();
    }

    static void pressEnterToStart() {

        println("Press any key to start...");

        try {
            System.in.read();
        } catch (IOException e){
            System.out.println("Error reading from user");
        }
    }

    static void clearScreen() {

        System.out.print("\033[H\033[2J");  
        System.out.flush(); 

        printLogo();
    }

    static char getInputKeyAsChar() {

        Scanner s = new Scanner(System.in);
        
        String str = s.next();
        
        return str.charAt(0);
    }

    static int getInputKeyAsInteger() {

        char key = getInputKeyAsChar();

        int num = Character.getNumericValue(key);
        
        return num;
    }

    /**
     * Returns a random number between
     * min (inclusive) and max (exclusive)
     */
    static int randInteger(int min, int max) {
        
        return new Random().nextInt(max);
    }

    static int randIndex(int array[], int size) {
        return randInteger(0, size);
    }

    static int randElement(int array[], int size) {

        int index = randIndex(array, size);

        return array[index];
    }

    static String toString(int num){
        return Integer.toString(num);
    }

    static void drawLine(int lineId, int number) {

        String p1 = lineId == number ? "X" : " ";
        String p2 = lineId + 1 == number ? "X" : " ";
        String p3 = lineId + 2 == number ? "X" : " ";

        String l1 = toString(lineId);
        String l2 = toString(lineId + 1);
        String l3 = toString(lineId + 2);

        println("|       |       |       |     |       |       |       |");
        println("|   "+p1+"   |   "+p2+"   |   "+p3+"   |     |   "+l1+"   |   "+l2+"   |   "+l3+"   |");
        println("|       |       |       |     |       |       |       |");
        println("+-------+-------+-------+     +-------+-------+-------+");
    }

    static void drawKeyPad(int number) {

        println("Computer                      You");
        println("+-------+-------+-------+     +-------+-------+-------+");
        drawLine(1, number);
        drawLine(4, number);
        drawLine(7, number);
    }

    static void drawEmptyKeyPad() {
        
        drawKeyPad(0);
    }

    static void sleep(int time){
        
        try {
            TimeUnit.MILLISECONDS.sleep(time);
        } catch(InterruptedException ex) {
            Thread.currentThread().interrupt();
        }
    }

    static void play(String key){
        // Not implemented it. Please contribute!
    }

    static void playNumber(int number){
        // Not implemented it. Please contribute!
    }

    static boolean equals(int array1[], int array2[], int index){
        
        for (int i = 0; i <= index; i++) {

            int a = array1[i];
            int b = array2[i];

            if (a != b) { 
                return false;
            }
        }

        return true;
    }

    static void printFail() {
        
        clearScreen();
        play("fail");

        println("+-----------------------+");
        println("|         Fail          |");
        println("+-----------------------+");
        println();
    }

    static void printComplete() {
        
        clearScreen();
        play("complete");

        println("+-----------------------+");
        println("|       Complete        |");
        println("+-----------------------+");
        println();
    }

    static void turn() {

        clearScreen();
        drawEmptyKeyPad();
        play("start");
        
        int numbers[] = new int[]{1, 2, 3, 4, 5, 6, 7, 8, 9};

        int pcSequence[] = new int[5];
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
            
            int userSequence[] = new int[5];
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

    static void init(){
     
    }

    public static void main(String[] args){

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
}
