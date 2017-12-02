export default class {
    constructor() {
    }

    constrainVelocity(sprite, maxVelocity) {
        var body = sprite.body;
        var angle, currVelocitySqr, vx, vy;

        vx = body.data.velocity[0];
        vy = body.data.velocity[1];

        currVelocitySqr = vx * vx + vy * vy;
        //console.log('currVelocity: '+currVelocitySqr);

        if (currVelocitySqr > maxVelocity * maxVelocity) {
            angle = Math.atan2(vy, vx);


            vx = Math.cos(angle) * maxVelocity;
            vy = Math.sin(angle) * maxVelocity;

            body.data.velocity[0] = vx;
            body.data.velocity[1] = vy;
            console.log('limited speed to: ' + maxVelocity);
        }
    };

    getAngle(body1, body2) {
        // angle in radians
        var angleRadians = Math.atan2(body2.y - body1.y, body2.x - body1.x);
        // angle in degrees
        var angleDeg = (Math.atan2(body2.y - body1.y, body2.x - body1.x) * 180 / Math.PI);
        return angleDeg;
    }
}