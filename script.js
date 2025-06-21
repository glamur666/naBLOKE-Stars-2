// === Элементы ===
const startScreen = document.getElementById('startScreen');
const buyScreen = document.getElementById('buyScreen');
const btnBuyStars = document.getElementById('btnBuyStars');
const btnBack = document.getElementById('btnBack');
const starInput = document.getElementById('starInput');
const payButton = document.getElementById('payButton');
const userInfo = document.getElementById('userInfo');

// === Функции переключения экранов ===
btnBuyStars.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  buyScreen.classList.remove('hidden');
});

btnBack.addEventListener('click', () => {
  buyScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
});

// === Установка количества звёзд кнопками ===
function setStars(amount) {
  starInput.value = amount;
}

// === Telegram WebApp авторизация ===
const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe.user;
if (user) {
  userInfo.innerText = `Привет, ${user.first_name} ${user.last_name || ''} (@${user.username || '-'})`;
} else {
  userInfo.innerText = "Авторизация Telegram не получена";
}

// === Оплата через TonConnect ===
payButton.addEventListener('click', async () => {
  const amount = parseInt(starInput.value);
  if (!amount || amount <= 0) {
    alert('Введите корректное количество звёзд');
    return;
  }
  if (!user) {
    alert('Пожалуйста, авторизуйтесь в Telegram, чтобы продолжить оплату');
    return;
  }

  const tonAddress = "UQC-V7DG1I6T2Q0pbIllLAHbQiPdVtKlbw1ZSZHPHNosc-tA";
  const pricePer1000 = 0.0083;
  const priceInTon = ((amount / 1000) * pricePer1000).toFixed(4);

  const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://ton-connect.github.io/demo-dapp-with-react/tonconnect-manifest.json',
    buttonRootId: '',
  });

  await tonConnectUI.connectWallet();

  const tx = {
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [{
      address: tonAddress,
      amount: (parseFloat(priceInTon) * 1e9).toFixed(0)
    }]
  };

  try {
    await tonConnectUI.sendTransaction(tx);
    alert('✅ Оплата прошла успешно! Звезды будут начислены автоматически.');
    sendStarsToUser(user.username, amount);
  } catch (e) {
    alert("❌ Ошибка при оплате: " + e.message);
  }
});

function sendStarsToUser(username, amount) {
  // Тут должна быть логика для backend или Bot API
  console.log(`Начисляем ${amount} звезд пользователю ${username}`);
  alert(`⭐ Пользователь @${username} получил ${amount} звёзд. Спасибо за покупку!`);
}

// === Звёзды и падающие NFT подарки ===
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const starChar = '⭐️';

// Примитивные "подарки" — для примера используем текстовые эмодзи ТГ
const nftIcons = ['🚬', '⌚', '💍', '🐸', '🌙', '🎩']; // сигара, часы, кольцо, плюш, сейлор муну, шляпа

class FallingItem {
  constructor(text) {
    this.text = text;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -canvas.height;
    this.speed = 1 + Math.random() * 2;
    this.fontSize = 20 + Math.random() * 20;
  }
  draw() {
    ctx.font = `${this.fontSize}px Arial`;
    ctx.fillText(this.text, this.x, this.y);
    this.y += this.speed;
    if (this.y > canvas.height) {
      this.y = Math.random() * -canvas.height;
      this.x = Math.random() * canvas.width;
    }
  }
}

const fallingStars = [];
for(let i=0; i<70; i++) fallingStars.push(new FallingItem(starChar));
const fallingNFTs = [];
for(let i=0; i<20; i++) fallingNFTs.push(new FallingItem(nftIcons[i % nftIcons.length]));

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  fallingStars.forEach(s => s.draw());
  fallingNFTs.forEach(n => n.draw());
  requestAnimationFrame(animate);
}
animate();

// Обработка изменения размера окна
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
