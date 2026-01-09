// Translations for multilingual support
const translations = {
    english: {
        // Navigation
        patientMode: "Patient Mode",
        clinicianMode: "Clinician Mode",
        logout: "Logout",

        // Landing
        appTitle: "Healthcare Imaging / Report Explainer",
        appSubtitle: "AI-Powered Medical Report Analysis",
        skipIntro: "Skip Intro",
        getStarted: "Get Started",

        // Auth
        welcomeBack: "Welcome Back",
        signInText: "Sign in to access your reports",
        createAccount: "Create Account",
        joinText: "Join us to understand your medical reports better",
        email: "Email ID",
        password: "Password",
        login: "Login",
        forgotPassword: "Forgot Password?",
        createNewAccount: "Create New Account",
        alreadyHaveAccount: "Already have an account?",
        signIn: "Sign In",

        // Signup
        selectRole: "Select Your Role",
        patient: "Patient",
        clinician: "Clinician",
        username: "Username",
        mobileNumber: "Mobile Number",
        dateOfBirth: "Date of Birth",
        gender: "Gender",
        selectGender: "Select Gender",
        male: "Male",
        female: "Female",
        other: "Other",
        preferNotToSay: "Prefer not to say",
        confirmPassword: "Confirm Password",
        passwordRequirements: {
            length: "8+ characters",
            uppercase: "Uppercase",
            number: "Number",
            special: "Special char"
        },

        // Dashboard
        uploadTitle: "Upload Medical Report",
        uploadSubtitle: "Upload your medical report or imaging file for AI-powered analysis",
        dragDrop: "Drag & Drop your file here",
        dragDropMultiple: "Drag & Drop your files here",
        orClickBrowse: "or click to browse",
        orClickBrowseMultiple: "or click to browse (multiple files supported)",
        maxFilesLimit: "Max 10 files • 10MB each",
        filesSelected: "files selected",
        addMore: "Add More",
        clearAll: "Clear All",
        selectReportType: "Select Report Type",
        xray: "X-Ray",
        mri: "MRI",
        ctScan: "CT Scan",
        bloodTest: "Blood Test",
        labTest: "Lab Test",
        handwritten: "Handwritten",
        analyzeReport: "Analyze Report",
        reportsAnalyzed: "Reports Analyzed",
        reportNumber: "Report",

        // Results
        analysisResults: "Analysis Results",
        understandingReport: "Understanding your medical report",
        extractedData: "Extracted Data",
        briefSummary: "Brief Summary",
        quickOverview: "Quick Overview",
        detailedExplanation: "Detailed Explanation",
        inDepthAnalysis: "In-Depth Analysis",
        recentReports: "Recent Reports",

        // Status
        normal: "Normal",
        high: "High",
        low: "Low",
        analyzed: "Analyzed",
        pending: "Pending",

        // Chatbot
        aiAssistant: "AI Assistant",
        askAboutReport: "Ask about your report...",
        chatGreeting: "Hello! I'm your AI assistant. Upload a medical report and I can help you understand it. Ask me anything about your report!",

        // Disclaimer
        medicalDisclaimer: "MEDICAL DISCLAIMER: This analysis is for educational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals.",

        // Messages
        uploadSuccess: "File uploaded successfully",
        analysisComplete: "Analysis complete",
        loginSuccess: "Login successful",
        accountCreated: "Account created successfully",
        logoutSuccess: "Logged out successfully",
        error: "An error occurred",
        invalidCredentials: "Invalid email or password",
        passwordMismatch: "Passwords do not match",
        allFieldsRequired: "All fields are required",
        selectFile: "Please select a file first",
        selectReportTypeFirst: "Please select a report type"
    },
    tamil: {
        // Navigation
        patientMode: "நோயாளி பயன்முறை",
        clinicianMode: "மருத்துவர் பயன்முறை",
        logout: "வெளியேறு",

        // Landing
        appTitle: "சுகாதார இமேஜிங் / அறிக்கை விளக்கம்",
        appSubtitle: "AI-இயக்கப்படும் மருத்துவ அறிக்கை பகுப்பாய்வு",
        skipIntro: "அறிமுகத்தைத் தவிர்",
        getStarted: "தொடங்கு",

        // Auth
        welcomeBack: "மீண்டும் வரவேற்கிறோம்",
        signInText: "உங்கள் அறிக்கைகளை அணுக உள்நுழையவும்",
        createAccount: "கணக்கை உருவாக்கு",
        joinText: "உங்கள் மருத்துவ அறிக்கைகளை நன்கு புரிந்துகொள்ள எங்களுடன் சேருங்கள்",
        email: "மின்னஞ்சல் ஐடி",
        password: "கடவுச்சொல்",
        login: "உள்நுழை",
        forgotPassword: "கடவுச்சொல் மறந்துவிட்டதா?",
        createNewAccount: "புதிய கணக்கை உருவாக்கு",
        alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
        signIn: "உள்நுழை",

        // Signup
        selectRole: "உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்",
        patient: "நோயாளி",
        clinician: "மருத்துவர்",
        username: "பயனர்பெயர்",
        mobileNumber: "மொபைல் எண்",
        dateOfBirth: "பிறந்த தேதி",
        gender: "பாலினம்",
        selectGender: "பாலினத்தைத் தேர்ந்தெடுக்கவும்",
        male: "ஆண்",
        female: "பெண்",
        other: "மற்றவை",
        preferNotToSay: "சொல்ல விரும்பவில்லை",
        confirmPassword: "கடவுச்சொல்லை உறுதிப்படுத்து",

        // Dashboard
        uploadTitle: "மருத்துவ அறிக்கையை பதிவேற்றவும்",
        uploadSubtitle: "AI-இயக்கப்படும் பகுப்பாய்விற்கு உங்கள் மருத்துவ அறிக்கையை பதிவேற்றவும்",
        dragDrop: "உங்கள் கோப்பை இங்கே இழுத்து விடுங்கள்",
        dragDropMultiple: "உங்கள் கோப்புகளை இங்கே இழுத்து விடுங்கள்",
        orClickBrowse: "அல்லது உலாவ கிளிக் செய்யவும்",
        orClickBrowseMultiple: "அல்லது உலாவ கிளிக் செய்யவும் (பல கோப்புகள் ஆதரிக்கப்படுகின்றன)",
        maxFilesLimit: "அதிகபட்சம் 10 கோப்புகள் • தலா 10MB",
        filesSelected: "கோப்புகள் தேர்ந்தெடுக்கப்பட்டன",
        addMore: "மேலும் சேர்க்கவும்",
        clearAll: "அனைத்தையும் நீக்கு",
        selectReportType: "அறிக்கை வகையைத் தேர்ந்தெடுக்கவும்",
        xray: "எக்ஸ்-ரே",
        mri: "எம்ஆர்ஐ",
        ctScan: "சிடி ஸ்கேன்",
        bloodTest: "இரத்த பரிசோதனை",
        labTest: "ஆய்வக சோதனை",
        handwritten: "கையால் எழுதப்பட்டது",
        analyzeReport: "அறிக்கையை பகுப்பாய்வு செய்",
        reportsAnalyzed: "அறிக்கைகள் பகுப்பாய்வு செய்யப்பட்டன",
        reportNumber: "அறிக்கை",

        // Results
        analysisResults: "பகுப்பாய்வு முடிவுகள்",
        understandingReport: "உங்கள் மருத்துவ அறிக்கையைப் புரிந்துகொள்ளுதல்",
        extractedData: "பிரித்தெடுக்கப்பட்ட தரவு",
        briefSummary: "சுருக்கமான சுருக்கம்",
        detailedExplanation: "விரிவான விளக்கம்",
        recentReports: "சமீபத்திய அறிக்கைகள்",

        // Status
        normal: "இயல்பான",
        high: "அதிகம்",
        low: "குறைவு",
        analyzed: "பகுப்பாய்வு செய்யப்பட்டது",
        pending: "நிலுவையில்",

        // Chatbot
        aiAssistant: "AI உதவியாளர்",
        askAboutReport: "உங்கள் அறிக்கையைப் பற்றி கேளுங்கள்...",
        chatGreeting: "வணக்கம்! நான் உங்கள் AI உதவியாளர். மருத்துவ அறிக்கையை பதிவேற்றி, புரிந்துகொள்ள உதவுகிறேன். உங்கள் அறிக்கையைப் பற்றி எதையும் கேளுங்கள்!",

        // Disclaimer
        medicalDisclaimer: "மருத்துவ மறுப்பு: இந்த பகுப்பாய்வு கல்வி நோக்கங்களுக்காக மட்டுமே. மருத்துவ முடிவுகளுக்கு தகுதி வாய்ந்த சுகாதார நிபுணர்களை அணுகவும்.",

        // Messages
        uploadSuccess: "கோப்பு வெற்றிகரமாக பதிவேற்றப்பட்டது",
        analysisComplete: "பகுப்பாய்வு முடிந்தது",
        loginSuccess: "உள்நுழைவு வெற்றிகரமானது",
        accountCreated: "கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது",
        error: "பிழை ஏற்பட்டது"
    },
    hindi: {
        // Navigation
        patientMode: "मरीज़ मोड",
        clinicianMode: "चिकित्सक मोड",
        logout: "लॉग आउट",

        // Landing
        appTitle: "हेल्थकेयर इमेजिंग / रिपोर्ट एक्सप्लेनर",
        appSubtitle: "AI-संचालित मेडिकल रिपोर्ट विश्लेषण",
        skipIntro: "इंट्रो छोड़ें",
        getStarted: "शुरू करें",

        // Auth
        welcomeBack: "वापसी पर स्वागत है",
        signInText: "अपनी रिपोर्ट तक पहुंचने के लिए साइन इन करें",
        createAccount: "खाता बनाएं",
        joinText: "अपनी मेडिकल रिपोर्ट को बेहतर समझने के लिए हमसे जुड़ें",
        email: "ईमेल आईडी",
        password: "पासवर्ड",
        login: "लॉगिन",
        forgotPassword: "पासवर्ड भूल गए?",
        createNewAccount: "नया खाता बनाएं",
        alreadyHaveAccount: "पहले से खाता है?",
        signIn: "साइन इन",

        // Signup
        selectRole: "अपनी भूमिका चुनें",
        patient: "मरीज़",
        clinician: "चिकित्सक",
        username: "यूज़रनेम",
        mobileNumber: "मोबाइल नंबर",
        dateOfBirth: "जन्म तिथि",
        gender: "लिंग",
        selectGender: "लिंग चुनें",
        male: "पुरुष",
        female: "महिला",
        other: "अन्य",
        preferNotToSay: "बताना नहीं चाहते",
        confirmPassword: "पासवर्ड की पुष्टि करें",

        // Dashboard
        uploadTitle: "मेडिकल रिपोर्ट अपलोड करें",
        uploadSubtitle: "AI-संचालित विश्लेषण के लिए अपनी मेडिकल रिपोर्ट अपलोड करें",
        dragDrop: "अपनी फ़ाइल यहाँ खींचें और छोड़ें",
        dragDropMultiple: "अपनी फ़ाइलें यहाँ खींचें और छोड़ें",
        orClickBrowse: "या ब्राउज़ करने के लिए क्लिक करें",
        orClickBrowseMultiple: "या ब्राउज़ करने के लिए क्लिक करें (एकाधिक फ़ाइलें समर्थित)",
        maxFilesLimit: "अधिकतम 10 फ़ाइलें • प्रत्येक 10MB",
        filesSelected: "फ़ाइलें चुनी गईं",
        addMore: "और जोड़ें",
        clearAll: "सभी साफ़ करें",
        selectReportType: "रिपोर्ट प्रकार चुनें",
        xray: "एक्स-रे",
        mri: "एमआरआई",
        ctScan: "सीटी स्कैन",
        bloodTest: "ब्लड टेस्ट",
        labTest: "लैब टेस्ट",
        handwritten: "हस्तलिखित",
        analyzeReport: "रिपोर्ट का विश्लेषण करें",
        reportsAnalyzed: "रिपोर्टों का विश्लेषण किया गया",
        reportNumber: "रिपोर्ट",

        // Results
        analysisResults: "विश्लेषण परिणाम",
        understandingReport: "अपनी मेडिकल रिपोर्ट को समझना",
        extractedData: "निकाला गया डेटा",
        briefSummary: "संक्षिप्त सारांश",
        detailedExplanation: "विस्तृत विवरण",
        recentReports: "हाल की रिपोर्ट",

        // Status
        normal: "सामान्य",
        high: "उच्च",
        low: "निम्न",
        analyzed: "विश्लेषित",
        pending: "लंबित",

        // Chatbot
        aiAssistant: "AI सहायक",
        askAboutReport: "अपनी रिपोर्ट के बारे में पूछें...",
        chatGreeting: "नमस्ते! मैं आपका AI सहायक हूं। मेडिकल रिपोर्ट अपलोड करें और मैं इसे समझने में मदद करूंगा। अपनी रिपोर्ट के बारे में कुछ भी पूछें!",

        // Disclaimer
        medicalDisclaimer: "चिकित्सा अस्वीकरण: यह विश्लेषण केवल शैक्षिक उद्देश्यों के लिए है। चिकित्सा निर्णयों के लिए योग्य स्वास्थ्य पेशेवरों से परामर्श करें।",

        // Messages
        uploadSuccess: "फ़ाइल सफलतापूर्वक अपलोड हुई",
        analysisComplete: "विश्लेषण पूर्ण",
        loginSuccess: "लॉगिन सफल",
        accountCreated: "खाता सफलतापूर्वक बनाया गया",
        error: "एक त्रुटि हुई"
    }
};

// Get translation
function t(key, lang = 'english') {
    const keys = key.split('.');
    let value = translations[lang];
    for (const k of keys) {
        value = value?.[k];
    }
    return value || translations.english[key] || key;
}

// Export for use in other files
window.translations = translations;
window.t = t;
