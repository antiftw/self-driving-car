class Controls {
    constructor(type) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        switch(type) {
            case "PLAYER": 
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                // dummies just drive forwards at a constant speed
                this.forward = true;
                break;
            case "AI":
            default:
                break;
                // no settings needed, since the AI drives by Neural Net
        }
    }
    #addKeyboardListeners() {
        // Handle keyDown event (enable movement)
        document.onkeydown = (event) => {
            switch(event.key) {
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break; 
            }
            
        }
        // Handle key-up event (disable movement)
        document.onkeyup = (event) => {
            switch(event.key) {
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break; 
            }
        }
    }
}