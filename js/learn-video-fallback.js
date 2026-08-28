(() => {
  const params = new URLSearchParams(location.search);
  const language = params.get('lang') || localStorage.getItem('indospeed_learn_language_v2') || 'en';
  const course = params.get('course') || 'varsity';
  const teacher = params.get('teacher') || '';
  const part = Math.max(1, Math.min(10, Number(params.get('part') || 1)));
  const STATE_KEY = 'indospeed_learn_course_v9';

  const channels = {
    en: { investopedia: 'Investopedia', groww: 'Groww' },
    kn: { vistara: 'Vistara Money Plus', growwkn: 'Groww Kannada' },
    hi: { groww: 'Groww', pranjal: 'Pranjal Kamra' },
    ta: { businessman: 'BusinessMan', growwta: 'Groww Tamil' },
    mr: { growwmr: 'Groww Marathi', marathi: 'Marathi Share Market' },
    te: { growwte: 'Groww Telugu', searchte: 'Telugu Stock Market' },
    ml: { growwml: 'Groww Malayalam', searchml: 'Malayalam Stock Market' },
    gu: { growwgu: 'Groww Gujarati', searchgu: 'Gujarati Stock Market' },
    bn: { growwbn: 'Groww Bengali', searchbn: 'Bengali Stock Market' },
    or: { searchor: 'Odia Stock Market', searchor2: 'Odia Investor Education' }
  };

  const verifiedVideos = {
    'kn:vistara:1': 'UucJL1nqejw',
    'ta:businessman:1': 'wHP5ADT6Mk0',
    'en:investopedia:1': 'BgEZn-HJNb4',
    'hi:pranjal:1': 'RFP3ooXIiyI'
  };

  const teacherName = (channels[language] || channels.en)[teacher] || teacher || 'selected teacher';
  const videoId = verifiedVideos[`${language}:${teacher}:${part}`] || '';
  const query = encodeURIComponent(`${teacherName} Course 1 Part ${part} stock market ${language}`);
  const searchUrl = `https://www.youtube.com/results?search_query=${query}`;

  window.INDOSPEED_LEARN_VIDEO = {
    language,
    course,
    teacher,
    part,
    teacherName,
    videoId,
    verified: Boolean(videoId),
    searchUrl,
    stateKey: STATE_KEY,
    player: null
  };

  function fallback() {
    const frame = document.getElementById('videoFrame');
    if (!frame || videoId) return;
    frame.innerHTML = `<div class="video-empty" style="height:100%;display:grid;place-items:center;padding:20px;text-align:center;background:linear-gradient(145deg,#08111f,#101c30);color:#fff"><div style="max-width:420px"><div style="font-size:12px;font-weight:900">${teacherName}</div><div style="margin-top:6px;font-size:11px;color:#b9c5d6">Course 1 · Part ${part} · ${language.toUpperCase()}</div><a href="${searchUrl}" target="_blank" rel="noopener" style="display:inline-block;margin-top:14px;padding:11px 15px;border-radius:10px;background:linear-gradient(90deg,#5532ce,#7847eb);color:#fff;text-decoration:none;font-size:11px;font-weight:900">Watch Part ${part} on YouTube →</a><div style="margin-top:8px;font-size:9px;color:#8f9db0">This exact video is not verified for in-app tracking. No completion or unlock is allowed.</div></div></div>`;
  }

  function mountVerified() {
    const frame = document.getElementById('videoFrame');
    if (!frame || !videoId) return;
    const origin = encodeURIComponent(location.origin);
    frame.innerHTML = `<iframe id="learnYoutubePlayer" src="https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&origin=${origin}&rel=0&modestbranding=1&playsinline=1" title="${teacherName} Part ${part}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    window.INDOSPEED_LEARN_VIDEO.iframe = frame.querySelector('iframe');
  }

  function attachPlayer() {
    if (!videoId || !window.YT || !window.YT.Player) return false;
    const iframe = document.getElementById('learnYoutubePlayer');
    if (!iframe || window.INDOSPEED_LEARN_VIDEO.player) return true;
    try {
      window.INDOSPEED_LEARN_VIDEO.player = new YT.Player(iframe, {
        events: {
          onReady: () => {
            window.INDOSPEED_LEARN_VIDEO.ready = true;
            window.INDOSPEED_LEARN_VIDEO.duration = Number(window.INDOSPEED_LEARN_VIDEO.player.getDuration() || 0);
            document.dispatchEvent(new CustomEvent('indospeed:video-ready'));
          },
          onStateChange: event => {
            window.INDOSPEED_LEARN_VIDEO.state = event.data;
            document.dispatchEvent(new CustomEvent('indospeed:video-state', { detail: { state: event.data } }));
          },
          onError: () => {
            window.INDOSPEED_LEARN_VIDEO.verified = false;
            window.INDOSPEED_LEARN_VIDEO.videoId = '';
            fallback();
            document.dispatchEvent(new CustomEvent('indospeed:video-error'));
          }
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  function load() {
    if (!videoId) {
      fallback();
      return;
    }
    mountVerified();
    const started = Date.now();
    const timer = setInterval(() => {
      if (attachPlayer() || Date.now() - started > 12000) clearInterval(timer);
    }, 300);
  }

  window.addEventListener('load', load, { once: true });
  window.onYouTubeIframeAPIReady = () => attachPlayer();
})();
