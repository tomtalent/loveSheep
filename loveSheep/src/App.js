import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Sheep from './canvas/sheep.js';
import Ball from './canvas/ball.js';
import Back from './canvas/background.js'
import Light from './canvas/light.js'
import colors from './canvas/colors.js'



const TRAY = document.getElementById('js-tray-slide');

class App extends Component {
  
  componentDidMount() {        
    let scene,
    camera,
    controls,
    renderer,      
    mouseDown,     
    vAngle = 0;

    let activeOption = 'face';
    let directionOpt = 'right';
    let rotationSpeed = 30;
    let directionFlag = true;
    let sheepOriginalPos = 0;
    let rotate = 1;
    

    let background = new Back();
    let light = new Light();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcce0ff);
    scene.fog = new THREE.Fog(0xcce0ff, 500, 10000);

    Sheep.scale.set(0.3, 0.3, 0.3)
    scene.add(Sheep);
    scene.add(Ball);
    scene.add(background);
    scene.add(light);
    scene.add(colors)
    
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, -10, 9);
         
    this.mount.addEventListener('mousedown', onMouseDownEvent);
    this.mount.addEventListener('mouseup', onMouseUp);
    this.mount.addEventListener('touchstart', onTouchStart);
    this.mount.addEventListener('touchend', onTouchEnd);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );

    this.mount.appendChild(renderer.domElement);

    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    // controls.enableZoom = false;
    controls.minDistance = 6;
    controls.maxDistance = 20;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.maxAzimuthAngle = Math.PI /8;
    controls.minAzimuthAngle = -Math.PI /8;
    controls.autoRotateSpeed = 0.2;

 
    function onMouseDownEvent(event) {
      mouseDown = true;      
    }
    
    function onTouchStart(event) {
      const targetClass = event.target.classList[0];
      if (targetClass === 'toggle' || targetClass === 'toggle-music') return;
      event.preventDefault();
      mouseDown = true;
    }

    function onMouseUp() {
      mouseDown = false;     
    }
    function onTouchEnd(event) {
      const targetClass = event.target.classList[0];
      if (targetClass === 'toggle' || targetClass === 'toggle-music') return;
      event.preventDefault();
      mouseDown = false;
    }

    let {children} = Sheep
    
    function jump(speed) {
      vAngle += speed/4;
      Sheep.position.y = Math.sin(vAngle) +0.1 ;
      const legRotation = Math.sin(vAngle) * Math.PI / 6 + 0.4;
  
      children[2].rotation.z = legRotation;
      children[4].rotation.z = legRotation;
      children[3].rotation.z = -legRotation;
      children[5].rotation.z = -legRotation;
  
      const earRotation = Math.sin(vAngle) * Math.PI / 3 + 1.5;      

      Sheep.children[1].children[5].rotation.z = earRotation;
      Sheep.children[1].children[6].rotation.z = -earRotation;
    }
    function jumpOnMouseDown() {
      if (mouseDown) {
        jump(0.05);
      } else {
        if (Sheep.position.y <= -0.899) return;
        jump(0.08);
      }
    }    
    function bend() {
      vAngle += 0.08;
      
      Ball.children[0].position.y = -Math.cos(vAngle) * 0.12;
      Ball.children[1].position.y = -Math.cos(vAngle) * 0.1 - 0.3;
      Ball.children[2].position.y = -Math.cos(vAngle) * 0.1 - 0.3;
      Ball.children[3].position.y = -Math.cos(vAngle) * 0.08 - 0.3;
      Ball.children[4].position.y = -Math.cos(vAngle) * 0.08 - 0.3;
    }

    // Function - Build Colors

    function buildColors(colors) {
      for (let [i, color] of colors.entries()) {
        let swatch = document.createElement('div');
        swatch.classList.add('tray__swatch');
    
        if (color.texture)
        {
          swatch.style.backgroundImage = "url(" + color.texture + ")";
        } else
        {
          swatch.style.background = "#" + color.color;
        }
    
        swatch.setAttribute('data-key', i);
        TRAY.append(swatch);
      }
    }
    
    buildColors(colors);

    // Select Option

    const options = document.querySelectorAll(".option");

    for (const option of options) {
      option.addEventListener('click', selectOption);
    }

    function selectOption(e) {
      let option = e.target;
      activeOption = e.target.dataset.option;
      for (const otherOption of options) {
        otherOption.classList.remove('--is-active');
      }
      option.classList.add('--is-active');
    }
    // Swatches
    const swatches = document.querySelectorAll(".tray__swatch");

    for (const swatch of swatches) {
      swatch.addEventListener('click', selectSwatch);
    }

    function selectSwatch(e) {
      let color = colors[parseInt(e.target.dataset.key)];
      let new_mtl;

      if (color.texture) {

        let txt = new THREE.TextureLoader().load(color.texture);

        txt.repeat.set(color.size[0], color.size[1], color.size[2]);
        txt.wrapS = THREE.RepeatWrapping;
        txt.wrapT = THREE.RepeatWrapping;

        new_mtl = new THREE.MeshPhongMaterial({
          map: txt,
          shininess: color.shininess ? color.shininess : 10 });
      } else {
        new_mtl = new THREE.MeshPhongMaterial({
          color: parseInt('0x' + color.color),
          shininess: color.shininess ? color.shininess : 10 });
      }

      if(activeOption === 'face'){
        setMaterial(Sheep.children[1].children[0], new_mtl);
        setMaterial(Sheep.children[1].children[1], new_mtl);
      } else if(activeOption === 'eye'){
        setMaterial(Sheep.children[1].children[3], new_mtl);
        setMaterial(Sheep.children[1].children[4], new_mtl);
      } else if(activeOption === 'ear'){
        setMaterial(Sheep.children[1].children[5], new_mtl);
        setMaterial(Sheep.children[1].children[6], new_mtl);
      } else if(activeOption === 'cat'){
        setMaterial(Sheep.children[1].children[2], new_mtl);
      } else if(activeOption === 'body'){
        setMaterial(Sheep.children[0], new_mtl);
      } else if(activeOption === 'legs'){
        setMaterial(Sheep.children[2], new_mtl);
        setMaterial(Sheep.children[3], new_mtl);
        setMaterial(Sheep.children[4], new_mtl);
        setMaterial(Sheep.children[5], new_mtl);
      } else {
        setMaterial(Ball, new_mtl);
      }
    }

    function setMaterial(parent, mtl) {
      parent.traverse(o => {
        if (o.isMesh) {         
            o.material = mtl;                     
        }
      });
    }    

    // direction control
    const direction = document.querySelectorAll('.container')
    for (const container of direction) {
      container.addEventListener('click', selectDirection);
    }

    function selectDirection(e) {
      directionOpt = e.target.dataset.option;

      sheepOriginalPos = Sheep.rotation.y;
      if(directionOpt ===  'right'){
          directionFlag = true;
          rotate = 0;        
      } else if(directionOpt ===  'left'){
        directionFlag = false;
        rotate = 0;
      } 
    }

    var rotspeed = document.getElementById('rotSpeed')
    rotspeed.addEventListener('input',selectSpeed )
    function selectSpeed(e){
      rotationSpeed = e.target.value;
    }
    // var rotspeed = false;
    console.log('r')

