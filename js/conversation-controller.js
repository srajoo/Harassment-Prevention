import { LexBot, LexBotEvents } from './lex-bot.js';
import { KeyboardUtils } from './lib/keyboard-utils.js';


export class ConversationController {

  constructor(sumerianHost, talkButton) {
    this.host = sumerianHost;
    this.speech = sumerianHost.TextToSpeechFeature;
    this.bot = new LexBot();

    this.acquireMicrophoneAccess();

    this.scenePlay();

    // Set up UI event handling
    talkButton.addEventListener('mousedown', this._onTalkButtonPress.bind(this));
    talkButton.addEventListener('mouseup', this._onTalkButtonRelease.bind(this));

    // Subscribe to LexBot events.
    this.bot.listenTo(LexBotEvents.RESPONSE_RECEIVED, this._onLexBotResponse.bind(this));
  }

  async start() {
    const message = `Hello! And welcome to the questionnaire`;

    this.speech.play(message);
  }

  async acquireMicrophoneAccess() {
    try {
    await this.bot.enableMicInput();
    }catch (e) {
    // The user or browser denied mic access. Display appropriate messaging
    // to the user.
    if (e.message === 'Permission dismissed') {
        alert("Permission denied")
    } else {
      //showUiScreen('micDisabledScreen');
    }
  }
}

  scenePlay()
  {
    /*const wave = this.host.AnimationFeature('Gesture', 'Wave');
    wave.play();*/
  }

  _onTalkButtonPress() {
    //this.speech.stop();

    // Ensure the host looks at the user.
    const scene = BABYLON.Engine.LastCreatedScene;
    const camera = scene.cameras[0];
    this.host.PointOfInterestFeature.setTarget(camera);

    // TODO: Add logic here that starts recording the user's voice.
    this.bot.beginVoiceRecording();
  }

  
  _onTalkButtonRelease() {

    //Code to record input audio is not working. Using keyboard functionality for now
    //this.bot.endVoiceRecording();
    this._simulateUserUtterance();

    
  }

  
  _onLexBotResponse(response) {
   //this.speech.play(response.message);
    switch (response.dialogState) {
      // This case indicates the bot needs to know the task the user would like
      // help with.
      case 'ElicitIntent': {
        this.speech.play(response.message);
        break;
      }

      // This case indicates the bot is asking for more information.
      case 'ElicitSlot': {
        //this.host.AnimationFeature.playAnimation('Gesture', 'Wave');
        //this.host2.AnimationFeature.playAnimation('Gesture', 'Wave');
        this.speech.play(response.message);
        //this.speech2.play(response.message);
        break;
      }
      case 'ElicitSlot': {
        //this.host.AnimationFeature.playAnimation('Gesture', 'Wave');
        //this.host2.AnimationFeature.playAnimation('Gesture', 'Wave');
        this.speech.play(response.message);
        break;
      }
      case 'ElicitSlot': {
        //this.host.AnimationFeature.playAnimation('Gesture', 'Wave');
        //this.host2.AnimationFeature.playAnimation('Gesture', 'Wave');
        this.speech.play(response.message);
        break;
      }
      case 'ElicitSlot': {
        //this.host.AnimationFeature.playAnimation('Gesture', 'Wave');
        //this.host2.AnimationFeature.playAnimation('Gesture', 'Wave');
        this.speech2.play(response.message);
        break;
      }

      // This case indicates the bot has collected all necessary slot values but
      // would like to confirm with the user whether the values are correct.
      case 'ConfirmIntent': {
        // TRICKY: In order to get Polly to pronounce the employee ID as individual
        // characters rather than words we need to inject some SSML tags
        // that surround the employee ID value.
        //const response = response.slots.Res;
        this.speech.play(response.message);
        break;
      }

      // This case indicates the bot has all necessary info and has completed
      // the task.
      case 'Fulfilled': {

        this.speech.play(response.message);

        
        setTimeout(() => {
          const scene = BABYLON.Engine.LastCreatedScene;

          // Make host look at the "ScreenPOI" invisible object which is
          // contained within the scene.
          const poiNode = scene.getTransformNodeByName('ScreenPOI');
          this.host.PointOfInterestFeature.setTarget(camera);

          // Trigger a built-in gesture.
          this.host.GestureFeature.playGesture('Gesture', 'you', { holdTime: 0.2 });
          //this.host.AnimationFeature.playAnimation('Blink', 'blink');
        }, 1300);

        break;
      }

      // This case indicates the bot has not gotten all necessary info to
      // complete the task and is giving up.
      case 'Failed': {
        this.speech.play(response.message);
        break;
      }

      default: {
        console.error(`Unexpected Lex dialog state: "${response.dialogState}"\n`);
        //console.log(response);
      }
    }
  }

  /**
   * This demo doesn't currently include the ability to actually record a user's
   * voice, so this function simulates a user's utterance depending on which
   * keyboard key is pressed at the time it is called.
   */
  _simulateUserUtterance() {
    switch (KeyboardUtils.mostRecentKey) {
      case '1': {
        this.bot.postUtterance('Scene Complete');
        break;
      }

      case '2': {
        this.bot.postUtterance('5');
        break;
      }

      case 'y': {
        this.bot.postUtterance('yes');
        break;
      }
      case 'n': {
        this.bot.postUtterance('no');
        break;
      }
      default: {
        this.bot.postUtterance('sssss'); // unintelligible audio
      }
    }
  }

}
