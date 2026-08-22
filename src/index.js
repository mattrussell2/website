require('file-loader?name=[name].[ext]!./index.html');

import * as THREE from 'three';

import { FontLoader } from './three/FontLoader';
import { TextGeometry } from './three/TextGeometry';
import { Water } from './three/Water';
import { Interaction } from 'three.interaction/src/index.js';
import { OrbitControls } from './three/OrbitControls.js';
import * as content from './content.js';
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

const eye_fixed_x = 0; 
const eye_fixed_y = 10;
const eye_fixed_z = 100; // isDesktop ? 100 : 75; 

const eye_world_x = 0;
const eye_world_y = 10;
const eye_world_z = isDesktop ? 115 : 100;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x04070f);   // deep navy, not pure black

const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( eye_fixed_x, eye_fixed_y, eye_fixed_z );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
document.body.appendChild( renderer.domElement );

const composer = new EffectComposer( renderer );
const controls = new OrbitControls( camera, renderer.domElement );
controls.enabled = false;
const interaction = new Interaction(renderer, scene, camera); // mouse interaction

const waterNormals = new THREE.TextureLoader().load( './assets/waternormals.jpeg', tex => tex.wrapS = tex.wrapT = THREE.RepeatWrapping );
const underwaterTransition = new UnderwaterTransition(scene, camera, renderer, composer, waterNormals);

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

/*
 * Content panel: a flat DOM overlay on top of the scene.
 * 'center' = centered over a full-screen scene (about / research)
 */
const panel = document.getElementById('panel');
const chromeNav = document.querySelector('#chrome nav');
const PANEL_LAYOUT = { about: 'center', research: 'center', teaching: 'center', software: 'center' };

function showPanel(section) {
    panel.innerHTML = content[section];
    panel.className = PANEL_LAYOUT[section];
    panel.scrollTop = 0;
    void panel.offsetWidth;          // flush styles so the open transition animates
    panel.classList.add('open');
    setCurrentNav(section);
}

function hidePanel() {
    panel.classList.remove('open');
    setCurrentNav(null);
}

function setCurrentNav(section) {
    for (const b of chromeNav.querySelectorAll('button')) {
        b.toggleAttribute('aria-current', b.dataset.section === section);
    }
}

const waterOpts = {
    textureWidth: isDesktop ? 512 : 128,
    textureHeight: isDesktop ? 512 : 128,
    waterNormals,
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x0fffff,
    distortionScale: 7,
    fog: scene.fog !== undefined, 
    shininess: 100,
}

const pgimgs = ['python-plain.svg', 'cplusplus-original.svg', 'r-original.svg', 
		        'javascript-original.svg', 'java-original.svg',
                'bash-original.svg', 'matlab-plain.svg', 
		        'docker-original.svg', 'digitalocean-original.svg', 'git-original.svg', 
                'github-original.svg', 'gitlab-original.svg', 'linux-plain.svg',
                'pandas-original.svg', 'postgresql-original.svg', 'threejs-original.svg'];

const logopath = './assets/logos/';

var nameText;
var nameGlow;

// palette shared with index.html (--accent-2)
// Name colors, each a harmony of the water's hue (187°). Sky blue is the default;
// easter egg: number keys 1-8 swap between them.
const NAME_TRIALS = [
    ['1 orchid (current)',        0xC9A0E8],
    ['2 complement coral 7°',     0xF9A094],
    ['3 split-comp rose 337°',    0xF994BB],
    ['4 split-comp amber 37°',    0xF9D394],
    ['5 triad magenta 307°',      0xF994ED],
    ['6 triad chartreuse 67°',    0xEDF994],
    ['7 tetrad violet 277°',      0xD394F9],
    ['8 analogous sky 217°',      0x94BBF9],
];
const NAME_GLOW = NAME_TRIALS[7][1];
window.addEventListener('keydown', (ev) => {
    const i = parseInt(ev.key, 10) - 1;
    if (i >= 0 && i < NAME_TRIALS.length && nameGlow) nameGlow.material.color.set(NAME_TRIALS[i][1]);
});
var plBoxes = [];

