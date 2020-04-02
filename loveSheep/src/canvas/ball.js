import * as THREE from 'three';

const Ball = new THREE.Group();
Ball.position.y = -1.65;
Ball.scale.set(0.43, 0.43, 0.43);

var material = new THREE.MeshStandardMaterial({
    color: 0xacb3fb,
    roughness: 1,
    shading: THREE.FlatShading
});


drawParts();

Ball.traverse((part) => {
    part.castShadow = true;
    part.receiveShadow = true;
});


function drawParts() {
    const partGeometry = new THREE.IcosahedronGeometry(1, 0);
    const upperPart = new THREE.Mesh(partGeometry, material);
    Ball.add(upperPart);
    
    const leftPart = upperPart.clone();
    leftPart.position.set(-1.2, -0.3, 0);
    leftPart.scale.set(0.8, 0.8, 0.8);
    Ball.add(leftPart);
    
    const rightPart = leftPart.clone();
    rightPart.position.x = -leftPart.position.x;
    Ball.add(rightPart);
    
    const frontPart = leftPart.clone();
    frontPart.position.set(0, -0.4, 0.9);
    frontPart.scale.set(0.7, 0.7, 0.7);
    Ball.add(frontPart);
    
    const backPart = frontPart.clone();
    backPart.position.z = -frontPart.position.z;
    Ball.add(backPart);
}


export default Ball;