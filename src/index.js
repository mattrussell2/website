require('file-loader?name=[name].[ext]!./index.html');

import * as THREE from 'three';

import { FontLoader } from './three/FontLoader';
import { TextGeometry } from './three/TextGeometry';
import { Water } from './three/Water';
import { Sky } from './three/Sky';
import { Interaction } from 'three.interaction/src/index.js'; 
import { CSS3DObject, CSS3DRenderer } from './three/CSS3DRenderer.js';

const scene = new THREE.Scene();

const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

const cssScene = new THREE.Scene();
const cssScale = 10;
cssScene.scale.set( 1/cssScale, 1/cssScale, 1/cssScale);  //.1, .1, .1 );

const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 20, 100 );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize( window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = 0;
cssRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild( cssRenderer.domElement );


// for mouse interaction
const interaction = new Interaction(renderer, scene, camera);


// /*
//  * Given a depth, return the height/width of the visible area
//  * https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269
//  */
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
    return visibleHeightAtZDepth( depth, camera ) * camera.aspect;
};

const z = 30;
var w = visibleWidthAtZDepth(30, camera);
var h = visibleHeightAtZDepth(30, camera);
var ledge = -w / 2;
var textBoxWidth = w * .9;
var textBoxHeight = h * .5;

var textBox = document.createElement( 'div' );
textBox.style.width = `${ textBoxWidth * cssScale }px`;
textBox.style.maxHeight = `${textBoxHeight * cssScale}px`;
textBox.style.height = 'auto'; 
textBox.style.color = '#657b83';
textBox.style.fontSize = `${ 2 * cssScale }px`;
textBox.style.scrollbarWidth = 'thin';
textBox.style.borderRadius = '1em';
textBox.style.overflowX = 'hidden';
textBox.style.overflowY = 'auto';
textBox.style.padding = '0.25em';
textBox.style.backgroundColor = '#073642';
textBox.style.opacity = 1;

var objectCSS = new CSS3DObject( textBox );
objectCSS.position.x = 0;
objectCSS.position.y = ( h * cssScale ) / 2;
objectCSS.position.z = 30 * cssScale;
objectCSS.visible = false;
cssScene.add( objectCSS );

