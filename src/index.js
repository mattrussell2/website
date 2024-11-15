require('file-loader?name=[name].[ext]!./index.html');

import * as THREE from 'three';

import { FontLoader } from './three/FontLoader';
import { TextGeometry } from './three/TextGeometry';
import { Water } from './three/Water';
// import { Sky } from './three/Sky';
import { Interaction } from 'three.interaction/src/index.js'; 
import { CSS3DObject, CSS3DRenderer } from './three/CSS3DRenderer.js';
import { OrbitControls } from './three/OrbitControls.js';
import { UnderwaterTransition } from './underwaterTransition.js';
import { SkyTransition } from './skyTransition.js';
import { EffectComposer } from './three/EffectComposer.js';
import { TWEEN } from './three/tween.module.min';
import { StarField } from './StarField';

THREE.ColorManagement.enabled = false;

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

const isMobile = window.mobileCheck();
const isDesktop = !isMobile; 

// Add this right after mobileCheck and before any other code
if (isMobile) {
    window.location.replace('https://mrussell.me/mobile/index.html');
}

const eye_fixed_x = 0; 
const eye_fixed_y = 10;
const eye_fixed_z = 100; // isDesktop ? 100 : 75; 

const eye_world_x = 0;
const eye_world_y = 10;
const eye_world_z = isDesktop ? 115 : 100;

const scene = new THREE.Scene();
const cssScene = new THREE.Scene();
cssScene.scale.set(0.1, 0.1, 0.1);

const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( eye_fixed_x, eye_fixed_y, eye_fixed_z );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
document.body.appendChild( renderer.domElement );

const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
cssRenderer.domElement.style.left = '0';
cssRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(cssRenderer.domElement);

const composer = new EffectComposer( renderer );
const controls = new OrbitControls( camera, renderer.domElement );
const interaction = new Interaction(renderer, scene, camera); // mouse interaction

const underwaterTransition = new UnderwaterTransition(scene, camera, renderer, composer);
scene.add( underwaterTransition.underwaterScene );

const skyTransition = new SkyTransition(scene, camera, renderer, controls);

const starField = new StarField(scene);

/*
 * Given a depth, return the height/width of the visible area
 * https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269
 */
const visibleHeightAtZDepth = ( depth, camera ) => {
    const cameraOffset = eye_fixed_z;
    if ( depth < cameraOffset ) depth -= cameraOffset;
    else depth += cameraOffset;
  
    // vertical fov (radians)
    const vFOV = camera.fov * Math.PI / 180; 
  
    return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
};
  
const visibleWidthAtZDepth = ( depth, camera ) => {
    return visibleHeightAtZDepth( depth, camera ) * camera.aspect;
};

const z_depth = 50;
var w = visibleWidthAtZDepth(z_depth, camera);
var h = visibleHeightAtZDepth(z_depth, camera);
var ledge = -w / 2;

var textBox = document.createElement( 'div' );
textBox.style.width = 'auto';
textBox.style.height = 'auto';
textBox.style.backgroundColor = 'rgba(256, 256, 0, 100)'; //'rgba(0, 194, 186, 0.8)';
textBox.style.color = '#000000';
textBox.style.padding = '20px';
textBox.style.borderRadius = '10px';
textBox.style.overflow = 'auto';
textBox.style.fontSize = '16px';
textBox.style.display = 'flex';
textBox.style.alignItems = 'center';
textBox.style.justifyContent = 'center';
textBox.style.transform = 'translate(-50%, -50%)';

var objectCSS = new CSS3DObject( textBox );
objectCSS.visible = false;
cssScene.add( objectCSS );

