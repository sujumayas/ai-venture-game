import Player from '../objects/Player.js';
import DialogBox from '../ui/DialogBox.js'

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene'); // Scene identifier
    }

    preload() {
        // Preload the background image
        this.load.image('main-game-scene-bg', '../assets/images/full-interface-reference.jpg');
    }

    create() {
        // Create and display assets
        // Add the background image
        this.add.image(0, 0, 'main-game-scene-bg')
            .setOrigin(0, 0)   
        // Example: this.player = new Player(this, x, y, 'player');

        // Initialize the player
        // this.player = new Player(this, 100, 100); // Position the player at x=100, y=100
        let dialogBox = new DialogBox(this, {
            // callback: function () { }, // This function will handle the update of text or actions after a click or delay
            isInteractive: false, // Set to true if the dialog box should close on click, or false for automatic closing
            //autoCloseDelay: 5000, // Time in milliseconds before the dialog box closes automatically, if applicable
            textStyle: {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#ffffff'
            }, // Add any additional styling as needed
            optionStyle: {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#f1f1f1'
            }, // Add any additional styling as needed
            hoverColor: '#3e3e3e',
            boxColor:'#964B00',
            cornerRadius: '30',
            strokeeWidth: '2',
            strokeColor: '#C19A6B',

        });

        // Add dialogBox to the current scene
        this.add.existing(dialogBox);
        // Add other game objects, listeners, etc.
        //this.dialogBox.open("texto de prueba2", ["1. Primera opcion", "2. Segunda Opcion","3. Tercera opcion"])
    }

    // update() {
        // Game loop for the scene
        // Handle real-time updates like player movement
        // this.player.update();
    // }
}
