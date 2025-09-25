const playButton = document.getElementById('play-pause-btn');
const cdImage = document.getElementById('cd-image');
const audio = document.getElementById('audio');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');

// 当音频元数据加载时，设置进度条的最大值和总时长
audio.addEventListener('loadedmetadata', () => {
    progressBar.max = Math.floor(audio.duration);
    totalTimeDisplay.textContent = formatTime(audio.duration); // 显示总时长
});

// 每次播放时，更新当前时间并同步进度条
audio.addEventListener('timeupdate', () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTimeDisplay.textContent = formatTime(audio.currentTime); // 显示当前时间
});

// 拖动进度条时，跳转到指定时间
progressBar.addEventListener('input', () => {
    audio.currentTime = progressBar.value;
});


// 播放/暂停按钮
playButton.addEventListener('click', () => {
    const isPaused = audio.paused;

    if (isPaused) {
        audio.play();
        cdImage.style.animationPlayState = 'running';
        playButton.textContent = 'Pause';
    } else {
        audio.pause();
        cdImage.style.animationPlayState = 'paused';
        playButton.textContent = 'Play';
    }
});

// 格式化时间（秒 -> 分:秒）
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
}