const waterOpts = {
    textureWidth: isDesktop ? 512 : 128,
    textureHeight: isDesktop ? 512 : 128,
    waterNormals: new THREE.TextureLoader().load( './assets/waternormals.jpeg', tex => tex.wrapS = tex.wrapT = THREE.RepeatWrapping ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x0fffff,
    distortionScale: 7,
    fog: scene.fog !== undefined, 
    shininess: 100,
}

const researchText = `I work in the Human-Computer Interaction Lab at Tufts University. We study implicit Brain-Computer interface design and implementation. Specifically, we run human subject studies using functional near-infrared spectroscopy (fNIRS) and/or electroencephalography (EEG), whereby we infer a mental state from the user (e.g. mental workload) for the purpose of adapting an interface towards the user's benefit. Our current work is multidimensional, focusing on: pushing state-of-the-art mental workload interfaces, leveraging measurement of mental workload using fNIRS towards the investigation of LLM-based interfaces, as well as inferring cross-task 'horizontal' state-classification from EEG data towards future BCI designs. 
<br><br>
-- Publications --
<br>
M. Russell, A. Shah, G. Blaney, J. Amores, A. Cambon, M. Czerwinski, R.J.K Jacob, "Your Brain on an Interactive LLM" [in review] (2024). 
<br><br>
M. Russell, S. Youkeles, A. Shah, E. Lai, R.J.K. Jacob, “Chess, Cognitive Neuroscience, and their Interaction with the MUSE 2 device for BCI” [in review]
(2024).
<br><br>
M. Russell, S. Hincks, L. Wang, A. Babar, Z. Chen, Z. White, R.J.K Jacob,"Visualization and Workload with Implicit fNIRS-based BCI", Frontiers in Neuroergonomics (2024) [accepted].
<br><br>
A. Bosworth, M. Russell, and R.J.K Jacob, "fNIRS as an Input to Brain-Computer Interfaces: A Review of Research from the Tufts Human-Computer Interaction Laboratory," Photonics (2019). <a href="https://www.mdpi.com/2304-6732/6/3/90">link</a>
<br><br>
T. Shibata, A. Borisenko, A. Hakone, T. August, L. Deligiannidis, C.H. Yu, M. Russell, A. Olwal, and R.J.K. Jacob, "An Implicit Dialogue Injection System for Interruption Management," Proc. Tenth Augmented Human International Conference (2019). <a href="http://www.cs.tufts.edu/~jacob/papers/shibata.ah19.pdf">link</a>
<br><br>
L. Hirshfield, D. Bergen-Cico, M. Costa, R.J.K. Jacob, S. Hincks, M. Russell, "Measuring the Neural Correlates of Mindfulness with Functional Near-Infrared Spectroscopy,"Empirical Studies of Contemplative Practices (2018). <a href="https://www.researchgate.net/publication/329362205_Measuring_the_neural_correlates_of_mindfulness_with_functional_near-infrared_spectroscopy">link</a>
<br><br>
L. Hirshfield, R. Gulotta, S. Hirshfield, S. Hincks, M. Russell, R. Ward, T. Williams, and R. Jacob, "This is Your Brain on Interfaces: Enhancing Usability Testing with Functional Near-Infrared Spectroscopy," Proc. ACM CHI 2011 Human Factors in Computing Systems Conference, ACM Press (2011). <a href="https://dl.tufts.edu/concern/pdfs/j6731g17b">link</a>
<br><br>
L. Hirshfield, S. Hirshfield, S. Hincks, M. Russell, R. Ward, T. Williams, “Trust in Human-Computer Interactions as Measured by Frustration, Surprise, and Workload.,” Foundations of Augmented Cognition. Directing the Future of Adaptive Systems. (2011). <a href="https://doi.org/10.1007/978-3-642-21852-1_58">link</a>`

const aboutText = `Welcome! My name is Matt Russell, and I'm a PhD candidate in computer science at Tufts University. I love coding, learning, and teaching. I'm currently working on my dissertation, which focuses on measurement of mental workload using fNIRS towards the investigation of LLM-based interfaces, developing next-generation workload-based fNIRS interfaces, and inferring cross-task 'horizontal' state-classification from EEG data towards future BCI work. I'm also a teaching assistant for the computer science department, and have been the professor for our online Data Structures course (in C++) twice.

<br><br>I'm happily married (since January 2016), and have two amazing daughters, born 2018 and 2020. My hobbies include: cooking, chess, crossword puzzles, camping, snowboarding, rock climbing. `

const teachingText = `-- Courses Taught -- 
<br>CS 15: Data Structures (C++) [2020 and 2023 summer semesters]
<br><br>
-- Courses TA'd -- 
<br>CS 175: Computer Graphics (C++) [2 semesters]
<br>CS 15: Data Structures (C++) [7 semesters]
<br>CS 50CP: Concurrency (Erlang, Python)
<br>CS 116: Cybersecurity 
<br>CS 10: Introduction to Computer Science (Python)
<br>
`

const pgimgs = ['python-plain.svg', 'cplusplus-original.svg', 'r-original.svg', 
		        'javascript-original.svg', 'java-original.svg',
                'bash-original.svg', 'matlab-plain.svg', 
		        'docker-original.svg', 'digitalocean-original.svg', 'git-original.svg', 
                'github-original.svg', 'gitlab-original.svg', 'linux-plain.svg',
                'pandas-original.svg', 'postgresql-original.svg', 'threejs-original.svg'];

const logopath = './assets/logos/';

var homeButton = new THREE.Group();
homeButton.cursor = 'pointer';
const buttonSize = 0.25;

// Create the circular background
const circleGeometry = new THREE.CircleGeometry(buttonSize, 32);
const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.5 });
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
homeButton.add(circle);

