const questions = [
    {
        id: 'relationship',
        text: '1. 당사자와 어떤 관계인가요?',
        options: [
            { text: '가족 또는 형제/자매', score: 100000, desc: '가족은 역시 두둑하게!' },
            { text: '부랄친구/절친', score: 70000, desc: '우정의 증표!' },
            { text: '직장 동료/학교 동기', score: 30000, desc: '사회생활의 기본' },
            { text: '애매한 지인 (가끔 연락)', score: 0, desc: '가야하나 말아야하나...' }
        ]
    },
    {
        id: 'contact',
        text: '2. 최근 1년 내 연락 빈도는?',
        options: [
            { text: '주 1회 이상 (단톡 포함)', score: 30000 },
            { text: '월 1~2회 정도', score: 10000 },
            { text: '명절에나 안부 묻는 사이', score: -10000 },
            { text: '청첩장 주려고 연락함', score: -20000 }
        ]
    },
    {
        id: 'reciprocity',
        text: '3. 내 경조사에 상대방은 어땠나요?',
        options: [
            { text: '내 결혼식에 와서 넉넉히 냄', score: 50000 },
            { text: '내 결혼식에 와서 기본은 함', score: 20000 },
            { text: '아직 내 경조사가 없었음', score: 0 },
            { text: '내 경조사에 안 왔음/안 냄', score: -30000 }
        ]
    },
    {
        id: 'attendance',
        text: '4. 식장에 참석하시나요?',
        options: [
            { text: '직접 참석 (맛있게 식사)', score: 30000 },
            { text: '직접 참석 (바빠서 식사 안함)', score: 0 },
            { text: '축의금만 전달 (불참)', score: -20000 }
        ]
    },
    {
        id: 'plus_one',
        text: '5. 동행인이 있나요?',
        options: [
            { text: '혼자 가요', score: 0 },
            { text: '배우자/연인과 함께', score: 70000 },
            { text: '아이들과 함께 (3인 이상)', score: 120000 }
        ]
    },
    {
        id: 'venue',
        text: '6. 예식장 장소는 어디인가요?',
        options: [
            { text: '호텔 (식대가 비싸보임)', score: 20000 },
            { text: '일반 예식장/컨벤션', score: 0 },
            { text: '야외/지방/공공기관', score: -10000 }
        ]
    },
    {
        id: 'my_status',
        text: '7. 본인의 현재 상황은?',
        options: [
            { text: '수입이 안정적인 직장인', score: 20000 },
            { text: '학생 또는 취업 준비 중', score: -30000 },
            { text: '돈 나갈 데 많은 가장/부모', score: 0 }
        ]
    }
];

let currentStep = 0;
let totalAmount = 50000; // 기본 시작 금액

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionContainer = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');
const finalAmountDisplay = document.getElementById('final-amount');
const resultDesc = document.getElementById('result-desc');

function showQuestion() {
    const q = questions[currentStep];
    questionText.textContent = q.text;
    optionsContainer.innerHTML = '';

    // 질문이 바뀔 때 애니메이션 효과
    questionContainer.style.transform = 'scale(0.95)';
    questionContainer.style.opacity = '0.5';
    
    setTimeout(() => {
        q.options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option.text;
            btn.onclick = () => handleAnswer(option.score);
            optionsContainer.appendChild(btn);
        });
        questionContainer.style.transform = 'scale(1)';
        questionContainer.style.opacity = '1';
    }, 100);
}

function handleAnswer(score) {
    totalAmount += score;
    currentStep++;

    if (currentStep < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    
    // 한국 정서에 맞는 최종 금액 보정
    let finalAmount = totalAmount;

    // 최소 금액 하한선
    if (finalAmount < 30000) finalAmount = 30000;

    // 금액 단위 조정 로직
    if (finalAmount < 100000) {
        // 10만원 미만은 3, 5, 7, 10만원으로 맞춤
        if (finalAmount <= 35000) finalAmount = 30000;
        else if (finalAmount <= 60000) finalAmount = 50000;
        else if (finalAmount <= 85000) finalAmount = 70000;
        else finalAmount = 100000;
    } else {
        // 10만원 이상은 5만원 단위로 반올림/버림
        finalAmount = Math.round(finalAmount / 50000) * 50000;
    }

    // 예외 처리: 10만원 이상인데 9만원 이런 경우 10만원으로
    if (finalAmount > 70000 && finalAmount < 100000) finalAmount = 100000;

    finalAmountDisplay.textContent = finalAmount.toLocaleString() + '원';
    
    let comment = "";
    if (finalAmount >= 200000) comment = "당신은 정말 통 큰 사람! 최고의 하객입니다. 👍";
    else if (finalAmount >= 100000) comment = "서로 서운함 없을 넉넉한 금액이에요. 😊";
    else if (finalAmount >= 50000) comment = "가장 대중적이고 합리적인 선택입니다! 👌";
    else comment = "진심 어린 축하의 마음이 더 중요하죠! ✨";

    resultDesc.innerHTML = `${comment}<br><br><small>(관계와 상황을 종합적으로 고려한 결과입니다.)</small>`;
}

document.getElementById('restart-btn').onclick = () => {
    currentStep = 0;
    totalAmount = 50000;
    resultContainer.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    showQuestion();
};

// 테마 토글
const themeToggle = document.getElementById('theme-toggle');
themeToggle.onclick = () => {
    document.body.classList.toggle('light-mode');
    themeToggle.textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
};

// 초기 실행
showQuestion();
