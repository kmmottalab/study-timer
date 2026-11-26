<?php session_start(); ?>
<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FocusFlow ULTRA — Playlist Player</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>

<!-- BACKGROUND -->
<canvas id="nebula"></canvas>
<div class="aurora aurora-1"></div>
<div class="aurora aurora-2"></div>
<div class="aurora aurora-3"></div>
<div class="bubbles" id="bubbles"></div>
<div class="noise"></div>
<div class="vignette"></div>

<!-- LOADER -->
<div id="loader">
    <div class="loader-inner">
        <div class="loader-orb">
            <div class="loader-ring"></div>
            <div class="loader-ring ring-2"></div>
            <div class="loader-core"></div>
        </div>
        <h1>FocusFlow</h1>
        <p>Entering deep focus zone…</p>
        <div class="loader-progress"><span></span></div>
    </div>
</div>

<!-- TOPBAR -->
<header class="topbar">
    <div class="brand">
        <div class="brand-mark"><i class="fa-solid fa-wave-square"></i></div>
        <span>FocusFlow</span>
    </div>
    <div class="top-actions">
        <button class="icon-btn" id="themeToggle" title="Theme (T)"><i class="fa-solid fa-moon"></i></button>
        <button class="icon-btn" id="focusModeBtn" title="Focus Mode (F)"><i class="fa-solid fa-expand"></i></button>
    </div>
</header>

<!-- CLOCK -->
<main class="dash" id="dash">
    <section class="clock-stage" id="clockStage">
        <div class="stage-glow"></div>
        <div class="stage-glow secondary"></div>

        <div class="clock-wrap" id="clockWrap">
            <svg class="clock-svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#7c5cff"/>
                        <stop offset="50%" stop-color="#00d4ff"/>
                        <stop offset="100%" stop-color="#00ffa3"/>
                    </linearGradient>
                    <linearGradient id="secGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stop-color="#00ffa3" stop-opacity="0.9"/>
                        <stop offset="100%" stop-color="#00d4ff" stop-opacity="0.9"/>
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="blur"/>
                        <feMerge>
                            <feMergeNode in="blur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g id="ticks" opacity="0.4"></g>
                <circle class="ring-track" cx="200" cy="200" r="168"/>
                <circle class="ring-fill" id="ringFill" cx="200" cy="200" r="168" filter="url(#glow)"/>
                <circle class="ring-second" id="ringSecond" cx="200" cy="200" r="186"/>
                <circle class="ring-tip" id="ringTip" cx="200" cy="32" r="5"/>
            </svg>

            <div class="clock-center">
                <div class="mode-pill" id="modePill">FOCUS</div>
                <div class="time" id="timeDisplay">
                    <span class="t-mm">25</span><span class="t-sep">:</span><span class="t-ss">00</span>
                </div>
                <div class="time-sub" id="timeSub">25 min · 0 sec</div>
                <div class="progress-line">
                    <div class="progress-line-fill" id="progressLine"></div>
                </div>
                <div class="progress-pct" id="progressPct">0%</div>
            </div>
        </div>

        <div class="clock-controls">
            <button class="ctrl ghost" id="resetTimer" title="Reset (R)"><i class="fa-solid fa-rotate-left"></i></button>
            <button class="ctrl primary" id="startTimer">
                <i class="fa-solid fa-play"></i><span>Start</span>
            </button>
            <button class="ctrl ghost" id="skipTimer" title="Skip"><i class="fa-solid fa-forward-step"></i></button>
        </div>

        <div class="presets">
            <button class="preset" data-min="15">15m</button>
            <button class="preset active" data-min="25">25m</button>
            <button class="preset" data-min="45">45m</button>
            <button class="preset" data-min="60">60m</button>
            <button class="preset custom" id="customTimeBtn">
                <i class="fa-solid fa-sliders"></i> Custom
            </button>
        </div>

        <div class="custom-panel" id="customPanel">
            <div class="custom-inner">
                <div class="cp-field">
                    <label>Minutes</label>
                    <input type="number" id="customMin" min="0" max="180" value="30">
                </div>
                <span class="cp-sep">:</span>
                <div class="cp-field">
                    <label>Seconds</label>
                    <input type="number" id="customSec" min="0" max="59" value="0">
                </div>
                <div class="custom-actions">
                    <button class="btn-ghost" id="customCancel">Cancel</button>
                    <button class="btn-glow" id="customApply">Apply</button>
                </div>
            </div>
        </div>
    </section>
