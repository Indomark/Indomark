(() => {
  const VISTARA_KANNADA_VIDEOS = [
    {
      category: 'Stock Market Basics', level: 0, order: 1,
      title: 'ಏನಿದು Stock Market ? Stock Market ಹುಟ್ಟಿದ್ದು ಹೇಗೆ ? | History Of Stock Market',
      description: 'Level 0 — ಮೊದಲು stock market ಹೇಗೆ ಹುಟ್ಟಿತು, ಅದರ history ಮತ್ತು evolution ಬಗ್ಗೆ ತಿಳಿಯಿರಿ. ಇದು history context ಮಾತ್ರ; ಮುಂದೆ ಬರುವ lessonsನಲ್ಲಿ ಇದೇ explanation ಅನ್ನು repeat ಮಾಡುವುದಿಲ್ಲ.',
      videoId: 'g6kNBA-J7qI', verified: true, source: 'Vistara Money Plus'
    },
    {
      category: 'Stock Market Basics', level: 0, order: 2,
      title: 'Stock Market Basics For beginners | ಷೇರು ಮಾರುಕಟ್ಟೆ ಹೂಡಿಕೆ ಬಗ್ಗೆ ಕಂಪ್ಲೀಟ್ ಮಾಹಿತಿ |',
      description: 'Level 0 — history ನಂತರ stock market investment, investing vs trading, Demat/Trading Account, broker, regulator, Nifty/Sensex, market-cap ಮತ್ತು investing basics ಕಲಿಯಿರಿ.',
      videoId: 'UucJL1nqejw', verified: true, source: 'Vistara Money Plus'
    },
    {
      category: 'Stock Market Basics', level: 1, order: 3,
      title: 'Different Types Of Investment In Stock Market | ಹೂಡಿಕೆಯ ಪ್ರಮುಖ ವಿಧಗಳ ಸಮಗ್ರ ವಿವರ',
      description: 'Level 1 — foundation ಮುಗಿದ ಮೇಲೆ stock marketನಲ್ಲಿ ಇರುವ different investment types ಮತ್ತು investment approaches ಬಗ್ಗೆ ಕಲಿಯಿರಿ. Level 0 concepts ಅನ್ನು repeat ಮಾಡುವುದಿಲ್ಲ.',
      videoId: 'oBwtLi4tHfM', verified: true, source: 'Vistara Money Plus'
    },
    {
      category: 'Stock Market Basics', level: 2, order: 4,
      title: 'ಷೇರನ್ನು ಖರೀದಿಸುವ ಮುಂಚೆ ಇದನ್ನು ತಪ್ಪದೆ ಮಾಡಿ.! | Stock Market Investment In Kannada | Share Market',
      description: 'Level 2 — share ಖರೀದಿಸುವ ಮೊದಲು ಮಾಡಬೇಕಾದ practical checks ಮತ್ತು basic investing discipline ಬಗ್ಗೆ ಕಲಿಯಿರಿ.',
      videoId: 'jJSIm32W49Y', verified: true, source: 'Vistara Money Plus'
    },
    {
      category: 'Stock Market Basics', level: 2, order: 5,
      title: 'What Is Trading And How To Trade For Beginners In Kannada | How To Earn More Money In Trading',
      description: 'Level 2 — basic investing understanding ನಂತರ trading ಎಂದರೇನು ಮತ್ತು beginner trading mechanics ಬಗ್ಗೆ introduction ಪಡೆಯಿರಿ.',
      videoId: '_KHXlzU1f-M', verified: true, source: 'Vistara Money Plus'
    },
    {
      category: 'Stock Market Basics', level: 1, order: 6,
      title: 'ಸ್ಟಾಕ್‌ ಮಾರ್ಕೆಟ್‌ ಹೂಡಿಕೆ ಬಗ್ಗೆ ತಜ್ಞರಿಂದ ಕಲಿಯಿರಿ…! | Stock Market Basics For Beginners Kannada',
      description: 'Level 1 — stock-market investment ಬಗ್ಗೆ practical beginner understanding ಮತ್ತು ಪ್ರಮುಖ concepts.',
      videoId: 'LLGkm3TTcCg', verified: true, source: 'Vistara Money Plus'
    },
    {
      category: 'Fundamental Analysis', level: 0, order: 1,
      title: 'ಫಂಡಮೆಂಟಲ್ ಅನಾಲಿಸಿಸ್ ಮತ್ತು ಟೆಕ್ನಿಕಲ್ ಅನಾಲಿಸಿಸ್ | Fundamental analysis Vs Technical Analysis',
      description: 'Level 0 — Fundamental Analysis ಮತ್ತು Technical Analysis ನಡುವಿನ ಮುಖ್ಯ ವ್ಯತ್ಯಾಸ ಏನು, Fundamental Analysis ಯಾಕೆ ಬೇಕು, investingನಲ್ಲಿ ಅದನ್ನು ಹೇಗೆ ನೋಡಬೇಕು ಎಂಬ foundation.',
      videoId: 'HrGI1t7OfE8', verified: true, source: 'Vistara Money Plus'
    },
    {
      category: 'Fundamental Analysis', level: 1, order: 2,
      title: 'ಷೇರು ಮಾರ್ಕೆಟ್‌ನಲ್ಲಿ ಜಾಸ್ತಿ ದುಡ್ಡು ಮಾಡ್ಬೇಕಾ? ಇಲ್ಲಿದೆ ಸೂತ್ರ | Return On Equity | ROE In Share Market',
      description: 'Level 1 — ROE ಅಂದರೇನು, ಅದರ formula ಏನು ಮತ್ತು Screener.inನಲ್ಲಿ ROE ಅನ್ನು ಹೇಗೆ ಕಂಡುಹಿಡಿಯಬೇಕು ಎಂಬುದು.',
      videoId: 'XefyvvVAjFo', verified: true, source: 'Vistara Money Plus'
    },
    {
      category: 'Fundamental Analysis', level: 1, order: 3,
      title: 'ಷೇರು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಲಾಭ ಕೊಡುವ ಕಂಪನಿ ಹುಡುಕೋದು ಹೇಗೆ ? | How to Identify Good Company in Share Market ?',
      description: 'Level 1 — ಕಂಪನಿ profit ಹೇಗೆ ಮಾಡುತ್ತದೆ, Operating Profit Margin, PAT Margin ಮತ್ತು profitability ratios ಮೂಲಕ ಒಳ್ಳೆಯ ಕಂಪನಿಯನ್ನು ಹೇಗೆ screen ಮಾಡಬೇಕು ಎಂಬುದು.',
      videoId: 'xVg1bxRfXKM', verified: true, source: 'Vistara Money Plus'
    },
    {
      category: 'Technical Analysis', level: 0, order: 1,
      title: 'Technical Analysis On Stock Market | ಷೇರು ಮಾರುಕಟ್ಟೆಯ ಟ್ರೆಂಡ್ ತಿಳಿಯಲು ಸಹಕಾರಿ',
      description: 'Level 0 — Technical Analysis ಎಂದರೇನು, stock-market trend ಅನ್ನು technical tools ಮೂಲಕ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವ foundation.',
      videoId: 'qE1ISoZOOBQ', verified: true, source: 'Vistara Money Plus'
    },
    {
      category: 'Technical Analysis', level: 1, order: 2,
      title: 'ಏನಿದು ಡೋಜಿ ಸ್ಟ್ರಾಟಜಿ? ಹೆಚ್ಚು ಲಾಭ ಮಾಡುವುದು ಹೇಗೆ..? | Doji Candlestick Tricks And Tips In Stock Market',
      description: 'Level 1 — Doji candlestick pattern ಎಂದರೇನು, ಅದನ್ನು ಹೇಗೆ ಗುರುತಿಸಬೇಕು ಮತ್ತು tradingನಲ್ಲಿ ಅದರ basic use ಏನು ಎಂಬುದು.',
      videoId: 'DnKG6lVtgYc', verified: true, source: 'Vistara Money Plus'
    },
    {
      category: 'Technical Analysis', level: 2, order: 3,
      title: 'ಲಾಭ ಕೊಡೋ ಷೇರು ಆಯ್ಕೆ ಮಾಡಲು RSI ಸ್ಟ್ರಾಟಜಿ! | RSI Strategy | Stock Market in Kannada',
      description: 'Level 2 — RSI indicator ಅನ್ನು stock selection/trend analysisನಲ್ಲಿ ಹೇಗೆ ಬಳಸಬಹುದು ಎಂಬ strategy-focused lesson.',
      videoId: '6KQ2PGZ_T00', verified: true, source: 'Vistara Money Plus'
    },
    {
      category: 'Risk Management', level: 0, order: 1,
      title: 'Stop-Loss Trading Strategy | Stop loss and Target tool | ಸ್ಟಾಪ್ ಲಾಸ್ ಬಗ್ಗೆ ನಿಮಗೆಷ್ಟು ಗೊತ್ತು?',
      description: 'Level 0 — Stop-loss ಎಂದರೇನು, tradingನಲ್ಲಿ loss ಅನ್ನು ನಿಯಂತ್ರಿಸಲು stop-loss ಮತ್ತು target tools ಅನ್ನು ಹೇಗೆ ಬಳಸಬೇಕು ಎಂಬ risk-control foundation.',
      videoId: 'VZ2CG9oIfgg', verified: true, source: 'Vistara Money Plus'
    },
    {
      category: 'Investor Psychology', level: 0, order: 1,
      title: 'What Is FUD? How to invest without fear? | Vistara Money Plus | Rangaswamy Mookanahalli',
      description: 'Level 0 — Fear, Uncertainty and Doubt (FUD) investor decisions ಮೇಲೆ ಹೇಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ ಮತ್ತು fear-free investing mindset ಬಗ್ಗೆ foundation.',
      videoId: 'HKPFMhRls0w', verified: true, source: 'Vistara Money Plus'
    },
    {
      category: 'Investor Education', level: 0, order: 1,
      title: 'ಎಂಥವರೂ ಕೂಡ ಹಣ ಉಳಿಸಲು ಸಿಂಪಲ್ ಸೂತ್ರ! | Money Saving Tips In Kannada | Vistara Money Plus',
      description: 'Level 0 — budgeting, spending control, savings habits ಮತ್ತು financial goals ಮೂಲಕ basic money-management foundation.',
      videoId: 'Z9lJucF3lJA', verified: true, source: 'Vistara Money Plus'
    },
    {
      category: 'Investor Education', level: 1, order: 2,
      title: 'ನಿಮ್ಮ ಹಣದ ಮೌಲ್ಯ ವೃದ್ಧಿಸುವ ಸಿಂಪಲ್ ಟಿಪ್ಸ್ | Money Management Tips In Kannada | Vistara Money Plus',
      description: 'Level 1 — ಹಣವನ್ನು manage ಮಾಡುವುದು, financial discipline ಮತ್ತು money-value growth ಬಗ್ಗೆ practical personal-finance education.',
      videoId: 'DGhbjZioKSE', verified: true, source: 'Vistara Money Plus'
    },
    {
      category: 'Investor Education', level: 1, order: 3,
      title: 'ಸಾಲವನ್ನು ಬೇಗ ತೀರಿಸುವುದು ಹೇಗೆ ? | How to Repay Home Loan Faster? | Vistara Money Plus',
      description: 'Level 1 — good vs bad debt, EMI, loan tenure, interest burden ಮತ್ತು home-loan repayment strategy ಬಗ್ಗೆ financial education.',
      videoId: 'aRov8Ilvh2s', verified: true, source: 'Vistara Money Plus'
    },
    {
      category: 'Investor Education', level: 2, order: 4,
      title: 'Loan Details In Kannada | ಸಿಬಿಲ್ ಸ್ಕೋರ್ ಬಗ್ಗೆ ನಿಮಗೆಷ್ಟು ಗೊತ್ತು? | Vistara Money Plus',
      description: 'Level 2 — loan basics, CIBIL score ಮತ್ತು personal-credit awareness ಬಗ್ಗೆ practical financial education.',
      videoId: 'Dv-HwCJQRyw', verified: true, source: 'Vistara Money Plus'
    },
    {
      category: 'Investor Education', level: 2, order: 5,
      title: 'ಬೆಸ್ಟ್‌ 5 ಪೋಸ್ಟ್‌ ಆಫೀಸ್‌ ಸ್ಕೀಮ್ಸ್‌ಗಳು...! | Post Office Monthly Scheme In Kannada | POMIS In Kannada',
      description: 'Level 2 — government-backed post-office investment options and monthly-income-oriented schemes ಬಗ್ಗೆ investor education.',
      videoId: '5meULGFlwB4', verified: true, source: 'Vistara Money Plus'
    }
  ];

  function getVistaraVideos(category = '') {
    const videos = category ? VISTARA_KANNADA_VIDEOS.filter(v => v.category === category && v.verified !== false && v.videoId) : VISTARA_KANNADA_VIDEOS.slice();
    return videos.sort((a,b)=>(a.level??9999)-(b.level??9999)||(a.order??9999)-(b.order??9999));
  }
  window.INDOSPEED_VISTARA_KANNADA_VIDEOS = VISTARA_KANNADA_VIDEOS;
  window.getIndoSpeedVistaraVideos = getVistaraVideos;
})();
