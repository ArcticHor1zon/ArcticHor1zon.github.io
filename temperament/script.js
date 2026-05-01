(function() {
    const QUESTIONS = [
        { type: 'sanguine', text: "I find it easy to talk to new people." },
        { type: 'sanguine', text: "I love being around lots of people." },
        { type: 'sanguine', text: "I get over bad feelings quickly." },
        { type: 'sanguine', text: "I often speak without thinking." },
        { type: 'sanguine', text: "I am usually positive about the future." },
        { type: 'sanguine', text: "I find regular routines boring." },
        { type: 'sanguine', text: "I am often the loudest person in a group." },
        { type: 'sanguine', text: "I have many different hobbies." },
        { type: 'sanguine', text: "I show my feelings very openly." },
        { type: 'sanguine', text: "I like to suggest fun things to do." },
        { type: 'choleric', text: "Getting things done is more important than being nice." },
        { type: 'choleric', text: "I feel restless when things move slowly." },
        { type: 'choleric', text: "I find it easy to make hard choices." },
        { type: 'choleric', text: "I enjoy being the one in charge." },
        { type: 'choleric', text: "I am very direct when I want something." },
        { type: 'choleric', text: "I get annoyed when people can't decide." },
        { type: 'choleric', text: "I like doing things on my own." },
        { type: 'choleric', text: "I prefer logic over feelings." },
        { type: 'choleric', text: "I expect a lot from everyone." },
        { type: 'choleric', text: "I don't mind taking risks to win." },
        { type: 'melancholic', text: "I need quiet time to feel better." },
        { type: 'melancholic', text: "I am very sensitive to things around me." },
        { type: 'melancholic', text: "I plan everything out very carefully." },
        { type: 'melancholic', text: "I find big parties very tiring." },
        { type: 'melancholic', text: "I try to make my work perfect." },
        { type: 'melancholic', text: "I often get lost in my own thoughts." },
        { type: 'melancholic', text: "I prefer a few close friends over many." },
        { type: 'melancholic', text: "I notice small mistakes that others miss." },
        { type: 'melancholic', text: "I like deep, one-on-one talks." },
        { type: 'melancholic', text: "I take my promises very seriously." },
        { type: 'phlegmatic', text: "I like to keep the peace." },
        { type: 'phlegmatic', text: "I prefer to let others lead." },
        { type: 'phlegmatic', text: "I rarely get angry or upset." },
        { type: 'phlegmatic', text: "I enjoy a steady, simple life." },
        { type: 'phlegmatic', text: "I am a steady and reliable worker." },
        { type: 'phlegmatic', text: "I try to avoid any kind of trouble." },
        { type: 'phlegmatic', text: "I stay calm even when things go wrong." },
        { type: 'phlegmatic', text: "I am happy with what I have." },
        { type: 'phlegmatic', text: "I listen more than I talk." },
        { type: 'phlegmatic', text: "I am very patient with others." }
    ];

    const THEMES = {
        sanguine: { primary: '#D4E157', onPrimary: '#1B1F00', bg: '#0D1402' },
        choleric: { primary: '#80CBC4', onPrimary: '#00201D', bg: '#011412' },
        melancholic: { primary: '#9CCC65', onPrimary: '#0C1F00', bg: '#051401' },
        phlegmatic: { primary: '#4DB6AC', onPrimary: '#00201D', bg: '#011414' },
        default: { primary: '#9cd67d', onPrimary: '#0c3900', bg: '#10140f' }
    };

    const DESCRIPTIONS = {
        sanguine: "The Radiant Spark. You are fun, warm, and positive. You love to try new things and make others smile.",
        choleric: "The Visionary Leader. You are focused and decisive. You know how to get things done and overcome obstacles.",
        melancholic: "The Thoughtful Analyst. You are deep and careful. You look for meaning and quality in everything you do.",
        phlegmatic: "The Steady Harbor. You are calm and kind. You help keep things peaceful and are a great listener."
    };

    const INSIGHTS = {
        'sanguine-choleric': "Your enthusiasm and drive make you a natural motivator. You thrive in fast-paced, social environments.",
        'sanguine-melancholic': "You balance a lively spirit with deep reflection – a creative and empathetic blend.",
        'sanguine-phlegmatic': "Your warmth and easygoing nature make you a beloved peacemaker.",
        'choleric-melancholic': "A strategic thinker with high standards, you excel at turning complex ideas into reality.",
        'choleric-phlegmatic': "You combine steady reliability with quiet determination, making you a calm but effective leader.",
        'melancholic-phlegmatic': "Your sensitivity and patience create a thoughtful, supportive presence."
    };

    const STORAGE_KEY = 'temperament-quiz-state-v2';
    const TOTAL_QUESTIONS = QUESTIONS.length;
    const MAX_SCORE_PER_TYPE = 50;
    const RADAR_CENTER = 100;
    const RADAR_RADIUS = 80;

    let currentIdx = 0;
    let shuffled = [];
    let scores = { sanguine: 0, choleric: 0, melancholic: 0, phlegmatic: 0 };
    let answers = [];
    let quizCompleted = false;
    let isTransitioning = false;

    const $ = (sel) => document.querySelector(sel);
    const mainContainer = $('#mainContainer');
    const startScreen = $('#startScreen');
    const questionScreen = $('#questionScreen');
    const transitionScreen = $('#transitionScreen');
    const resultScreen = $('#resultScreen');
    const quizHeader = $('#quizHeader');
    const backBtn = $('#backBtn');
    const progressFill = $('#progressFill');
    const stepCounter = $('#stepCounter');
    const percentText = $('#percentText');
    const questionText = $('#questionText');
    const choiceContainer = $('#choiceContainer');
    const radarPoly = $('#radarPoly');
    const statsContainer = $('#stats');
    const resultIdDisplay = $('#resultIdDisplay');
    const resultName = $('#resultName');
    const resultDesc = $('#resultDesc');
    const socialOrientation = $('#socialOrientation');
    const secondaryBadge = $('#secondaryBadge');
    const balanceSection = $('#balanceSection');
    const balanceFill = $('#balanceFill');
    const balanceLabel = $('#balanceLabel');
    const insightBox = $('#insightBox');
    const insightText = $('#insightText');
    const copyFeedback = $('#copyFeedback');
    const restoreError = $('#restoreError');
    const autoRestorePrompt = $('#autoRestorePrompt');
    const idInputSection = $('#idInputSection');
    const restoreIdInput = $('#restoreId');

    function updateTheme(type) {
        const theme = THEMES[type] || THEMES.default;
        const root = document.documentElement.style;
        root.setProperty('--primary', theme.primary);
        root.setProperty('--on-primary', theme.onPrimary);
        root.setProperty('--surface', theme.bg);
        root.setProperty('--theme-color', theme.primary);
        root.setProperty('--shape-opacity', type === 'default' ? '0.15' : '0.18');
    }

    function scrollToTop() {
        mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function saveState() {
        if (quizCompleted) return localStorage.removeItem(STORAGE_KEY);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                currentIdx, shuffled, scores, answers, timestamp: Date.now()
            }));
        } catch (e) {}
    }

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const state = JSON.parse(raw);
            if (!state.shuffled || !state.scores || !Array.isArray(state.answers) || typeof state.currentIdx !== 'number') {
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }
            if (Date.now() - state.timestamp > 24 * 60 * 60 * 1000) {
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }
            return state;
        } catch (e) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
    }

    function clearSavedState() {
        localStorage.removeItem(STORAGE_KEY);
        autoRestorePrompt.classList.add('hidden');
        resetQuizInternal();
    }

    function resumeQuiz() {
        const state = loadState();
        if (!state) { clearSavedState(); return; }
        currentIdx = state.currentIdx;
        shuffled = state.shuffled;
        scores = state.scores;
        answers = state.answers;
        quizCompleted = false;
        isTransitioning = false;
        autoRestorePrompt.classList.add('hidden');
        startScreen.classList.add('hidden');
        questionScreen.classList.remove('hidden');
        quizHeader.classList.remove('hidden');
        resultScreen.classList.add('hidden');
        transitionScreen.classList.add('hidden');
        showQuestion();
    }

    function resetQuizInternal() {
        currentIdx = 0;
        scores = { sanguine: 0, choleric: 0, melancholic: 0, phlegmatic: 0 };
        answers = [];
        shuffled = [];
        quizCompleted = false;
        isTransitioning = false;
        updateTheme('default');
        progressFill.style.width = '0%';
        percentText.innerText = '0%';
        stepCounter.innerText = `Question 1 of ${TOTAL_QUESTIONS}`;
        backBtn.classList.add('hidden');
        radarPoly.setAttribute('points', '100,100 100,100 100,100 100,100');
        for (let i=0; i<4; i++) {
            const dot = $('#radarDot'+i);
            if (dot) dot.style.display = 'none';
        }
        copyFeedback.style.opacity = '0';
        restoreError.classList.add('hidden');
        restoreIdInput.value = '';
        localStorage.removeItem(STORAGE_KEY);
        scrollToTop();
    }

    function resetQuiz() {
        resetQuizInternal();
        resultScreen.classList.add('hidden');
        transitionScreen.classList.add('hidden');
        questionScreen.classList.add('hidden');
        quizHeader.classList.add('hidden');
        autoRestorePrompt.classList.add('hidden');
        idInputSection.classList.add('hidden');
        startScreen.classList.remove('hidden');
        updateTheme('default');
        scrollToTop();
    }

    function startQuiz() {
        shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
        currentIdx = 0;
        scores = { sanguine: 0, choleric: 0, melancholic: 0, phlegmatic: 0 };
        answers = [];
        quizCompleted = false;
        isTransitioning = false;
        startScreen.classList.add('hidden');
        autoRestorePrompt.classList.add('hidden');
        idInputSection.classList.add('hidden');
        questionScreen.classList.remove('hidden');
        quizHeader.classList.remove('hidden');
        resultScreen.classList.add('hidden');
        transitionScreen.classList.add('hidden');
        backBtn.classList.add('hidden');
        updateTheme(shuffled[0].type);
        showQuestion();
        saveState();
    }

    function showQuestion() {
        if (currentIdx >= shuffled.length) { startTransition(); return; }
        isTransitioning = false;
        const q = shuffled[currentIdx];
        updateTheme(q.type);
        backBtn.classList.toggle('hidden', currentIdx === 0);

        const choices = choiceContainer.querySelectorAll('.m3-choice');
        choices.forEach((c, i) => {
            c.classList.remove('stagger-in');
            c.setAttribute('aria-checked', 'false');
            void c.offsetWidth;
            c.style.animationDelay = `${0.05 + i*0.1}s`;
            c.classList.add('stagger-in');
        });

        questionText.innerText = q.text;
        questionText.classList.remove('fade-in');
        void questionText.offsetWidth;
        questionText.classList.add('fade-in');

        stepCounter.innerText = `Question ${currentIdx+1} of ${TOTAL_QUESTIONS}`;
        const progress = (currentIdx / TOTAL_QUESTIONS) * 100;
        progressFill.style.width = `${progress}%`;
        percentText.innerText = `${Math.round(progress)}%`;

        scrollToTop();
        saveState();

        setTimeout(() => {
            const firstChoice = choiceContainer.querySelector('.m3-choice');
            if (firstChoice && document.activeElement !== firstChoice) firstChoice.focus({ preventScroll: true });
        }, 150);
    }

    function answer(val) {
        if (isTransitioning || currentIdx >= shuffled.length) return;
        answers[currentIdx] = val;
        scores[shuffled[currentIdx].type] += val;
        currentIdx++;
        if (currentIdx < shuffled.length) showQuestion();
        else startTransition();
    }

    function goBack() {
        if (isTransitioning || currentIdx <= 0 || quizCompleted) return;
        currentIdx--;
        const oldVal = answers[currentIdx];
        if (oldVal !== undefined) {
            scores[shuffled[currentIdx].type] -= oldVal;
            delete answers[currentIdx];
        }
        answers.length = currentIdx;
        showQuestion();
    }

    function startTransition() {
        isTransitioning = true;
        quizCompleted = true;
        questionScreen.classList.add('hidden');
        quizHeader.classList.add('hidden');
        transitionScreen.classList.remove('hidden');
        localStorage.removeItem(STORAGE_KEY);
        scrollToTop();
        setTimeout(showResult, 2800);
    }

    function showResult() {
        transitionScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');

        const sorted = Object.entries(scores).sort((a,b) => b[1] - a[1]);
        const primary = sorted[0][0];
        const secondary = sorted[1][1] > 0 ? sorted[1][0] : null;

        const totalExtro = scores.sanguine + scores.choleric;
        const totalIntro = scores.melancholic + scores.phlegmatic;
        const maxPossible = MAX_SCORE_PER_TYPE * 2;
        const threshold = maxPossible * 0.12;
        let orientation = "Balanced";
        if (totalExtro > totalIntro + threshold) orientation = "Extrovert";
        else if (totalIntro > totalExtro + threshold) orientation = "Introvert";

        updateTheme(primary);
        socialOrientation.innerText = orientation;
        resultName.innerText = primary.charAt(0).toUpperCase() + primary.slice(1);
        resultDesc.innerText = DESCRIPTIONS[primary];

        if (secondary) {
            secondaryBadge.innerText = `Secondary: ${secondary.charAt(0).toUpperCase()+secondary.slice(1)}`;
            secondaryBadge.classList.remove('hidden');
        } else secondaryBadge.classList.add('hidden');

        const values = Object.values(scores);
        const mean = values.reduce((a,b)=>a+b,0)/4;
        const variance = values.reduce((s,v)=>s + (v-mean)**2, 0)/4;
        const stdDev = Math.sqrt(variance);
        const balancePercent = Math.max(0, Math.min(100, 100 - (stdDev / 15)*100));
        balanceFill.style.width = balancePercent + '%';
        balanceSection.classList.remove('hidden');
        if (balancePercent > 75) balanceLabel.innerText = 'Very Balanced';
        else if (balancePercent > 45) balanceLabel.innerText = 'Moderately Focused';
        else balanceLabel.innerText = 'Highly Specialized';

        const key = [primary, secondary].filter(Boolean).sort().join('-');
        const insight = INSIGHTS[key] || "Your unique blend of traits gives you a one‑of‑a‑kind perspective.";
        insightText.innerText = insight;
        insightBox.classList.remove('hidden');

        setTimeout(() => animateRadarChart(scores), 400);
        const resId = btoa(JSON.stringify(scores)).replace(/=/g, '');
        resultIdDisplay.innerText = resId;
        resultIdDisplay.classList.remove('copied');
        copyFeedback.style.opacity = '0';

        statsContainer.innerHTML = '';
        sorted.forEach(([type, score], i) => {
            const percentage = Math.min((score / MAX_SCORE_PER_TYPE)*100, 100);
            statsContainer.innerHTML += `
                <div class="fade-in" style="animation-delay: ${0.5 + i*0.12}s">
                    <div class="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-40">
                        <span>${type}</span><span>${Math.round(percentage)}%</span>
                    </div>
                    <div class="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div class="h-full result-bar-fill" style="width:0%; background-color:${THEMES[type].primary};" data-target="${percentage}%"></div>
                    </div>
                </div>`;
        });
        setTimeout(() => {
            statsContainer.querySelectorAll('.result-bar-fill').forEach((bar,i) => {
                setTimeout(() => bar.style.width = bar.dataset.target, i*150);
            });
        }, 600);

        scrollToTop();
        quizCompleted = true;
    }

    function animateRadarChart(targetScores) {
        const types = ['sanguine','choleric','melancholic','phlegmatic'];
        const targetPoints = types.map((t,i) => {
            const r = Math.min(targetScores[t]/MAX_SCORE_PER_TYPE, 1) * RADAR_RADIUS;
            const angle = [-90,0,90,180][i] * Math.PI/180;
            return { x: RADAR_CENTER + r*Math.cos(angle), y: RADAR_CENTER + r*Math.sin(angle) };
        });
        const startPoints = targetPoints.map(() => ({x:RADAR_CENTER, y:RADAR_CENTER}));
        const duration = 1200, startTime = performance.now();

        function easeOutBack(t) { const c1=1.70158; return 1+(c1+1)*Math.pow(t-1,3)+c1*Math.pow(t-1,2); }
        function frame(now) {
            const p = easeOutBack(Math.min((now-startTime)/duration, 1));
            const pts = startPoints.map((s,i) => ({ x: s.x+(targetPoints[i].x-s.x)*p, y: s.y+(targetPoints[i].y-s.y)*p }));
            radarPoly.setAttribute('points', pts.map(v=>`${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(' '));
            pts.forEach((pt,i) => {
                const dot = $('#radarDot'+i);
                if (dot) {
                    dot.setAttribute('cx', pt.x.toFixed(1)); dot.setAttribute('cy', pt.y.toFixed(1));
                    if (p>0.3) { dot.style.display=''; dot.style.opacity = Math.min((p-0.3)/0.7,1); }
                }
            });
            if (p<1) requestAnimationFrame(frame);
            else {
                radarPoly.setAttribute('points', targetPoints.map(v=>`${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(' '));
                targetPoints.forEach((pt,i) => {
                    const dot = $('#radarDot'+i);
                    if (dot) { dot.setAttribute('cx', pt.x.toFixed(1)); dot.setAttribute('cy', pt.y.toFixed(1)); dot.style.display=''; dot.style.opacity='1'; }
                });
            }
        }
        requestAnimationFrame(frame);
    }

    function toggleIdInput() {
        const isHidden = idInputSection.classList.contains('hidden');
        if (isHidden) {
            idInputSection.classList.remove('hidden');
            restoreError.classList.add('hidden');
            restoreIdInput.value = '';
            setTimeout(() => restoreIdInput.focus(), 100);
        } else idInputSection.classList.add('hidden');
    }

    function restoreSession() {
        const id = restoreIdInput.value.trim();
        restoreError.classList.add('hidden');
        if (!id) { restoreError.innerText='Please enter a code.'; restoreError.classList.remove('hidden'); return; }
        try {
            const decoded = JSON.parse(atob(id));
            if (!['sanguine','choleric','melancholic','phlegmatic'].every(k=>typeof decoded[k]==='number')) throw new Error();
            scores = decoded;
            quizCompleted = true; isTransitioning = false; currentIdx = TOTAL_QUESTIONS; answers = [];
            startScreen.classList.add('hidden'); autoRestorePrompt.classList.add('hidden');
            idInputSection.classList.add('hidden'); questionScreen.classList.add('hidden');
            quizHeader.classList.add('hidden'); resultScreen.classList.add('hidden');
            transitionScreen.classList.remove('hidden'); localStorage.removeItem(STORAGE_KEY);
            scrollToTop(); setTimeout(showResult, 2800);
        } catch(e) {
            restoreError.innerText = "That code didn't work. Please try again.";
            restoreError.classList.remove('hidden');
        }
    }

    async function copyId() {
        const text = resultIdDisplay.innerText;
        if (!text || text==='COPIED'|| text==='...') return;
        let ok = false;
        try { await navigator.clipboard.writeText(text); ok = true; } catch(e) {}
        if (!ok) {
            const t = document.createElement('textarea'); t.value=text; t.style.position='fixed'; t.style.left='-9999px';
            document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); ok=true;
        }
        if (ok) {
            resultIdDisplay.classList.add('copied'); copyFeedback.style.opacity='1';
            const orig = resultIdDisplay.innerText; resultIdDisplay.innerText='✓ COPIED';
            setTimeout(() => { resultIdDisplay.innerText=orig; resultIdDisplay.classList.remove('copied'); copyFeedback.style.opacity='0'; }, 2200);
        }
    }

    document.addEventListener('keydown', e => {
        if (!questionScreen.classList.contains('hidden') && !isTransitioning && !quizCompleted) {
            const val = {'1':1,'2':2,'3':3,'4':4,'5':5}[e.key];
            if (val && !e.ctrlKey && !e.metaKey && !e.altKey) {
                if (document.activeElement?.tagName==='INPUT') return;
                e.preventDefault(); answer(val); return;
            }
            if ((e.key==='Backspace'||e.key==='ArrowLeft') && currentIdx>0 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                if (document.activeElement?.tagName==='INPUT') return;
                e.preventDefault(); goBack();
            }
        }
        if (e.key==='Enter' && document.activeElement===resultIdDisplay && !resultScreen.classList.contains('hidden')) {
            e.preventDefault(); copyId();
        }
        if (e.key==='Escape' && !idInputSection.classList.contains('hidden')) {
            idInputSection.classList.add('hidden'); restoreError.classList.add('hidden');
        }
    });

    window.startQuiz = startQuiz;
    window.resetQuiz = resetQuiz;
    window.toggleIdInput = toggleIdInput;
    window.restoreSession = restoreSession;
    window.copyId = copyId;
    window.goBack = goBack;
    window.answer = answer;
    window.clearSavedState = clearSavedState;
    window.resumeQuiz = resumeQuiz;

    const saved = loadState();
    if (saved && saved.currentIdx > 0 && saved.currentIdx < TOTAL_QUESTIONS) {
        autoRestorePrompt.classList.remove('hidden');
        const origResume = resumeQuiz;
        window.resumeQuiz = function() {
            if (!saved) { clearSavedState(); return; }
            currentIdx = saved.currentIdx; shuffled = saved.shuffled; scores = saved.scores; answers = saved.answers || [];
            quizCompleted = false; isTransitioning = false;
            autoRestorePrompt.classList.add('hidden');
            startScreen.classList.add('hidden'); questionScreen.classList.remove('hidden');
            quizHeader.classList.remove('hidden'); resultScreen.classList.add('hidden');
            transitionScreen.classList.add('hidden');
            showQuestion();
        };
    } else if (saved && saved.currentIdx >= TOTAL_QUESTIONS) {
        localStorage.removeItem(STORAGE_KEY);
    }
})();