const waterOpts = {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load( './assets/waternormals.jpeg', tex => tex.wrapS = tex.wrapT = THREE.RepeatWrapping ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x0ffff,
    distortionScale: 7,
    fog: scene.fog !== undefined, 
}

const researchText = `I work in the Human-Computer Interaction Lab at Tufts University. We study implicit Brain-Computer interfaces. Specifically, I have developed and run human subject studies using functional near-infrared spectroscopy (fNIRS) and/or electroencephalography (EEG) to measure brain activity, and to adapt a user's interface to better help the user based on brain state. 
<br><br>
Since arriving at Tufts, I have been a part of the following papers:
<br><br>
A. Bosworth, M. Russell, and R.J.K Jacob, "fNIRS as an Input to Brain-Computer Interfaces: A Review of Research from the Tufts Human-Computer Interaction Laboratory," Photonics (2019). https://www.mdpi.com/2304-6732/6/3/90
<br><br>
T. Shibata, A. Borisenko, A. Hakone, T. August, L. Deligiannidis, C.H. Yu, M. Russell, A. Olwal, and R.J.K. Jacob, "An Implicit Dialogue Injection System for Interruption Management,” Proc. Tenth Augmented Human International Conference (2019). http://www.cs.tufts.edu/~jacob/papers/shibata.ah19.pdf
<br><br>
L. Hirshfield, D. Bergen-Cico, M. Costa, R.J.K. Jacob, S. Hincks, M. Russell, "Measuring the Neural Correlates of Mindfulness with Functional Near-Infrared Spectroscopy,"Empirical Studies of Contemplative Practices (2018). http://www.samulus.com/public/papers/NeuralCorrelatesofMindfulness.pdf`

const aboutText = `Welcome. My name is Matt Russell, and I'm a PhD candidate in computer science at Tufts University. I love coding, teaching, and learning. I'm currently working on my dissertation, which is about implicit Brain-Computer Interfaces. I'm also a teaching assistant for the computer science department, and I have taught the Data Structures course in C++.
<br><br>My hobbies include hiking, camping, rock climbing, snowboarding, chess and cooking. I'm happily married since January 2016, and have two daughers, ages 2 and 4.`

const teachingText = `I have been a teaching assistant for the computer science department at Tufts University since 2016. I have ta'd the following courses: 
<br>
<br>CS 10: Introduction to Computer Science (Python)
<br>CS 15: Data Structures (C++) [7 semesters]
<br>CS 50CP: Concurrency (Erlang, Python)
<br>CS 116: Cybersecurity 
<br>CS 175: Computer Graphics (C++) [2 semesters]
<br><br>
Additionally I taught the 2020 summer session of CS 15: Data Structures (C++) at Tufts University. I am planning to teach this course in 2023 summer as well. 
`

const pgimgs = ['python-plain.svg', 'cplusplus-original.svg', 'javascript-original.svg', 'java-original.svg',
                'bash-original.svg', 'matlab-plain.svg', 'docker-original.svg', 
                'digitalocean-original.svg', 'heroku-original.svg', 'git-original.svg', 
                'github-original.svg', 'gitlab-original.svg', 'linux-plain.svg',
                'pandas-original.svg', 'postgresql-original.svg', 'threejs-original.svg'];

const logopath = './assets/logos/';

var nameText;
var headers = [];
var plBoxes = [];

var nameSize = 7;
var headerSize = 2;
var plCubeDim = 4;

var cube;

const headerTxt = ['about', 'projects', 'teaching', 'research', 'contact', 'resume'];

window.addEventListener( 'resize', onWindowResize ); 

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    cssRenderer.setSize( window.innerWidth, window.innerHeight );
    
    w = visibleWidthAtZDepth(30, camera);
    h = visibleHeightAtZDepth(30, camera);
    nameSize = 7;
    headerSize = 2;
    plCubeDim = 4;
    ledge = -w / 2;
    textBoxWidth = w * .9;
    textBoxHeight = h * .6;

    textBox.style.width = `${textBoxWidth}px`;
    textBox.style.maxHeight = `${textBoxHeight}px`;
    objectCSS.position.set(0, h/2, 30); 

    loadImages();
    loadText();
}

function make_image_material(fname) {
    const texture = new THREE.TextureLoader().load( './assets/' + fname );
    texture.minFilter = THREE.LinearFilter;
    return new THREE.MeshBasicMaterial( { map: texture } );
}

function initCube() {
    const imgFiles = [ 'gradescope_autograder_pic.png', 'unit_test_pic.png', 'backgammon.png', 'cuda_raytracer.png' ];
    const imgMats = imgFiles.map( fname => make_image_material(fname) );
    const boxSize = (h < w ? h : w) / 3;
    cube = new THREE.Mesh(
                            new THREE.BoxGeometry( boxSize, boxSize, boxSize, 1, 1, 1 ), 
                            [ imgMats[2], imgMats[1], imgMats[3], imgMats[1], imgMats[0], imgMats[0] ]
                         );
    cube.visible = false;
    cube.cursor = 'pointer';
    //cube.on( 'touchstart', (ev) => click(ev) );
    cube.on( 'click', (ev) => click(ev) );
    function click(ev){     
        switch (ev.intersects[0].faceIndex) {
            case 0: 
            case 1: 
                window.open('https://www.github.com/mattrussell2/backgammon', '_blank');
                break;
            case 2:
            case 3:
            case 6:
            case 7:
                window.open('https://www.github.com/mattrussell2/vscode-cpp-unit-test', '_blank');
                break;
            case 4:
            case 5:
                window.open('https://www.github.com/mattrussell2/cuda_raytracer', '_blank');
                break;
            case 8:
            case 9:
            case 10:
            case 11:
                window.open('https://gitlab.cs.tufts.edu/mrussell/gradescope-autograding', '_blank');
                break;
        }
    }
    scene.add(cube);
}

