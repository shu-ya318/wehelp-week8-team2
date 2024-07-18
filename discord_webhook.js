function botSayHi() {
  const info = {
    region: document.querySelector("#selected-district").innerText,
    date: document.querySelector("#today-date").innerText,
    sunrise: document.querySelector("#sunrise").innerText,
    sunset: document.querySelector("#sunset").innerText,
    weather:
      "溫度: " +
      document.querySelector("#today-temperature").innerText +
      "\n" +
      document.querySelector("#today-precipitation").innerText,
  };

  const webhookURL =
    "https://discord.com/api/webhooks/1162404320399085690/y6pNTIyURc4-ftZIicqF49uzwNTF70bRw_9D1QyVrmxzbwagnXXX-HNW2E6QvzUJVUVS";
  const embed = {
    title: "氣象預報小幫手",
    color: 0x1e90ff,
    fields: [
      {
        name: "📅  日期",
        value: info.date,
        inline: true,
      },
      {
        name: "🌍  地區",
        value: info.region,
        inline: true,
      },
      {
        name: "🌤  天氣",
        value: info.weather,
        inline: false,
      },
      {
        name: "🌅  日出",
        value: info.sunrise,
        inline: true,
      },
      {
        name: "🌇  日落",
        value: info.sunset,
        inline: true,
      },
    ],
    image: {
      url: "https://cdntwrunning.biji.co/600_87f879efdeb7cf3db7bed52b6cb9fc8e.jpg",
    },
    footer: {
      text: "祝您有個美好的一天",
    },
  };

  const message = {
    username: "蔡醫師",
    avatar_url:
      "https://i0.wp.com/www.berylatelier.com/wp-content/uploads/2024/03/%E8%94%A114-3.jpg?fit=1280%2C1280&ssl=1",
    embeds: [embed],
  };

  fetch(webhookURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
export { botSayHi };
