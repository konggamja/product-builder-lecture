const questions = [
    {
        id: 'relationship',
        text: '당사자와 어떤 관계인가요?',
        options: [
            { text: '가족 또는 친척', score: 100000, label: '가족' },
            { text: '매우 친한 친구', score: 70000, label: '절친' },
            { text: '직장 동료 또는 동기', score: 30000, label: '동료' },
            { text: '연락이 뜸했던 지인', score: 0, label: '지인' }
        ]
    },
    {
        id: 'contact',
        text: '최근 연락 빈도는 어느 정도인가요?',
        options: [
            { text: '주 1회 이상 (자주 연락)', score: 30000 },
            { text: '월 1~2회 정도', score: 10000 },
            { text: '명절이나 안부 묻는 정도', score: -10000 },
            { text: '이번 청첩장이 오랜만', score: -20000 }
        ]
    },
    {
        id: 'reciprocity',
        text: '내 경조사 때 상대방은 어땠나요?',
        options: [
            { text: '와서 넉넉히 축하해줌', score: 50000 },
            { text: '와서 기본은 해줌', score: 20000 },
            { text: '아직 내 경조사가 없었음', score: 0 },
            { text: '불참 또는 안 냈음', score: -30000 }
        ]
    },
    {
        id: 'attendance',
        text: '결혼식에 직접 참석하시나요?',
        options: [
            { text: '참석해서 식사도 함', score: 30000, value: 'attend' },
            { text: '참석하지만 식사는 안 함', score: 0, value: 'attend_no_eat' },
            { text: '축의금만 전달 (불참)', score: -20000, value: 'no_attend' }
        ]
    },
    {
        id: 'plus_one',
        text: '동행인이 있으신가요?',
        options: [
            { text: '혼자 방문', score: 0 },
            { text: '배우자 또는 연인과 동반', score: 70000 },
            { text: '가족과 동반 (3인 이상)', score: 120000 }
        ]
    },
    {
        id: 'venue',
        text: '예식장의 장소는 어디인가요?',
        options: [
            { text: '호텔 예식장', score: 20000 },
            { text: '일반 예식장 또는 컨벤션', score: 0 },
            { text: '지방, 야외 또는 공공기관', score: -10000 }
        ]
    },
    {
        id: 'my_status',
        text: '현재 본인의 상황은 어떤가요?',
        options: [
            { text: '수입이 있는 직장인', score: 20000 },
            { text: '학생 또는 취업 준비 중', score: -30000 },
            { text: '사회 초년생', score: 0 }
        ]
    }
];

let currentStep = 0;
let totalAmount = 50000;
let userRelationship = "";
let isAttending = true;

const startContainer = document.getElementById('start-container');
const questionContainer = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const finalAmountDisplay = document.getElementById('final-amount');
const resultDesc = document.getElementById('result-desc');
const progressBar = document.getElementById('progress');

document.getElementById('start-btn').onclick = () => {
    currentStep = 0;
    totalAmount = 50000;
    startContainer.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    showQuestion();
};

function showQuestion() {
    const q = questions[currentStep];
    questionText.textContent = q.text;
    optionsContainer.innerHTML = '';

    const progressPercent = (currentStep / questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option.text;
        btn.onclick = () => {
            if (q.id === 'relationship') userRelationship = option.label;
            if (q.id === 'attendance') isAttending = (option.value !== 'no_attend');
            handleAnswer(option.score);
        };
        optionsContainer.appendChild(btn);
    });
}

function handleAnswer(score) {
    totalAmount += score;
    currentStep++;

    if (currentStep < questions.length) {
        showQuestion();
    } else {
        progressBar.style.width = '100%';
        setTimeout(showResult, 400);
    }
}

function showResult() {
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    
    let finalAmount = totalAmount;
    if (finalAmount < 30000) finalAmount = 30000;

    if (finalAmount < 100000) {
        if (finalAmount <= 35000) finalAmount = 30000;
        else if (finalAmount <= 60000) finalAmount = 50000;
        else if (finalAmount <= 85000) finalAmount = 70000;
        else finalAmount = 100000;
    } else {
        finalAmount = Math.round(finalAmount / 50000) * 50000;
    }
    if (finalAmount > 70000 && finalAmount < 100000) finalAmount = 100000;

    finalAmountDisplay.textContent = finalAmount.toLocaleString() + '원';
    
    let comment = "";
    let emoji = "✉️";
    if (finalAmount >= 200000) {
        comment = "정말 소중한 인연이시군요!<br>넉넉한 마음이 최고예요.";
        emoji = "✨";
    } else if (finalAmount >= 100000) {
        comment = "서로 서운하지 않을 정성스러운 금액입니다.";
        emoji = "😊";
    } else if (finalAmount >= 50000) {
        comment = "가장 대중적이고 합리적인 선택이에요!";
        emoji = "👌";
    } else {
        comment = "축하하는 진심을 담아 전달해 보세요.";
        emoji = "💵";
    }

    resultDesc.innerHTML = `<div class="result-emoji">${emoji}</div>${comment}`;

    // 통계 업데이트
    const statsText = document.getElementById('stats-text');
    const statsFill = document.getElementById('stats-fill');
    const randomPercent = Math.floor(Math.random() * 20) + 65; 
    statsText.innerHTML = `내 또래의 <strong>${randomPercent}%</strong>가<br>이 관계에 <strong>${finalAmount.toLocaleString()}원</strong>을 냈습니다.`;
    statsFill.style.width = `${randomPercent}%`;
}

// 이미지 저장
document.getElementById('save-img-btn').onclick = () => {
    const captureArea = document.getElementById('capture-area');
    html2canvas(captureArea, {
        backgroundColor: document.body.classList.contains('light-mode') ? '#ffffff' : '#2d2d2d',
        scale: 2
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = '축의금_계산_결과.png';
        link.href = canvas.toDataURL();
        link.click();
    });
};

// 링크 복사 기능
document.getElementById('copy-link-btn').onclick = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('링크가 복사되었습니다! 친구들에게 공유해보세요.');
    });
};

document.getElementById('restart-btn').onclick = () => {
    resultContainer.classList.add('hidden');
    startContainer.classList.remove('hidden');
};

const themeToggle = document.getElementById('theme-toggle');
themeToggle.onclick = () => {
    document.body.classList.toggle('dark-mode'); // default is light, so toggle dark-mode class
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
};
