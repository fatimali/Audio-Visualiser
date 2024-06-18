const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const playPauseButton = document.getElementById('play-pause-button');

canvas.width = 1080;
canvas.height = 1080; // Set canvas size to 1080x1080

let audioContext;
let analyser;
let source;
let audioElement;
let isPlaying = false;

// Function to initialize the audio visualizer
function initVisualizer() {
    audioElement = new Audio('Everglow.mp3');  // Path to your audio file
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 2048; // Increase fftSize for better waveform resolution

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray); // Use getByteTimeDomainData for waveform

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FFFF00'; // Yellow color for waveform
        ctx.beginPath();

        const sliceWidth = canvas.width * 1.0 / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0; // Normalize to 0-1
            const y = v * canvas.height / 2;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
    }

    draw();

    // Hide play/pause button after starting playback
    playPauseButton.style.display = 'none';

    // Allow spacebar to toggle play/pause
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            togglePlayPause();
        }
    });
}

// Play or pause the audio and update the button text
function togglePlayPause() {
    if (isPlaying) {
        audioElement.pause();
    } else {
        audioElement.play().then(() => {
            console.log('Audio playback started');
        }).catch(error => {
            console.error('Error playing audio:', error);
        });
    }
    isPlaying = !isPlaying;
}

// Initialize the visualizer when the button is clicked
playPauseButton.addEventListener('click', () => {
    if (!audioContext) {
        initVisualizer();
    }
    togglePlayPause();
});
