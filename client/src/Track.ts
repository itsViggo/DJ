import useAudioContext from "./useAudioContext";

export default class Track {
    #audioContext: AudioContext;
    #source: AudioBufferSourceNode;
    #offset: number;
    #gainNode: GainNode;
    #startTime: number;
    #started: boolean;
    #onTrackEnded?: () => void;

    constructor(options?: {onTrackEnded: () => void}) {
        this.#audioContext = useAudioContext();
        this.#source = this.#audioContext.createBufferSource();
        this.#offset = 0;
        this.#gainNode = this.#audioContext.createGain();
        this.#gainNode.connect(this.#audioContext.destination);
        this.#startTime = 0;
        this.#started = false;
        this.#onTrackEnded = options?.onTrackEnded;
    }

    play() {
        if (this.#started) {
            return;
        }
        if (this.#audioContext.state === "suspended") {
            this.#audioContext.resume();
        }
        this.#source.start(undefined, this.#offset);
        this.#started = true;
        this.#startTime = this.#audioContext.currentTime;
    }

    pause() {
        if (!this.#started) {
            return;
        }
        const prevBuffer = this.#source.buffer;
        this.reInitializeSourceNodeWithData(prevBuffer);
        this.#offset = (this.#audioContext.currentTime - this.#startTime) + this.#offset;
    }

    set volume(volume: number) {
        this.#gainNode.gain.value = volume;
    }

    async setFile(newTrack: File) {
        const buffArr = await newTrack.arrayBuffer();
        const audioData = await this.#audioContext.decodeAudioData(buffArr);
        this.reInitializeSourceNodeWithData(audioData);
        this.#offset = 0;
    }

    private reInitializeSourceNodeWithData(buffer: AudioBuffer | null) {
        if (this.#started) {
            this.#source.stop();
            this.#started = false;
        }
        this.#source.disconnect();
        this.#source = this.#audioContext.createBufferSource();
        this.#source.buffer = buffer;
        this.#source.onended = () => {
            if (this.#started) {
                this.reInitializeSourceNodeWithData(this.#source.buffer);
                this.#offset = 0;
                this.#onTrackEnded?.()
            }
        }
        this.#source.connect(this.#gainNode).connect(this.#audioContext.destination);
    }
}