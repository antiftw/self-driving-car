/**
 * The car
 */
class Car {
    constructor(x, y, width, height, controlType, maxSpeed = 3, color = "blue") {
        // x, y location of the center of the car
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;

        this.angle = 0;
        this.damaged = false;
        this.sensor = null;

        this.useBrain = controlType === "AI";
        this.hiddenLayerNeurons = 6;
        this.outputLayerNeurons = 4; // up, down, left, right

        if(controlType !== "DUMMY") {
            // Only AI or Player cars have a Sensor
            this.sensor = new Sensor(this);
        }
        if (controlType === "AI"){
            this.brain = new NeuralNetwork([
                this.sensor.rayCount, // the amount of "input sensors"
                this.hiddenLayerNeurons, // currently only 1 hidden layer
                // here we could add more layers by just giving the
                // amount of neurons we want it to contain
                // e.g. :
                // 6
                this.outputLayerNeurons // the amount of output "actions"
            ]);
        }
        // The module that handles controls for human players
        this.controls = new Controls(controlType);

        // Create the image for the car
        this.img = new Image();
        this.img.src = this.img.src="car.png";
        // Create a new canvas for the image mask 
        this.mask = document.createElement("canvas");
        // With the same height & width as the car
        this.mask.width=width;
        this.mask.height=height;

        // Create the context
        const maskCtx = this.mask.getContext("2d");
        this.img.onload=()=>{
            // Set color
            maskCtx.fillStyle=color;
            //  Create a rectangle with the same height and width
            maskCtx.rect(0,0,this.width,this.height);
            // Fill it in
            maskCtx.fill();
            // Make sure we draw the car on top of the rectangle
            maskCtx.globalCompositeOperation="destination-atop";
            // Draw the image
            maskCtx.drawImage(this.img,0,0,this.width,this.height);
        }
    }

    update(roadBorders, traffic) {
        if(!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if(this.sensor) {
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(
                s => s === null ? 0 : 1 - s.offset
            );
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            if(this.useBrain) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
    }

    #assessDamage(roadBorders, traffic) {
        for(let i = 0; i < roadBorders.length; i++) {
            if(polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        
        for(let i = 0; i < traffic.length; i++) {
            if(polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Create a polygon (square at the moment) to represent the car,
     * using the Unit circle.
     * @returns {array} points
     */
    #createPolygon() {
        
        const points = [];
        const radius = Math.hypot(this.width, this.height) / 2;
        const alpha  = Math.atan2(this.width, this.height);
        // One point per corner of the car
        // +
        points.push({
            x : this.x - Math.sin(this.angle - alpha) * radius,
            y : this.y - Math.cos(this.angle - alpha) * radius
        });
        // -
        points.push({
            x : this.x - Math.sin(this.angle + alpha) * radius,
            y : this.y - Math.cos(this.angle + alpha) * radius
        });
        //// + 180 degrees
        // +
        points.push({
            x : this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
            y : this.y - Math.cos(Math.PI + this.angle - alpha) * radius
        });
        // - 
        points.push({
            x : this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
            y : this.y - Math.cos(Math.PI + this.angle + alpha) * radius
        });
        return points;
    }

    /**
     * Private function to handle movement
     */
    #move() {
        // Pressing forward increases speed with acceleration
        if(this.controls.forward) {
            this.speed += this.acceleration;
        }
        // Same but backwards
        if(this.controls.reverse) {
            this.speed -= this.acceleration;
        }
        // Apply maximum speed
        if(this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        // Max speed backwards is half the speed as forward
        if(this.speed < - this.maxSpeed / 2) {
            this.speed = - this.maxSpeed / 2;
        }
        // slowly decrease speed while driving forwards
        if(this.speed >  0 ) {
            this.speed -= this.friction;
        }
        // slowly increase speed when driving backwards
        if(this.speed < 0) {
            this.speed += this.friction;
        }
        // prevent issues with friction
        if(Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }
        // Only allow steering while moving
        if(this.speed !== 0) {
            // Flip steering while driving backwards
            const flip = this.speed > 0 ? 1 : - 1;
            if(this.controls.left) {
                // Slowly turn left (or right when driving backwards)
                this.angle += 0.03 * flip;
            }
            if(this.controls.right) {
                // Slowly turn right (or left when driving backwards)
                this.angle -= 0.03 * flip;
            }
        }
        // Calculate final coordinates
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
       
    }
    draw(ctx, drawSensor = false) {
        // Only draw sensor when defined and on AI/Player
        if(this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }
        // Save the current context
        ctx.save();
        // Update translation
        ctx.translate(this.x,this.y);
        // And rotation
        ctx.rotate(-this.angle);
        if(!this.damaged){
            // If the car is not damaged, we also draw the mask,
            // containing the color.
            ctx.drawImage(this.mask,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height);
            ctx.globalCompositeOperation="multiply";
        }
        // Draw the image of the car itself
        ctx.drawImage(this.img,
            -this.width/2,
            -this.height/2,
            this.width,
            this.height);
        // Restore context
        ctx.restore();
    }
}