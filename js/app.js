/* ============================================================
   FOCUSFLOW ULTRA v3.2 — FIXED
   ============================================================ */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ============ STATE ============ */
const S = {
    theme: 'dark',
    ytMuted: false,
    ytMinimized: false,
    ytHidden: false,
    ytVolume: 60,
    ytSpeed: 1,
    ytQuality: 'default',
    ytAutoplay: true,
    ytShuffle: false,
    ytRepeat: 0,
    ytQueue: [],
    ytIndex: -1,
    ytPos: { right: 24, bottom: 24 },
    ytSize: { width: 400 },
    ytPlaylistId: '',
    ytLastLoaded: 'jfKfPfyJRdk',
    ytLastName: 'Lofi Hip Hop Radio'
};
function loadState() {
    try {
        const raw = localStorage.getItem('focusflow_ultra');
        if (raw) Object.assign(S, JSON.parse(raw));
    } catch(e) {}
}
function saveState() { localStorage.setItem('focusflow_ultra', JSON.stringify(S)); }

/* ============================================================
   NEBULA
   ============================================================ */
(function nebula() {
    const canvas = document.getElementById('nebula');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], mouse = { x: -9999, y: -9999 };
    function resize() {
        W = canvas.width = innerWidth * devicePixelRatio;
        H = canvas.height = innerHeight * devicePixelRatio;
        canvas.style.width = innerWidth + 'px';
        canvas.style.height = innerHeight + 'px';
    }
    resize();
    addEventListener('resize', resize);
    addEventListener('mousemove', e => {
        mouse.x = e.clientX * devicePixelRatio;
        mouse.y = e.clientY * devicePixelRatio;
    });
    class Particle {
        constructor() { this.reset(true); }
        reset(initial) {
            this.x = Math.random() * W;
            this.y = initial ? Math.random() * H : H + 20 * devicePixelRatio;
            this.size = (Math.random() * 2 + 0.5) * devicePixelRatio;
            this.speedY = -(Math.random() * 0.35 + 0.05) * devicePixelRatio;
            this.speedX = (Math.random() - 0.5) * 0.15 * devicePixelRatio;
            this.hue = [265, 190, 155][Math.floor(Math.random() * 3)];
            this.alpha = Math.random() * 0.6 + 0.15;
            this.phase = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.02 + Math.random() * 0.02;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            const dx = this.x - mouse.x, dy = this.y - mouse.y;
            const d2 = dx * dx + dy * dy;
            const maxD = (180 * devicePixelRatio) ** 2;
            if (d2 < maxD) {
                const force = (1 - d2 / maxD) * 0.6;
                this.x += (dx / Math.sqrt(d2 || 1)) * force;
                this.y += (dy / Math.sqrt(d2 || 1)) * force;
            }
            this.phase += this.pulseSpeed;
            if (this.y < -20 || this.x < -20 || this.x > W + 20) this.reset(false);
        }
        draw() {
            const a = this.alpha * (0.7 + 0.3 * Math.sin(this.phase));
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 90%, 65%, ${a})`;
            ctx.shadowColor = `hsla(${this.hue}, 90%, 65%, ${a * 1.5})`;
            ctx.shadowBlur = 8 * devicePixelRatio;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    for (let i = 0; i < 80; i++) particles.push(new Particle());
    (function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    })();
})();

function spawnBubbles() {
    const wrap = $('#bubbles');
    if (!wrap) return;
    for (let i = 0; i < 20; i++) {
        const b = document.createElement('div');
        b.className = 'bubble';
        const size = 20 + Math.random() * 80;
        b.style.width = size + 'px';
        b.style.height = size + 'px';
        b.style.left = Math.random() * 100 + '%';
        b.style.animationDuration = (14 + Math.random() * 16) + 's';
        b.style.animationDelay = (Math.random() * 14) + 's';
        b.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
        wrap.appendChild(b);
    }
}

function toast(msg, type = 'info') {
    const icons = { info: '✨', success: '✅', warn: '⚠️', focus: '🎯', music: '🎵' };
    const el = document.createElement('div');
    el.className = 'toast-msg';
    el.innerHTML = `<span>${icons[type] || '✨'}</span><span>${msg}</span>`;
    $('#toastStack').appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 3000);
}

addEventListener('load', () => setTimeout(() => $('#loader').classList.add('hide'), 1000));

/* THEME */
$('#themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('light');
    const light = document.body.classList.contains('light');
    S.theme = light ? 'light' : 'dark';
    saveState();
    $('#themeToggle').innerHTML = light
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
});

/* FOCUS MODE */
function toggleFocusMode() {
    document.body.classList.toggle('focus-mode');
    const on = document.body.classList.contains('focus-mode');
    $('#focusModeBtn').innerHTML = on
        ? '<i class="fa-solid fa-compress"></i>'
        : '<i class="fa-solid fa-expand"></i>';
    if (on && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else if (!on && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
    }
    toast(on ? 'Focus mode ON' : 'Focus mode OFF', 'focus');
}
$('#focusModeBtn').addEventListener('click', toggleFocusMode);

/* ============================================================
   TIMER
   ============================================================ */
let interval = null;
let totalSeconds = 25 * 60;
let remaining = 25 * 60;
let mode = 'focus';
let currentPreset = 25;

const ringFill = $('#ringFill');
const ringSecond = $('#ringSecond');
const ringTip = $('#ringTip');
const timeMM = $('.t-mm');
const timeSS = $('.t-ss');
const timeSub = $('#timeSub');
const modePill = $('#modePill');
const startBtn = $('#startTimer');
const clockStage = $('#clockStage');
const progressLine = $('#progressLine');
const progressPct = $('#progressPct');

const CIRC_MAIN = 2 * Math.PI * 168;
const CIRC_SEC = 2 * Math.PI * 186;
const TIP_RADIUS = 168;

function buildTicks() {
    const g = $('#ticks');
    if (!g) return;
    const cx = 200, cy = 200, rO = 190, rI = 182;
    for (let i = 0; i < 60; i++) {
        const a = (i / 60) * Math.PI * 2;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', cx + Math.cos(a) * rI);
        line.setAttribute('y1', cy + Math.sin(a) * rI);
        line.setAttribute('x2', cx + Math.cos(a) * rO);
        line.setAttribute('y2', cy + Math.sin(a) * rO);
        if (i % 5 === 0) line.setAttribute('stroke-width', '2');
        g.appendChild(line);
    }
}

function renderTime() {
    const m = Math.floor(remaining / 60).toString().padStart(2, '0');
    const s = (remaining % 60).toString().padStart(2, '0');
    timeMM.textContent = m;
    timeSS.textContent = s;
    timeSub.textContent = `${Math.floor(remaining/60)} min · ${remaining%60} sec`;

    const frac = 1 - remaining / totalSeconds;
    ringFill.style.strokeDashoffset = CIRC_MAIN * frac;
    const secFrac = (remaining % 60) / 60;
    ringSecond.style.strokeDashoffset = CIRC_SEC * (1 - secFrac);
    const tipRad = (-90 + frac * 360) * Math.PI / 180;
    ringTip.setAttribute('cx', 200 + Math.cos(tipRad) * TIP_RADIUS);
    ringTip.setAttribute('cy', 200 + Math.sin(tipRad) * TIP_RADIUS);
    const pct = Math.round(frac * 100);
    progressLine.style.width = pct + '%';
    progressPct.textContent = pct + '%';
    document.title = `${m}:${s} · ${mode === 'focus' ? 'Focus' : 'Break'} — FocusFlow`;
}

function setMode(newMode) {
    mode = newMode;
    modePill.textContent = mode === 'focus' ? 'FOCUS' : 'BREAK';
    modePill.classList.toggle('break', mode !== 'focus');
}

function startTick() {
    clockStage.classList.add('running');
    startBtn.classList.add('paused');
    startBtn.innerHTML = '<i class="fa-solid fa-pause"></i><span>Pause</span>';
    interval = setInterval(() => {
        remaining--;
        renderTime();
        if (remaining <= 0) {
            clearInterval(interval);
            interval = null;
            completeSession();
        }
    }, 1000);
}

function pauseTick() {
    clockStage.classList.remove('running');
    startBtn.classList.remove('paused');
    startBtn.innerHTML = '<i class="fa-solid fa-play"></i><span>Resume</span>';
    clearInterval(interval);
    interval = null;
}

function resetTimer() {
    clearInterval(interval);
    interval = null;
    remaining = totalSeconds;
    clockStage.classList.remove('running');
    startBtn.classList.remove('paused');
    startBtn.innerHTML = '<i class="fa-solid fa-play"></i><span>Start</span>';
    renderTime();
}

function completeSession() {
    const mins = Math.round(totalSeconds / 60);
    if (mode === 'focus') {
        toast(`${mins} min focus complete! 🎯`, 'focus');
        beep();
        setTimeout(() => {
            totalSeconds = 5 * 60;
            remaining = totalSeconds;
            setMode('break');
            renderTime();
            toast('5-min break ☕', 'info');
            currentPreset = 5;
            $$('.preset').forEach(p => p.classList.remove('active'));
        }, 800);
    } else {
        toast('Break over. Focus again? 🚀', 'success');
        beep();
        setTimeout(() => {
            totalSeconds = (currentPreset || 25) * 60;
            remaining = totalSeconds;
            setMode('focus');
            renderTime();
        }, 800);
    }
    resetTimer();
}

function beep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        [523, 659, 784, 1047].forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = f;
            osc.type = 'sine';
            osc.connect(gain).connect(ctx.destination);
            const t = ctx.currentTime + i * 0.12;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.18, t + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
            osc.start(t); osc.stop(t + 0.4);
        });
    } catch(e) {}
}

startBtn.addEventListener('click', () => { if (interval) pauseTick(); else startTick(); });
$('#resetTimer').addEventListener('click', () => { resetTimer(); toast('Timer reset', 'info'); });
$('#skipTimer').addEventListener('click', () => {
    remaining = 1;
    if (!interval) startTick();
    toast('Skipping…', 'info');
});

$$('.preset[data-min]').forEach(btn => {
    btn.addEventListener('click', () => {
        const min = +btn.dataset.min;
        currentPreset = min;
        totalSeconds = min * 60;
        remaining = totalSeconds;
        resetTimer();
        setMode('focus');
        renderTime();
        $$('.preset').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        $('#customPanel').classList.remove('open');
        toast(`${min} min preset`, 'focus');
    });
});

$('#customTimeBtn').addEventListener('click', () => $('#customPanel').classList.toggle('open'));
$('#customCancel').addEventListener('click', () => $('#customPanel').classList.remove('open'));
$('#customApply').addEventListener('click', () => {
    const m = Math.max(0, Math.min(180, +$('#customMin').value || 0));
    const s = Math.max(0, Math.min(59, +$('#customSec').value || 0));
    if (m === 0 && s === 0) return toast('Enter a valid time', 'warn');
    totalSeconds = m * 60 + s;
    remaining = totalSeconds;
    currentPreset = m;
    resetTimer();
    setMode('focus');
    renderTime();
    $('#customPanel').classList.remove('open');
    $$('.preset').forEach(p => p.classList.remove('active'));
    toast(`Custom: ${m}m ${s}s`, 'focus');
});

/* ============================================================
   YOUTUBE PLAYER — FIXED
   ============================================================ */
const ytPlayer = $('#ytPlayer');
const ytOverlay = $('#ytOverlay');
const ytLoading = $('#ytLoading');
const ytTitle = $('#ytTitle');
const ytTitleOverlay = $('#ytTitleOverlay');
const ytCurTime = $('#ytCurTime');
const ytDurTime = $('#ytDurTime');
const ytIdx = $('#ytIdx');
const ytPlayPause = $('#ytPlayPause');
const ytCenterPlay = $('#ytCenterPlay');
const ytVolume = $('#ytVolume');
const ytExpand = $('#ytExpand');
const ytClose = $('#ytClose');
const ytRestore = $('#ytRestore');
const ytProgress = $('#ytProgress');
const ytProgressFill = $('#ytProgressFill');
const ytProgressBuffer = $('#ytProgressBuffer');
const ytFsBtn = $('#ytFsBtn');
const ytDragbar = $('#ytDragbar');
const ytResize = $('#ytResize');
const ytVolSlider = $('#ytVolSlider');
const ytVolValue = $('#ytVolValue');
const ytSleepTimer = $('#ytSleepTimer');
const ytSleepCountdown = $('#ytSleepCountdown');
const ytQueueEl = $('#ytQueue');
const ytQueueBadge = $('#queueBadge');
const queueInfo = $('#queueInfo');

let ytApi = null;
let ytIsPlaying = false;
let ytIsMuted = false;
let ytIsReady = false;
let progressInterval = null;
let sleepInterval = null;
let sleepRemaining = 0;

/* ✅ FIX: Central overlay-hide helper */
function hideOverlay() {
    if (ytOverlay) {
        ytOverlay.classList.add('hide');
    }
}
function showOverlay() {
    if (ytOverlay) {
        ytOverlay.classList.remove('hide');
    }
}

function loadYTAPI() {
    if (window.YT && window.YT.Player) { initYTPlayer(); return; }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.onerror = () => toast('YouTube API blocked — check connection', 'warn');
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = initYTPlayer;
}

function initYTPlayer() {
    if (ytApi) return;
    ytLoading.classList.add('show');

    const playerVars = {
        autoplay: 1,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        origin: location.origin,
        enablejsapi: 1,
        iv_load_policy: 3
    };

    const playerConfig = {
        playerVars,
        events: {
            onReady: (e) => {
                ytIsReady = true;
                ytLoading.classList.remove('show');
                hideOverlay();  /* ✅ FIX #1 */
                try {
                    ytApi.setVolume(S.ytVolume);
                    ytApi.setPlaybackRate(S.ytSpeed);
                    if (S.ytQuality !== 'default') {
                        ytApi.setPlaybackQuality(S.ytQuality);
                    }
                } catch(err) {}
                startProgressLoop();
                if (S.ytQueue.length > 0 && S.ytIndex >= 0) {
                    loadQueueItem(S.ytIndex, false);
                }
            },
            onStateChange: (e) => {
                const st = e.data;
                if (st === YT.PlayerState.PLAYING) {
                    ytIsPlaying = true;
                    ytPlayer.classList.add('playing');
                    ytPlayPause.innerHTML = '<i class="fa-solid fa-pause"></i>';
                    ytCenterPlay.innerHTML = '<i class="fa-solid fa-pause"></i>';
                    ytLoading.classList.remove('show');
                    hideOverlay();  /* ✅ FIX #2 */
                } else if (st === YT.PlayerState.PAUSED) {
                    ytIsPlaying = false;
                    ytPlayer.classList.remove('playing');
                    ytPlayPause.innerHTML = '<i class="fa-solid fa-play"></i>';
                    ytCenterPlay.innerHTML = '<i class="fa-solid fa-play"></i>';
                    hideOverlay();  /* ✅ FIX #3 */
                } else if (st === YT.PlayerState.ENDED) {
                    handleVideoEnd();
                } else if (st === YT.PlayerState.BUFFERING) {
                    ytLoading.classList.add('show');
                    hideOverlay();  /* ✅ FIX #4 */
                } else if (st === YT.PlayerState.CUED) {
                    hideOverlay();  /* ✅ FIX #5 */
                }
            },
            onError: (e) => {
                ytLoading.classList.remove('show');
                console.warn('YT error', e.data);
                if (e.data === 100 || e.data === 101 || e.data === 150) {
                    toast('Video unavailable — skipping', 'warn');
                    setTimeout(() => nextVideo(), 800);
                } else {
                    toast('Playback error', 'warn');
                }
            }
        }
    };

    if (S.ytQueue.length > 0 && S.ytIndex >= 0) {
        const item = S.ytQueue[S.ytIndex];
        playerConfig.videoId = item.id;
        ytApi = new YT.Player('ytFrame', playerConfig);
        updateNowPlaying(item);
    } else if (S.ytLastLoaded) {
        const vid = extractVideoId(S.ytLastLoaded);
        if (vid) playerConfig.videoId = vid;
        ytApi = new YT.Player('ytFrame', playerConfig);
    } else {
        ytApi = new YT.Player('ytFrame', playerConfig);
    }
}

function fmtTime(s) {
    if (!s || isNaN(s)) return '0:00';
    s = Math.floor(s);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    return `${m}:${String(sec).padStart(2,'0')}`;
}

function startProgressLoop() {
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
        if (!ytApi || !ytIsReady) return;
        try {
            const cur = ytApi.getCurrentTime() || 0;
            const dur = ytApi.getDuration() || 0;
            if (dur > 0) {
                const pct = (cur / dur) * 100;
                ytProgressFill.style.width = pct + '%';
                ytProgressBuffer.style.width = Math.min(100, pct + 12) + '%';
                ytCurTime.textContent = fmtTime(cur);
                ytDurTime.textContent = fmtTime(dur);
            } else {
                ytCurTime.textContent = 'LIVE';
                ytDurTime.textContent = 'LIVE';
            }
        } catch(err) {}
    }, 500);
}

/* ✅ FIX #6: Overlay click → instant hide + load */
ytOverlay.addEventListener('click', () => {
    hideOverlay();
    ytLoading.classList.add('show');
    if (!ytApi || !ytIsReady) {
        loadYTAPI();
    } else {
        try { ytApi.playVideo(); } catch(e) {}
    }
});

ytProgress.addEventListener('click', (e) => {
    if (!ytApi || !ytIsReady) return;
    const rect = ytProgress.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    try {
        const dur = ytApi.getDuration();
        if (dur > 0) ytApi.seekTo(dur * pct, true);
    } catch(err) {}
});

function togglePlay() {
    if (!ytApi || !ytIsReady) { loadYTAPI(); return; }
    hideOverlay();
    if (ytIsPlaying) ytApi.pauseVideo();
    else ytApi.playVideo();
}
ytPlayPause.addEventListener('click', togglePlay);
ytCenterPlay.addEventListener('click', togglePlay);

ytVolume.addEventListener('click', () => {
    if (!ytApi || !ytIsReady) return;
    if (ytIsMuted) {
        ytApi.unMute();
        ytVolume.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        ytIsMuted = false;
    } else {
        ytApi.mute();
        ytVolume.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        ytIsMuted = true;
    }
});

ytVolSlider.addEventListener('input', (e) => {
    const v = +e.target.value;
    S.ytVolume = v;
    ytVolValue.textContent = v + '%';
    saveState();
    if (ytApi && ytIsReady) {
        ytApi.setVolume(v);
        if (v > 0 && ytIsMuted) {
            ytApi.unMute();
            ytIsMuted = false;
            ytVolume.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        }
    }
});

function updateExpandIcon() {
    if (ytPlayer.classList.contains('minimized')) {
        ytExpand.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
    } else {
        ytExpand.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
    }
}
ytExpand.addEventListener('click', () => {
    ytPlayer.classList.toggle('minimized');
    S.ytMinimized = ytPlayer.classList.contains('minimized');
    saveState();
    updateExpandIcon();
});
$('#ytMiniBtn').addEventListener('click', () => {
    ytPlayer.classList.toggle('minimized');
    S.ytMinimized = ytPlayer.classList.contains('minimized');
    saveState();
    updateExpandIcon();
});

ytFsBtn.addEventListener('click', () => {
    ytPlayer.classList.toggle('fullscreen');
    const fs = ytPlayer.classList.contains('fullscreen');
    ytFsBtn.innerHTML = fs
        ? '<i class="fa-solid fa-compress"></i>'
        : '<i class="fa-solid fa-expand"></i>';
});

ytClose.addEventListener('click', () => {
    ytPlayer.classList.add('hidden-player');
    ytRestore.classList.add('show');
    S.ytHidden = true;
    saveState();
    if (ytApi && ytIsReady) { try { ytApi.pauseVideo(); } catch(e){} }
    toast('Player hidden', 'info');
});
ytRestore.addEventListener('click', () => {
    ytPlayer.classList.remove('hidden-player');
    ytRestore.classList.remove('show');
    S.ytHidden = false;
    saveState();
    if (ytApi && ytIsReady) { try { ytApi.playVideo(); } catch(e){} }
    toast('Player restored 🎵', 'music');
});

/* ============================================================
   URL PARSER
   ============================================================ */
function extractVideoId(input) {
    if (!input) return null;
    input = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
    const patterns = [
        /(?:youtube\.com\/watch\?[^#]*v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /(?:music\.youtube\.com\/watch\?[^#]*v=)([a-zA-Z0-9_-]{11})/
    ];
    for (const p of patterns) {
        const m = input.match(p);
        if (m) return m[1];
    }
    return null;
}

function extractPlaylistId(input) {
    if (!input) return null;
    input = input.trim();
    if (/^(PL|UU|OL|FL|RD|LL)[a-zA-Z0-9_-]{10,}$/.test(input)) return input;
    const patterns = [
        /[?&]list=([a-zA-Z0-9_-]+)/,
        /playlist\?list=([a-zA-Z0-9_-]+)/
    ];
    for (const p of patterns) {
        const m = input.match(p);
        if (m) return m[1];
    }
    return null;
}

/* ============================================================
   QUEUE
   ============================================================ */
function updateQueueUI() {
    if (!ytQueueBadge) return;
    ytQueueBadge.textContent = S.ytQueue.length;
    ytQueueBadge.classList.toggle('show', S.ytQueue.length > 0);
    queueInfo.textContent = `${S.ytQueue.length} video${S.ytQueue.length !== 1 ? 's' : ''} in queue`;

    if (S.ytQueue.length === 0) {
        ytQueueEl.innerHTML = '<div class="yt-empty-mini">Queue is empty</div>';
        return;
    }

    ytQueueEl.innerHTML = S.ytQueue.map((item, idx) => `
        <div class="yt-q-item ${idx === S.ytIndex ? 'current' : ''}" data-idx="${idx}">
            <span class="yt-q-num">${idx + 1}</span>
            <img class="yt-q-thumb" src="${item.thumb || ''}" alt="" onerror="this.style.display='none'">
            <div class="yt-q-info">
                <div class="yt-q-title">${escapeHtml(item.title || 'Unknown')}</div>
                <div class="yt-q-channel">${escapeHtml(item.channel || 'YouTube')}</div>
            </div>
            <button class="yt-q-del" data-idx="${idx}" title="Remove">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `).join('');

    $$('.yt-q-item').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.closest('.yt-q-del')) return;
            loadQueueItem(+el.dataset.idx);
        });
    });
    $$('.yt-q-del').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromQueue(+btn.dataset.idx);
        });
    });
}

function addToQueue(items) {
    if (!Array.isArray(items)) items = [items];
    items.forEach(item => {
        if (!S.ytQueue.some(q => q.id === item.id)) S.ytQueue.push(item);
    });
    saveState();
    updateQueueUI();
    toast(`Added ${items.length} to queue 📥`, 'success');
}

function removeFromQueue(idx) {
    S.ytQueue.splice(idx, 1);
    if (idx < S.ytIndex) S.ytIndex--;
    else if (idx === S.ytIndex) S.ytIndex = Math.min(S.ytIndex, S.ytQueue.length - 1);
    saveState();
    updateQueueUI();
}

/* ✅ FIX #7: loadQueueItem hides overlay */
function loadQueueItem(idx, play = true) {
    if (idx < 0 || idx >= S.ytQueue.length) return;
    S.ytIndex = idx;
    const item = S.ytQueue[idx];
    saveState();

    hideOverlay();
    ytLoading.classList.add('show');

    if (!ytApi) {
        loadYTAPI();
    } else if (ytIsReady) {
        try {
            ytApi.loadVideoById(item.id);
            if (play) ytApi.playVideo();
        } catch(err) {
            console.warn('loadVideoById failed', err);
        }
    }
    updateNowPlaying(item);
    updateQueueUI();
    setActiveChip(null);
}

function updateNowPlaying(item) {
    ytTitle.textContent = item.title || 'Now playing';
    ytTitleOverlay.textContent = item.title || '';
    ytIdx.textContent = S.ytQueue.length > 0 ? `${S.ytIndex + 1}/${S.ytQueue.length}` : '';
}

function handleVideoEnd() {
    ytIsPlaying = false;
    ytPlayer.classList.remove('playing');

    if (S.ytRepeat === 2) {
        try { ytApi.seekTo(0); ytApi.playVideo(); } catch(e) {}
        return;
    }
    if (S.ytShuffle) { playRandom(); return; }
    if (S.ytAutoplay && S.ytQueue.length > 1) { nextVideo(); return; }
    if (S.ytRepeat === 1) { nextVideo(); return; }

    ytPlayPause.innerHTML = '<i class="fa-solid fa-play"></i>';
    ytCenterPlay.innerHTML = '<i class="fa-solid fa-play"></i>';
    toast('Queue finished', 'info');
}

function nextVideo() {
    if (S.ytQueue.length === 0) return;
    let nextIdx;
    if (S.ytShuffle) {
        do { nextIdx = Math.floor(Math.random() * S.ytQueue.length); }
        while (nextIdx === S.ytIndex && S.ytQueue.length > 1);
    } else {
        nextIdx = S.ytIndex + 1;
        if (nextIdx >= S.ytQueue.length) {
            if (S.ytRepeat === 1) nextIdx = 0;
            else return;
        }
    }
    loadQueueItem(nextIdx);
}

function prevVideo() {
    if (S.ytQueue.length === 0) return;
    try {
        const cur = ytApi?.getCurrentTime() || 0;
        if (cur > 3) { ytApi.seekTo(0); return; }
    } catch(e) {}
    let prevIdx = S.ytIndex - 1;
    if (prevIdx < 0) prevIdx = S.ytQueue.length - 1;
    loadQueueItem(prevIdx);
}

function playRandom() {
    if (S.ytQueue.length === 0) return;
    let randIdx;
    do { randIdx = Math.floor(Math.random() * S.ytQueue.length); }
    while (randIdx === S.ytIndex && S.ytQueue.length > 1);
    loadQueueItem(randIdx);
}

$('#ytNextBtn').addEventListener('click', () => { nextVideo(); toast('Next ▶', 'music'); });
$('#ytPrevBtn').addEventListener('click', () => { prevVideo(); toast('Previous ◀', 'music'); });
$('#ytShuffleBtn').addEventListener('click', () => {
    S.ytShuffle = !S.ytShuffle;
    saveState();
    $('#ytShuffleBtn').classList.toggle('active', S.ytShuffle);
    toast(`Shuffle ${S.ytShuffle ? 'ON' : 'OFF'}`, 'info');
});
$('#ytRepeatBtn').addEventListener('click', () => {
    S.ytRepeat = (S.ytRepeat + 1) % 3;
    saveState();
    updateRepeatUI();
    toast(['Repeat OFF', 'Repeat ALL', 'Repeat ONE'][S.ytRepeat], 'info');
});
function updateRepeatUI() {
    const btn = $('#ytRepeatBtn');
    btn.classList.toggle('active', S.ytRepeat > 0);
    btn.classList.toggle('repeat-one', S.ytRepeat === 2);
}

/* ============================================================
   LOAD
   ============================================================ */
function loadFromUrl(input) {
    const playlistId = extractPlaylistId(input);
    const videoId = extractVideoId(input);

    if (playlistId) { loadPlaylist(playlistId); return true; }
    if (videoId) { loadSingleVideo(videoId); return true; }
    toast('Invalid YouTube URL', 'warn');
    return false;
}

/* ✅ FIX #8: loadPlaylist hides overlay */
function loadPlaylist(playlistId) {
    S.ytPlaylistId = playlistId;
    saveState();
    toast('Loading playlist…', 'info');

    if (!ytApi || !ytIsReady) {
        loadYTAPI();
        setTimeout(() => loadPlaylist(playlistId), 1500);
        return;
    }

    hideOverlay();
    ytLoading.classList.add('show');

    try {
        ytApi.loadPlaylist({
            list: playlistId,
            listType: 'playlist',
            index: 0,
            startSeconds: 0,
            suggestedQuality: S.ytQuality !== 'default' ? S.ytQuality : 'default'
        });
        ytTitle.textContent = 'Playlist loaded';
        ytIdx.textContent = '🎵 PL';
        S.ytQueue = [];
        S.ytIndex = -1;
        saveState();
        updateQueueUI();
        toast('Playlist started 📻', 'music');
    } catch(err) {
        console.error('Playlist load failed', err);
        toast('Could not load playlist', 'warn');
    }
}

/* ✅ FIX #9: loadSingleVideo hides overlay */
function loadSingleVideo(videoId) {
    if (!ytApi || !ytIsReady) {
        S.ytLastLoaded = videoId;
        saveState();
        loadYTAPI();
        setTimeout(() => loadSingleVideo(videoId), 1500);
        return;
    }
    hideOverlay();
    ytLoading.classList.add('show');
    try {
        ytApi.loadVideoById(videoId);
        S.ytQueue = [{ id: videoId, title: 'Custom video', channel: 'YouTube' }];
        S.ytIndex = 0;
        saveState();
        updateNowPlaying(S.ytQueue[0]);
        updateQueueUI();
        setActiveChip(null);
        toast('Video loaded 🎬', 'music');
    } catch(err) {
        toast('Could not load video', 'warn');
    }
}

$('#ytSearchBtn').addEventListener('click', () => {
    const input = $('#ytSearchInput').value;
    if (input) loadFromUrl(input);
});
$('#ytSearchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') $('#ytSearchBtn').click();
});
$('#ytLoadBtn').addEventListener('click', () => {
    const input = $('#ytUrlInput').value;
    if (loadFromUrl(input)) $('#ytUrlInput').value = '';
});
$('#ytAddQueueBtn').addEventListener('click', () => {
    const input = $('#ytUrlInput').value;
    const vid = extractVideoId(input);
    if (!vid) {
        toast('Only single videos can be added', 'warn');
        return;
    }
    addToQueue({ id: vid, title: 'Custom video', channel: 'YouTube' });
    $('#ytUrlInput').value = '';
});

/* ============================================================
   PRESETS
   ============================================================ */
function setActiveChip(chip) {
    $$('.yt-chip').forEach(c => c.classList.remove('active'));
    if (chip) chip.classList.add('active');
}

$$('.yt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const type = chip.dataset.type;
        const id = chip.dataset.id;
        const name = chip.dataset.name;
        setActiveChip(chip);

        if (type === 'playlist') {
            loadPlaylist(id);
            ytTitle.textContent = name;
        } else {
            S.ytQueue = [{ id, title: name, channel: 'YouTube' }];
            S.ytIndex = 0;
            S.ytLastLoaded = id;
            S.ytLastName = name;
            saveState();
            if (!ytApi || !ytIsReady) {
                loadYTAPI();
            } else {
                hideOverlay();
                ytLoading.classList.add('show');
                ytApi.loadVideoById(id);
                updateNowPlaying({ title: name });
            }
            updateQueueUI();
            toast(`Loading: ${name}`, 'music');
        }
    });
});

/* TABS */
$$('.yt-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const name = tab.dataset.tab;
        $$('.yt-tab').forEach(t => t.classList.remove('active'));
        $$('.yt-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        $(`.yt-tab-content[data-tab="${name}"]`).classList.add('active');
    });
});

/* SPEED */
$$('.yt-speed-btns button').forEach(btn => {
    btn.addEventListener('click', () => {
        const speed = +btn.dataset.speed;
        S.ytSpeed = speed;
        saveState();
        $$('.yt-speed-btns button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (ytApi && ytIsReady) {
            try { ytApi.setPlaybackRate(speed); } catch(e) {}
        }
        toast(`Speed: ${speed}×`, 'info');
    });
});

/* SLEEP */
ytSleepTimer.addEventListener('change', () => {
    clearInterval(sleepInterval);
    sleepRemaining = (+ytSleepTimer.value) * 60;
    if (sleepRemaining === 0) { ytSleepCountdown.textContent = ''; return; }
    updateSleepDisplay();
    sleepInterval = setInterval(() => {
        sleepRemaining--;
        updateSleepDisplay();
        if (sleepRemaining <= 0) {
            clearInterval(sleepInterval);
            if (ytApi && ytIsReady) ytApi.pauseVideo();
            ytSleepCountdown.textContent = '';
            ytSleepTimer.value = '0';
            toast('Sleep timer — paused 😴', 'info');
        }
    }, 1000);
});
function updateSleepDisplay() {
    const m = Math.floor(sleepRemaining / 60);
    const s = sleepRemaining % 60;
    ytSleepCountdown.textContent = `${m}:${String(s).padStart(2,'0')}`;
}

/* AUTOPLAY */
$('#autoplaySwitch').addEventListener('click', () => {
    S.ytAutoplay = !S.ytAutoplay;
    saveState();
    $('#autoplaySwitch').classList.toggle('active', S.ytAutoplay);
    toast(`Autoplay ${S.ytAutoplay ? 'ON' : 'OFF'}`, 'info');
});

/* QUALITY */
$('#ytQuality').addEventListener('change', (e) => {
    S.ytQuality = e.target.value;
    saveState();
    if (ytApi && ytIsReady) {
        try {
            ytApi.setPlaybackQuality(e.target.value === 'default' ? 'default' : e.target.value);
        } catch(err) {}
    }
    toast(`Quality: ${e.target.value}`, 'info');
});

/* QUEUE CLEAR */
$('#queueClearBtn').addEventListener('click', () => {
    if (S.ytQueue.length === 0) return;
    S.ytQueue = [];
    S.ytIndex = -1;
    saveState();
    updateQueueUI();
    toast('Queue cleared', 'info');
});

/* ============================================================
   DRAG
   ============================================================ */
let dragState = null;
ytDragbar.addEventListener('mousedown', (e) => {
    if (ytPlayer.classList.contains('fullscreen')) return;
    if (e.target.closest('.yt-drag-actions')) return;
    dragState = {
        startX: e.clientX,
        startY: e.clientY,
        startRight: parseInt(getComputedStyle(ytPlayer).right) || 24,
        startBottom: parseInt(getComputedStyle(ytPlayer).bottom) || 24
    };
    e.preventDefault();
});
document.addEventListener('mousemove', (e) => {
    if (!dragState) return;
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    let newRight = dragState.startRight - dx;
    let newBottom = dragState.startBottom - dy;
    newRight = Math.max(8, Math.min(innerWidth - 100, newRight));
    newBottom = Math.max(8, Math.min(innerHeight - 60, newBottom));
    ytPlayer.style.right = newRight + 'px';
    ytPlayer.style.bottom = newBottom + 'px';
    S.ytPos = { right: newRight, bottom: newBottom };
});
document.addEventListener('mouseup', () => {
    if (dragState) { dragState = null; saveState(); }
});

/* RESIZE */
let resizeState = null;
ytResize.addEventListener('mousedown', (e) => {
    if (ytPlayer.classList.contains('fullscreen')) return;
    resizeState = { startX: e.clientX, startWidth: ytPlayer.offsetWidth };
    e.preventDefault(); e.stopPropagation();
});
document.addEventListener('mousemove', (e) => {
    if (!resizeState) return;
    const dx = resizeState.startX - e.clientX;
    let newWidth = resizeState.startWidth + dx;
    newWidth = Math.max(280, Math.min(600, newWidth));
    ytPlayer.style.width = newWidth + 'px';
    S.ytSize = { width: newWidth };
});
document.addEventListener('mouseup', () => {
    if (resizeState) { resizeState = null; saveState(); }
});

/* UTIL */
function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
}

/* KEYBOARD */
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        if (e.key === 'Escape') e.target.blur();
        return;
    }
    if (e.code === 'Space') { e.preventDefault(); startBtn.click(); }
    if (e.key === 'r' || e.key === 'R') $('#resetTimer').click();
    if (e.key === 'f' || e.key === 'F') toggleFocusMode();
    if (e.key === 't' || e.key === 'T') $('#themeToggle').click();
    if (e.key === 'm' || e.key === 'M') togglePlay();
    if (e.key === 'n' || e.key === 'N') nextVideo();
    if (e.key === 'p' || e.key === 'P') prevVideo();
    if (e.key === 's' || e.key === 'S') $('#ytShuffleBtn').click();
    if (e.key === 'y' || e.key === 'Y') {
        if (ytPlayer.classList.contains('hidden-player')) ytRestore.click();
        else {
            ytPlayer.classList.toggle('minimized');
            S.ytMinimized = ytPlayer.classList.contains('minimized');
            saveState();
            updateExpandIcon();
        }
    }
    if (e.key === 'h' || e.key === 'H') ytClose.click();
    if (e.key === 'Escape') {
        if (ytPlayer.classList.contains('fullscreen')) {
            ytPlayer.classList.remove('fullscreen');
            ytFsBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
        } else if (document.body.classList.contains('focus-mode')) {
            toggleFocusMode();
        }
    }
});

/* ============================================================
   INIT
   ============================================================ */
function init() {
    loadState();
    spawnBubbles();
    buildTicks();
    setMode('focus');
    renderTime();

    if (S.ytHidden) {
        ytPlayer.classList.add('hidden-player');
        ytRestore.classList.add('show');
    } else {
        if (S.ytMinimized) ytPlayer.classList.add('minimized');
        ytPlayer.style.right = S.ytPos.right + 'px';
        ytPlayer.style.bottom = S.ytPos.bottom + 'px';
        ytPlayer.style.width = S.ytSize.width + 'px';
    }

    if (S.theme === 'light') {
        document.body.classList.add('light');
        $('#themeToggle').innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    ytVolSlider.value = S.ytVolume;
    ytVolValue.textContent = S.ytVolume + '%';
    updateExpandIcon();
    updateRepeatUI();
    updateQueueUI();

    if (S.ytShuffle) $('#ytShuffleBtn').classList.add('active');

    $$('.yt-speed-btns button').forEach(b => {
        b.classList.toggle('active', +b.dataset.speed === S.ytSpeed);
    });

    $('#ytQuality').value = S.ytQuality;
    if (S.ytAutoplay) $('#autoplaySwitch').classList.add('active');

    // ✅ FIX #10: SAFETY failsafe — hide overlay after delay no matter what
    setTimeout(() => {
        if (ytIsReady || ytApi) hideOverlay();
    }, 2500);
    setTimeout(() => {
        hideOverlay();
    }, 6000);

    loadYTAPI();

    if (S.ytQueue.length > 0 && S.ytIndex >= 0) {
        updateNowPlaying(S.ytQueue[S.ytIndex]);
    }
}
init();

console.log('%c⚡ FocusFlow ULTRA v3.2 — FIXED', 'background:linear-gradient(90deg,#7c5cff,#00d4ff,#00ffa3);color:#fff;padding:8px 16px;border-radius:8px;font-weight:700;font-size:14px;');
console.log('Shortcuts → SPACE:timer  R:reset  F:focus  T:theme  M:play  N:next  P:prev  S:shuffle  Y:min  H:hide  ESC:exit');
