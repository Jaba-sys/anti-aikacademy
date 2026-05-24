const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Разрешаем запросы только методом POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const userName = data.name || "Аноним";

    // 1. Генерируем случайный уникальный ключ (например: AIC-4921-X)
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const generatedKey = `AIC-${randomNum}-${randomLetter}`;

    // 2. Настраиваем отправку письма тебе на почту
    // Используем бесплатный встроенный сервис или тестовый транспорт
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email", // Для теста. Ниже расскажу, как привязать твой Gmail
      port: 587,
      secure: false, 
      auth: {
        user: 'sop3chit.xpol.viva0@gmail.com', // Твоя почта
        pass: 'zzvb nqji ktha umab',
      },
    });

    // Текст письма, которое придет тебе
    let mailOptions = {
      from: '"Система Доступа" <no-reply@anti-aikacademy.fun>',
      to: "sop3chit.xpol.viva0@gmail.com", 
      subject: `🔑 Новый запрос ключа от ${userName}`,
      text: `Пользователь ${userName} зашел на сайт. Для него сгенерирован ключ: ${generatedKey}\n\nВы можете передать ему этот ключ для входа.`,
      html: `<h3>Новый запрос доступа</h3>
             <p><b>Имя/Ник:</b> ${userName}</p>
             <p><b>Сгенерированный персональный ключ:</b> <code style="background:#eee;padding:4px;font-size:16px;">${generatedKey}</code></p>`
    };

    await transporter.sendMail(mailOptions);

    // Возвращаем хэш ключа на фронтенд (чтобы пользователь не увидел сам ключ в коде!)
    // Для простоты пока вернем статус успеха
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Запрос отправлен администратору!" }),
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};