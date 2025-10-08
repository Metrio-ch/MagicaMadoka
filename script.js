const playButton = document.getElementById('play-pause-btn');
const cdImage = document.getElementById('cd-image');
const audio = document.getElementById('audio');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');
const songList = document.getElementById('song-list');
const songItems = document.querySelectorAll('.song-item');
const lyricsDisplay = document.getElementById('lyrics-display');

// 歌曲列表
const songs = [
  { src: 'song1.mp3', name: 'In horae punctum stetit', lyricsFile: 'Instrumental.txt' },
  { src: 'song2.mp3', name: '輪廻の檻', lyricsFile: 'lyrics2.txt' },
  { src: 'song3.mp3', name: '輪廻の檻-Instrumental', lyricsFile: 'Instrumental.txt' },
  { src: 'song4.mp3', name: 'Sis Puella Magica (Arr.)', lyricsFile: 'Instrumental.txt' }
];

let currentSongIndex = 0;

// 初始化播放器
function initPlayer() {
  loadSong(currentSongIndex);
  
  // 当音频元数据加载时，设置进度条的最大值和总时长
  audio.addEventListener('loadedmetadata', () => {
    progressBar.max = Math.floor(audio.duration);
    totalTimeDisplay.textContent = formatTime(audio.duration);
  });

  // 每次播放时，更新当前时间并同步进度条
  audio.addEventListener('timeupdate', () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
  });

  // 拖动进度条时，跳转到指定时间
  progressBar.addEventListener('input', () => {
    audio.currentTime = progressBar.value;
  });

  // 当歌曲结束时，播放下一首
  audio.addEventListener('ended', playNextSong);
}

// 加载歌曲
function loadSong(index) {
  currentSongIndex = index;
  audio.src = songs[index].src;
  
  // 加载歌词
  loadLyrics(songs[index].lyricsFile);
  
  // 更新歌曲列表高亮
  songItems.forEach((item, i) => {
    if (i === index) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // 如果音频正在播放，继续播放新歌曲
  if (!audio.paused) {
    audio.play();
  }
}

// 从txt文件加载歌词
function loadLyrics(lyricsFile) {
  lyricsDisplay.innerHTML = '<p>加载歌词中...</p>';
  
  fetch(lyricsFile)
    .then(response => {
      if (!response.ok) {
        throw new Error('歌词文件加载失败');
      }
      return response.text();
    })
    .then(lyricsText => {
      // 将歌词文本转换为HTML格式
      const formattedLyrics = formatLyrics(lyricsText);
      lyricsDisplay.innerHTML = formattedLyrics;
      
      // 确保歌词区域可以滚动
      setTimeout(() => {
        ensureLyricsScrollable();
      }, 100);
    })
    .catch(error => {
      console.error('加载歌词时出错:', error);
      lyricsDisplay.innerHTML = '<p>歌词加载失败</p>';
    });
}

// 确保歌词区域可以滚动
function ensureLyricsScrollable() {
  const lyricsContent = document.querySelector('.lyrics-content');
  if (lyricsContent) {
    // 强制启用滚动
    lyricsContent.style.overflowY = 'auto';
    lyricsContent.style.webkitOverflowScrolling = 'touch';
    
    // 如果内容高度小于容器高度，添加一些空行
    if (lyricsContent.scrollHeight <= lyricsContent.clientHeight) {
      const extraLines = 10 - lyricsDisplay.children.length;
      if (extraLines > 0) {
        for (let i = 0; i < extraLines; i++) {
          lyricsDisplay.innerHTML += '<p>&nbsp;</p>';
        }
      }
    }
  }
}

// 格式化歌词文本
function formatLyrics(lyricsText) {
  // 按行分割歌词
  const lines = lyricsText.split('\n');
  let formattedHTML = '';
  
  // 为每一行歌词创建段落
  lines.forEach(line => {
    if (line.trim() !== '') {
      formattedHTML += `<p>${line.trim()}</p>`;
    }
  });
  
  return formattedHTML;
}

// 播放下一首歌曲
function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
}

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

// 歌曲列表点击事件
songItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    loadSong(index);
    
    // 如果当前没有播放，开始播放
    if (audio.paused) {
      audio.play();
      cdImage.style.animationPlayState = 'running';
      playButton.textContent = 'Pause';
    }
  });
});

// 格式化时间（秒 -> 分:秒）
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
}

// 初始化播放器
initPlayer();

// 窗口大小改变时重新确保歌词可滚动
window.addEventListener('resize', ensureLyricsScrollable);
