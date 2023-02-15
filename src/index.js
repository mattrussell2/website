require('file-loader?name=[name].[ext]!./index.html');
import * as THREE from 'three';

import { FontLoader } from './three/FontLoader';
import { TextGeometry } from './three/TextGeometry';
import { Water } from './three/Water';
import { Sky } from './three/Sky';

import { SVGLoader } from './three/SVGLoader.js';
import { Interaction } from 'three.interaction/src/index.js'; 

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );

const CAMX = 0;
const CAMY = 20; 
const CAMZ = 100;
camera.position.set( CAMX, CAMY, CAMZ );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const interaction = new Interaction(renderer, scene, camera);

var nameText;
var headers = [];
var plBoxes = [];

var nameSize = 7;
var headerSize = 2;
var plCubeDim = 4;

window.addEventListener( 'resize', onWindowResize ); 
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    nameSize = 7;
    headerSize = 2;
    plCubeDim = 4;
    loadImages();
    loadText();
}

/*
 * Given a depth, return the height/width of the visible area
 * https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269
 */
const visibleHeightAtZDepth = ( depth, camera ) => {
    // compensate for cameras not positioned at z=0
    const cameraOffset = camera.position.z;
    if ( depth < cameraOffset ) depth -= cameraOffset;
    else depth += cameraOffset;
  
    // vertical fov in radians
    const vFOV = camera.fov * Math.PI / 180; 
  
    // Math.abs to ensure the result is always positive
    return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
};
  
const visibleWidthAtZDepth = ( depth, camera ) => {
    const height = visibleHeightAtZDepth( depth, camera );
    return height * camera.aspect;
};

/*
 * Load the programming language images
 */
const logopath = '../static/logos/';
function loadTexture(imgName, imgx, imgy, imgz) {
    const texture = new THREE.TextureLoader().load(logopath + imgName);
    const cube = new THREE.Mesh(new THREE.BoxGeometry(plCubeDim, plCubeDim, 0),
                                new THREE.MeshBasicMaterial( { map: texture, transparent:true }));
    cube.position.set(imgx, imgy, imgz);
    scene.add(cube);
    plBoxes.push(cube);
}

function loadImages() {
    for (let plBox of plBoxes) {
        scene.remove(plBox);
    }
    plBoxes = [];

    let pgimgs = ['python-plain.svg', 'cplusplus-original.svg', 'javascript-original.svg', 'java-original.svg',
                  'bash-original.svg', 'matlab-plain.svg', 'docker-original.svg', 
                  'digitalocean-original.svg', 'heroku-original.svg',
                  'git-original.svg', 'github-original.svg', 'gitlab-original.svg', 
                  'linux-plain.svg', 
                  'pandas-original.svg', 'postgresql-original.svg', 'threejs-original.svg'];
    let imgz = 50;

    const w = visibleWidthAtZDepth(imgz, camera);
    const wDelta = w / pgimgs.length;
    if (wDelta <= plCubeDim*.95) {
        plCubeDim *= .85;
        loadImages();
        return;
    }

    const ledge = -(w / 2) + wDelta / 2.0;
    let imgx = ledge;
    let imgy = 2;
    
    for (let imgName of pgimgs) {
        loadTexture(imgName, imgx, imgy, imgz);
        imgx += wDelta;
    }
}