// Create the arrow
const arrowShape = new THREE.Shape();
arrowShape.moveTo(0, buttonSize * 0.5);
arrowShape.lineTo(-buttonSize * 0.55, -buttonSize * 0.2);
arrowShape.lineTo(-buttonSize * 0.3, -buttonSize * 0.2);
arrowShape.lineTo(-buttonSize * 0.3, -buttonSize * 0.5);
arrowShape.lineTo(buttonSize * 0.3, -buttonSize * 0.5);
arrowShape.lineTo(buttonSize * 0.3, -buttonSize * 0.2);
arrowShape.lineTo(buttonSize * 0.55, -buttonSize * 0.2);
arrowShape.lineTo(0, buttonSize * 0.5);

const arrowGeometry = new THREE.ShapeGeometry(arrowShape);
const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
homeButton.add(arrow);
homeButton.visible = false;

scene.add(homeButton);
underwaterTransition.underwaterScene.add(homeButton);

function goHome() {
    objectCSS.visible = false;
    if (underwaterTransition.isUnderwater) {
        underwaterTransition.transitionToHome();
    }else if (skyTransition.isSky) {
        skyTransition.transitionToHome();
    }  
    homeButton.visible = false;
}

// Make the button clickable
homeButton.userData = { clickable: true };
homeButton.on( 'click', (ev) => { goHome() } );

var nameText;
var nameGlow;
var headers = [];
var plBoxes = [];

var nameSize = 7;
var headerSize = 2;
var plCubeDim = 2.25;

var cube;

const headerTxt = ['about', 'research', 'projects', 'teaching', 'resume', 'contact'];

window.addEventListener( 'resize', onWindowResize ); 

function onWindowResize() {

    camera.position.set( eye_fixed_x, eye_fixed_y, eye_fixed_z );

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    cssRenderer.setSize( window.innerWidth, window.innerHeight );
    
    w = visibleWidthAtZDepth(z_depth, camera);
    h = visibleHeightAtZDepth(z_depth, camera);
    nameSize = 7;
    headerSize = 2;
    plCubeDim = 2.25;
    ledge = -w / 2;

    loadText();
    initCube();
    loadImages();

    camera.position.set( eye_world_x, eye_world_y, eye_world_z );
    controls.update();

    if (objectCSS.visible) {
        const distance = 100;
        const verticalOffset = h / 4;
        objectCSS.position.copy(camera.position);
        objectCSS.position.z = camera.position.z - distance;
        objectCSS.position.y -= verticalOffset;
        objectCSS.quaternion.copy(camera.quaternion);
    }
    controls.update()

}

function make_image_material(fname) {
    const texture = new THREE.TextureLoader().load( './assets/' + fname );
    texture.minFilter = THREE.LinearFilter;
    return new THREE.MeshBasicMaterial( { map: texture } );
}

function initCube() {
    let is_visible = false; 

    if ( cube !== undefined ) {
        console.log("removing cube");
        is_visible = cube.visible;
        scene.remove(cube);
    }

    const imgFiles = [ 'gradescope_autograder_pic.png', 'cuda_raytracer.png', 'backgammon.png', 'unit_test_pic.png', 'heap_vis.png', 'website.png' ];
    const imgMats = imgFiles.map( fname => make_image_material(fname) );
    const boxSize = (h < w ? h : w) / 3;
    cube = new THREE.Mesh(
                            new THREE.BoxGeometry( boxSize, boxSize, boxSize, 1, 1, 1 ), 
                            [ imgMats[2], imgMats[0], imgMats[4], imgMats[1], imgMats[5], imgMats[3] ]
                         );
    cube.visible = is_visible;
    cube.cursor = 'pointer';
    cube.on( 'click', (ev) => click(ev) );
    function click(ev){     
        console.log(ev.intersects[0].faceIndex);
        switch (ev.intersects[0].faceIndex) {
            case 0: 
            case 1: 
                window.open('https://www.github.com/mattrussell2/games', '_blank');
                break;
            case 2:
            case 3:
                window.open('https://www.github.com/mattrussell2/gradescope-autograder', '_blank');
                break;
            case 6:
            case 7:
                window.open('https://www.github.com/mattrussell2/cuda_raytracer', '_blank');
                break;
            case 4:
            case 5:
                window.open('https://mattrussell2.github.io/data-structures-vis/', '_blank');
                break;
            case 8:
            case 9:
                window.open('https://github.com/mattrussell2/website', '_blank');
                break;
            case 10:
            case 11:
                window.open('https://www.github.com/mattrussell2/vscode-cpp-unit-test', '_blank');
                break;
        }
    }
    scene.add(cube);

    if ( is_visible ) { 
        const yCurr = nameText.position.y + nameText.geometry.boundingBox.max.y;
        const d = h - yCurr - 15;
        cube.position.set(0, yCurr + d/3, 30);
        cube.scale.set(1, 1, 1); 
        cube.rotation.y = THREE.MathUtils.degToRad(55);
        cube.rotation.z = THREE.MathUtils.degToRad(45);
        currObj = cube;
    }
}

