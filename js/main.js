import { SumerianHostUtils } from './dist/sumerian-host-utils.js';
import { SumerianHostObject } from './lib/sumerian-host-utils.js';
import { RoomScene } from './scene-room.js';
import { PlayScene } from './scene-play.js';
import { ConversationController } from './conversation-controller.js';

const cognitoIdentityPoolId = 'us-east-1:df2c2ac7-5e57-4318-9e50-9312f7cf766a';

const characterId = 'Fiona';
const characterId_1 = 'Jane';
const characterId_2 = 'John';

//const characterId_2 = 'John';

let canvas;
let engine;
let scene;
//let scene1;
let host;
//let host1;
//let host2;
let conversation;

var clicks = 0;
var showScene = 0;
showScene = clicks % 2;


// The function calls below define our app's start-up sequence.
configureAwsSdk();
init3dEngine();




if(showScene)
{
  await loadScene1();
  await loadCharacter1();
}
else
{
  await loadScene();
  await loadCharacter();
  //Call start app when switching back to first scene after 2nd scene has done playing. 
  //Code to toggle has been added in scene-room.js. It's been commented out now since
  //integrtaion is not complete.
  startApp();
}


function configureAwsSdk() {
  AWS.config.region = cognitoIdentityPoolId.split(':')[0];
  AWS.config.credentials = new AWS.CognitoIdentityCredentials(
    { IdentityPoolId: cognitoIdentityPoolId },
  );
}

function init3dEngine() {
  canvas = document.getElementById('renderCanvas');
  engine = new BABYLON.Engine(canvas, true, undefined, true);
  // Use our own button to enable audio
  BABYLON.Engine.audioEngine.useCustomUnlockedButton = true;

  // Handle window resize
  window.addEventListener('resize', () => engine.resize());
}

async function loadScene(){
    scene = await RoomScene.create(engine);

    // Allow camera to be controlled by user.
    const cameraControlEl = document.getElementById('renderCanvas');
    const camera = scene.cameras[0];
    camera.attachControl(cameraControlEl, true);

}

async function loadScene1(){
    scene = await PlayScene.createScene(engine);

    // Allow camera to be controlled by user.
    const cameraControlEl = document.getElementById('renderCanvas');
    const camera = scene.cameras[0];
    camera.attachControl(cameraControlEl, true);

}


async function loadCharacter() {
  const pollyConfig = {pollyVoice: 'Joanna', pollyEngine: 'neural'};

  // Instantiate the host.
  const characterConfig = SumerianHostUtils.getCharacterConfig(characterId);

  
  host = await SumerianHostUtils.createHost(scene, characterConfig, pollyConfig);


  // Tell the host to always look at the camera.
  const camera = scene.cameras[0];
  const poiNode = scene.getTransformNodeByName('ScreenPOI');
  host.PointOfInterestFeature.setTarget(camera);
  //host2.PointOfInterestFeature.setTarget(poiNode);
  host.owner.position = new BABYLON.Vector3(-0.5, 0, 0);
  //host2.owner.position = new BABYLON.Vector3(-8, 0, 5);
  //host.owner.rotate(BABYLON.Vector3.Up(), Math.PI/2);
  //host2.owner.rotate(BABYLON.Vector3.Up(), -Math.PI/2);

  host.AnimationFeature.setLayerWeight('Blink', 0.7);
  host.TextToSpeechFeature.play('Press Begin to start scene');
  host.GestureFeature.playGesture('Gesture', 'you', { holdTime: 0.2 });
  alert("Press Begin to start scene");
}

async function loadCharacter1() {
  const pollyConfig_1 = {pollyVoice: 'Joanna', pollyEngine: 'neural'};
  const pollyConfig_2 = {pollyVoice: 'Mathew', pollyEngine: 'neural'};

  // Instantiate the host.
  const characterConfig_1 = SumerianHostObject.getCharacterConfig(characterId_1);
  const characterConfig_2 = SumerianHostObject.getCharacterConfig(characterId_2);

  
  host1 = await SumerianHostObject.createHost(scene, characterConfig_1, pollyConfig_1);
  host2 = await SumerianHostObject.createHost(scene, characterConfig_2, pollyConfig_2);


  // Tell the host to always look at the camera.
  const camera = scene.cameras[0];
  const poiNode = scene.getTransformNodeByName('ScreenPOI');
  //host.PointOfInterestFeature.setTarget(camera);
  //host2.PointOfInterestFeature.setTarget(poiNode);
  host1.owner.position = new BABYLON.Vector3(-10, 0, 5);
  host2.owner.position = new BABYLON.Vector3(-8, 0, 5);
  host1.owner.rotate(BABYLON.Vector3.Up(), Math.PI/2);
  host2.owner.rotate(BABYLON.Vector3.Up(), -Math.PI/2);

  //host.AnimationFeature.setLayerWeight('Blink', 0.7);

  //The animations to be played can be found in assets/3d-assets/animations/${characterType}/custom/gestures.glb
  //Upload the file in Babylon Sandbox to view

}

function startApp(){
  const talkButton = document.getElementById('talkButton');
  conversation = new ConversationController(host, talkButton);
}

