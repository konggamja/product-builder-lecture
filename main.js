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
        `;

        shadow.appendChild(style);
        shadow.appendChild(wrapper);
    }

    set numbers(numbers) {
        const wrapper = this.shadowRoot.querySelector('.numbers-wrapper');
        wrapper.innerHTML = '';
        numbers.forEach(number => {
            const ball = document.createElement('div');
            ball.setAttribute('class', 'number-ball');
            ball.textContent = number;
            wrapper.appendChild(ball);
        });
    }
}

customElements.define('lotto-numbers', LottoNumbers);

document.getElementById('generate-btn').addEventListener('click', () => {
    const lottoNumbersElement = document.querySelector('lotto-numbers');
    lottoNumbersElement.numbers = generateLottoNumbers();
});

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers);
}

// Initial generation
document.querySelector('lotto-numbers').numbers = generateLottoNumbers();
