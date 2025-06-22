const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Простое хранилище в памяти (потом можно заменить на базу)
const userStars = {};

// Стартовое сообщение
bot.start((ctx) => ctx.reply('Добро пожаловать! Покупайте звёзды через наш сервис.'));

// Команда показать количество звёзд
bot.command('stars', (ctx) => {
  const userId = ctx.from.id;
  const stars = userStars[userId] || 0;
  ctx.reply(`У вас ${stars} звёзд.`);
});

// Функция начисления звёзд (будет вызываться сервером оплаты)
async function addStars(userId, amount) {
  if (!userStars[userId]) userStars[userId] = 0;
  userStars[userId] += amount;

  try {
    await bot.telegram.sendMessage(userId, `Вам начислено ${amount} звёзд! Сейчас у вас ${userStars[userId]} звёзд.`);
  } catch (error) {
    console.error('Ошибка отправки сообщения:', error);
  }
}

bot.launch().then(() => console.log('Бот запущен!'));

// Экспортируем функцию для внешнего вызова
module.exports = { addStars };
