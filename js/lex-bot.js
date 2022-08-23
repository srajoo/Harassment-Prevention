// TODO: Update the botName and botAlias values to match those of the Lex bot you've created
// in your AWS account.
const botName = 'Questionnaire';
const botAlias = 'Dev';

export const LexBotEvents = {
  // Event emitted whenever a Lex response is received.
  RESPONSE_RECEIVED: 'LexResponseReceived',
};

/**
 * This class provides a simple API for interacting with any Lex bot. It emits
 * messages that consumers can subscribe to in order to be informed of Lex
 * bot response events.
 */
export class LexBot {

  constructor() {
    this.lex = new AWS.LexRuntime();
    this.anonymousUserId = generateSimpleSessionId();
    this.messageBus = new HOST.Messenger(botName);
    this._micReady = false;
    this._recording = false;
    this._recLength = 0;
    this._recBuffer = [];
    this.setupAudioContext();
  }

  setupAudioContext() {
    this._audioContext = new AudioContext();
  }

  _processWithAudio(inputAudio, sourceSampleRate, config = {}) {
    const audio = this._prepareAudio(inputAudio, sourceSampleRate);
    return this._process('audio/x-l16; rate=16000', audio, config);
  }

  _process(contentType, inputStream, config) {
    const settings = this._validateConfig(config);
    const lexSettings = {
      botName: settings.botName,
      botAlias: settings.botAlias,
      contentType,
      inputStream,
      userId: settings.userId,
    };
    return new Promise((resolve, reject) => {
      this._lexRuntime.postContent(lexSettings, (error, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(data);
      });
    })
      .then(data => {
        //this.emit(this.constructor.EVENTS.lexResponseReady, data);
        return data;
      })
      .catch(error => {
        const errorMessage = `Error happened during voice recording: ${error}. Please check whether your speech is more than 15s.`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      });
  }

  _validateConfig(config) {
    const settings = {};

    settings.botName = config.botName ? config.botName : this._botName;
    settings.botAlias = config.botAlias ? config.botAlias : this._botAlias;
    settings.userId = config.userId ? config.userId : this._userId;

    if (!settings.botName || !settings.botAlias || !settings.userId) {
      throw new Error(
        'Cannot process lex request. All arguments must be defined.'
      );
    }

    return settings;
  }

  _prepareAudio(audioBuffer, sourceSampleRate) {
    const downsampledAudio = LexUtils.downsampleAudio(
      audioBuffer,
      sourceSampleRate,
      this.constructor.LEX_DEFAULTS.SampleRate
    );
    const encodedAudio = LexUtils.encodeWAV(
      downsampledAudio,
      this.constructor.LEX_DEFAULTS.SampleRate
    );

    return new Blob([encodedAudio], {type: 'application/octet-stream'});
  }

  async enableMicInput() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    const source = this._audioContext.createMediaStreamSource(stream);
    //TODO: createScriptProcessor is deprecated which should be replaced
    const node = this._audioContext.createScriptProcessor(4096, 1, 1);

    node.onaudioprocess = e => {
      if (!this._recording) return;

      const buffer = e.inputBuffer.getChannelData(0);
      this._recBuffer.push(new Float32Array(buffer));
      this._recLength += buffer.length;
    };

    source.connect(node);
    node.connect(this._audioContext.destination);

    this.emit(this.constructor.EVENTS.micReady);
    this._micReady = true;
  }

  beginVoiceRecording() {
    console.log("enter 2");
    if (!this._micReady) {
      return;
    }

    if (
      this._audioContext.state === 'suspended' ||
      this._audioContext.state === 'interrupted'
    ) {
      this._audioContext.resume();
    }
    this._recLength = 0;
    this._recBuffer = [];
    this._recording = true;

    //this.emit(this.constructor.EVENTS.recordBegin);
  }

  endVoiceRecording() {
    console.log("enter 4");
    if (!this._recording) {
      return Promise.resolve();
      console.log("enter 5");
    }

    this._recording = false;

    const result = new Float32Array(this._recLength);
    let offset = 0;
    for (let i = 0; i < this._recBuffer.length; i++) {
      result.set(this._recBuffer[i], offset);
      offset += this._recBuffer[i].length;
    }

    //this.emit(this.constructor.EVENTS.recordEnd);
    return this._processWithAudio(result, this._audioContext.sampleRate);
  }



  async postUtterance(value) {
    const params = {
      botAlias,
      botName,
      userId: this.anonymousUserId,
      inputText: value,
    };

    const response = await this.lex.postText(params).promise();

    // Emit a message for other objects that may be interested.
    this.messageBus.emit(LexBotEvents.RESPONSE_RECEIVED, response);

    return response;
  }

  /**
   * Allows an object to subsrcibe itself to an event emitted by this LexBot instance.
   *
   * @param {string} message
   *   The event type to listen for. For available events see LexBotEvents.
   * @param {function} callback
   *   The function to trigger when this event occurs.
   */
  listenTo(message, callback) {
    this.messageBus.listenTo(message, callback);
  }

  /**
   * Allows an object to unsubscribe from an event.
   *
   * @param {string} message
   *   The event type to stop listening for. For available events see LexBotEvents.
   * @param {*} callback
   *   The callback function that was previously registered as the event handler.
   */
  stopListening(message, callback) {
    this.messageBus.stopListening(message, callback);
  }

}

/**
 * Generates a random, anonymous ID that can be used to track a user
 * conversation with the Lex bot.
 *
 * IMPORTANT: It is extremely unlikely that this implementation would generate
 * the same random ID for two different users, but it is not impossible. If
 * you need a truly globally unique session ID you will need to use a different
 * approach.
 *
 * @returns {string} A unique ID for this user session
 */
function generateSimpleSessionId() {
  return `${Math.round(Math.random() * 100000000).toString(16)}-${Date.now().toString(16)}`;
}
