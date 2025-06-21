const starInput = document.getElementById('starInput');
const payButton = document.getElementById('payButton');

function setStars(num) {
  starInput.value = num;
}

payButton.addEventListener('click', async () => {
  const amount = parseInt(starInput.value);
  if (!amount || amount <= 0) {
    alert('Введите корректное количество звёзд');
    return;
  }

  const tonAddress = "UQC-V7DG1I6T2Q0pbIllLAHbQiPdVtKlbw1ZSZHPHNosc-tA"; // Твой адрес TON
  const pricePer1000 = 0.0083; // Цена за 1000
  const priceInTon = ((amount / 1000) * pricePer1000).toFixed(4);

  const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://ton-connect.github.io/demo-dapp-with-react/tonconnect-manifest.json',
    buttonRootId: '', // без кнопки
  });

  await tonConnectUI.connectWallet();

  const tx = {
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [{
      address: tonAddress,
      amount: (parseFloat(priceInTon) * 1e9).toString(), // перевод в нанотонны
    }]
  };

  try {
    await tonConnectUI.sendTransaction(tx);
    showReviewModal();
  } catch (e) {
    alert("Ошибка при оплате: " + e.message);
  }
});

function showReviewModal() {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <p>⭐ Звезды будут зачислены в ближайшее время.</p>
    <p>Оставить отзыв можно тут: <a href="https://t.me/naBLOKEreviews" target="_blank">@naBLOKEreviews</a></p>
  `;
  document.body.appendChild(modal);
  modal.style.display = 'block';
}

// Падающие "naBLOKE"
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let letters = [];
for (let i = 0; i < 100; i++) {
  letters.push({
    text: 'naBLOKE',
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: 2 + Math.random() * 3
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  letters.forEach(letter => {
    ctx.fillText(letter.text, letter.x, letter.y);
    letter.y += letter.speed;
    if (letter.y > canvas.height) {
      letter.y = -20;
      letter.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(animate);
}
animate();
