 async function create(engine) {

  //1st Scene
  const scene = new BABYLON.Scene(engine);
  scene.useRightHandedSystem = true;

  const modelUrl = './assets/3d-assets/environments/room_model/room_model.gltf';
  const sceneAssets = await BABYLON.SceneLoader.LoadAssetContainerAsync(modelUrl);
  sceneAssets.addAllToScene();

  addCamera(scene);

  //2nd Scene

  /*scene1 = new BABYLON.Scene(engine);
  scene1.useRightHandedSystem = true;
  
  var VRHelper = scene1.createDefaultVRExperience();
    
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene1);
  light.intensity = 0.6;
  light.specular = BABYLON.Color3.Black();

  var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene1);
  light2.position = new BABYLON.Vector3(0, 5, 5);

  BABYLON.SceneLoader.Append("https://www.babylonjs.com/Scenes/Espilit/","Espilit.babylon", scene1, async function () 
    {
      var xr = await scene1.createDefaultXRExperienceAsync({floorMeshes: [scene1.getMeshByName("Sols")]});
    });

  
 /* addCamera(scene1);*/

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

/*async function create(engine) 
{

  var clicks = 0;
  var showScene = 0;
  var advancedTexture;
  
  //Scene 1
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

  //Scene 2
  const scene1 = new BABYLON.Scene(engine);
  scene1.useRightHandedSystem = true;

  const modelUrl = './assets/3d-assets/environments/room_model/room_model.gltf';
  const sceneAssets = await BABYLON.SceneLoader.LoadAssetContainerAsync(modelUrl);
  sceneAssets.addAllToScene();

  addCamera(scene1);

  function createGUI(scene, showScene)
{

   switch (showScene) {
            case 0:            
                advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene1);
            break
            case 1:            
                advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
            break
        }
        var button = BABYLON.GUI.Button.CreateSimpleButton("but", "Scene " + ((clicks + 1) % 2));
        button.width = 0.2;
        button.height = "40px";
        button.color = "white";
        button.background = "green";
        button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        advancedTexture.addControl(button);

    
        button.onPointerUpObservable.add(function () {       
            clicks++;                   
        });
}

  createGUI(scene1, showScene);


  setTimeout(function() {
        engine.stopRenderLoop();

        engine.runRenderLoop(function () {
            if(showScene != (clicks % 2)){
                showScene = clicks % 2;          
                switch (showScene) {
                    case 0:                    
                        advancedTexture.dispose();
                        createGUI(scene1, showScene);
                        scene1.render();
                    break
                    case 1:
                        advancedTexture.dispose();
                        createGUI(scene, showScene);
                        scene.render();
                    break
                }
            }
        });
    }, 500);

  return scene;
}*/

export const RoomScene = { create };


