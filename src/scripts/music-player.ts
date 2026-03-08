const audio = document.getElementById('ambientAudio') as HTMLAudioElement
let tracks: string[] = []
let currentIndex = 0

audio.volume = 0.3

function trackDisplayName(path: string): string {
  return decodeURIComponent(path.split('/').pop()?.replace('.mp3', '') || '')
}

function loadTrack(index: number) {
  if (tracks.length === 0) return
  audio.src = tracks[index]
  const nowPlaying = document.getElementById('nowPlaying')
  if (nowPlaying) nowPlaying.textContent = trackDisplayName(tracks[index])
}

audio.addEventListener('ended', () => {
  currentIndex = (currentIndex + 1) % tracks.length
  loadTrack(currentIndex)
  audio.play()
})

function handleClick() {
  if (audio.paused) {
    if (!audio.src || audio.src === location.href) loadTrack(currentIndex)
    audio.play()
    syncUI()
  } else {
    audio.pause()
    syncUI()
  }
}

function skipTrack(direction: number) {
  if (tracks.length === 0) return
  const wasPlaying = !audio.paused
  currentIndex = (currentIndex + direction + tracks.length) % tracks.length
  loadTrack(currentIndex)
  if (wasPlaying) audio.play()
  syncUI()
}

function handlePrev() { skipTrack(-1) }
function handleNext() { skipTrack(1) }

function syncUI() {
  const musicBtn = document.getElementById('musicToggle')
  const playIcon = document.querySelector('.music-play') as SVGElement
  const pauseIcon = document.querySelector('.music-pause') as SVGElement
  const nowPlaying = document.getElementById('nowPlaying')
  const nowPlayingBar = document.getElementById('nowPlayingBar')

  if (!musicBtn) return

  tracks = JSON.parse(musicBtn.dataset.tracks || '[]')
  const playing = !audio.paused

  if (playIcon) playIcon.style.display = playing ? 'none' : ''
  if (pauseIcon) pauseIcon.style.display = playing ? '' : 'none'
  if (nowPlayingBar) nowPlayingBar.style.visibility = playing ? 'visible' : 'hidden'
  if (nowPlaying && playing) nowPlaying.textContent = trackDisplayName(tracks[currentIndex] || '')
  musicBtn.setAttribute('aria-pressed', String(playing))
  musicBtn.setAttribute('aria-label', playing ? 'Pause ambient music' : 'Play ambient music')

  musicBtn.removeEventListener('click', handleClick)
  musicBtn.addEventListener('click', handleClick)

  const prevBtn = document.getElementById('prevTrack')
  const nextBtn = document.getElementById('nextTrack')
  if (prevBtn) {
    prevBtn.removeEventListener('click', handlePrev)
    prevBtn.addEventListener('click', handlePrev)
  }
  if (nextBtn) {
    nextBtn.removeEventListener('click', handleNext)
    nextBtn.addEventListener('click', handleNext)
  }
}

document.addEventListener('astro:page-load', syncUI)
