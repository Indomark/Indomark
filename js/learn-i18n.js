(() => {
  const KEY = 'indomark_learn_language_v2';
  const LANGS = ['en','kn','hi','ta','mr','te','ml','gu','bn','or'];
  const LANG_LABELS = {
    en:'English', kn:'ಕನ್ನಡ', hi:'हिन्दी', ta:'தமிழ்', mr:'मराठी',
    te:'తెలుగు', ml:'മലയാളം', gu:'ગુજરાતી', bn:'বাংলা', or:'ଓଡ଼ିଆ'
  };

  const T = {
    en: {
      hub:'LEARNING HUB', title:'Learn', intro:'Choose a category. Next choose language, then channel, then videos.',
      progress:'Your Learning Progress', mapped:'mapped parts completed', continue:'Continue Learning →',
      continueText:'Choose category → language → channel', categories:'Learning Categories', viewAll:'View All',
      basics:'Stock Market Basics', technical:'Technical Analysis', fundamental:'Fundamental Analysis',
      risk:'Risk Management', psychology:'Investor Psychology', education:'Investor Education',
      flow:'Language → channel → videos', basicsFlow:'Language → channel → course', official:'Verified learning resources',
      paper:'Paper Money Practice', simulation:'SIMULATION', paperText:'Practice what you learn with virtual money. No real-money trading in Learn.', start:'Start Practice →',
      chooseLanguage:'Choose your learning language', stepText:'Choose the language for your Learn section.',
      chooseTeacher:'Choose your teacher/channel', teacherText:'Choose a channel. Your progress stays separate for each channel.',
      back:'←', language:'Language:', channel:'Channel:', category:'Category:', videos:'Videos', videoIntro:'Start from Level 0 and move forward step by step.',
      verified:'✓ Verified', empty:'No verified videos have been added for this channel and category yet.',
      level0:'Foundation', level1:'Beginner Basics', level2:'Core Concepts', level3:'Technical Analysis',
      level4:'Trading / Intraday', level5:'F&O / Options / Futures', verifiedVideos:'Verified Videos',
      course:'COURSE LEARNING', selectedPath:'Selected language → selected teacher → continue your course.',
      changeLanguage:'Change Language', changeTeacher:'Change Teacher', courseParts:'Course Parts',
      loading:'Loading verified course video…', qa:'Important Point Q&A', finish:'Finish the verified video first.'
    },
    kn: {
      hub:'ಕಲಿಕೆಯ ಕೇಂದ್ರ', title:'ಕಲಿಕೆ', intro:'ವಿಭಾಗ ಆಯ್ಕೆ ಮಾಡಿ. ನಂತರ ಭಾಷೆ, ಚಾನೆಲ್ ಮತ್ತು ವೀಡಿಯೊಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.',
      progress:'ನಿಮ್ಮ ಕಲಿಕಾ ಪ್ರಗತಿ', mapped:'ಮ್ಯಾಪ್ ಮಾಡಿದ ಭಾಗಗಳಲ್ಲಿ ಪೂರ್ಣಗೊಂಡಿವೆ', continue:'ಕಲಿಕೆಯನ್ನು ಮುಂದುವರಿಸಿ →',
      continueText:'ವಿಭಾಗ → ಭಾಷೆ → ಚಾನೆಲ್ ಆಯ್ಕೆ ಮಾಡಿ', categories:'ಕಲಿಕಾ ವಿಭಾಗಗಳು', viewAll:'ಎಲ್ಲವನ್ನೂ ನೋಡಿ',
      basics:'ಷೇರು ಮಾರುಕಟ್ಟೆ ಮೂಲಭೂತಗಳು', technical:'ತಾಂತ್ರಿಕ ವಿಶ್ಲೇಷಣೆ', fundamental:'ಮೂಲಭೂತ ವಿಶ್ಲೇಷಣೆ',
      risk:'ಅಪಾಯ ನಿರ್ವಹಣೆ', psychology:'ಹೂಡಿಕೆದಾರರ ಮನೋವಿಜ್ಞಾನ', education:'ಹೂಡಿಕೆದಾರರ ಶಿಕ್ಷಣ',
      flow:'ಭಾಷೆ → ಚಾನೆಲ್ → ವೀಡಿಯೊಗಳು', basicsFlow:'ಭಾಷೆ → ಚಾನೆಲ್ → ಕೋರ್ಸ್', official:'ಪರಿಶೀಲಿಸಿದ ಕಲಿಕಾ ಸಂಪನ್ಮೂಲಗಳು',
      paper:'ಪೇಪರ್ ಮನಿ ಅಭ್ಯಾಸ', simulation:'ಸಿಮ್ಯುಲೇಶನ್', paperText:'ವರ್ಚುವಲ್ ಹಣದಿಂದ ಕಲಿತದ್ದನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ. Learnನಲ್ಲಿ ನೈಜ ಹಣದ ಟ್ರೇಡಿಂಗ್ ಇಲ್ಲ.', start:'ಅಭ್ಯಾಸ ಪ್ರಾರಂಭಿಸಿ →',
      chooseLanguage:'ನಿಮ್ಮ ಕಲಿಕೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ', stepText:'Learn ವಿಭಾಗಕ್ಕೆ ಬೇಕಾದ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.',
      chooseTeacher:'ನಿಮ್ಮ ಶಿಕ್ಷಕ / ಚಾನೆಲ್ ಆಯ್ಕೆ ಮಾಡಿ', teacherText:'ಒಂದು ಚಾನೆಲ್ ಆಯ್ಕೆ ಮಾಡಿ. ಪ್ರತಿ ಚಾನೆಲ್‌ನ ಪ್ರಗತಿ ಪ್ರತ್ಯೇಕವಾಗಿರುತ್ತದೆ.',
      back:'←', language:'ಭಾಷೆ:', channel:'ಚಾನೆಲ್:', category:'ವಿಭಾಗ:', videos:'ವೀಡಿಯೊಗಳು', videoIntro:'Level 0ರಿಂದ ಪ್ರಾರಂಭಿಸಿ ಹಂತ ಹಂತವಾಗಿ ಮುಂದುವರಿಯಿರಿ.',
      verified:'✓ ಪರಿಶೀಲಿಸಲಾಗಿದೆ', empty:'ಈ ಚಾನೆಲ್ ಮತ್ತು ವಿಭಾಗಕ್ಕೆ ಇನ್ನೂ ಪರಿಶೀಲಿಸಿದ ವೀಡಿಯೊಗಳನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ.',
      level0:'ಮೂಲಭೂತ ಹಂತ', level1:'ಆರಂಭಿಕ ಹಂತ', level2:'ಮುಖ್ಯ ಪರಿಕಲ್ಪನೆಗಳು', level3:'ತಾಂತ್ರಿಕ ವಿಶ್ಲೇಷಣೆ',
      level4:'ಟ್ರೇಡಿಂಗ್ / ಇಂಟ್ರಾಡೇ', level5:'F&O / ಆಪ್ಷನ್ಸ್ / ಫ್ಯೂಚರ್ಸ್', verifiedVideos:'ಪರಿಶೀಲಿಸಿದ ವೀಡಿಯೊಗಳು',
      course:'ಕೋರ್ಸ್ ಕಲಿಕೆ', selectedPath:'ಆಯ್ಕೆ ಮಾಡಿದ ಭಾಷೆ → ಶಿಕ್ಷಕ → ನಿಮ್ಮ ಕೋರ್ಸ್ ಮುಂದುವರಿಸಿ.',
      changeLanguage:'ಭಾಷೆ ಬದಲಿಸಿ', changeTeacher:'ಶಿಕ್ಷಕ ಬದಲಿಸಿ', courseParts:'ಕೋರ್ಸ್ ಭಾಗಗಳು',
      loading:'ಪರಿಶೀಲಿಸಿದ ಕೋರ್ಸ್ ವೀಡಿಯೊ ಲೋಡ್ ಆಗುತ್ತಿದೆ…', qa:'ಮುಖ್ಯ ಅಂಶಗಳ ಪ್ರಶ್ನೋತ್ತರ', finish:'ಮೊದಲು ಪರಿಶೀಲಿಸಿದ ವೀಡಿಯೊವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ವೀಕ್ಷಿಸಿ.'
    },
    hi: {
      hub:'लर्निंग हब', title:'सीखें', intro:'एक श्रेणी चुनें। फिर भाषा, चैनल और वीडियो चुनें.',
      progress:'आपकी सीखने की प्रगति', mapped:'मैप किए गए भाग पूरे', continue:'सीखना जारी रखें →', continueText:'श्रेणी → भाषा → चैनल चुनें',
      categories:'लर्निंग श्रेणियां', viewAll:'सभी देखें', basics:'शेयर मार्केट बेसिक्स', technical:'टेक्निकल एनालिसिस', fundamental:'फंडामेंटल एनालिसिस', risk:'रिस्क मैनेजमेंट', psychology:'इन्वेस्टर साइकोलॉजी', education:'इन्वेस्टर एजुकेशन', flow:'भाषा → चैनल → वीडियो', basicsFlow:'भाषा → चैनल → कोर्स', official:'सत्यापित सीखने के संसाधन', paper:'पेपर मनी प्रैक्टिस', simulation:'सिमुलेशन', paperText:'वर्चुअल पैसे से अभ्यास करें। Learn में वास्तविक ट्रेडिंग नहीं है।', start:'अभ्यास शुरू करें →', chooseLanguage:'सीखने की भाषा चुनें', stepText:'Learn सेक्शन के लिए भाषा चुनें।', chooseTeacher:'शिक्षक / चैनल चुनें', teacherText:'एक चैनल चुनें। हर चैनल की प्रगति अलग रहेगी।', back:'←', language:'भाषा:', channel:'चैनल:', category:'श्रेणी:', videos:'वीडियो', videoIntro:'Level 0 से शुरू करके क्रम से आगे बढ़ें।', verified:'✓ सत्यापित', empty:'इस चैनल और श्रेणी के लिए अभी सत्यापित वीडियो नहीं हैं।', level0:'फाउंडेशन', level1:'बिगिनर बेसिक्स', level2:'मुख्य अवधारणाएं', level3:'टेक्निकल एनालिसिस', level4:'ट्रेडिंग / इंट्राडे', level5:'F&O / ऑप्शंस / फ्यूचर्स', verifiedVideos:'सत्यापित वीडियो', course:'कोर्स लर्निंग', selectedPath:'चयनित भाषा → शिक्षक → कोर्स जारी रखें।', changeLanguage:'भाषा बदलें', changeTeacher:'शिक्षक बदलें', courseParts:'कोर्स भाग', loading:'सत्यापित कोर्स वीडियो लोड हो रहा है…', qa:'महत्वपूर्ण बिंदु प्रश्नोत्तर', finish:'पहले सत्यापित वीडियो पूरा देखें.'
    },
    ta: {
      hub:'கற்றல் மையம்', title:'கற்க', intro:'ஒரு பிரிவை தேர்வு செய்யுங்கள். பின்னர் மொழி, சேனல், வீடியோவை தேர்வு செய்யுங்கள்.', progress:'உங்கள் கற்றல் முன்னேற்றம்', mapped:'முழுமையான பகுதிகள்', continue:'கற்றலைத் தொடரவும் →', continueText:'பிரிவு → மொழி → சேனல்', categories:'கற்றல் பிரிவுகள்', viewAll:'அனைத்தையும் காண்க', basics:'பங்கு சந்தை அடிப்படைகள்', technical:'தொழில்நுட்ப பகுப்பாய்வு', fundamental:'அடிப்படை பகுப்பாய்வு', risk:'ஆபத்து மேலாண்மை', psychology:'முதலீட்டாளர் உளவியல்', education:'முதலீட்டாளர் கல்வி', flow:'மொழி → சேனல் → வீடியோக்கள்', basicsFlow:'மொழி → சேனல் → பாடநெறி', official:'சரிபார்க்கப்பட்ட கற்றல் வளங்கள்', paper:'பேப்பர் மணி பயிற்சி', simulation:'சிமுலேஷன்', paperText:'மெய்நிகர் பணத்தில் பயிற்சி செய்யுங்கள். Learnல் உண்மையான வர்த்தகம் இல்லை.', start:'பயிற்சியைத் தொடங்கவும் →', chooseLanguage:'கற்றல் மொழியைத் தேர்வு செய்யுங்கள்', stepText:'Learn பிரிவிற்கான மொழியைத் தேர்வு செய்யுங்கள்.', chooseTeacher:'ஆசிரியர் / சேனலைத் தேர்வு செய்யுங்கள்', teacherText:'ஒரு சேனலைத் தேர்வு செய்யுங்கள். ஒவ்வொரு சேனலின் முன்னேற்றமும் தனியாக இருக்கும்.', back:'←', language:'மொழி:', channel:'சேனல்:', category:'பிரிவு:', videos:'வீடியோக்கள்', videoIntro:'Level 0இல் தொடங்கி படிப்படியாக முன்னேறுங்கள்.', verified:'✓ சரிபார்க்கப்பட்டது', empty:'இந்த சேனல் மற்றும் பிரிவிற்கு இன்னும் சரிபார்க்கப்பட்ட வீடியோக்கள் இல்லை.', level0:'அடித்தளம்', level1:'ஆரம்ப அடிப்படைகள்', level2:'முக்கிய கருத்துகள்', level3:'தொழில்நுட்ப பகுப்பாய்வு', level4:'வர்த்தகம் / இன்ட்ராடே', level5:'F&O / ஆப்ஷன்ஸ் / ஃப்யூச்சர்ஸ்', verifiedVideos:'சரிபார்க்கப்பட்ட வீடியோக்கள்', course:'பாடநெறி கற்றல்', selectedPath:'தேர்ந்த மொழி → ஆசிரியர் → பாடநெறியைத் தொடரவும்.', changeLanguage:'மொழியை மாற்றவும்', changeTeacher:'ஆசிரியரை மாற்றவும்', courseParts:'பாடநெறி பகுதிகள்', loading:'சரிபார்க்கப்பட்ட பாடநெறி வீடியோ ஏற்றப்படுகிறது…', qa:'முக்கிய அம்ச கேள்வி-பதில்', finish:'முதலில் சரிபார்க்கப்பட்ட வீடியோவை முழுமையாகப் பாருங்கள்.'
    },
    mr: {
      hub:'लर्निंग हब', title:'शिका', intro:'एक श्रेणी निवडा. मग भाषा, चॅनेल आणि व्हिडिओ निवडा.', progress:'तुमची शिकण्याची प्रगती', mapped:'पूर्ण झालेले मॅप केलेले भाग', continue:'शिकणे सुरू ठेवा →', continueText:'श्रेणी → भाषा → चॅनेल', categories:'शिकण्याच्या श्रेणी', viewAll:'सर्व पहा', basics:'शेअर मार्केट बेसिक्स', technical:'टेक्निकल अॅनालिसिस', fundamental:'फंडामेंटल अॅनालिसिस', risk:'रिस्क मॅनेजमेंट', psychology:'इन्व्हेस्टर सायकोलॉजी', education:'इन्व्हेस्टर एज्युकेशन', flow:'भाषा → चॅनेल → व्हिडिओ', basicsFlow:'भाषा → चॅनेल → कोर्स', official:'सत्यापित शिक्षण संसाधने', paper:'पेपर मनी सराव', simulation:'सिम्युलेशन', paperText:'व्हर्च्युअल पैशांनी सराव करा. Learn मध्ये वास्तविक ट्रेडिंग नाही.', start:'सराव सुरू करा →', chooseLanguage:'शिकण्याची भाषा निवडा', stepText:'Learn विभागासाठी भाषा निवडा.', chooseTeacher:'शिक्षक / चॅनेल निवडा', teacherText:'एक चॅनेल निवडा. प्रत्येक चॅनेलची प्रगती वेगळी राहील.', back:'←', language:'भाषा:', channel:'चॅनेल:', category:'श्रेणी:', videos:'व्हिडिओ', videoIntro:'Level 0 पासून सुरू करून क्रमाने पुढे जा.', verified:'✓ सत्यापित', empty:'या चॅनेल आणि श्रेणीसाठी अद्याप सत्यापित व्हिडिओ नाहीत.', level0:'फाउंडेशन', level1:'बिगिनर बेसिक्स', level2:'मुख्य संकल्पना', level3:'टेक्निकल अॅनालिसिस', level4:'ट्रेडिंग / इंट्राडे', level5:'F&O / ऑप्शन्स / फ्युचर्स', verifiedVideos:'सत्यापित व्हिडिओ', course:'कोर्स लर्निंग', selectedPath:'निवडलेली भाषा → शिक्षक → कोर्स सुरू ठेवा.', changeLanguage:'भाषा बदला', changeTeacher:'शिक्षक बदला', courseParts:'कोर्स भाग', loading:'सत्यापित कोर्स व्हिडिओ लोड होत आहे…', qa:'महत्त्वाचे मुद्दे प्रश्नोत्तर', finish:'प्रथम सत्यापित व्हिडिओ पूर्ण पहा.'
    },
    te: {
      hub:'లెర్నింగ్ హబ్', title:'నేర్చుకోండి', intro:'ఒక విభాగాన్ని ఎంచుకోండి. తర్వాత భాష, ఛానెల్, వీడియోలను ఎంచుకోండి.', progress:'మీ లెర్నింగ్ పురోగతి', mapped:'మ్యాప్ చేసిన భాగాలు పూర్తయ్యాయి', continue:'లెర్నింగ్ కొనసాగించండి →', continueText:'విభాగం → భాష → ఛానెల్', categories:'లెర్నింగ్ విభాగాలు', viewAll:'అన్నీ చూడండి', basics:'స్టాక్ మార్కెట్ బేసిక్స్', technical:'టెక్నికల్ అనాలిసిస్', fundamental:'ఫండమెంటల్ అనాలిసిస్', risk:'రిస్క్ మేనేజ్‌మెంట్', psychology:'ఇన్వెస్టర్ సైకాలజీ', education:'ఇన్వెస్టర్ ఎడ్యుకేషన్', flow:'భాష → ఛానెల్ → వీడియోలు', basicsFlow:'భాష → ఛానెల్ → కోర్స్', official:'ధృవీకరించిన లెర్నింగ్ వనరులు', paper:'పేపర్ మనీ ప్రాక్టీస్', simulation:'సిమ్యులేషన్', paperText:'వర్చువల్ డబ్బుతో ప్రాక్టీస్ చేయండి. Learnలో నిజమైన ట్రేడింగ్ లేదు.', start:'ప్రాక్టీస్ ప్రారంభించండి →', chooseLanguage:'లెర్నింగ్ భాషను ఎంచుకోండి', stepText:'Learn విభాగానికి భాషను ఎంచుకోండి.', chooseTeacher:'టీచర్ / ఛానెల్ ఎంచుకోండి', teacherText:'ఒక ఛానెల్ ఎంచుకోండి. ప్రతి ఛానెల్ పురోగతి వేరుగా సేవ్ అవుతుంది.', back:'←', language:'భాష:', channel:'ఛానెల్:', category:'విభాగం:', videos:'వీడియోలు', videoIntro:'Level 0 నుండి ప్రారంభించి క్రమంగా ముందుకు వెళ్లండి.', verified:'✓ ధృవీకరించబడింది', empty:'ఈ ఛానెల్ మరియు విభాగానికి ఇంకా ధృవీకరించిన వీడియోలు లేవు.', level0:'ఫౌండేషన్', level1:'బిగినర్ బేసిక్స్', level2:'ముఖ్య కాన్సెప్ట్స్', level3:'టెక్నికల్ అనాలిసిస్', level4:'ట్రేడింగ్ / ఇంట్రాడే', level5:'F&O / ఆప్షన్స్ / ఫ్యూచర్స్', verifiedVideos:'ధృవీకరించిన వీడియోలు', course:'కోర్స్ లెర్నింగ్', selectedPath:'ఎంచుకున్న భాష → టీచర్ → కోర్స్ కొనసాగించండి.', changeLanguage:'భాష మార్చండి', changeTeacher:'టీచర్ మార్చండి', courseParts:'కోర్స్ భాగాలు', loading:'ధృవీకరించిన కోర్స్ వీడియో లోడ్ అవుతోంది…', qa:'ముఖ్యాంశాల ప్రశ్నోత్తరాలు', finish:'ముందుగా ధృవీకరించిన వీడియోను పూర్తిగా చూడండి.'
    },
    ml: {
      hub:'ലേണിംഗ് ഹബ്', title:'പഠിക്കുക', intro:'ഒരു വിഭാഗം തിരഞ്ഞെടുക്കുക. തുടർന്ന് ഭാഷ, ചാനൽ, വീഡിയോകൾ തിരഞ്ഞെടുക്കുക.', progress:'നിങ്ങളുടെ പഠന പുരോഗതി', mapped:'പൂർത്തിയായ മാപ്പ് ചെയ്ത ഭാഗങ്ങൾ', continue:'പഠനം തുടരുക →', continueText:'വിഭാഗം → ഭാഷ → ചാനൽ', categories:'പഠന വിഭാഗങ്ങൾ', viewAll:'എല്ലാം കാണുക', basics:'സ്റ്റോക്ക് മാർക്കറ്റ് അടിസ്ഥാനങ്ങൾ', technical:'ടെക്നിക്കൽ അനാലിസിസ്', fundamental:'ഫണ്ടമെന്റൽ അനാലിസിസ്', risk:'റിസ്ക് മാനേജ്മെന്റ്', psychology:'ഇൻവസ്റ്റർ സൈക്കോളജി', education:'ഇൻവസ്റ്റർ എജുക്കേഷൻ', flow:'ഭാഷ → ചാനൽ → വീഡിയോകൾ', basicsFlow:'ഭാഷ → ചാനൽ → കോഴ്‌സ്', official:'സ്ഥിരീകരിച്ച പഠന വിഭവങ്ങൾ', paper:'പേപ്പർ മണി പരിശീലനം', simulation:'സിമുലേഷൻ', paperText:'വെർച്വൽ പണം ഉപയോഗിച്ച് പരിശീലിക്കുക. Learnൽ യഥാർത്ഥ ട്രേഡിംഗ് ഇല്ല.', start:'പരിശീലനം തുടങ്ങുക →', chooseLanguage:'പഠന ഭാഷ തിരഞ്ഞെടുക്കുക', stepText:'Learn വിഭാഗത്തിനുള്ള ഭാഷ തിരഞ്ഞെടുക്കുക.', chooseTeacher:'അധ്യാപക / ചാനൽ തിരഞ്ഞെടുക്കുക', teacherText:'ഒരു ചാനൽ തിരഞ്ഞെടുക്കുക. ഓരോ ചാനലിന്റെയും പുരോഗതി വേർതിരിച്ച് സൂക്ഷിക്കും.', back:'←', language:'ഭാഷ:', channel:'ചാനൽ:', category:'വിഭാഗം:', videos:'വീഡിയോകൾ', videoIntro:'Level 0 മുതൽ ആരംഭിച്ച് ക്രമമായി മുന്നോട്ട് പോകുക.', verified:'✓ സ്ഥിരീകരിച്ചു', empty:'ഈ ചാനലിനും വിഭാഗത്തിനും സ്ഥിരീകരിച്ച വീഡിയോകൾ ഇതുവരെ ചേർത്തിട്ടില്ല.', level0:'അടിസ്ഥാനം', level1:'തുടക്ക അടിസ്ഥാനങ്ങൾ', level2:'പ്രധാന ആശയങ്ങൾ', level3:'ടെക്നിക്കൽ അനാലിസിസ്', level4:'ട്രേഡിംഗ് / ഇൻട്രാഡേ', level5:'F&O / ഓപ്ഷൻസ് / ഫ്യൂച്ചേഴ്സ്', verifiedVideos:'സ്ഥിരീകരിച്ച വീഡിയോകൾ', course:'കോഴ്‌സ് ലേണിംഗ്', selectedPath:'തിരഞ്ഞെടുത്ത ഭാഷ → അധ്യാപകൻ → കോഴ്‌സ് തുടരുക.', changeLanguage:'ഭാഷ മാറ്റുക', changeTeacher:'അധ്യാപകനെ മാറ്റുക', courseParts:'കോഴ്‌സ് ഭാഗങ്ങൾ', loading:'സ്ഥിരീകരിച്ച കോഴ്‌സ് വീഡിയോ ലോഡ് ചെയ്യുന്നു…', qa:'പ്രധാന പോയിന്റ് ചോദ്യോത്തരം', finish:'ആദ്യം സ്ഥിരീകരിച്ച വീഡിയോ പൂർണ്ണമായി കാണുക.'
    },
    gu: {
      hub:'લર્નિંગ હબ', title:'શીખો', intro:'એક કેટેગરી પસંદ કરો. પછી ભાષા, ચેનલ અને વિડિયો પસંદ કરો.', progress:'તમારી લર્નિંગ પ્રગતિ', mapped:'પૂર્ણ થયેલા મૅપ કરેલા ભાગો', continue:'લર્નિંગ ચાલુ રાખો →', continueText:'કેટેગરી → ભાષા → ચેનલ', categories:'લર્નિંગ કેટેગરીઝ', viewAll:'બધું જુઓ', basics:'સ્ટોક માર્કેટ બેસિક્સ', technical:'ટેક્નિકલ એનાલિસિસ', fundamental:'ફંડામેન્ટલ એનાલિસિસ', risk:'રિસ્ક મેનેજમેન્ટ', psychology:'ઇન્વેસ્ટર સાયકોલોજી', education:'ઇન્વેસ્ટર એજ્યુકેશન', flow:'ભાષા → ચેનલ → વિડિયો', basicsFlow:'ભાષા → ચેનલ → કોર્સ', official:'ચકાસેલ લર્નિંગ સંસાધનો', paper:'પેપર મની પ્રેક્ટિસ', simulation:'સિમ્યુલેશન', paperText:'વર્ચ્યુઅલ પૈસાથી પ્રેક્ટિસ કરો. Learnમાં વાસ્તવિક ટ્રેડિંગ નથી.', start:'પ્રેક્ટિસ શરૂ કરો →', chooseLanguage:'લર્નિંગ ભાષા પસંદ કરો', stepText:'Learn વિભાગ માટે ભાષા પસંદ કરો.', chooseTeacher:'શિક્ષક / ચેનલ પસંદ કરો', teacherText:'એક ચેનલ પસંદ કરો. દરેક ચેનલની પ્રગતિ અલગ રહેશે.', back:'←', language:'ભાષા:', channel:'ચેનલ:', category:'કેટેગરી:', videos:'વિડિયો', videoIntro:'Level 0થી શરૂ કરીને ક્રમશઃ આગળ વધો.', verified:'✓ ચકાસેલ', empty:'આ ચેનલ અને કેટેગરી માટે હજી ચકાસેલા વિડિયો ઉમેરાયા નથી.', level0:'ફાઉન્ડેશન', level1:'બિગિનર બેસિક્સ', level2:'મુખ્ય ખ્યાલો', level3:'ટેક્નિકલ એનાલિસિસ', level4:'ટ્રેડિંગ / ઇન્ટ્રાડે', level5:'F&O / ઑપ્શન્સ / ફ્યુચર્સ', verifiedVideos:'ચકાસેલા વિડિયો', course:'કોર્સ લર્નિંગ', selectedPath:'પસંદ કરેલી ભાષા → શિક્ષક → કોર્સ ચાલુ રાખો.', changeLanguage:'ભાષા બદલો', changeTeacher:'શિક્ષક બદલો', courseParts:'કોર્સ ભાગો', loading:'ચકાસેલ કોર્સ વિડિયો લોડ થઈ રહ્યો છે…', qa:'મુખ્ય મુદ્દા પ્રશ્નોત્તરી', finish:'પહેલા ચકાસેલ વિડિયો સંપૂર્ણ જુઓ.'
    },
    bn: {
      hub:'লার্নিং হাব', title:'শিখুন', intro:'একটি বিভাগ বেছে নিন। তারপর ভাষা, চ্যানেল ও ভিডিও বেছে নিন।', progress:'আপনার শেখার অগ্রগতি', mapped:'সম্পন্ন ম্যাপ করা অংশ', continue:'শেখা চালিয়ে যান →', continueText:'বিভাগ → ভাষা → চ্যানেল', categories:'লার্নিং বিভাগ', viewAll:'সব দেখুন', basics:'স্টক মার্কেট বেসিকস', technical:'টেকনিক্যাল অ্যানালিসিস', fundamental:'ফান্ডামেন্টাল অ্যানালিসিস', risk:'রিস্ক ম্যানেজমেন্ট', psychology:'ইনভেস্টর সাইকোলজি', education:'ইনভেস্টর এডুকেশন', flow:'ভাষা → চ্যানেল → ভিডিও', basicsFlow:'ভাষা → চ্যানেল → কোর্স', official:'যাচাইকৃত শেখার রিসোর্স', paper:'পেপার মানি প্র্যাকটিস', simulation:'সিমুলেশন', paperText:'ভার্চুয়াল টাকা দিয়ে অনুশীলন করুন। Learn-এ আসল ট্রেডিং নেই।', start:'প্র্যাকটিস শুরু করুন →', chooseLanguage:'শেখার ভাষা বেছে নিন', stepText:'Learn বিভাগের জন্য ভাষা বেছে নিন।', chooseTeacher:'শিক্ষক / চ্যানেল বেছে নিন', teacherText:'একটি চ্যানেল বেছে নিন। প্রতিটি চ্যানেলের অগ্রগতি আলাদা থাকবে।', back:'←', language:'ভাষা:', channel:'চ্যানেল:', category:'বিভাগ:', videos:'ভিডিও', videoIntro:'Level 0 থেকে শুরু করে ধাপে ধাপে এগিয়ে যান।', verified:'✓ যাচাইকৃত', empty:'এই চ্যানেল ও বিভাগের জন্য এখনও যাচাইকৃত ভিডিও যোগ করা হয়নি।', level0:'ফাউন্ডেশন', level1:'বিগিনার বেসিকস', level2:'মূল ধারণা', level3:'টেকনিক্যাল অ্যানালিসিস', level4:'ট্রেডিং / ইন্ট্রাডে', level5:'F&O / অপশন / ফিউচার', verifiedVideos:'যাচাইকৃত ভিডিও', course:'কোর্স লার্নিং', selectedPath:'নির্বাচিত ভাষা → শিক্ষক → কোর্স চালিয়ে যান।', changeLanguage:'ভাষা বদলান', changeTeacher:'শিক্ষক বদলান', courseParts:'কোর্সের অংশ', loading:'যাচাইকৃত কোর্স ভিডিও লোড হচ্ছে…', qa:'গুরুত্বপূর্ণ পয়েন্ট প্রশ্নোত্তর', finish:'প্রথমে যাচাইকৃত ভিডিওটি সম্পূর্ণ দেখুন।'
    },
    or: {
      hub:'ଲର୍ଣ୍ଣିଂ ହବ୍', title:'ଶିଖନ୍ତୁ', intro:'ଏକ ବିଭାଗ ବାଛନ୍ତୁ। ପରେ ଭାଷା, ଚ୍ୟାନେଲ ଏବଂ ଭିଡିଓ ବାଛନ୍ତୁ।', progress:'ଆପଣଙ୍କ ଶିକ୍ଷା ପ୍ରଗତି', mapped:'ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଥିବା ମ୍ୟାପ୍ ଭାଗ', continue:'ଶିକ୍ଷା ଜାରି ରଖନ୍ତୁ →', continueText:'ବିଭାଗ → ଭାଷା → ଚ୍ୟାନେଲ', categories:'ଶିକ୍ଷା ବିଭାଗ', viewAll:'ସବୁ ଦେଖନ୍ତୁ', basics:'ଷ୍ଟକ୍ ମାର୍କେଟ୍ ବେସିକ୍ସ', technical:'ଟେକ୍ନିକାଲ୍ ଆନାଲିସିସ୍', fundamental:'ଫଣ୍ଡାମେଣ୍ଟାଲ୍ ଆନାଲିସିସ୍', risk:'ରିସ୍କ ମ୍ୟାନେଜମେଣ୍ଟ', psychology:'ଇନଭେଷ୍ଟର ସାଇକୋଲୋଜି', education:'ଇନଭେଷ୍ଟର ଏଜୁକେସନ୍', flow:'ଭାଷା → ଚ୍ୟାନେଲ → ଭିଡିଓ', basicsFlow:'ଭାଷା → ଚ୍ୟାନେଲ → କୋର୍ସ', official:'ଯାଞ୍ଚିତ ଶିକ୍ଷା ସମ୍ପଦ', paper:'ପେପର୍ ମନି ପ୍ରାକ୍ଟିସ୍', simulation:'ସିମୁଲେସନ୍', paperText:'ଭର୍ଚୁଆଲ୍ ଟଙ୍କାରେ ପ୍ରାକ୍ଟିସ୍ କରନ୍ତୁ। Learnରେ ବାସ୍ତବ ଟ୍ରେଡିଂ ନାହିଁ।', start:'ପ୍ରାକ୍ଟିସ୍ ଆରମ୍ଭ କରନ୍ତୁ →', chooseLanguage:'ଶିକ୍ଷା ଭାଷା ବାଛନ୍ତୁ', stepText:'Learn ବିଭାଗ ପାଇଁ ଭାଷା ବାଛନ୍ତୁ।', chooseTeacher:'ଶିକ୍ଷକ / ଚ୍ୟାନେଲ ବାଛନ୍ତୁ', teacherText:'ଏକ ଚ୍ୟାନେଲ ବାଛନ୍ତୁ। ପ୍ରତ୍ୟେକ ଚ୍ୟାନେଲର ପ୍ରଗତି ଅଲଗା ରହିବ।', back:'←', language:'ଭାଷା:', channel:'ଚ୍ୟାନେଲ:', category:'ବିଭାଗ:', videos:'ଭିଡିଓ', videoIntro:'Level 0ରୁ ଆରମ୍ଭ କରି କ୍ରମାନୁସାରେ ଆଗକୁ ବଢ଼ନ୍ତୁ।', verified:'✓ ଯାଞ୍ଚିତ', empty:'ଏହି ଚ୍ୟାନେଲ ଏବଂ ବିଭାଗ ପାଇଁ ଏପର୍ଯ୍ୟନ୍ତ ଯାଞ୍ଚିତ ଭିଡିଓ ଯୋଡ଼ାଯାଇନାହିଁ।', level0:'ଫାଉଣ୍ଡେସନ୍', level1:'ବିଗିନର୍ ବେସିକ୍ସ', level2:'ମୁଖ୍ୟ ଧାରଣା', level3:'ଟେକ୍ନିକାଲ୍ ଆନାଲିସିସ୍', level4:'ଟ୍ରେଡିଂ / ଇଣ୍ଟ୍ରାଡେ', level5:'F&O / ଅପ୍ସନ୍ / ଫ୍ୟୁଚର୍ସ', verifiedVideos:'ଯାଞ୍ଚିତ ଭିଡିଓ', course:'କୋର୍ସ ଲର୍ଣ୍ଣିଂ', selectedPath:'ଚୟନିତ ଭାଷା → ଶିକ୍ଷକ → କୋର୍ସ ଜାରି ରଖନ୍ତୁ।', changeLanguage:'ଭାଷା ବଦଳାନ୍ତୁ', changeTeacher:'ଶିକ୍ଷକ ବଦଳାନ୍ତୁ', courseParts:'କୋର୍ସ ଭାଗ', loading:'ଯାଞ୍ଚିତ କୋର୍ସ ଭିଡିଓ ଲୋଡ୍ ହେଉଛି…', qa:'ମୁଖ୍ୟ ବିନ୍ଦୁ ପ୍ରଶ୍ନୋତ୍ତର', finish:'ପ୍ରଥମେ ଯାଞ୍ଚିତ ଭିଡିଓଟି ସମ୍ପୂର୍ଣ୍ଣ ଦେଖନ୍ତୁ।'
    }
  };

  const saved = localStorage.getItem(KEY);
  const fromUrl = new URLSearchParams(location.search).get('lang');
  const lang = LANGS.includes(fromUrl) ? fromUrl : (LANGS.includes(saved) ? saved : 'en');
  localStorage.setItem(KEY, lang);
  document.documentElement.lang = lang;
  const t = T[lang] || T.en;
  const set = (sel, value) => { const el=document.querySelector(sel); if(el) el.textContent=value; };
  const setAll = (sel, value) => document.querySelectorAll(sel).forEach(el => el.textContent=value);

  function applyLearnHub(){
    if(!document.getElementById('learnLanguage')) return;
    set('.eyebrow', t.hub);
    set('.hero-copy h1', t.title);
    set('.hero-copy > p:not(.eyebrow)', t.intro);
    set('.progress-head b', t.progress);
    set('#continueLink', t.continue);
    set('#continueText', t.continueText);
    set('.section-title h2', t.categories);
    set('.section-title a', t.viewAll);
    const cats=document.querySelectorAll('.cat');
    const catNames=[t.basics,t.technical,t.fundamental,t.risk,t.psychology,t.education];
    cats.forEach((a,i)=>{ if(catNames[i]) { const b=a.querySelector('b'); if(b)b.textContent=catNames[i]; const s=a.querySelector('small'); if(s)s.textContent=i===0?t.basicsFlow:(i===5?t.official:t.flow); }});
    set('.paper h3', t.paper + ' ');
    const badge=document.querySelector('.paper .badge'); if(badge) badge.textContent=t.simulation;
    set('.paper p', t.paperText);
    set('.paper a', t.start);
  }

  function applyFlow(){
    set('#back', t.back);
    set('.hero h1', t.videos);
    set('.hero > p:not(.eyebrow)', t.videoIntro);
    set('.empty', t.empty);
    document.querySelectorAll('.verified').forEach(el=>el.textContent=t.verified);
  }

  // This script intentionally scopes language state to the Learn section only.
  applyLearnHub();
  applyFlow();
})();