//color slider
    var slider = document.getElementById('js-tray'),sliderItems = document.getElementById('js-tray-slide'),difference;

    function slide(wrapper, items) {
      var posX1 = 0,
      posX2 = 0,
      posInitial,
      threshold = 20,
      posFinal,
      slides = items.getElementsByClassName('tray__swatch');
    
      // Mouse events
      items.onmousedown = dragStart;
    
      // Touch events
      items.addEventListener('touchstart', dragStart);
      items.addEventListener('touchend', dragEnd);
      items.addEventListener('touchmove', dragAction);
    
    
      function dragStart(e) {
        e = e || window.event;
        posInitial = items.offsetLeft;
        difference = sliderItems.offsetWidth - slider.offsetWidth;
        difference = difference * -1;
    
        if (e.type === 'touchstart') {
          posX1 = e.touches[0].clientX;
        } else {
          posX1 = e.clientX;
          document.onmouseup = dragEnd;
          document.onmousemove = dragAction;
        }
      }
    
      function dragAction(e) {
        e = e || window.event;
    
        if (e.type === 'touchmove') {
          posX2 = posX1 - e.touches[0].clientX;
          posX1 = e.touches[0].clientX;
        } else {
          posX2 = posX1 - e.clientX;
          posX1 = e.clientX;
        }
    
        if (items.offsetLeft - posX2 <= 0 && items.offsetLeft - posX2 >= difference) {
          items.style.left = items.offsetLeft - posX2 + "px";
        }
      }
    
      function dragEnd(e) {
        posFinal = items.offsetLeft;
        if (posFinal - posInitial < -threshold) {
    
        } else if (posFinal - posInitial > threshold) {
    
        } else {
          items.style.left = posInitial + "px";
        }
    
        document.onmouseup = null;
        document.onmousemove = null;
      }
    
    }
    
    slide(slider, sliderItems);

    function onWindowResize( event ) {
      renderer.setSize( window.innerWidth, window.innerHeight );
      background.children[0].material.uniforms.u_resolution.value.x = renderer.domElement.width;
      background.children[0].material.uniforms.u_resolution.value.y = renderer.domElement.height;
    }
    console.log(background.children[0].material.uniforms)
    function animate(delta) {
      requestAnimationFrame(animate);
      controls.update();
      rotate += 100;
      render(delta, rotate);
    }

    function render(delta, rotate) {
      jumpOnMouseDown();
      if (Sheep.position.y > -0.889) bend();
      background.children[0].material.uniforms.u_time.value = -10000 + delta * 0.0005 ;
    
      if(directionFlag) {        
        Sheep.rotation.y = sheepOriginalPos + rotationSpeed * -rotate * 0.000005 ;
        Ball.rotation.y = sheepOriginalPos + rotationSpeed * -rotate * 0.000005 ;
      }
      else {
        Sheep.rotation.y = sheepOriginalPos + rotationSpeed * rotate * 0.000005 ;
        Ball.rotation.y = sheepOriginalPos + rotationSpeed * rotate * 0.000005 ;
      }
      renderer.render(scene, camera);
    }

    animate();
  
  }

  render() {
    return (
      <div>
        <div
          ref={mount => {
            this.mount = mount;
          }}
        />
      </div>      
    );
  }
}
export default App;