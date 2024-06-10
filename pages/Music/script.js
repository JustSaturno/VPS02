const progress = document.querySelector('.progress');
const progressBar = document.querySelector('#duration');
const progressFilled = document.querySelector('.progress-filled-inner');

const resizeleftbar = document.querySelector('.sizeable-handle');
const leftbar = document.querySelector('.left-container');

const addButton = document.getElementById('add-music');
const musicContainer = document.querySelector('.add-music-container');

const volume = document.querySelector('.volume');

const audio = document.querySelector('audio');

const activePlaylist = document.querySelector('.main-playlist-songs');

const musicPlaying = document.querySelector('.music-playing');

// Sizeable leftbar

resizeleftbar.addEventListener('mousedown', (e) => {
    document.onmousemove = (e) => {

        if(e.clientX > 200) {
            leftbar.classList.remove('minimized');
            leftbar.style.width = `400px`;
        }

        if(e.clientX < 100) {
            leftbar.style.width = `90px`;
            leftbar.classList.add('minimized');
        }
    }

    document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
    }
})

// Add Music

musicContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains('add-music-container')) {
        musicContainer.classList.add('hidden');
        addButton.classList.remove('active');
        addButton.querySelector('i').classList.add('fa-plus');
        addButton.querySelector('i').classList.remove('fa-times');
    }
})

addButton.addEventListener('click', () => {
    
    addButton.classList.toggle('active');
    if (addButton.classList.contains('active')) {
        addButton.querySelector('i').classList.remove('fa-plus');
        addButton.querySelector('i').classList.add('fa-times');

        musicContainer.classList.remove('hidden');
    }
})

setTimeout(() => {
    activePlaylist.querySelectorAll('.song').forEach(song => {
        const songId = song.querySelector('.song-id').innerHTML;
        song.addEventListener('mouseover', () => {
            if(song.classList.contains('active')) {
                song.querySelector('.song-id').innerHTML = '<i class="fas fa-pause"></i>';
            }else {
                song.querySelector('.song-id').innerHTML = '<i class="fas fa-play"></i>';
            }
        })

        song.addEventListener('mouseout', () => {
            if(song.classList.contains('active')) {
                song.querySelector('.song-id').innerHTML = '<i class="fas fa-pause"></i>';
            }else {
                song.querySelector('.song-id').innerHTML = songId;
            }
            
        })

        song.addEventListener('click', () => {
            if(song.classList.contains('active')){
                return
            }

            document.querySelectorAll('.song').forEach(song => {
                song.classList.remove('active');
                song.querySelector('.song-id').innerHTML = song.getAttribute('song-id');
            })

            if(song.classList.contains('active')) {
                song.querySelector('.song-id').innerHTML = '<i class="fas fa-play"></i>';
            }

            if(!song.classList.contains('active')) {
                song.querySelector('.song-id').innerHTML = songId;

                musicPlaying.innerHTML = song.innerHTML;
                const songPath = song.getAttribute('path-data');
                const songTitle = song.querySelector('.song-title').innerHTML;
                const songArtist = song.querySelector('.song-artist').innerHTML;

                document.querySelector('#cover-art').src = `../assets/musics/${songPath}/${songPath}.jpg`;
                document.querySelector('#song-info').innerHTML = `<span id="title">${songTitle}</span><span id="artist">${songArtist}</span>`

                audio.src = `../assets/musics/${songPath}/${songPath}.mp3`;
                togglePlay(document.querySelector('#play'));
            }

            song.classList.toggle('active');
            
        })
    })
}, 100)


var volumeValue = 0;

// Controls

function togglePlay(e) {
    if (audio.paused) {
        audio.play();
        e.querySelector('i').classList.remove('fa-play');
        e.querySelector('i').classList.add('fa-pause');
    } else {
        audio.pause();
        e.querySelector('i').classList.remove('fa-pause');
        e.querySelector('i').classList.add('fa-play');
    }

    const minutes = Math.floor(audio.duration / 60);
    let seconds = Math.floor(audio.duration % 60);
    if (seconds < 10) {  
        seconds = `0${seconds}`
    }
    document.querySelector('#duration-time').textContent = `${minutes}:${seconds}`
}