var nameSize = isMobile ? 5 : 4.3;
var plCubeDim = 2.25;

var cube;

const SECTIONS = ['about', 'research', 'software', 'teaching', 'resume', 'contact'];

window.addEventListener( 'resize', onWindowResize ); 

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

    w = visibleWidthAtZDepth(z_depth, camera);
    h = visibleHeightAtZDepth(z_depth, camera);
    nameSize = isMobile ? 5 : 4.3;
    plCubeDim = 2.25;
    ledge = -w / 2;

    loadText();
    initCube();
    loadImages();
}

function make_image_material(fname) {
    const texture = new THREE.TextureLoader().load( './assets/' + fname );
    texture.minFilter = THREE.LinearFilter;
    return new THREE.MeshBasicMaterial( { map: texture } );
}

function initCube() {
    let is_visible = false; 

    if ( cube !== undefined ) {
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

    if ( is_visible ) placeCube();
}

// Park the cube beside the centered software card, at the name's depth (above it on phones).
function placeCube() {
    const yCurr = nameText.position.y + nameText.geometry.boundingBox.max.y;
    const d = h - yCurr - 15;
    cube.position.set(isMobile ? 0 : w * 0.53, isMobile ? yCurr + d/2 : 4, eye_fixed_z - z_depth);
    cube.scale.setScalar(isMobile ? 0.5 : 0.6);
    cube.rotation.y = THREE.MathUtils.degToRad(55);
    cube.rotation.z = THREE.MathUtils.degToRad(45);
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

/*
 * Navigation state machine.
 *
 *   world:   'home' | 'underwater' (about) | 'sky' (research)
 *   current: the open section, or null when at home with nothing open
 *
 * Clicking the active section returns home. Clicking a different section goes
 * there directly; if that means changing world (e.g. underwater -> sky) the
 * intermediate surfacing runs automatically, then the next move starts.
 */
// The dive (about) and rocket launch (research) are kept as a future easter egg; with
// travel off (default): every section is a panel over the home scene. Press M to toggle.
var travelEgg = false;
function worldOf(section) {
    if (!travelEgg) return 'home';
    return { about: 'underwater', research: 'sky' }[section] || 'home';
}
window.addEventListener('keydown', (ev) => {
    if (ev.key.toLowerCase() !== 'm' || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    travelEgg = !travelEgg;
    // if a section is open and its world just changed, travel there (or come home) now
    if (current && !busy) { const sec = current; closeCurrent(); goTo(sec); }
    else if (!travelEgg && world !== 'home' && !busy) goHome();
});

var current = null;         // open section
var world = 'home';         // where the camera is
var busy = false;           // a camera transition is running
var queued = null;          // section requested during a transition


function setAway(away) { document.body.classList.toggle('away', away); }

/* Camera moves. Each resolves to the new world and then runs `done`. */
function moveTo(targetWorld, done) {
    if (world === targetWorld) { done(); return; }
    busy = true;
    const finish = () => { world = targetWorld; busy = false; done(); flushQueue(); };

    if (world === 'home' && targetWorld === 'underwater') {
        underwaterTransition.transitionToUnderwater(finish);
    } else if (world === 'home' && targetWorld === 'sky') {
        skyTransition.transitionToSky(finish);
    } else if (world === 'underwater' && targetWorld === 'home') {
        underwaterTransition.transitionToHome(finish);
    } else if (world === 'sky' && targetWorld === 'home') {
        skyTransition.transitionToHome(finish);
    } else {
        // underwater <-> sky: surface first, then keep going
        moveTo('home', () => moveTo(targetWorld, done));
        return;
    }
}

function flushQueue() {
    if (queued && !busy) { const q = queued; queued = null; goTo(q); }
}

function closeCurrent() {
    hidePanel();
    if (cube) cube.visible = false;
    current = null;
}

function goHome() {
    closeCurrent();
    setAway(false);
    moveTo('home', () => {});
}

/* Entry point for every nav click. */
function goTo(section) {
    if (section === 'contact') { window.location.href = 'mailto:mrussell@cs.tufts.edu'; return; }
    if (section === 'resume')  { window.open('./assets/resume.pdf', '_blank'); return; }
    if (section === 'home')    { queued = null; goHome(); return; }

    if (busy) { queued = section; return; }

    // same button again -> home
    if (current === section) { goHome(); return; }

    closeCurrent();
    current = section;
    setCurrentNav(section);                 // highlight immediately so the click feels acknowledged
    const target = worldOf(section);
    setAway(target !== 'home');

    moveTo(target, () => {
        if (current !== section) return;    // superseded while travelling
        if (section === 'software') { placeCube(); cube.visible = true; }
        showPanel(section);
    });
}

// DOM chrome: top-right nav + brand link
document.getElementById('chrome').addEventListener('click', (ev) => {
    const target = ev.target.closest('[data-section]');
    if (!target) return;
    ev.preventDefault();
    goTo(target.dataset.section);
});

// Escape closes whatever is open
window.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && current) goHome(); });

