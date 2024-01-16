// Utils.js

// Constants used throughout the game
export const Constants = {
    GAME_WIDTH: 1200,
    GAME_HEIGHT: 900,
    // You can define other constants here
    // Example: PLAYER_SPEED: 300,
};

// Utility functions that can be used anywhere in the game
export const Utils = {
    // Example utility function to calculate a random integer within a range
    randomInt: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1
        ) + min);
    },
    // Function to convert degrees to radians, useful for rotations
    degreesToRadians: (degrees) => {
        return degrees * (Math.PI / 180);
    },
    // Function to convert radians to degrees, useful for rotations
    radiansToDegrees: (radians) => {
        return radians * (180 / Math.PI);
    },
    // Add any other utility functions that you think will be useful for the game
    // For example, a function to ease animations, handle collision detection, etc.
};