function toggleRepeat(e) {
    if (audio.loop) {
        audio.loop = false;
        e.querySelector('i').classList.remove('active');
    } else {
        audio.loop = true;
        e.querySelector('i').classList.add('active');
    }
}

function prevSong() {
    
}

function nextSong() {
    
}

// Volume

volume.querySelector('input').addEventListener('input', (e) => {
    const volumeValue = e.target.value / 100;
    audio.volume = volumeValue;

    volume.querySelector('.volume-range').style.width = `${volumeValue * 90}%`;

    if (volumeValue === 0) {
        volume.querySelector('i').classList.remove('fa-volume-up');
        volume.querySelector('i').classList.add('fa-volume-off');
    }

    if (volumeValue > 0 && volumeValue < 0.8) {
        volume.querySelector('i').classList.remove('fa-volume-off');
        volume.querySelector('i').classList.remove('fa-volume-up');
        volume.querySelector('i').classList.add('fa-volume-down');
    }

    if (volumeValue > 0.8) {
        volume.querySelector('i').classList.remove('fa-volume-down');
        volume.querySelector('i').classList.add('fa-volume-up');
    }  
})

volume.querySelector('i').addEventListener('click', () => {
    if(volume.querySelector('input').value != 0) {
        volumeValue = volume.querySelector('input').value;
    }

    if(audio.muted) {
        audio.muted = false;
        volume.querySelector('input').value = volumeValue
        volume.querySelector('.volume-range').style.width = `${volumeValue}%`;
        volume.querySelector('i').classList.remove('fa-volume-off');
        volume.querySelector('i').classList.add('fa-volume-down');
    }else {
        audio.muted = true;
        volume.querySelector('input').value = 0;
        volume.querySelector('.volume-range').style.width = `0%`;
        volume.querySelector('i').classList.remove('fa-volume-up');
        volume.querySelector('i').classList.remove('fa-volume-down');
        volume.querySelector('i').classList.add('fa-volume-off');
    }
})

// Progress

progress.addEventListener('input', (e) => {
    const progressValue = e.target.value;
    audio.currentTime = (progressValue * audio.duration) / 100;

    
    progressFilled.style.width = `${progressValue}%`;
})

audio.onloadedmetadata = () => {
    const minutes = Math.floor(audio.duration / 60);
    let seconds = Math.floor(audio.duration % 60);
    if (seconds < 10) {  
        seconds = `0${seconds}`
    }
    document.querySelector('#duration-time').textContent = `${minutes}:${seconds}`
}

audio.addEventListener('timeupdate', () => {
    const progressValue = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progressValue;
    progressFilled.style.width = `${progressValue}%`;
    const minutes = Math.floor(audio.currentTime / 60);
    let seconds = Math.floor(audio.currentTime % 60);
    if (seconds < 10) {  
        seconds = `0${seconds}`
    }
    document.querySelector('#progress-time').textContent = `${minutes}:${seconds}`
})

audio.addEventListener('ended', () => {
    if(!audio.loop) {
        audio.pause();
        document.querySelector('#play').querySelector('i').classList.remove('fa-pause');
        document.querySelector('#play').querySelector('i').classList.add('fa-play');
    }
})


function addMusic(e) {
    return;
    e.preventDefault();
    let body = {
        url: document.querySelector('#url-input').value,
    }

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };

    options.body = JSON.stringify(body);

    fetch('http://localhost:3050/musicCreate', options)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.status == 200) {
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }

            if(data.status == 400) {
                if(data.error == 'URL must be a YouTube video') {
                    document.querySelector('#url-input').classList.add('error');
                    document.querySelector('#url-input').value = '';
                    document.querySelector('#url-input').setAttribute('placeholder', 'Must be a YouTube video');
                } else if (data.error == 'Must be a URL') {
                    document.querySelector('#url-input').classList.add('error');
                    document.querySelector('#url-input').value = '';
                    document.querySelector('#url-input').setAttribute('placeholder', 'Must be a URL');
                }
            }
        })
}

const btnfxmodel = document.querySelector("#fxModel")

function fxbtn(){
    document.querySelector('.modelOptions').style.display = 'none';

}
