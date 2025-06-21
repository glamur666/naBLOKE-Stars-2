const starInput = document.getElementById('starInput');
const payButton = document.getElementById('payButton');
const userInfo = document.getElementById('userInfo');

function setStars(amount) {
  starInput.value = amount;
}

// Telegram Web App авторизация
const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe.user;
if (user) {
  userInfo.innerText = `Привет, ${user.first_name} ${user.last_name || ''} (@${user.username || '-'})`;
} else {
  userInfo.innerText = "Авторизация Telegram не получена";
}

// Оплата через TonConnect
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
    // Эмуляция автоначисления (можно потом заменить вызовом backend)
    sendStarsToUser(user.username, amount);
  } catch (e) {
    alert("❌ Ошибка при оплате: " + e.message);
  }
});

function sendStarsToUser(username, amount) {
  // Здесь вызывай backend или Telegram bot API
  console.log(`Начисляем ${amount} звезд пользователю ${username}`);
  // Пока просто уведомление
  alert(`⭐ Пользователь @${username} получил ${amount} звёзд. Спасибо за покупку!`);
}

// Звёздный фон (как было)
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
for (let i = 0; i < 100; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5,
    speed: 0.5 + Math.random() * 1.5
  });
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
    star.y += star.speed;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(animateStars);
}
animateStars();
