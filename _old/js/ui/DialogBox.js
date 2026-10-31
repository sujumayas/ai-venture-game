class DialogBox extends Phaser.GameObjects.Container {
    constructor(scene, opts) {
        super(scene);
        this.scene = scene;
        this.opts = opts; // Options can include textStyle, boxStyle, callback, etc.
        this.text = 'I am an invisible NPC in a testing environment, if you want to chat with me you are going to need to choose one of the four options I give you here. Try not to think too much.';
        // Set the dialog box's width to a third of the screen width
        this.width = this.scene.sys.game.config.width / 3;
        // Calculate the max height for the dialog box
        this.maxHeight = this.scene.sys.game.config.height * (3 / 4);
        this.padding = 20; // Padding for the text inside the dialog box
        this.isInteractive = opts.isInteractive || false;
        this.autoCloseDelay = opts.autoCloseDelay || null; // Time in ms for automatic closing
        this.opts.wrapWidth = (this.scene.sys.game.config.width / 3) - (this.padding);
        this.initComponents();
        this.setPosition(0, this.scene.sys.game.config.height - (this.height)); // Position at the bottom left
    }

    initComponents() {
        // Initialize background, text, and option buttons
        this.background = this.createBackground();
        this.contentText = this.createContentText();
        this.options = this.createOptions();
        this.add(this.background);
        this.add(this.contentText);
        this.addOptionsToContainer(this.options);

        // Handle interaction
        if (this.isInteractive) {
            this.setInteractive();
        }
    }
    createBackground() {
        // Create a new Graphics object
        let background = this.scene.add.graphics();

        // Set the background fill style
        background.fillStyle(this.opts.boxColor, 1); // Replace with your desired color and alpha

        // Draw a rounded rectangle as the dialog background
        background.fillRoundedRect(0, 0, this.width, this.height, this.opts.cornerRadius);

        // Optional: Draw a stroke around the dialog box for better visibility
        background.lineStyle(this.opts.strokeWidth, this.opts.strokeColor, 1);
        background.strokeRoundedRect(0, 0, this.width, this.height, this.opts.cornerRadius);

        // Return the background Graphics object
        return background;
    }

    createContentText() {
        // Create and return a Phaser.Text object or Phaser.BitmapText object depending on preference
        let contentText = this.scene.add.text(0, 0, this.text, this.opts.textStyle);
        contentText.setWordWrapWidth(this.opts.wrapWidth, true);
        return contentText;
    }

    createOptions() {
        // Create and return interactive option buttons
        let options = [
            { text: "1. Say nothing to the NPC, he is not real", callback: function () { } }, 
            { text: "2. Start wondering what other options do exist", callback: function () { } },
            { text: "3. Leave the NPC alone, but give him the finger first", callback: function () { } },
            { text: "4. Enjoy the mountain view and keep walking", callback: function () { } }
        ]; // Array to hold option button objects
        // Options setup code will go here...
        return options;
    }

    addOptionsToContainer(optionsData) {
        // Clear any existing options
        this.options.forEach(option =>{
                if (option instanceof Phaser.GameObjects.Text) {
                    option.destroy();
                }
            }
        );
        this.options = [];

        // Assuming optionsData is an array of objects with text and callback properties
        optionsData.forEach((optionData, index) => {
            // Create a text object for the option
            let optionText = this.scene.add.text(0, 0, optionData.text, this.opts.optionStyle);
            optionText.setOrigin(0, 0); // Center the text
            optionText.setInteractive(); // Make the text interactive

            // The x position should be half the width of the background to center it
            // The y position starts after the contentText and is incremented for each option
            let xPosition = this.width / 2; // This centers the option text within the dialog box
            let yPosition = this.contentText.height + (index * (optionText.height + this.padding)) + this.padding;

            // Set the positions
            optionText.setPosition(xPosition, yPosition);

            // Add a hover effect
            optionText.on('pointerover', () => {
                optionText.setStyle({ fill: this.opts.hoverColor }); // Change text color on hover
            });
            optionText.on('pointerout', () => {
                optionText.setStyle({ fill: this.opts.optionStyle.color }); // Revert text color when not hovering
            });

            // Set up the callback for when an option is clicked
            optionText.on('pointerdown', () => {
                if (optionData.callback) {
                    optionData.callback();
                }
            });

            // Add the option text to the options array and the container
            this.options.push(optionText);
            this.add(optionText);
        });

        // Adjust the size of the dialog box background to accommodate the new options
        this.resizeBox();
    }

    setInteractive() {
        // Make the dialog box interactive (clickable)
        this.background.setInteractive();
        this.background.on('pointerdown', () => this.next());
    }

    // next() {
    //     // Execute the callback function to update the text
    //     if (this.callback) {
    //         this.callback();
    //     }
    // }

    setText(newText, newOptions) {
        // Update the content text and resize the dialog box
        this.contentText.setText(newText);
        this.resizeBox();
        this.addOptions(newOptions);
    }

    resizeBox() {
        // Adjust the background size based on the new text
        // Adjust the background size based on the new text content and options
        let textHeight = this.contentText.height + (8 * this.padding);
        let optionsHeight = this.options.length > 0 ? this.options[0].height + this.padding : 0;
        let totalHeight = textHeight + optionsHeight;

        // Ensure the total height does not exceed the max height
        if (totalHeight > this.maxHeight) {
            totalHeight = this.maxHeight;
        }

        // Resize the dialog box background
        this.resizeBackground(this.width, totalHeight);
        this.background.setPosition(0, -totalHeight); // Position relative to the container

        // Update the position of the text and options within the dialog box
        this.contentText.setPosition(this.padding, -totalHeight + this.padding);
        this.positionOptions(totalHeight);
    }

    resizeBackground(width, totalHeight) {
        // Clear the current graphics to prepare for redrawing
        this.background.clear();

        // Re-apply fill style for the new drawing
        this.background.fillStyle(this.opts.boxColor, 1); // Assuming boxColor is provided in this.opts

        // Re-draw the rounded rectangle with new dimensions
        this.background.fillRoundedRect(0, 0, width, totalHeight, this.opts.cornerRadius);

        // If you have a stroke around the box, re-apply the line style and redraw the stroke
        if (this.opts.strokeWidth) {
            this.background.lineStyle(this.opts.strokeWidth, this.opts.strokeColor, 1);
            this.background.strokeRoundedRect(0, 0, width, totalHeight, this.opts.cornerRadius);
        }
    }


    positionOptions(totalHeight) {
        // Position the option buttons at the bottom of the dialog box
        let startY = -totalHeight + this.contentText.height + (2 * this.padding);
        for (let i = 0; i < this.options.length; i++) {
            let option = this.options[i];
            option.setPosition(this.padding, startY + (i * (option.height + this.padding)));
        }
    }

    addOptions(newOptions) {
        // Update the options at the bottom of the dialog box
        // Clear existing options if any
        this.options.forEach(option => option.destroy());
        this.options = this.createOptions(newOptions);
        this.addOptionsToContainer(this.options);
    }

    update() {
        // Update method for the Phaser game loop
        if (this.autoCloseDelay && this.isOpen) {
        // If autoCloseDelay is set, automatically close the dialog after the delay
            Close();
        }
        // Update option button hover effects and other interactive elements if necessary
        this.updateOptions();
    }

    checkAutoClose() {
        // Check if it's time to auto-close the dialog
        let currentTime = this.scene.time.now;
        if (currentTime > this.openTime + this.autoCloseDelay) {
            this.close();
        }
    }

    open(text, options) {
        // Open the dialog box with text and options
        this.setText(text, options);
        this.visible = true;
        this.isOpen = true;
        this.openTime = this.scene.time.now; // Record the time when the dialog opened
        
        // Handle automatic closing if not interactive
        if (!this.isInteractive && this.autoCloseDelay) {
            this.scene.time.delayedCall(this.autoCloseDelay, this.close, [], this);
        }
    }

    close() {
        // Close the dialog box
        this.visible = false;
        this.isOpen = false;
        // Additional cleanup if necessary
    }

}
export default DialogBox;

