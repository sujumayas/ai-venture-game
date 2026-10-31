// Importing scenes and other necessary components
// Assuming ES6 modules are used for organization
import BootScene from './scenes/BootScene.js';
import MainMenu from './scenes/MainMenu.js';
import GameScene from './scenes/GameScene.js';
// ...import other scenes as needed

import Player from './objects/Player.js';
// import NPC from './objects/NPC.js';
// import Item from './objects/Item.js';
// ...import other objects as needed

// import Inventory from './ui/Inventory.js';
// import DialogueBox from './ui/DialogueBox.js';
// ...import other UI components as needed

import { Constants, Utils } from './utils/Utils.js'; // Example of utility imports

// Phaser game configuration
const config = {
    type: Phaser.AUTO, // Phaser will decide to use WebGL or Canvas based on the browser
    width: Constants.GAME_WIDTH, // Assuming game width is defined in Constants
    height: Constants.GAME_HEIGHT, // Assuming game height is defined in Constants
    parent: 'game-container', // The ID of the DOM element to add the game canvas to
    scene: [BootScene, MainMenu, GameScene], // Add all scenes used in the game
    // ...additional Phaser configuration like physics, audio, etc.
};

// Create the Phaser game instance
const game = new Phaser.Game(config);

// Game initialization and global state management
game.scene.start('BootScene'); // Starting with the BootScene

// Global game state or shared variables can be initialized here
// Example: game.global = { playerData: {}, currentLevel: 1, ... };

// Additional global configurations or game-wide systems can be set up here
// Example: setupGlobalEventListeners(game), initializeAnalytics(), etc.
