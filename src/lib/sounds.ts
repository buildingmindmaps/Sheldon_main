// Sound utility for SWOT Analysis page
// Manages playback of sound effects for user interactions

// Define sound file paths
const SOUNDS = {
  CORRECT_ANSWER: '/Sounds/correct-ans-2.mp3',
  WRONG_ANSWER: '/Sounds/wrong-ans-2.mp3',
  BUTTON_CLICK: '/Sounds/button-click-1.mp3',
  LEVEL_COMPLETE: '/Sounds/game-level-complete-1.mp3',
};

// Audio cache to prevent reloading sounds
const audioCache: Record<string, HTMLAudioElement> = {};

/**
 * Preload sounds for better performance
 */
export function preloadSounds(): void {
  Object.values(SOUNDS).forEach((soundPath) => {
    const audio = new Audio(soundPath);
    audio.preload = 'auto';
    audioCache[soundPath] = audio;
  });
}

/**
 * Play a sound from cache or create a new audio instance
 * @param soundPath - Path to the sound file
 */
function playSound(soundPath: string): void {
  try {
    let audio = audioCache[soundPath];

    if (!audio) {
      audio = new Audio(soundPath);
      audioCache[soundPath] = audio;
    }

    // Reset and play
    audio.currentTime = 0;
    audio.play().catch((error) => {
      console.error('Error playing sound:', error);
    });
  } catch (error) {
    console.error('Sound playback error:', error);
  }
}

// Sound player functions for specific actions
export const SoundEffects = {
  /**
   * Play sound for correct answer submission
   */
  playCorrectAnswer: () => playSound(SOUNDS.CORRECT_ANSWER),

  /**
   * Play sound for wrong answer submission
   */
  playWrongAnswer: () => playSound(SOUNDS.WRONG_ANSWER),

  /**
   * Play sound for button clicks (navigation)
   */
  playButtonClick: () => playSound(SOUNDS.BUTTON_CLICK),

  /**
   * Play sound for module completion
   */
  playLevelComplete: () => playSound(SOUNDS.LEVEL_COMPLETE),
};

// Enable or disable all sounds
let soundEnabled = true;

export function toggleSounds(enable?: boolean): boolean {
  if (enable !== undefined) {
    soundEnabled = enable;
  } else {
    soundEnabled = !soundEnabled;
  }
  return soundEnabled;
}

// Wrap the original sound functions to respect the enabled setting
Object.keys(SoundEffects).forEach((key) => {
  const originalFn = (SoundEffects as any)[key];
  (SoundEffects as any)[key] = (...args: any[]) => {
    if (soundEnabled) {
      return originalFn(...args);
    }
  };
});