const waterOpts = {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load( '../static/waternormals.jpeg', function ( texture ) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x0ffff,
    distortionScale: 7,
    fog: scene.fog !== undefined, 
}

function loadText() {
    const loader = new FontLoader();
    loader.load( '../static/helvetiker_regular.typeface.json', function ( font ) {
        if (nameText !== undefined) {
            scene.remove(nameText);
        }

        let textGeo = new TextGeometry('matt russell', 
                                        {
                                            font: font,
                                            size: nameSize,
                                            height: 1,
                                            curveSegments: 12
                                        });
        textGeo.computeBoundingBox();
        const z = 30;
        const w = visibleWidthAtZDepth(z, camera);
        const ledge = -(w / 2);
        nameText = new Water(textGeo, waterOpts);
        nameText.position.set(ledge + 2, 5, z);
        scene.add(nameText); 
        if (textGeo.boundingBox.max.x >= w*.4) {
            nameSize *= .8;
            loadText();
            return;
        }
        
        for (let header of headers) {
            for (let h of header) {
                scene.remove(h);
            }
        }
        headers = [];
        const y = 1;
        let headerSpace = w;
        const headerTxt = ['about', 'projects', 'teaching', 'research', 'contact', 'resume'];
        for (let header of headerTxt) {
            textGeo = new TextGeometry( header, 
                                        {
                                            font: font,
                                            size: headerSize,
                                            height: 1,
                                            curveSegments: 12
                                        });
            textGeo.computeBoundingBox();
            const headerOpts = waterOpts;
            headerOpts.waterColor = 0x0000ff;
            let text = new Water(textGeo, waterOpts);
            scene.add(text); 
            text.cursor = 'pointer';
            // text.on('click', function(ev) {console.log("yeeeeeeeeet")});  
            headers.push([text]);
            console.log(headers);
            headerSpace -= textGeo.boundingBox.max.x;
        }
        let headerDelta = headerSpace / headerTxt.length;
        let x = ledge + headerDelta / 2;
        for (let header of headers) {
            header[0].position.set(x, y, z);
            // add a transparent bounding box for each header
            const box = new THREE.Mesh(new THREE.BoxGeometry(header[0].geometry.boundingBox.max.x, header[0].geometry.boundingBox.max.y, 0), 
                                       new THREE.MeshBasicMaterial( { color: 0x000000, transparent:true, opacity:0.0 } ));
            box.position.set(x + header[0].geometry.boundingBox.max.x / 2, y+1, z+1.5);
            box.cursor = 'pointer'
            box.on('click', function(ev) {console.log("yeeeeeeeeet")});
            scene.add(box);
            header.push(box);
            x += headerDelta + header[0].geometry.boundingBox.max.x;
        }
        if (headerSpace <= 5) {
            headerSize /= 2;
            loadText();
            return;
        }
    });
}

loadImages();
loadText();

/*
 * Sun and Sky
 * https://threejs.org/examples/?q=water#webgl_shaders_ocean
 */
const water = new Water(new THREE.PlaneGeometry( 10000, 10000 ), waterOpts);
water.rotation.x = - Math.PI / 2;
scene.add( water );

const sun = new THREE.Vector3();
const sky = new Sky();
sky.scale.setScalar( 10000 );
scene.add( sky );

const skyUniforms = sky.material.uniforms;

skyUniforms[ 'turbidity' ].value = 10;
skyUniforms[ 'rayleigh' ].value = 2;
skyUniforms[ 'mieCoefficient' ].value = 0.001;
skyUniforms[ 'mieDirectionalG' ].value = 0.75;

var sunParams = {
    elevation: 0.50,
    azimuth: 180
};

const pmremGenerator = new THREE.PMREMGenerator( renderer );
let renderTarget;
function updateSun() {
    const phi = THREE.MathUtils.degToRad( 90 - sunParams.elevation );
    const theta = THREE.MathUtils.degToRad( sunParams.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
    water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

    if ( renderTarget !== undefined ) renderTarget.dispose();

    renderTarget = pmremGenerator.fromScene( sky );
    scene.environment = renderTarget.texture;
}

// // add light to scene illuminating the text above the water
// const light = new THREE.DirectionalLight( 0xffffff, 1 );
// light.position.set( 0, 0, -1 );
// scene.add( light );


function animate() {
    requestAnimationFrame( animate );

    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    sunParams.elevation += 1.0 / 5000.0;
    updateSun();

    if (nameText !== undefined) {
        nameText.material.uniforms['time'].value += 1.0 / 360.0;
    }
    for (let header of headers) {
        header[0].material.uniforms['time'].value += 1.0 / 360.0;
    }

    renderer.render( scene, camera );
};

animate();