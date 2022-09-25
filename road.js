/**
 * The road
 */
class Road {
    constructor(x, width, lanes = 3) {
        this.x = x;
        this.width = width;
        this.lanes = lanes;

        this.left = x - width / 2;
        this.right = x + width / 2;

        // We use "infinity" to stretch the road all the way 
        // up and down, since the JS version of infinity causes issues
        const infinity = 10000000;
        this.top = -infinity
        this.bottom = infinity;

        // The corners of the roads
        const topLeft = {x:this.left, y:this.top}
        const topRight = {x:this.right, y:this.top}
        const bottomLeft = {x:this.left, y:this.bottom}
        const bottomRight = {x:this.right, y:this.bottom}

        // Borders go on either side left and right
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ]
    }

    /**
     * Find the center of a given lane
     * @param {number} laneIndex the index of the lane we want the center for
     * @returns {number} x coordinate of the center
     */
    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.lanes;
        return this.left + laneWidth / 2 + Math.min(laneIndex, this.lanes) * laneWidth;
    }


    /**
     * Draw the roads
     * @param {Context} ctx context to draw in
     */
    draw(ctx) {

        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        // For each lane
        for(let i = 1; i <= this.lanes -1 ; i++) {
            // Find the x coordinate between two lanes
            const x = lerp(
                this.left,
                this.right,
                i / this.lanes
            );
            // Enable dotted line
            ctx.setLineDash([20,20]);
            
            // Draw the line top to bottom
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }
        // Turn line back to continuous
        ctx.setLineDash([]);

        // Draw borders
        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        })
    }
}

