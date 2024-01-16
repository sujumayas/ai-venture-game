export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene'); // Scene identifier
    }

    preload() {
        // Load the background image for the MainMenu scene
        this.load.image('main-menu-background', '../assets/images/eucalypto.jpeg');

        // Load other assets needed for the MainMenu
        // Example: this.load.image('logo', '../assets/images/logo.png');

        // If you have a loading bar, load its assets here and initialize it
    }

    create() {
        // All assets for the MainMenu have been loaded, transition to it
        this.scene.start('MainMenu');
    }
}
