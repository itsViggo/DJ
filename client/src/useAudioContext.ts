let audioContext : AudioContext | null = null;

export default function useAudioContext(): AudioContext {
    if (audioContext === null) {
        audioContext = new AudioContext();
    }
    return audioContext;
}