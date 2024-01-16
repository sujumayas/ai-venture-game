import Player from '../objects/Player.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene'); // Scene identifier
    }

    preload() {
        // Load assets specific to this scene
        // Example: this.load.image('player', 'path/to/player/sprite.png');
    }

    create() {
        // Create and display assets
        // Example: this.player = new Player(this, x, y, 'player');

        // Initialize the player
        this.player = new Player(this, 100, 100); // Position the player at x=100, y=100

        // Add other game objects, listeners, etc.
    }

    update() {
        // Game loop for the scene
        // Handle real-time updates like player movement
        this.player.update();
    }
}
