var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
var width = window.innerWidth;
var height = window.innerHeight;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');






class Boids {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    make_triangle() {
        c.beginPath();
        c.strokeStyle = "red";
        c.fillStyle = 'red';



        this.b = (Math.cos(0.261799 * 2) * 30);
        c.lineWidth = 5;


        c.arc(this.x, this.y, 5, 0, 2 * Math.PI);


        c.fill();

    }
    move(ang) {

        this.x = (this.x + this.velocity * Math.cos(this.angle + ang)) % (width + 2 * this.b);
        this.y = (this.y + this.velocity * Math.sin(this.angle + ang)) % (height + 2 * this.b);
    }
    assignDirection() {
        this.angle = getRndInteger(0, 2 * Math.PI);

    }
    assignVelocity() {
        this.velocity = getRndInteger(0.1, 0.101);
    }
    movinDirection(ang) {
        this.x1 = this.x - Math.cos(this.angle + ang) * 15;
        this.y1 = this.y - Math.sin(this.angle + ang) * 15;
        // c.beginPath();
        // c.strokeStyle = "green";
        // c.lineWidth = 5;
        // c.moveTo(this.x, this.y);
        // c.lineTo(this.x1, this.y1);
        // // c.lineTo(this.x1 + 5, this.y1 + 5); 
        // c.closePath();
        // c.stroke();


    }


}



function getRndInteger(min, max) {
    return (Math.random() * (max - min + 1)) + min;
}



var triangle_array = [];

function draw_triangles(numbers) {

    for (var i = 0; i < numbers; i++) {

        var a = getRndInteger(100, window.innerWidth - 10) + Math.floor(Math.random() * 10);
        var b = getRndInteger(100, window.innerHeight - 10) + Math.floor(Math.random() * 10);

        triangle = new Boids(a, b);
        triangle.assignVelocity();
        triangle.assignDirection();
        triangle.make_triangle();


        triangle_array.push(triangle);

    }


}


draw_triangles(100);
N = triangle_array.length; //no of boids 







function rule(b, j) { //the boids try to fly towards the center of mass of the neighboring boids.
    //the boids try to stay away from each other -- for a given threshold
    // the boids try to match their velocities with each other-- have to be certain distance with each other
    pc = new Boids(width / 2, height / 2);

    c_ = new Boids(0, 0);
    l = new Boids(0, 0);
    l.velocity = 0;
    l.angle = 0;
    for (var k = 0; k < N; k++) {
        distance_betweenX = Math.abs(b.x - triangle_array[k].x);
        distance_betweenY = Math.abs(b.y - triangle_array[k].y);
        if (j != k && (distance_betweenX < 50) && (distance_betweenY < 50)) {
            pc.x += triangle_array[k].x;
            pc.y += triangle_array[k].y;
        }
        if (j != k && (distance_betweenX < 50) && (distance_betweenY < 50)) {
            if (Math.abs(b.x - triangle_array[k].x) < 20) {
                c_.x = c_.x + (b.x - triangle_array[k].x) / 20;
            }
            if (Math.abs(b.y - triangle_array[k].y) < 20) {
                c_.y += (b.y - triangle_array[k].y) / 20;
            }

            l.velocity += triangle_array[k].velocity;
            l.angle += triangle_array[k].angle;


        }

    }
    if (pc.x !== 0 && pc.y !== 0) {
        pc.x /= (N - 1);
        pc.y /= (N - 1);
    }
    if (l.velocity !== 0) {
        l.velocity /= (N - 1);
        offsetVelocity = (l.velocity - b.velocity) / (80);
    } else offsetVelocity = b.velocity;
    if (l.angle != 0) {
        l.angle /= (N - 1);
        offsetAngle = (l.angle - b.angle) / (80);
    } else offsetAngle = b.angle;
    return [
        [(pc.x - b.x) / 5000, (pc.y - b.y) / 5000], c_, offsetVelocity, offsetAngle
    ];

}












var flag = true;

function move_all_boids_to_new_positions() {

    var v3 = 0;
    c.clearRect(0, 0, width, height);
    for (var i = 0; i < N; i++) {

        v = rule(triangle_array[i], i);
        v1 = v[0];
        v2 = v[1];
        v3 = v[2];
        // if (flag && i <= 10) {
        //     // console.log(v1[0], v1[1]);
        //     console.log(v[3]);
        //     if (i == 9)
        //         flag = false;
        // }

        triangle_array[i].x = (triangle_array[i].x + v1[0] + v2.x + (v3 * Math.cos(v[3] * 100) / 10)) % width;
        triangle_array[i].y = (triangle_array[i].y + v1[1] + v2.y + (v3 * Math.sin(v[3] * 100) / 10)) % height;;
        triangle_array[i].movinDirection(v[3]);
        triangle_array[i].move(v[3] * 10);
        if (triangle_array[i].x < (0 - triangle_array[i].b)) {
            triangle_array[i].x = width;

        }
        if (triangle_array[i].y < (0 - triangle_array[i].b)) {
            triangle_array[i].y = height;

        }
        triangle_array[i].make_triangle();


    }
}



function draw() {


    move_all_boids_to_new_positions();
    window.requestAnimationFrame(draw);
}


draw();