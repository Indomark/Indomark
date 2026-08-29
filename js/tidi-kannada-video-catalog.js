(() => {
  const TIDI_KANNADA_VIDEOS = [
    {
      category: 'Stock Market Basics',
      level: 1,
      order: 1,
      title: 'When to Buy shares? Stock Market in Kannada',
      videoId: 'HJ3ih6kKJJ4',
      verified: true,
      source: 'TIDI ಕನ್ನಡ'
    },
    {
      category: 'Stock Market Basics',
      level: 4,
      order: 1,
      title: 'How to Trade in F&O and Intraday | #stockmarket #sharemarket #beginners #kannada',
      videoId: '3pjksNLwFkw',
      verified: true,
      source: 'TIDI ಕನ್ನಡ'
    },
    {
      category: 'Stock Market Basics',
      level: 4,
      order: 2,
      title: 'How to Do Intraday Trading: Expert Tips for Success | #tradingkannada #IntradayTrading #StockMarket',
      videoId: 'jLL9pSFRuyg',
      verified: true,
      source: 'TIDI ಕನ್ನಡ'
    },
    {
      category: 'Stock Market Basics',
      level: 5,
      order: 1,
      title: 'Basics of Option Trading | #stock #trading #optionstrading #basic #optionbasics #options',
      videoId: 'MwJZdLG2s2w',
      verified: true,
      source: 'TIDI ಕನ್ನಡ'
    },
    {
      category: 'Stock Market Basics',
      level: 4,
      order: 3,
      title: 'Stock Market in Kannada |ಇಂಟ್ರಾಡೇ ಎಂದರೇನು | What Is Intraday In Kannada | Share Market in Kannada',
      videoId: 'sVaKIqhbfCM',
      verified: true,
      source: 'TIDI ಕನ್ನಡ'
    },
    {
      category: 'Stock Market Basics',
      level: 5,
      order: 2,
      title: 'Stock Market in Kannada | Futures Trading ಎಂದರೇನು? | What is futures Trading',
      videoId: 'DRTEMgQRxTU',
      verified: true,
      source: 'TIDI ಕನ್ನಡ'
    },
    {
      category: 'Investor Psychology',
      level: 1,
      order: 1,
      title: 'ALERT traders | Morning routine of every trader before you hit button | #stockmarketkannada',
      videoId: 'uQ1jKfgRGgk',
      verified: true,
      source: 'TIDI ಕನ್ನಡ'
    }
  ];

  function getTidiVideos(category = '', level = null) {
    let videos = category
      ? TIDI_KANNADA_VIDEOS.filter(v => v.category === category)
      : TIDI_KANNADA_VIDEOS.slice();
    if (Number.isFinite(Number(level))) {
      videos = videos.filter(v => v.level === Number(level));
    }
    return videos.sort((a, b) => (a.level ?? 9999) - (b.level ?? 9999) || (a.order ?? 9999) - (b.order ?? 9999));
  }

  window.INDOMARK_TIDI_KANNADA_VIDEOS = TIDI_KANNADA_VIDEOS;
  window.getIndomarkTidiVideos = getTidiVideos;
})();
