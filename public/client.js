import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/PointerLockControls.js';
import { Reflector } from 'https://unpkg.com/three@0.126.1/examples/jsm/objects/Reflector.js';
// import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js';
// import { GUI } from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/dat.gui.module.js';

let camera, scene, renderer, controls;
let floorMirror, wallMirror, wallMirror1, wallMirror2, wallMirror3;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.x = -123;
  camera.position.y = 10;
  camera.position.z = -92;
  // x: -105.08839272102608
  // y: 9.999999999999998
  // z: -160.1867946978109

  const listener = new THREE.AudioListener();
  camera.add(listener);

  // create a global audio source
  const sound = new THREE.Audio(listener);

  // load a sound and set it as the Audio object's buffer
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load('chill-5061.mp3', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
  });

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.Fog(0xffffff, 0, 750);

  controls = new PointerLockControls(camera, document.body);

  const blocker = document.getElementById('blocker');
  const instructions = document.getElementById('instructions');

  instructions.addEventListener('click', function () {
    controls.lock();
  });

  controls.addEventListener('lock', function () {
    instructions.style.display = 'none';
    blocker.style.display = 'none';
  });

  controls.addEventListener('unlock', function () {
    blocker.style.display = 'block';
    instructions.style.display = '';
  });

  scene.add(controls.getObject());

  const onKeyDown = function (event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = true;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = true;
        break;
    }
  };

  const onKeyUp = function (event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = false;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = false;
        break;
    }
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  // // sky

  // let skyGeometry = new THREE.SphereGeometry(250, 32, 32);
  // const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  // const sky = new THREE.Mesh(skyGeometry, skyMaterial);
  // sky.material.side = THREE.BackSide;
  // // camera.position.x = -123;
  // // camera.position.y = 10;
  // // camera.position.z = -92;
  // sky.position.x = -123;
  // sky.position.y = 10;
  // sky.position.z = -92;
  // scene.add(sky);

  // floor

  const floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
  floorMirror = new Reflector(floorGeometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x777777,
  });
  floorMirror.position.y = 0.5;
  // positions plane horizontally
  floorMirror.rotateX(-Math.PI / 2);
  scene.add(floorMirror);

  // walls

  // wall 0
  const wallGeometry = new THREE.PlaneGeometry(250, 250);
  wallMirror = new Reflector(wallGeometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x889999,
  });
  wallMirror.position.x = -100;
  wallMirror.position.y = 50;
  wallMirror.position.z = -10;
  scene.add(wallMirror);

  // wall 1
  const wallGeometry1 = new THREE.PlaneGeometry(250, 250);
  wallMirror1 = new Reflector(wallGeometry1, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x889999,
  });
  wallMirror1.position.x = -100;
  wallMirror1.position.y = 50;
  wallMirror1.position.z = -210;
  scene.add(wallMirror1);

  // wall 2
  const wallGeometry2 = new THREE.PlaneGeometry(250, 250);
  wallMirror2 = new Reflector(wallGeometry2, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x889999,
  });
  wallMirror2.position.y = 10;
  wallMirror2.position.z = 50;
  wallMirror2.position.z = -90;
  wallMirror2.rotateY(Math.PI / 2);
  scene.add(wallMirror2);

  // wall 3
  const wallGeometry3 = new THREE.PlaneGeometry(250, 250);
  wallMirror3 = new Reflector(wallGeometry3, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x889999,
  });
  wallMirror3.position.x = -210;
  wallMirror3.position.y = 50;
  wallMirror3.position.z = -90;
  wallMirror3.rotateY(Math.PI / 2);
  scene.add(wallMirror3);

  // lanterns

  const lanternGeometry = new THREE.CylinderGeometry(
    3.1,
    4.8,
    10,
    64,
    1,
    false,
    0,
    6.3
  );

  const lanterns = [];

  for (let i = 0; i < 600; i++) {
    const lanternMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
    });
    lanternMaterial.color.setHSL(
      Math.random() * 0.2 + 0.75,
      0.75,
      Math.random() * 0.25 + 0.5
    );

    const lantern = new THREE.Mesh(lanternGeometry, lanternMaterial);
    lantern.position.x = Math.floor(Math.random() * 10 - 10) * 20;
    lantern.position.y = Math.floor(Math.random() * 10) * 20 + 10;
    lantern.position.z = Math.floor(Math.random() * 10 - 10) * 20;
    // console.log(lantern.position.x, lantern.position.y, lantern.position.z);

    lantern.scale.set(0.5, 0.5, 0.5);

    lanterns.push(lantern);

    scene.add(lantern);
  }
  // console.log('lanterns', lanterns);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //

  addEventListener('keydown', function (event) {
    // blue
    if (event.keyCode == 66)
      for (let i = 0; i < lanterns.length; i++) {
        lanterns[i].material.color.setHSL(
          Math.random() * 0.2 + 0.5,
          0.75,
          Math.random() * 0.25 + 0.5
        );
      }
  });

  addEventListener('keydown', function (event) {
    // purple
    if (event.keyCode == 80)
      for (let i = 0; i < lanterns.length; i++) {
        lanterns[i].material.color.setHSL(
          Math.random() * 0.2 + 0.75,
          0.75,
          Math.random() * 0.25 + 0.55
        );
      }
  });
  addEventListener('keydown', function (event) {
    // green
    if (event.keyCode == 71)
      for (let i = 0; i < lanterns.length; i++) {
        lanterns[i].material.color.setHSL(
          // Math.random() * 0.2 + 0.25,
          // 0.75,
          // Math.random() * 0.25 + 0.5
          Math.random() * 0.2 + 0.25,
          0.75,
          Math.random() * 0.25 + 0.35
        );
      }
  });
  addEventListener('keydown', function (event) {
    // red
    if (event.keyCode == 82)
      for (let i = 0; i < lanterns.length; i++) {
        lanterns[i].material.color.setHSL(
          Math.random() * 0.2 + 0.95,
          0.75,
          Math.random() * 0.25 + 0.45
        );
      }
  });

  //

  window.addEventListener('resize', onWindowResize);
}

// const loader = new GLTFLoader();
// loader.load( 'path/to/model.glb', function ( gltf ) {
// 	scene.add( gltf.scene );
// }, undefined, function ( error ) {
// 	console.error( error );
// } );

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  floorMirror
    .getRenderTarget()
    .setSize(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio
    );

  wallMirror
    .getRenderTarget()
    .setSize(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio
    );

  wallMirror1
    .getRenderTarget()
    .setSize(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio
    );

  wallMirror2
    .getRenderTarget()
    .setSize(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio
    );

  wallMirror3
    .getRenderTarget()
    .setSize(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio
    );
}

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();

  if (controls.isLocked === true) {
    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
  }

  prevTime = time;

  render();
}

function render() {
  renderer.render(scene, camera);
}
