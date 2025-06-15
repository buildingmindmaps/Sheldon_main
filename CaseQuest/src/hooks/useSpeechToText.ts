import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

// @ts-ignore
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

interface UseSpeechToTextOptions {
    onTranscript: (transcript: string) => void;
}

export const useSpeechToText = ({ onTranscript }: UseSpeechToTextOptions) => {
    const [isRecording, setIsRecording] = useState(false);
    const [volume, setVolume] = useState(0);
    const recognitionRef = useRef<any | null>(null);
    const textBeforeRecordingRef = useRef('');
    const silenceTimeoutRef = useRef<any>(null);
    const onTranscriptRef = useRef(onTranscript);

    // For audio visualization
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);


    // Keep the onTranscript ref up to date to avoid re-running main useEffect
    useEffect(() => {
        onTranscriptRef.current = onTranscript;
    }, [onTranscript]);

    const stop = useCallback(() => {
        // This function is designed to be idempotent for safe calling
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
        }
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
        setVolume(0);
    }, []);

    const handleTranscript = useCallback((event: any) => {
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
        }

        const fullTranscript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');

        onTranscriptRef.current(textBeforeRecordingRef.current + (textBeforeRecordingRef.current ? ' ' : '') + fullTranscript);
        
        silenceTimeoutRef.current = setTimeout(() => {
            stop();
        }, 3000); // Stop after 3 seconds of silence

    }, [stop]);

    useEffect(() => {
        if (!SpeechRecognitionAPI) {
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsRecording(true);
            toast.info("Recording started...");
        };

        recognition.onresult = handleTranscript;

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            if (event.error !== 'aborted') {
                toast.error(`Speech recognition error: ${event.error}. Please check browser permissions.`);
            }
            // `onend` will be called after an error, which will handle state updates.
        };

        recognition.onend = () => {
            // Using functional update to get the latest state
            setIsRecording(wasRecording => {
                if (wasRecording) {
                    toast.info("Recording stopped.");
                }
                return false;
            });
            stop(); // Ensure full cleanup
        };

        recognitionRef.current = recognition;

        return () => {
            stop();
        };
    }, [handleTranscript, stop]);

    const start = useCallback((existingText = '') => {
        if (isRecording || !SpeechRecognitionAPI) {
            return;
        }
        // Play start sound
        const startAudio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        startAudio.play().catch(e => console.error("Error playing start sound:", e));

        textBeforeRecordingRef.current = existingText.trim();
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                streamRef.current = stream;
                recognitionRef.current?.start();

                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                audioContextRef.current = audioContext;
                const source = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                source.connect(analyser);
                
                const dataArray = new Uint8Array(analyser.frequencyBinCount);

                const monitor = () => {
                    if (audioContextRef.current && audioContextRef.current.state === 'running') {
                        analyser.getByteFrequencyData(dataArray);
                        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length || 0;
                        setVolume(avg / 128);
                        animationFrameIdRef.current = requestAnimationFrame(monitor);
                    } else {
                       if (animationFrameIdRef.current) {
                           cancelAnimationFrame(animationFrameIdRef.current);
                           animationFrameIdRef.current = null;
                       }
                    }
                };
                monitor();
            })
            .catch(err => {
                console.error('Microphone access error:', err);
                toast.error('Microphone access denied. Please allow microphone access in your browser settings.');
            });
    }, [isRecording]);

    const manualStop = useCallback(() => {
        if (!isRecording) return;
        
        // Play stop sound
        const stopAudio = new Audio('https://actions.google.com/sounds/v1/acknowledgements/glitch.ogg');
        stopAudio.play().catch(e => console.error("Error playing stop sound:", e));

        stop();
    }, [isRecording, stop]);

    return {
        isRecording,
        start,
        stop: manualStop,
        isSupported: !!SpeechRecognitionAPI,
        volume,
    };
};
