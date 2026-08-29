(() => {
  const ANGEL_INVESTMENTS_KANNADA_VIDEOS = [
    {
      category: 'Stock Market Basics', level: 0, order: 1,
      title: '(Free 😱) ಕನ್ನಡದಲ್ಲಿ Stock market complete course / stock market kannada',
      description: 'Foundation overview: stock market ಎಂದರೇನು, shares/stocks ಎಂದರೇನು, investing benefits, basic stock-market terms ಮತ್ತು beginnerಗೆ ಬೇಕಾದ overall understanding. Starting foundation lesson.',
      videoId: 'iRE2QT9B5oI', verified: true, source: 'Angel Investments'
    },
    {
      category: 'Stock Market Basics', level: 0, order: 2,
      title: '(Free 😱) ನಮ್ಮ ದುಡ್ಡು Share ಮಾರುಕಟ್ಟೆ ಅಲ್ಲಿ safe..? | Basic of stock market part 2',
      description: 'Foundation regulation lesson: SEBI ಏನು, stock market regulator ಆಗಿ ಅದರ role ಏನು, ಮತ್ತು IPO ಎಂದರೇನು ಹಾಗೂ IPO process ಹೇಗೆ work ಆಗುತ್ತದೆ ಎಂಬುದನ್ನು ತಿಳಿಸುತ್ತದೆ.',
      videoId: 'VoeWF--KV6I', verified: true, source: 'Angel Investments'
    },
    {
      category: 'Stock Market Basics', level: 0, order: 3,
      title: '(Free 😱) Sensex ಎಂದರೇನು..? basic of stock market Kannada part 3',
      description: 'Foundation market-structure lesson: Sensex, Nifty, NSE ಮತ್ತು BSE ಎಂದರೇನು ಮತ್ತು ಅವುಗಳ basic difference ಹಾಗೂ role ಏನು ಎಂಬುದನ್ನು ತಿಳಿಸುತ್ತದೆ.',
      videoId: 'rrhmtcEHkrY', verified: true, source: 'Angel Investments'
    },
    {
      category: 'Stock Market Basics', level: 1, order: 4,
      title: 'Demat Account ಅಂದ್ರೇನು? Trading Apps ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತವೆ?',
      description: 'Beginner account lesson: Demat account ಮತ್ತು Trading account ನಡುವಿನ difference, order types, trading app basics, watchlist, orders ಮತ್ತು portfolio usage ಬಗ್ಗೆ ತಿಳಿಸುತ್ತದೆ.',
      videoId: '89RFACG8Brs', verified: true, source: 'Angel Investments'
    },
    {
      category: 'Stock Market Basics', level: 2, order: 5,
      title: 'QnA: Understanding Stock Market Reality | Kannada',
      description: 'Practical follow-up: investing vs trading, long-term investing, ROE ಮತ್ತು common beginner stock-market questions. Core foundation ನಂತರ ಮಾತ್ರ ಬರುತ್ತದೆ.',
      videoId: 'iX_fkLbKurw', verified: true, source: 'Angel Investments'
    },
    {
      category: 'Fundamental Analysis', level: 0, order: 1,
      title: '(Free) Course on fundamental analysis in kannada | #angelinvestments',
      description: 'Level 0 — Fundamental Analysis ಅಂದರೇನು, intrinsic value ಎಂದರೇನು, long-term investingಗೆ ಅದು ಯಾಕೆ ಮುಖ್ಯ, Fundamental vs Technical Analysis ಮತ್ತು company financial health ಅನ್ನು ಹೇಗೆ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಬೇಕು ಎಂಬ foundation.',
      videoId: 'G8qSFJ34IIo', verified: true, source: 'Angel Investments'
    },
    {
      category: 'Fundamental Analysis', level: 1, order: 2,
      title: 'Fundamental analysis of company in Kannada | EPS, ROE, Dividend, Book Value explained',
      description: 'Level 1 — EPS, ROE, Dividend ಮತ್ತು Book Value ಎಂದರೇನು, ಇವು company profitability ಮತ್ತು value ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಹೇಗೆ ಸಹಾಯ ಮಾಡುತ್ತವೆ ಎಂಬುದು.',
      videoId: 'sX7qvaJSKdw', verified: true, source: 'Angel Investments'
    },
    {
      category: 'Fundamental Analysis', level: 2, order: 3,
      title: 'How to FIND High Growth Shares using Screener in Kannada',
      description: 'Level 2 — Screenerನಲ್ಲಿ ROE, P/E, OPM, Debt-to-Equity, Market Capitalization ಮತ್ತು Dividend Yield ಮುಂತಾದ parameters ಬಳಸಿ high-growth shares screen ಮಾಡುವ approach.',
      videoId: 'FTYE23KIw9k', verified: true, source: 'Angel Investments'
    },
    {
      category: 'Fundamental Analysis', level: 2, order: 4,
      title: 'ಕಂಪನಿ Research ಮಾಡೋದು ಹೇಗೆ..? | Stock Analysis in Kannada',
      description: 'Level 2 — Screener ಮೂಲಕ company research ಮಾಡುವುದು, company overview ನೋಡುವುದು ಮತ್ತು P/E, PEG, Debt-to-Equity, EV value ಮುಂತಾದ key ratios ಅನ್ನು ಹೇಗೆ ಪರಿಶೀಲಿಸಬೇಕು ಎಂಬ practical workflow.',
      videoId: 'Okyz-1vm7l0', verified: true, source: 'Angel Investments'
    },
    {
      category: 'Risk Management', level: 0, order: 1,
      title: 'Stock Market ಬಗ್ಗೆ ಭಯ ಇದ್ರೆ ಈ Video ನ ನೋಡಲೇ ಬೇಕು..! Explaining Risk & Rewards In Stock Market......!',
      description: 'Level 0 — stock-market risk ಮತ್ತು reward ಏನು, risk ಅನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡು long-term investingನಲ್ಲಿ discipline ಮತ್ತು realistic expectations ಹೇಗೆ ಇಟ್ಟುಕೊಳ್ಳಬೇಕು ಎಂಬ foundation.',
      videoId: 'cl0bBDoEVaA', verified: true, source: 'Angel Investments'
    },
    {
      category: 'Investor Psychology', level: 0, order: 1,
      title: 'Fear Time ನಲ್ಲಿ Money ಹೇಗೆ build ಆಗುತ್ತೆ? | Sunday video Angel investments | QnA',
      description: 'Level 0 — market fear, uncertainty, investor confidence ಮತ್ತು market volatility ಸಮಯದಲ್ಲಿ long-term thinking ಹೇಗೆ ಉಳಿಸಿಕೊಳ್ಳಬೇಕು ಎಂಬ investor-psychology foundation.',
      videoId: 'hbVkcAajfWo', verified: true, source: 'Angel Investments'
    },
    {
      category: 'Investor Education', level: 0, order: 1,
      title: 'Power Of Compounding In Kannada...! Angel Investments',
      description: 'Level 0 — compounding ಎಂದರೇನು, ಅದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ ಮತ್ತು saving/investing ಮೂಲಕ long-term financial goals ಸಾಧಿಸಲು compounding ಯಾಕೆ ಮುಖ್ಯ ಎಂಬ foundation.',
      videoId: 'gOJ7nNtXWx0', verified: true, source: 'Angel Investments'
    },
    {
      category: 'Investor Education', level: 1, order: 2,
      title: 'Understanding Financial Mistakes | Kannada | Angel Investments',
      description: 'Level 1 — overspending, inadequate insurance, poor budgeting, excessive EMIs ಮತ್ತು investing ಅನ್ನು ನಿರ್ಲಕ್ಷಿಸುವುದು ಸೇರಿದಂತೆ common financial mistakes ಮತ್ತು financial discipline ಬಗ್ಗೆ practical education.',
      videoId: '-w2xDl2DSC4', verified: true, source: 'Angel Investments'
    },
    {
      category: 'Investor Education', level: 1, order: 3,
      title: 'ಸಂಪತ್ತು ಹೇಗೆ ಕಟ್ಟಬೇಕು? 💰 | Wealth Building Explained Simply',
      description: 'Level 1 — wealth buildingಗೆ money mindset, expense control, consistent investing, saving ಮತ್ತು compounding ಅನ್ನು long-term financial freedom ಕಡೆಗೆ ಹೇಗೆ ಬಳಸಬಹುದು ಎಂಬುದು.',
      videoId: 'y6zEv3UBWGA', verified: true, source: 'Angel Investments'
    },
    {
      category: 'Investor Education', level: 2, order: 4,
      title: 'Long Term Investing ಯಾಕೆ ಒಳ್ಳೇದು? | Angel Investments Weekly Video | QnA by Abhilash',
      description: 'Level 2 — long-term investing ಯಾಕೆ useful, stock-market decisionsನಲ್ಲಿ patience ಮತ್ತು long-term thinking ಹೇಗೆ ಬಳಸಬೇಕು, ಮತ್ತು beginner investment questions ಬಗ್ಗೆ practical discussion.',
      videoId: 'QuJd2JlHg7I', verified: true, source: 'Angel Investments'
    },
    {
      category: 'Investor Education', level: 2, order: 5,
      title: 'ನೀವು ಸತ್ತ ಮೇಲೆ ನಿಮ್ಮ ಷೇರುಗಳು ಯಾರಿಗೆ ಸಿಗುತ್ತವೆ? | Angel Investments Weekly Video | QnA by Abhilash',
      description: 'Level 2 — shares ನಂತರ ಯಾರಿಗೆ transfer ಆಗುತ್ತವೆ, nominee-related awareness ಮತ್ತು investment ownership/personal-finance awareness ಬಗ್ಗೆ practical education.',
      videoId: 'Ss-4In6qD6E', verified: true, source: 'Angel Investments'
    }
  ];

  function getAngelInvestmentsVideos(category = '') {
    const videos = category ? ANGEL_INVESTMENTS_KANNADA_VIDEOS.filter(v => v.category === category && v.verified !== false && v.videoId) : ANGEL_INVESTMENTS_KANNADA_VIDEOS.slice();
    return videos.sort((a,b)=>(a.level??9999)-(b.level??9999)||(a.order??9999)-(b.order??9999));
  }
  window.INDOMARK_ANGEL_INVESTMENTS_KANNADA_VIDEOS = ANGEL_INVESTMENTS_KANNADA_VIDEOS;
  window.getIndomarkAngelInvestmentsVideos = getAngelInvestmentsVideos;
})();
