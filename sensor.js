class Sensor {
    constructor(car) {
        this.car = car;
        // Use these values to configure the ray configruation
        this.rayCount = 8;
        this.rayLength = 100;
        this.raySpread = Math.PI/2;

        this.rays = [];
        this.readings = [];
    }

    /**
     * Update our sensor readings
     * @param {Edges} roadBorders - borders on side of the road
     * @param {Array} traffic - cars in traffic
     */
    update(roadBorders, traffic) {
        // Perform raycasting
        this.#castRays();
        this.readings = [];
        for(let i = 0; i < this.rays.length; i++) {
            // Walk all rays
            this.readings.push(
                // Push closest reading to readings
                this.#getReading(
                    this.rays[i],
                    roadBorders,
                    traffic
                )
            );
        }
    }

    /**
     * 
     * @param {vector} ray 
     * @param {Array} roadBorders 
     * @param {Array} traffic 
     * @returns 
     */
    #getReading(ray, roadBorders, traffic) {
        let touches = [];
        // Do the collision detection for the borders
        for(let i = 0; i < roadBorders.length; i++) {
        
            const rayX = ray[0];
            const rayY = ray[1];
            const borderX = roadBorders[i][0];
            const borderY = roadBorders[i][1];
           
            const touch = getIntersection(
               rayX,
               rayY,
               borderX,
               borderY
            );
            if(touch) {
                touches.push(touch);
            }
        }
        // Do collision detection for traffic
        for(let i = 0; i < traffic.length; i++) {
            const poly = traffic[i].polygon;
            for(let j = 0; j < poly.length; j++) {
                const touch = getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j+1) % poly.length] 
                )
                if(touch) {
                    touches.push(touch)
                }
            }
            
        }
        if(touches.length === 0) {
            // no touches found
            return null;
        }else{
            // get the distances to all the touches
            const offsets = touches.map(e => e.offset);
            // get the smallest value
            const minOffset = Math.min(...offsets);
            // get that touch with smallest offset distance
            return touches.find(e => e.offset === minOffset);
        }
    }

    /**
     * Perform raycasting
     */
    #castRays() {
        this.rays = [];
        for(let i = 0; i< this.rayCount; i++) {
            // For the amount of rays we want, calculate the angle
            // it should be at, by using linear interpolation
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                // prevent division by zero
                this.rayCount === 1 ? 0.5 : (i / (this.rayCount - 1))
            ) + this.car.angle; // turn sensors when car turns 
        
            // Startpoint is the center point of the car
            const start = { x: this.car.x, y: this.car.y };
            // Endpoint depends on angle and raylength
            const end = {
                x: this.car.x - 
                        Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - 
                    Math.cos(rayAngle) * this.rayLength
            }
            this.rays.push([start, end]);
        }
    }

    draw() {
        for(let i = 0; i< this.rayCount; i++) {
            // Endpoint is the end of the ray
            let end = this.rays[i][1];
            if(this.readings[i]) {
                // Unless we have a reading, then we take that as the endpoint
                end = this.readings[i];
            }
            // Ray until collision
            carCtx.beginPath();
            carCtx.lineWidth = 2;
            carCtx.strokeStyle = "yellow";
            carCtx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y,
            );
            carCtx.lineTo(
                end.x,
                end.y,
            );
            carCtx.stroke();

            // Ray beyond collision
            carCtx.beginPath();
            carCtx.lineWidth = 2;
            carCtx.strokeStyle = "black";
            carCtx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y,
            );
            carCtx.lineTo(
                end.x,
                end.y,
            );
            carCtx.stroke();
        }
    }
}