// ?open=<section> deep link; ?noanim disables DOM transitions
{
    const q = new URLSearchParams(window.location.search);
    if (q.has('noanim')) document.body.classList.add('noanim');
    const want = q.get('open');
    if (want && SECTIONS.includes(want)) setTimeout(() => goTo(want), 800);
}

function createName() {
    
    if (nameText !== undefined) {
        scene.remove(nameText);
        scene.remove(nameGlow);
    }

    let textGeo = new TextGeometry(
                                    'matthew russell, phd', 
                                    {
                                        font: fnt,
                                        size: nameSize,
                                        depth: 0.35,
                                        curveSegments: 12
                                    }
                                );
    textGeo.computeBoundingBox();

    nameText = new Water( textGeo, waterOpts );
    // left-anchored near the screen edge (the live camera sits further back than eye_fixed_z, so widen `ledge`)
    // center the geometry so the mesh pivots about its middle, then left-anchor the mesh
    textGeo.center();
    const halfW = textGeo.boundingBox.max.x;
    nameText.position.set( (isMobile ? ledge + 2 : ledge * 1.22 + 2) + halfW, 3, eye_fixed_z - z_depth );
    scene.add( nameText );


    const glowMaterial = new THREE.MeshBasicMaterial({ color: NAME_GLOW, transparent: true, opacity: .85, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    nameGlow = new THREE.Mesh(textGeo, glowMaterial);
    nameGlow.position.set( nameText.position.x, nameText.position.y, nameText.position.z );
    // keep the letters parallel to the screen (no yaw, so the baseline stays level) and pitch them
    // toward the slightly elevated camera; the thin extrusion keeps side walls out of the letter gaps
    const toCam = new THREE.Vector3( eye_world_x, eye_world_y, eye_world_z ).sub( nameText.position );
    nameText.rotation.x = Math.atan2( toCam.y, toCam.z );
    nameGlow.rotation.copy( nameText.rotation );
    scene.add(nameGlow);
    
    if (halfW * 2 >= w * (isMobile ? 0.9 : 0.42)) {
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

    const elapsed = clock.getElapsedTime();
    if ( elapsed < interval) return;
    clock.start();

    water.material.uniforms[ 'time' ].value += 1.0 / 120.0;

    if (nameText !== undefined) {
        nameText.material.uniforms[ 'time' ].value += 1.0 / 360.0;
    }
    if (cube !== undefined) {
        cube.rotation.y += 1/100;
    }

    starField.animate(elapsed);

    controls.update();
    if (underwaterTransition.isUnderwater) {
        underwaterTransition.update(elapsed);
        renderer.render(underwaterTransition.underwaterScene, camera);
    } else {
        renderer.render(scene, camera);
    }

    TWEEN.update();
    
};


camera.layers.enable(0);
camera.layers.enable(1);

animate();
