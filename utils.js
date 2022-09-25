/**
 * Calculate linear interpolation between two Vertices (points)
 * @param {Vertice} A - Vertice A to consider
 * @param {Vertice} B - Vertice B to consider
 * @param {number} t  - The ratio we want to interpolate (range 0 - 1)
 * @returns {number}
 */
function lerp(A,B,t){
    return A+(B-A)*t;
}

/**
 * Check if we have an intersection between AB and CD
 * @param {point} A Point A of line AB
 * @param {point} B Point B of line AB
 * @param {point} C Point C of line CD
 * @param {point} D Point D of line CD
 * @returns {point, offset} The point of intersection and the offset 
 */
function getIntersection(A,B,C,D){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}
/**
 * Check if two polygons intersect by walking all the edges
 * @param {polygon} poly1
 * @param {polygon} poly2 
 * @returns {point, offset} point of intersection and the offset
 */
function polysIntersect(poly1, poly2){
    for(let i=0;i<poly1.length;i++){
        // for all vertices in poly 1
        for(let j=0;j<poly2.length;j++){
            // for all vertices in poly 2
            const touch=getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length], // get edge from poly1
                poly2[j],
                poly2[(j+1)%poly2.length] // get edge from poly2
            );
            if(touch){
                return true;
            }
        }
    }
    return false;
}

/**
 * Get the RGBA string for a given value
 * @param {string} value 
 * @returns 
 */
function getRGBA(value){
    const alpha=Math.abs(value);
    const R=value<0?0:255;
    const G=R;
    const B=value>0?0:255;
    return "rgba("+R+","+G+","+B+","+alpha+")";
}
                