 async function createScene(engine) {

  const scene = new BABYLON.Scene(engine);
  scene.useRightHandedSystem = true;
  
  var VRHelper = scene.createDefaultVRExperience();
    
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.6;
  light.specular = BABYLON.Color3.Black();

  var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
  light2.position = new BABYLON.Vector3(0, 5, 5);

  BABYLON.SceneLoader.Append("https://www.babylonjs.com/Scenes/Espilit/","Espilit.babylon", scene, async function () 
    {
      var xr = await scene.createDefaultXRExperienceAsync({floorMeshes: [scene.getMeshByName("Sols")]});
    });

  
  addCamera(scene);

   engine.runRenderLoop(scene.render.bind(scene));
    return scene;
 }

 function addCamera(scene) {
  const position = new BABYLON.Vector3(-0.2, 1.5, 1.5);
  const aimTarget = new BABYLON.Vector3(-0.2, 1.5, 0);
  const camera = new BABYLON.UniversalCamera('flyCam', position, scene);
  camera.speed = 0.02;
  camera.minZ = 0.05;
  camera.maxZ = 1000;
  camera.fov = 0.6;

  // Set the key bindings that will control camera movement.
  const keyCodes = { w: 87, a: 65, s: 83, d: 68, q: 81, e: 69 };
  camera.keysLeft = [keyCodes.a];
  camera.keysRight = [keyCodes.d];
  camera.keysUp = [keyCodes.w];
  camera.keysDown = [keyCodes.s];
  camera.keysUpward = [keyCodes.e];
  camera.keysDownward = [keyCodes.q];

  camera.setTarget(aimTarget);
}

export const PlayScene = { createScene };
