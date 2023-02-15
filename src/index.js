require('file-loader?name=[name].[ext]!./index.html');
import * as THREE from 'three';

import {FontLoader} from './three/FontLoader';
import {TextGeometry} from './three/TextGeometry';

import {Water} from './three/Water';
import {Sky} from './three/Sky';

import { SVGLoader } from './three/SVGLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 30, 30, 100 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

const logopath = '../static/logos/';

async function loadTexture(imgName, pos, scale) {
    const texture = new THREE.TextureLoader().load(logopath + imgName);
    const cube = new THREE.Mesh(new THREE.BoxGeometry(7,7,0),
                                new THREE.MeshBasicMaterial( { map: texture, transparent:true }));
    cube.position.set(pos);
    // cube.position.y = 5;
    // cube.position.z = imgx > 90 ? 60 : 50;   
    cube.scale.set(scale, scale, scale);
    scene.add( cube );
}

async function loadImages() {
    
    let imgx = -28;
    let imgy = 5;
    let imgz = 50;
    let scale = 1;
    // 'flask-original.svg', 'linux-plain.svg', 
    let pgimgs = ['python-plain.svg','cplusplus-original.svg', 'javascript-original.svg', 
                  'java-original.svg', 'matlab-plain.svg', 
                  'bash-original.svg',  'docker-original.svg', 
                  'digitalocean-original.svg', 'heroku-original.svg',
                  'pandas-original.svg', 'postgresql-original.svg', 'threejs-original.svg',
                  'git-original.svg' //, 'github-original.svg', 'gitlab-original.svg',                    
                  ];
    for (let imgName of pgimgs) {
        if (imgx > 90) {
            imgx = -28;            
            imgz += 10;
            scale = 0.75;
        }
        await loadTexture(imgName, new THREE.Vector3(imgx, imgy, imgz), scale);
        imgx += 10;
        
    }
}
await loadImages();

const waterOpts = {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load( '../static/waternormals.jpeg', function ( texture ) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    } ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x0ffff,
    distortionScale: 7,
    fog: scene.fog !== undefined, 
}

const loader = new FontLoader();
let waterText;
loader.load( '../static/helvetiker_regular.typeface.json', function ( font ) {
    console.log(font);
    const textGeo = new TextGeometry( 'matt russell', 
                                {
                                    font: font,
                                    size: 12,
                                    height: 2,
                                    curveSegments: 12
                                });
    textGeo.computeBoundingBox();    
    const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    console.log(window.innerWidth);
    waterText = new Water(textGeo, waterOpts);
    console.log(centerOffset);
    waterText.position.set(centerOffset, 1.5, 5);
    scene.add(waterText);       
});


//https://threejs.org/examples/?q=water#webgl_shaders_ocean
const water = new Water(new THREE.PlaneGeometry( 1000, 1000 ), waterOpts);
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

updateSun();


function animate() {
    requestAnimationFrame( animate );

    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    if (waterText !== undefined) {
        waterText.material.uniforms['time'].value += 1.0 / 360.0;
    }
    //sunParams.elevation += 1.0 / 5000.0;
    //updateSun();

    renderer.render( scene, camera );
};

animate();