</main>

<!-- ============ YOUTUBE PLAYER — ULTRA ============ -->
<div class="yt-player" id="ytPlayer">

    <!-- Drag bar -->
    <div class="yt-dragbar" id="ytDragbar">
        <div class="yt-dots"><span></span><span></span><span></span></div>
        <div class="yt-drag-label" id="ytDragLabel">DRAG ME</div>
        <div class="yt-drag-actions">
            <button class="yt-mini-btn" id="ytMiniBtn" title="Mini mode">
                <i class="fa-solid fa-compress"></i>
            </button>
        </div>
    </div>

    <!-- Video frame -->
    <div class="yt-frame-wrap" id="ytFrameWrap">
        <div id="ytFrame"></div>
        <div class="yt-overlay" id="ytOverlay">
            <i class="fa-brands fa-youtube"></i>
            <span>Click to load player</span>
        </div>
        <div class="yt-loading" id="ytLoading">
            <div class="yt-spinner"></div>
        </div>
        <div class="yt-fs-btn" id="ytFsBtn" title="Fullscreen">
            <i class="fa-solid fa-expand"></i>
        </div>
        <div class="yt-title-overlay" id="ytTitleOverlay"></div>
    </div>

    <!-- Progress -->
    <div class="yt-progress" id="ytProgress">
        <div class="yt-progress-buffer" id="ytProgressBuffer"></div>
        <div class="yt-progress-fill" id="ytProgressFill"></div>
    </div>

    <!-- Info bar -->
    <div class="yt-bar">
        <div class="yt-logo">
            <i class="fa-brands fa-youtube"></i>
            <div class="yt-live-ring"></div>
        </div>
        <div class="yt-meta">
            <div class="yt-title" id="ytTitle">Loading playlist…</div>
            <div class="yt-sub">
                <span id="ytCurTime">0:00</span> / <span id="ytDurTime">0:00</span>
                <span class="yt-idx" id="ytIdx"></span>
            </div>
        </div>
        <div class="yt-actions">
            <button class="yt-btn" id="ytPlayPause" title="Play/Pause (M)"><i class="fa-solid fa-pause"></i></button>
            <button class="yt-btn" id="ytVolume" title="Mute"><i class="fa-solid fa-volume-high"></i></button>
            <button class="yt-btn" id="ytExpand" title="Expand (Y)"><i class="fa-solid fa-chevron-up"></i></button>
            <button class="yt-btn close" id="ytClose" title="Hide (H)"><i class="fa-solid fa-xmark"></i></button>
        </div>
    </div>

    <!-- Transport (prev / next / shuffle / repeat) -->
    <div class="yt-transport">
        <button class="yt-tr-btn" id="ytShuffleBtn" title="Shuffle">
            <i class="fa-solid fa-shuffle"></i>
        </button>
        <button class="yt-tr-btn" id="ytPrevBtn" title="Previous">
            <i class="fa-solid fa-backward-step"></i>
        </button>
        <button class="yt-tr-btn big" id="ytCenterPlay" title="Play/Pause">
            <i class="fa-solid fa-pause"></i>
        </button>
        <button class="yt-tr-btn" id="ytNextBtn" title="Next">
            <i class="fa-solid fa-forward-step"></i>
        </button>
        <button class="yt-tr-btn" id="ytRepeatBtn" title="Repeat">
            <i class="fa-solid fa-repeat"></i>
        </button>
    </div>

    <!-- Expanded controls -->
    <div class="yt-expanded-controls" id="ytExpandedControls">

        <!-- Tabs -->
        <div class="yt-tabs">
            <button class="yt-tab active" data-tab="playlists">
                <i class="fa-solid fa-list"></i> Playlists
            </button>
            <button class="yt-tab" data-tab="queue">
                <i class="fa-solid fa-bars-staggered"></i> Queue
                <span class="yt-badge" id="queueBadge">0</span>
            </button>
            <button class="yt-tab" data-tab="load">
                <i class="fa-solid fa-link"></i> Load URL
            </button>
            <button class="yt-tab" data-tab="settings">
                <i class="fa-solid fa-sliders"></i> Settings
            </button>
        </div>

        <!-- Playlists tab -->
        <div class="yt-tab-content active" data-tab="playlists">
            <div class="yt-search-wrap">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" id="ytSearchInput" placeholder="Paste YouTube playlist or video URL…">
                <button id="ytSearchBtn"><i class="fa-solid fa-arrow-right"></i></button>
            </div>
            <div class="yt-preset-groups">
                <div class="yt-group-label">📚 Study Playlists</div>
                <div class="yt-presets" id="ytPresets">
                    <button class="yt-chip active" data-type="playlist" data-id="PLOzDu-MXXLliO9fBNZOQTAm1qAE1n6U7" data-name="Lo-Fi Study Session">
                        <i class="fa-solid fa-headphones"></i> Lo-Fi Study
                    </button>
                    <button class="yt-chip" data-type="playlist" data-id="PLOzDu-MXXLlva9O-sZ7rLhEQ6jVJFnQOb" data-name="Deep Focus">
                        <i class="fa-solid fa-brain"></i> Deep Focus
                    </button>
                    <button class="yt-chip" data-type="playlist" data-id="PLOzDu-MXXLm3C74hJXeS0CsX1px7zSFE" data-name="Chillhop Essentials">
                        <i class="fa-solid fa-compact-disc"></i> Chillhop
                    </button>
                    <button class="yt-chip" data-type="playlist" data-id="PLOzDu-MXXLmVzC8vB8l6kL3c4s8pW6hJ" data-name="Classical Study">
                        <i class="fa-solid fa-violin"></i> Classical
                    </button>
                    <button class="yt-chip" data-type="playlist" data-id="PLOzDu-MXXLlzKpJd5_hXiZR8h7Kz3xBZ" data-name="Rain Ambience">
                        <i class="fa-solid fa-cloud-rain"></i> Rain
                    </button>
                </div>

                <div class="yt-group-label">🎵 Single Videos</div>
                <div class="yt-presets" id="ytVideoPresets">
                    <button class="yt-chip" data-type="video" data-id="jfKfPfyJRdk" data-name="Lo-Fi Hip Hop Radio">
                        <i class="fa-solid fa-radio"></i> Lofi Radio
                    </button>
                    <button class="yt-chip" data-type="video" data-id="lTRiuFIWV54" data-name="Deep Focus Music">
                        <i class="fa-solid fa-brain"></i> Deep Focus
                    </button>
                    <button class="yt-chip" data-type="video" data-id="5qap5aO4i9A" data-name="Jazz Cafe Radio">
                        <i class="fa-solid fa-mug-hot"></i> Jazz Cafe
                    </button>
                    <button class="yt-chip" data-type="video" data-id="n61ULEU7CO0" data-name="Rain Ambience">
                        <i class="fa-solid fa-cloud-rain"></i> Rain
                    </button>
                    <button class="yt-chip" data-type="video" data-id="DWcJFNfaw9c" data-name="Piano Ambience">
                        <i class="fa-solid fa-music"></i> Piano
                    </button>
                </div>

                <div class="yt-group-label">❤️ Favorites</div>
                <div class="yt-presets" id="ytFavorites">
                    <div class="yt-empty-mini">No favorites yet — click ❤️ on any video</div>
                </div>
            </div>
        </div>

        <!-- Queue tab -->
        <div class="yt-tab-content" data-tab="queue">
            <div class="yt-queue-header">
                <span id="queueInfo">0 videos in queue</span>
                <div class="yt-queue-actions">
                    <button class="yt-qbtn" id="queueClearBtn" title="Clear queue">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="yt-queue" id="ytQueue">
                <div class="yt-empty-mini">Queue is empty</div>
            </div>
        </div>

        <!-- Load URL tab -->
        <div class="yt-tab-content" data-tab="load">
            <div class="yt-load-help">
                <p><i class="fa-solid fa-circle-info"></i> Paste any of these:</p>
                <code>youtube.com/playlist?list=PLxxx</code>
                <code>youtube.com/watch?v=xxx&list=PLxxx</code>
                <code>youtu.be/xxxxx</code>
                <code>Video ID: xxxxxxxxxxx</code>
            </div>
            <textarea id="ytUrlInput" placeholder="Paste YouTube URL or playlist ID here…" rows="3"></textarea>
            <div class="yt-load-actions">
                <button class="yt-btn-primary" id="ytLoadBtn">
                    <i class="fa-solid fa-download"></i> Load
                </button>
                <button class="yt-btn-secondary" id="ytAddQueueBtn">
                    <i class="fa-solid fa-plus"></i> Add to Queue
                </button>
            </div>
            <div class="yt-load-hint">
                <i class="fa-solid fa-lightbulb"></i>
                <span>Tip: Playlist will start from first video. Use shuffle for random order.</span>
            </div>
        </div>

        <!-- Settings tab -->
        <div class="yt-tab-content" data-tab="settings">
            <div class="yt-setting">
                <label>Volume</label>
                <div class="yt-vol-slider-wrap">
                    <i class="fa-solid fa-volume-low"></i>
                    <input type="range" id="ytVolSlider" min="0" max="100" value="60">
                    <i class="fa-solid fa-volume-high"></i>
                    <span id="ytVolValue">60%</span>
                </div>
            </div>

            <div class="yt-setting">
                <label>Playback speed</label>
                <div class="yt-speed-btns">
                    <button data-speed="0.5">0.5×</button>
                    <button data-speed="0.75">0.75×</button>
                    <button data-speed="1" class="active">1×</button>
                    <button data-speed="1.25">1.25×</button>
                    <button data-speed="1.5">1.5×</button>
                    <button data-speed="2">2×</button>
                </div>
            </div>

            <div class="yt-setting">
                <label>Sleep timer</label>
                <div class="yt-sleep">
                    <i class="fa-solid fa-moon"></i>
                    <select id="ytSleepTimer">
                        <option value="0">Off</option>
                        <option value="15">15 min</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">1 hour</option>
                        <option value="90">1.5 hours</option>
                    </select>
                    <span id="ytSleepCountdown"></span>
                </div>
            </div>

            <div class="yt-setting">
                <label>Autoplay next video</label>
                <div class="yt-switch-row">
                    <span>Automatically play next in queue</span>
                    <button class="yt-switch active" id="autoplaySwitch"></button>
                </div>
            </div>

            <div class="yt-setting">
                <label>Video quality</label>
                <select id="ytQuality">
                    <option value="default">Auto</option>
                    <option value="hd1080">1080p</option>
                    <option value="hd720">720p</option>
                    <option value="large">480p</option>
                    <option value="medium">360p</option>
                    <option value="small">240p</option>
                </select>
            </div>
        </div>
    </div>

    <div class="yt-resize" id="ytResize"></div>
</div>

<!-- Restore button -->
<button class="yt-restore" id="ytRestore" title="Restore player (Y)">
    <i class="fa-brands fa-youtube"></i>
</button>

<!-- Toast -->
<div class="toast-stack" id="toastStack"></div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="js/app.js"></script>
</body>
</html>
