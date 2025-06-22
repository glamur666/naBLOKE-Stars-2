let selectedStars = 0;

const buttons = document.querySelectorAll('.stars-button');
buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedStars = parseInt(btn.dataset.value);
  });
});

document.getElementById('pay-btn').addEventListener('click', async () => {
  const tg = window.Telegram.WebApp;
  const userId = tg.initDataUnsafe?.user?.id;

  if (!userId || !selectedStars) {
    alert("Пожалуйста, выберите количество звёзд.");
    return;
  }

  const paymentInfo = document.getElementById("payment-info");
  paymentInfo.style.display = "block";
  paymentInfo.innerHTML = "<p>⏳ Загружаем данные для оплаты...</p>";

  try {
    const res = await fetch("https://ТВОЙ-ДОМЕН.onrender.com/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, stars: selectedStars }),
    });

    const data = await res.json();

    if (data.address && data.comment && data.amountTon) {
      paymentInfo.innerHTML = `
        <p>💸 Отправьте <b>${data.amountTon} TON</b> на адрес:</p>
        <code>${data.address}</code>
        <p>📌 В комментарии укажите:</p>
        <code>${data.comment}</code>
        <p>⏳ После оплаты звёзды будут начислены автоматически.</p>
      `;
    } else {
      paymentInfo.innerHTML = "<p>❌ Ошибка при получении данных оплаты</p>";
    }
  } catch (err) {
    console.error(err);
    paymentInfo.innerHTML = "<p>❌ Не удалось связаться с сервером</p>";
  }
});
