class LottoNumbers extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'numbers-wrapper');

        const style = document.createElement('style');
        style.textContent = `
            .numbers-wrapper {
                display: flex;
                gap: 10px;
                justify-content: center;
                flex-wrap: wrap;
            }
            .number-ball {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.5em;
                font-weight: bold;
                color: #fff;
                background: linear-gradient(135deg, #6dd5ed, #2193b0);
                box-shadow: 0 5px 10px rgba(0,0,0,0.25);
                transition: all 0.3s ease;
            }
            @media (max-width: 480px) {
                .number-ball {
                    width: 45px;
                    height: 45px;
                    font-size: 1.2em;
                }
            }
        `;

        shadow.appendChild(style);
        shadow.appendChild(wrapper);
    }

    set numbers(numbers) {
        const wrapper = this.shadowRoot.querySelector('.numbers-wrapper');
        if (wrapper) {
            wrapper.innerHTML = '';
            numbers.sort((a, b) => a - b).forEach(number => {
                const ball = document.createElement('div');
                ball.setAttribute('class', 'number-ball');
                ball.textContent = number;
                wrapper.appendChild(ball);
            });
        }
    }
}

customElements.define('lotto-numbers', LottoNumbers);

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    if (themeToggle) themeToggle.textContent = '☀️';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLightMode = body.classList.contains('light-mode');
        themeToggle.textContent = isLightMode ? '☀️' : '🌙';
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    });
}

// Lotto Generation Logic
const generateBtn = document.getElementById('generate-btn');
if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        const lottoNumbersElement = document.querySelector('lotto-numbers');
        if (lottoNumbersElement) {
            lottoNumbersElement.numbers = generateLottoNumbers();
        }
    });
}

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers);
}

// Initial generation
document.addEventListener('DOMContentLoaded', () => {
    const initialElement = document.querySelector('lotto-numbers');
    if (initialElement) {
        initialElement.numbers = generateLottoNumbers();
    }
});