/*
 * Load the programming language images
 */
function loadTexture(imgName, imgx, imgy, imgz) {
    const texture = new THREE.TextureLoader().load( logopath + imgName );
    texture.minFilter = THREE.LinearFilter;
    const pl_cube = new THREE.Mesh(
                                new THREE.BoxGeometry( plCubeDim, plCubeDim, 0 ),
                                new THREE.MeshBasicMaterial( { map: texture, transparent:true } )
                               );
    pl_cube.position.set( imgx, imgy, imgz );
    scene.add( pl_cube );
    plBoxes.push( pl_cube );
}

function loadImages() {
    plBoxes.forEach( plBox => scene.remove( plBox ) );
    plBoxes = [];
    
    const imgy = 1.75;
    const imgz = 75;
    const imgw = visibleWidthAtZDepth( imgz, camera );
    const wDelta = imgw / pgimgs.length;
    while ( wDelta <= plCubeDim * .95 ) {
        plCubeDim *= .95;
    }

    pgimgs.forEach( (imgName, i) => loadTexture( imgName, -imgw / 2.0 + wDelta / 2.0 + wDelta * i, imgy, imgz ) );
}

function resetCSS(objectCSS, z) {
    objectCSS.visible = true;
    objectCSS.position.copy(camera.position);

    // CSS Renderer scaling is wonky so make manual adjustments. 
    if (camera.position.y > 100) {
        objectCSS.position.x *= 10;
        objectCSS.position.y = objectCSS.position.y * 10 + h/2 * 20; 
        objectCSS.position.z = objectCSS.position.z * 10 - 1000;
    }

    if (isMobile) {
        objectCSS.position.z -= 5000;
        objectCSS.position.y += h/2 * 40;
    }

    objectCSS.quaternion.copy(camera.quaternion);
}

var currVis;
var currObj;

