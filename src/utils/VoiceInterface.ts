export class VoiceInterface {
  private recognition: any = null;
  private synthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private onResultCallback: ((text: string) => void) | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (this.onResultCallback) {
          this.onResultCallback(transcript);
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  startListening(onResult: (text: string) => void): boolean {
    if (!this.recognition) {
      console.warn('Speech recognition not supported');
      return false;
    }

    if (this.isListening) {
      return false;
    }

    this.onResultCallback = onResult;
    this.isListening = true;
    this.recognition.start();
    return true;
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text: string, options: { voice?: SpeechSynthesisVoice; rate?: number; pitch?: number } = {}) {
    if (!this.synthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set luxury voice preferences
    const voices = this.synthesis.getVoices();
    const preferredVoice = options.voice || 
      voices.find(voice => voice.name.includes('Female') && voice.lang.startsWith('en')) ||
      voices.find(voice => voice.lang.startsWith('en')) ||
      voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = options.rate || 0.9; // Slightly slower for luxury feel
    utterance.pitch = options.pitch || 1.1; // Slightly higher pitch
    utterance.volume = 0.8;

    this.synthesis.speak(utterance);
  }

  isVoiceSupported(): boolean {
    return !!(this.recognition && this.synthesis);
  }

  getCurrentListeningState(): boolean {
    return this.isListening;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis?.getVoices() || [];
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default VoiceInterface;