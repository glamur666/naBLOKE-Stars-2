require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { addStars } = require('./bot');

const app = express();
app.use(bodyParser.json());

// Для теста: вызываем начисление звёзд вручную
app.post('/payment', async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount) {
    return res.status(400).send('userId и amount обязательны');
  }

  try {
    await addStars(userId, amount);
    res.send('Звёзды успешно начислены');
  } catch (e) {
    res.status(500).send('Ошибка начисления звёзд');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
