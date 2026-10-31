export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu'); // Scene identifier
    }

    preload() {
        // Preload the background image
        this.load.image('main-menu-background', '../assets/images/eucalypto.jpg');
    }

    create() {
        // Add the background image
        this.add.image(0, 0, 'main-menu-background')
            .setOrigin(0, 0)            
            // .setScale(1); // The scale may need to be adjusted based on your game's canvas size

        // Add the menu text
        const startGameText = this.add.text(this.scale.width / 6*5.63, this.scale.height / 8 * 5.36, 'START GAME', {
            font: '16px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        const settingsText = this.add.text(this.scale.width / 6 * 5.63, this.scale.height / 8 * 5.36 + 75, 'SETTINGS', {
            font: '16px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        const creditsText = this.add.text(this.scale.width / 6 * 5.63, this.scale.height / 8 * 5.36 + 120, 'CREDITS', {
            font: '16px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        const exitText = this.add.text(this.scale.width / 6 * 5.63, this.scale.height / 8 * 5.36 + 168, 'EXIT', {
            font: '16px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();

        // Set up the menu option behaviors
        startGameText.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        settingsText.on('pointerdown', () => {
            // Code to transition to the Settings scene
            // this.scene.start('SettingsScene');
        });

        creditsText.on('pointerdown', () => {
            // Code to show credits
            // this.scene.start('CreditsScene');
        });

        exitText.on('pointerdown', () => {
            // Code to exit the game, if applicable, or return to a previous scene
            // this.scene.start('ExitScene'); // Or window.close(), if it's a standalone game
        });

        // Optionally, add hover states for the text for better interactivity
        this.addMenuOptionHoverState(startGameText);
        this.addMenuOptionHoverState(settingsText);
        this.addMenuOptionHoverState(creditsText);
        this.addMenuOptionHoverState(exitText);
    }

    // Function to add hover state to menu options
    addMenuOptionHoverState(text) {
        text.on('pointerover', () => {
            text.setStyle({ fill: '#ff0' });
        });

        text.on('pointerout', () => {
            text.setStyle({ fill: '#ffffff' });
        });
    }
}