/*
 * Load the programming language images
 */
function loadTexture(imgName, imgx, imgy, imgz) {
    const texture = new THREE.TextureLoader().load( logopath + imgName );
    texture.minFilter = THREE.LinearFilter;
    // texture.generateMipmaps = false;
    // texture.needsUpdate = true;
    const cube = new THREE.Mesh(
                                new THREE.BoxGeometry( plCubeDim, plCubeDim, 0 ),
                                new THREE.MeshBasicMaterial( { map: texture, transparent:true } )
                               );
    cube.position.set( imgx, imgy, imgz );
    scene.add( cube );
    plBoxes.push( cube );
}

function loadImages() {
    plBoxes.forEach( plBox => scene.remove( plBox ) );
    plBoxes = [];
    
    const imgy = 2;
    const imgz = 50;
    const imgw = visibleWidthAtZDepth( imgz, camera );
    const wDelta = imgw / pgimgs.length;
    while ( wDelta <= plCubeDim * .95 ) {
        plCubeDim *= .95;
    }

    pgimgs.forEach( (imgName, i) => loadTexture( imgName, -imgw / 2.0 + wDelta / 2.0 + wDelta * i, imgy, imgz ) );
}

var currVis; 

function initHeader(box, i) {
    // box.on( 'touchstart', (ev) => {
    //     console.log("TOUCHSTART"); 
    //     //clickHeader(ev, i)
    // });

    // box.on( 'touchend', (ev) => {
    //     console.log("TOUCHEND"); 
    //    // clickHeader(ev, i)
    // });
    // box.on( 'mousedown', (ev) => {
    //     console.log("MOUSEDOWN"); 
    //     //clickHeader(ev, i)
    // });

    // box.on( 'pointerdown', (ev) => {
    //     console.log("POINTERDOWN"); 
    //     clickHeader(ev, i)
    // });


    box.on( 'click', (ev) => {
        console.log("CLICK");   
        clickHeader(ev, i) 
    });
        
    function clickHeader(ev, i) {
        objectCSS.visible = false;
        cube.visible = false;
        let obj = null;
        switch ( headerTxt[i] ) {
            case 'about':
                textBox.innerHTML = aboutText;
                objectCSS.visible = true;
                obj = objectCSS;
                break;
            case 'projects':                
                const yCurr = nameText.position.y + nameText.geometry.boundingBox.max.y;
                const d = h - yCurr - 15;
                cube.position.set(0, yCurr + d/3, 30);
                cube.scale.set(1, 1, 1); 
                cube.rotation.y = THREE.MathUtils.degToRad(55);
                cube.rotation.z = THREE.MathUtils.degToRad(45);
                cube.visible = true;
                obj = cube;
                break;
            case 'teaching':
                textBox.innerHTML = teachingText;
                objectCSS.visible = true;
                obj = objectCSS;
                break;
            case 'research':
                textBox.innerHTML = researchText;
                objectCSS.visible = true;
                obj = objectCSS;
                break;
            case 'contact':
                const mail = document.createElement("a");
                mail.href = "mailto:mrussell@cs.tufts.edu";
                mail.click();
                break;
            case 'resume':
                window.open('./assets/resume.pdf', '_blank');
                break;
        }
        if ( currVis === headerTxt[i] && obj !== null) {
            obj.visible = false;
            currVis = null;
        } else {
            currVis = headerTxt[i];
        }
    }
}