function initHeader(obj, i) {
    
    obj.on( 'click', (ev) => { console.log("clicked!"); clickHeader(ev, i) } );
        
    function clickHeader(ev, i) {
        objectCSS.visible = false;
        cube.visible = false;
        currObj = null;
        switch ( headerTxt[i] ) {
            case 'about':
                if (!underwaterTransition.isUnderwater) {
                    underwaterTransition.transitionToUnderwater(() => {
                        textBox.innerHTML = aboutText;
                        currObj = objectCSS;
                        resetCSS(objectCSS);
                        homeButton.position.set(camera.position.x, camera.position.y, camera.position.z - 10); 
                        homeButton.visible = true;
                    });
                } else {
                    // If already underwater, just show the content immediately
                    textBox.innerHTML = aboutText;
                    objectCSS.visible = true;
                    currObj = objectCSS;
                }
                break;
            case 'projects':                
                const yCurr = nameText.position.y + nameText.geometry.boundingBox.max.y;
                const d = h - yCurr - 15;
                cube.position.set(0, yCurr + d/3, 30);
                cube.scale.set(1, 1, 1); 
                cube.rotation.y = THREE.MathUtils.degToRad(55);
                cube.rotation.z = THREE.MathUtils.degToRad(45);
                cube.visible = true;
                currObj = cube;
                break;
            case 'teaching':
                textBox.innerHTML = teachingText;
                currObj = objectCSS;
                resetCSS(objectCSS);
                break;
            case 'research':
                if (!skyTransition.isSky) {
                    skyTransition.transitionToSky(() => {
                        textBox.innerHTML = researchText;
                        currObj = objectCSS;
                        resetCSS(objectCSS);
                        homeButton.position.set(camera.position.x, camera.position.y, camera.position.z - 10); 
                        homeButton.visible = true;

                    });
                } else {
                    textBox.innerHTML = researchText;
                    objectCSS.visible = true;
                    currObj = objectCSS;
                }
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
        if ( currVis === headerTxt[i] && obj !== null ) {
            currObj.visible = false;
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
    for (let [i, header] of headerTxt.entries()) {
        let textGeo = new TextGeometry( header, 
                                    {
                                        font: fnt,
                                        size: headerSize,
                                        depth: 0.5,
                                        curveSegments: 12
                                    });
        textGeo.computeBoundingBox();
        let text = new Water( textGeo, headerOpts);
        text.cursor = 'pointer';
        text.minFilter = THREE.LinearFilter; //new
        scene.add( text ); 

        const glowMaterial = new THREE.MeshBasicMaterial({ color: 0x5C295C, transparent: false, opacity: 0.25 });
        const textGlow = new THREE.Mesh(textGeo, glowMaterial);
        textGlow.scale.multiplyScalar(1.02);
        scene.add(textGlow);

        // on mobile, seems that only the front-face is clickable, so make the boxes really tall. 
        const box = new THREE.Mesh(new THREE.BoxGeometry( textGeo.boundingBox.max.x, textGeo.boundingBox.max.y * isDesktop ? 3 : 10, 10 ), 
                                    new THREE.MeshBasicMaterial( { color: 0x000000, transparent:true, opacity:0.0 } ));
        box.cursor = 'pointer';
        
        scene.add( box );

        initHeader( text, i );
        initHeader( box, i );
                
        headers.push( [ text, box, textGlow ] );
        
    }
    let fullHeaderSpace = headers.reduce( (acc, [text, box]) => acc - text.geometry.boundingBox.max.x, w );
    let headerSpace = fullHeaderSpace * .75;
    let headerDelta = headerSpace / headerTxt.length;
    let pos = new THREE.Vector3;
    
    pos.x = ledge + headerDelta / 2 + (fullHeaderSpace - headerSpace) / 2; 
    pos.y = 1;
    pos.z = eye_fixed_z - z_depth;
    for ( let [text, box, textGlow] of headers ) {
        text.position.set( pos.x, pos.y, pos.z );
        box.position.set( pos.x + text.geometry.boundingBox.max.x / 2.0, pos.y, pos.z ); 
        textGlow.position.set(pos.x, pos.y, pos.z);
        pos.x += headerDelta + text.geometry.boundingBox.max.x;
    }

    if ( headerSpace <= 10 ) {
        headerSize *= .95;
        createHeader();
    }

}

function createName() {
    
    if (nameText !== undefined) {
        scene.remove(nameText);
        scene.remove(nameGlow);
    }

    let textGeo = new TextGeometry(
                                    'matt russell', 
                                    {
                                        font: fnt,
                                        size: nameSize,
                                        depth: 1,
                                        curveSegments: 12
                                    }
                                );
    textGeo.computeBoundingBox();

    nameText = new Water( textGeo, waterOpts );
    nameText.position.set( ledge + 2, 5, eye_fixed_z - z_depth );
    scene.add( nameText );


    const glowMaterial = new THREE.MeshBasicMaterial({ color: 0x5C295C, transparent: true, opacity: .5 });
    nameGlow = new THREE.Mesh(textGeo, glowMaterial);
    nameGlow.position.set( nameText.position.x, nameText.position.y, nameText.position.z);
    scene.add(nameGlow);
    
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

loadText();
initCube();
loadImages();
camera.position.set( eye_world_x, eye_world_y, eye_world_z );
controls.update();

/*
 * Sun and Sky
 * https://threejs.org/examples/?q=water#webgl_shaders_ocean
 */
const water = new Water( 
                            new THREE.PlaneGeometry( isMobile ? 2000 : 10000, isMobile ? 2000 : 10000 ), 
                            waterOpts 
                       );
water.rotation.x = - Math.PI / 2;
scene.add( water );

let renderTarget;

// https://stackoverflow.com/questions/11285065/limiting-framerate-in-three-js-to-increase-performance-requestanimationframe
// limit framerate to 30fps. 
const clock = new THREE.Clock();
const interval = 1 / 30;

function animate() {
    requestAnimationFrame( animate );

    if ( clock.getElapsedTime() < interval) return; 
    
    clock.start();

    water.material.uniforms[ 'time' ].value += 1.0 / 120.0;

    if (nameText !== undefined) {
        nameText.material.uniforms[ 'time' ].value += 1.0 / 360.0;
    }
    for (let header of headers) {
        header[0].material.uniforms[ 'time' ].value += 1.0 / 360.0;
    }
    if (cube !== undefined) {
        cube.rotation.y += 1/100;
    }

    starField.animate(1/10000);

    controls.update();
    if (underwaterTransition.isUnderwater) {
        renderer.render(underwaterTransition.underwaterScene, camera);
    } else {   
        renderer.render(scene, camera);
    }

    cssRenderer.render( cssScene, camera );

    TWEEN.update();
    
};


camera.layers.enable(0);
camera.layers.enable(1);

animate();
