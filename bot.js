import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);

export async function addStars(userId, stars) {
  try {
    await bot.telegram.sendMessage(userId, `⭐ Вам начислено ${stars} звёзд! Спасибо за покупку!`);
  } catch (err) {
    console.error("Ошибка отправки сообщения:", err);
  }
}

bot.start((ctx) => ctx.reply("Привет! Купи звёзды через наше WebApp!"));

bot.launch();

console.log("Бот запущен");

export default bot;