function createHeader() {
    for (let header of headers) {
        for (let obj of header) {
            scene.remove( obj );
        }
    }
    headers.length = 0;

    const headerOpts = waterOpts;
    headerOpts.waterColor = 0x0000ff;
    for (let [i, header] of headerTxt.entries()) {
        let textGeo = new TextGeometry( header, 
                                    {
                                        font: fnt,
                                        size: headerSize,
                                        height: 0.5,
                                        curveSegments: 12
                                    });
        textGeo.computeBoundingBox();
        let text = new Water( textGeo, waterOpts );
        text.cursor = 'pointer';
        text.minFilter = THREE.LinearFilter; //new
        
        scene.add( text ); 

        const box = new THREE.Mesh(new THREE.BoxGeometry( textGeo.boundingBox.max.x, textGeo.boundingBox.max.y*2, 10 ), 
                                   new THREE.MeshBasicMaterial( { color: 0x000000, transparent:false, opacity:0 } ));
        box.cursor = 'pointer';
        
        initHeader( box, i );
        
        scene.add( box );

        headers.push( [ text, box ] );
    }
    let headerSpace = headers.reduce( (acc, [text, box]) => acc - text.geometry.boundingBox.max.x, w );
    let headerDelta = headerSpace / headerTxt.length;
    let pos = new THREE.Vector3;
    
    pos.x = ledge + headerDelta / 2;
    pos.y = 1;
    pos.z = 30;
    for (let [text, box] of headers) {
        text.position.set( pos.x, pos.y, pos.z );
        box.position.set( pos.x + text.geometry.boundingBox.max.x / 2.0, pos.y + text.geometry.boundingBox.max.y / 2.0, pos.z + 1.5 ); 
        pos.x += headerDelta + text.geometry.boundingBox.max.x;
    }
    if (headerSpace <= 10) {
        headerSize *= .95;
        createHeader();
    }
}

function createName() {
    if (nameText !== undefined) scene.remove(nameText);
    let textGeo = new TextGeometry(
                                    'matt russell', 
                                    {
                                        font: fnt,
                                        size: nameSize,
                                        height: 1,
                                        curveSegments: 12
                                    }
                                );
    textGeo.computeBoundingBox();
    nameText = new Water( textGeo, waterOpts );
    nameText.position.set( ledge + 2, 5, z );
    scene.add( nameText );
    if (nameText.geometry.boundingBox.max.x >= w * .33) {
        nameSize *= .8;
        createName();
    }
}

var fnt;
function loadText() {
    const loader = new FontLoader();
    loader.load( './assets/helvetiker_regular.typeface.json', function ( f ) {
        fnt = f;
        createName();
        createHeader(); 
    });
}

initCube();
console.log("cube initialized");
loadImages();
console.log("pl images loaded");
loadText();
console.log("text loaded");

/*
 * Sun and Sky
 * https://threejs.org/examples/?q=water#webgl_shaders_ocean
 */
const water = new Water( 
                            new THREE.PlaneGeometry( 10000, 10000 ), 
                            waterOpts 
                       );
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
    elevation: 0,
    azimuth: 225
};

// let m_e = -50;
//let m_a = 225;



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

var sunDir = 'up';
// midnight - a: 0, h; -64
// 2 AM     - a: 
function animate() {
    requestAnimationFrame( animate );

    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

    sunParams.azimuth -= 1.0 / 100;
    if (sunParams.azimuth <= -350) {
        sunParams.azimuth = 0;
    }
    if (sunParams.elevation >= 8) {
        sunDir = 'down';
    }else if (sunParams.elevation <= -12) {
        sunDir = 'up';
        sunParams.elevation = -10;
        sunParams.azimuth = 275;
    }
    if (sunDir == 'up') {
        sunParams.elevation += 1.0 / 500; 
    } else {
        sunParams.elevation -= 1.0 / 500; 
    }
    updateSun();

    if (nameText !== undefined) {
        nameText.material.uniforms[ 'time' ].value += 1.0 / 360.0;
    }
    for (let header of headers) {
        header[0].material.uniforms[ 'time' ].value += 1.0 / 360.0;
    }
    if (cube !== undefined) {
        cube.rotation.y += 1/100;
    }
    renderer.render( scene, camera );
    cssRenderer.render( cssScene, camera );
};

animate();
