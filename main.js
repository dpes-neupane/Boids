import * as THREE from 'three';


var Bird = function () {
          var geometry = new THREE.BufferGeometry();
        const posit = [
                5, 0, 0,
                -5, 0, 0,
                -5, -2, 1,
                 0, 2, -6,
                -3, 0, 0,
                2, 0, 0,
                0, 2, 6,
                2, 0, 0,
                -3, 0, 0,
        ];
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(posit, 3));


        geometry.computeVertexNormals();
        return geometry;
  
};



var sizes = {
        width: window.innerWidth,
        height: window.innerHeight
}

window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

const aspect = window.innerWidth / window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, aspect, 1, 50);
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xb8e7fc, 1);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const material = new THREE.MeshStandardMaterial( { color: 0xf28880 , roughness:0.0, side:THREE.DoubleSide} );
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(0, 100, 100);
scene.add(directionalLight);
const light = new THREE.AmbientLight(0x404040, 20);
scene.add(light);
camera.position.z = 4;

var birds = [];
function createBirds(no){
        for (var i=0; i<no; i++){

                var bd = {
                        mesh: new THREE.Mesh( Bird(), material),
                        speed: new THREE.Vector3(),
                        vector : new THREE.Vector3(),
                        pos: new THREE.Vector3(),
                        x_ : function(vector){return Math.round((0.5 + vector.x / 2) * (renderer.domElement.width / window.devicePixelRatio)) },
                        y_ : function(vector){ return Math.round((0.5 - vector.y / 2) * (renderer.domElement.height / window.devicePixelRatio))},
                        x : 0,
                        y : 0,
                        phase: Math.floor(Math.random()) * 62.83,
                        checkBoundary: function ()  {

                                if (this.x < window.innerWidth && this.x > -0){
                                        this.mesh.position.x +=  this.speed.x;
                                }
                                else{
                                        this.mesh.position.x = -this.mesh.position.x + this.speed.x*2;
                                }
                                if (this.y > -0 && this.y < window.innerHeight){
                                        this.mesh.position.y += this.speed.y;
                                }
                                else{
                                        this.mesh.position.y = -this.mesh.position.y+this.speed.y*2;
                                }

                        },

                };
                var ra = Math.random();
                bd.mesh.position.x = (ra - 0.5) * 5;
                bd.mesh.position.y = (Math.random() - 0.5) * 5;
                bd.mesh.position.y = (Math.random() - 0.5) * 5;
                bd.speed.x = (Math.random() - 0.5) / 100;
                bd.speed.y = (Math.random() - 0.5) / 100;
                bd.mesh.scale.set(0.01, 0.01, 0.01);
                scene.add(bd.mesh);
                birds.push(bd);
        }
}



function moveBirds(no){
       for (var i=0; i<no; i++) {
                birds[i].vector.setFromMatrixPosition(birds[i].mesh.matrixWorld);
                birds[i].vector.project(camera);

                birds[i].x = birds[i].x_(birds[i].vector);
                birds[i].y = birds[i].y_(birds[i].vector);
                birds[i].mesh.updateMatrixWorld();
                birds[i].checkBoundary();
                birds[i].pos = birds[i].mesh.position.clone();
                birds[i].pos.x += birds[i].speed.x*50;
                birds[i].pos.y += birds[i].speed.y*50;
                birds[i].mesh.rotation.z = Math.asin(birds[i].speed.y / 2);
                birds[i].mesh.rotation.y = Math.atan2(-birds[i].speed.z, birds[i].speed.x);
                
                birds[i].phase = (birds[i].phase + (Math.max(0, birds[i].mesh.rotation.z) + 0.1)) % 62.83;
                const positions = birds[i].mesh.geometry.attributes.position.array;
                positions[3*3 + 1] = positions[3*6+1] = Math.sin(birds[i].phase) * 5;
                birds[i].mesh.geometry.attributes.position.needsUpdate = true;

                // birds[i].mesh.lookAt(birds[i].pos);
        }
}












createBirds(100);

// birds[0].mesh.geometry.rotateX(Math.PI/2);




function animate() {
        requestAnimationFrame( animate );                
        moveBirds(100);
        renderer.render( scene, camera );
}


animate()
