(() => {
  const CATALOG = {
    'kn:tidi:varsity': {
      courseTitle: 'Stock Market Basics — Course 1',
      sourceCourse: 'TIDI Academy — Kannada Stock Market Education',
      verifiedSource: 'Channel added as a verified Kannada education source. Exact YouTube course/playlist mapping must be verified before videos are added.',
      parts: []
    },
    'kn:wavetrader:varsity': {
      courseTitle: 'Stock Market Basics — Course 1',
      sourceCourse: 'Stock Market Course — Zero to Advance',
      verifiedSource: 'Parts 1–5 have been identified from Wavetraderkannada YouTube course videos. Part 2 is mapped from the user-provided video URL; Parts 6+ still require exact video verification before mapping.',
      parts: [
        { n: 1, title: 'Stock Market Course Part - 1 Zero to Advance', videoId: 'xL83DdYMlWQ' },
        { n: 2, title: 'Stock Market Course Part - 2 Zero to Advance', videoId: 'K0N7BQjff1U' },
        { n: 3, title: 'Stock Market Course Part - 3 Zero to Advance', videoId: 'UYwNdeMQQPc' },
        { n: 4, title: 'Stock Market Course Part- 4 Zero to Advance', videoId: 'Op2manPp_vE' },
        { n: 5, title: 'Stock Market Course Part- 5 Zero to Advance', videoId: 'FrmDSd0vpCg' }
      ]
    },
    'kn:vistara:varsity': { courseTitle: 'Stock Market Basics — Course 1', sourceCourse: 'Verified beginner stock-market lesson', verifiedSource: 'One exact lesson currently verified; more course parts must be identified before adding them.', parts: [{ n: 1, title: 'Stock Market Basics — Verified Lesson', videoId: 'UucJL1nqejw' }] },
    'hi:pranjal:varsity': { courseTitle: 'Stock Market Basics — Course 1', sourceCourse: 'Verified beginner stock-market lesson', verifiedSource: 'One exact lesson currently verified; more course parts must be identified before adding them.', parts: [{ n: 1, title: 'Stock Market Basics — Verified Lesson', videoId: 'RFP3ooXIiyI' }] },
    'ta:businessman:varsity': { courseTitle: 'Stock Market Basics — Course 1', sourceCourse: 'Complete Stock Market Course in Tamil', verifiedSource: 'One complete course video; it is not a multi-part series.', parts: [{ n: 1, title: 'Complete Stock Market Course in Tamil', videoId: 'SLO1dFKSvgg' }] },
    'en:investopedia:varsity': { courseTitle: 'Stock Market Basics — Course 1', sourceCourse: 'Verified beginner stock-market lesson', verifiedSource: 'One exact lesson currently verified; more course parts must be identified before adding them.', parts: [{ n: 1, title: 'Stock Market Basics — Verified Lesson', videoId: 'BgEZn-HJNb4' }] }
  };
  function getCatalog(language, teacher, course = 'varsity') { return CATALOG[`${language}:${teacher}:${course}`] || null; }
  window.INDOMARK_LEARN_CATALOG = { CATALOG, getCatalog };
})();
