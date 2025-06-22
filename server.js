import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import bot, { addStars } from "./bot.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
const TON_WALLET = process.env.TON_WALLET;
const TON_API_KEY = process.env.TON_API_KEY;
const PRICE_PER_1000 = parseFloat(process.env.PRICE_PER_1000) || 0.0083;

const orders = new Map();

app.post("/initiate", (req, res) => {
  const { userId, stars } = req.body;
  if (!userId || !stars || stars <= 0) return res.status(400).json({ error: "Неверные данные" });

  const comment = uuidv4().slice(0, 8);
  const amountTon = ((stars / 1000) * PRICE_PER_1000).toFixed(6);

  orders.set(comment, { userId, stars, paid: false, amountTon });
  res.json({ address: TON_WALLET, comment, amountTon });
});

async function checkPayments() {
  for (const [comment, order] of orders.entries()) {
    if (order.paid) continue;

    try {
      const url = `https://tonapi.io/v1/transactions?account=${TON_WALLET}&limit=50&token=${TON_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.result) continue;

      const tx = data.result.find(tx =>
        tx.in_msg?.msg_data?.comment === comment &&
        parseFloat(tx.in_msg?.value) >= parseFloat(order.amountTon)
      );

      if (tx) {
        console.log(`Оплата найдена для комментария ${comment}`);
        order.paid = true;
        await addStars(order.userId, order.stars);
      }
    } catch (err) {
      console.error("Ошибка при проверке платежей:", err);
    }
  }
}

setInterval(checkPayments, 30000);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
