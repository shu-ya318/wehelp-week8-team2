const dataKey = 'CWB-840CF1E7-FC59-4E06-81C9-F4BB79253855';
const dataUrl = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${dataKey}`;

function handleSpecialWeatherData(weatherData) {
  if (weatherData.elementName === 'PoP') {
    weatherData.elementDescription = '降雨機率';
    weatherData.parameterDescription = weatherData.parameterName + '%';
  }
  if (weatherData.elementName === 'MinT') {
    weatherData.elementDescription = '最低溫度';
    weatherData.parameterDescription = weatherData.parameterName + '°C';
  }
  if (weatherData.elementName === 'MaxT') {
    weatherData.elementDescription = '最高溫度';
    weatherData.parameterDescription = weatherData.parameterName + '°C';
  }
  if (weatherData.elementName === 'Wx') {
    weatherData.elementDescription = '天氣現象';
    weatherData.parameterDescription = weatherData.parameterValue;
    weatherData.wxDescription = weatherData.parameterName;
  }
  return weatherData;
}

function handleDataByTime(dataList) {
  const today = new Date();
  const startTime0 = dataList[0].startTime;
  const endTime0 = dataList[0].endTime;
  const timeDescription0 = startTime0.substring(11, 16) + ' - ' + endTime0.substring(11, 16);
  const startTime1 = dataList[1].startTime;
  const endTime1 = dataList[1].endTime;
  const timeDescription1 = startTime1.substring(11, 16) + ' - ' + endTime1.substring(11, 16);
  const startTime2 = dataList[2].startTime;
  const endTime2 = dataList[2].endTime;
  const timeDescription2 = startTime2.substring(11, 16) + ' - ' + endTime2.substring(11, 16);

  const periodTypeOne = [
    {
      description: "今日白天",
      startTime: startTime0,
      endTime: endTime0,
      descriptionTime: timeDescription0
    },
    {
      description: "今夜至明晨",
      startTime: startTime1,
      endTime: endTime1,
      descriptionTime: timeDescription1
    },
    {
      description: "明日白天",
      startTime: startTime2,
      endTime: endTime2,
      descriptionTime: timeDescription2
    }
  ];

  const periodTypeTwo = [
    {
      description: "今晚至明晨",
      startTime: startTime0,
      endTime: endTime0,
      descriptionTime: timeDescription0
    },
    {
      description: "明日白天",
      startTime: startTime1,
      endTime: endTime1,
      descriptionTime: timeDescription1
    },
    {
      description: "明夜至後天清晨",
      startTime: startTime2,
      endTime: endTime2,
      descriptionTime: timeDescription2
    }
  ];

  const periodType = today.getHours() >= 5 && today.getHours() < 17 ? periodTypeOne : periodTypeTwo;

  for (const period of periodType) {
    const periodWeatherData = [];
    for (const data of dataList) {
      const periodStartTime = period.startTime;
      const periodEndTime = period.endTime;
      const dataStartTime = data.startTime;
      const dataEndTime = data.endTime;
      const elementName = data.elementName;
      if (periodStartTime === dataStartTime && periodEndTime === dataEndTime) {
        periodWeatherData.push(data);

        if (elementName === 'PoP') {
          period.pop = data.parameterDescription;
          period.popTitle = data.elementDescription;
        }

        if (elementName === 'MaxT') {
          period.maxT = data.parameterDescription;
          period.maxTTitle = data.elementDescription;
        }

        if (elementName === 'MinT') {
          period.minT = data.parameterDescription;
          period.minTTitle = data.elementDescription;
        }

        if (elementName === 'Wx') {
          period.wx = data.parameterDescription;
          period.wxTitle = data.elementDescription;
          period.wxDescription = data.wxDescription;
        }
      }
    }
  }

  return periodType;
}

async function getDailyData(locationName) {
  const response = await fetch(`${dataUrl}&locationName=${encodeURIComponent(locationName)}&timestamp=${new Date().getTime()}`);//await fetch(`${dataUrl}&locationName=${encodeURIComponent(locationName)}`);
  const data = await response.json();

  console.log(data)

  const rawDataList = data.records.location[0].weatherElement;
  const dataList = [];
  for (const weatherData of rawDataList) {
    const elementName = weatherData.elementName;
    const timeList = weatherData.time;
    for (const time of timeList) {
      const parameter = time.parameter;
      let newData = {
        elementName: elementName,
        startTime: time.startTime,
        endTime: time.endTime,
        parameterName: parameter.parameterName,
        parameterValue: parameter.parameterValue,
        parameterUnit: parameter.parameterUnit
      };

      newData = handleSpecialWeatherData(newData);
      dataList.push(newData);
    }
  }

  const newWeatherData = handleDataByTime(dataList);
  console.log(newWeatherData);
  return {
    location_name: locationName,
    weather_data: newWeatherData
  };
}

async function get_three_span_weather(location_name) {
    const data = await getDailyData(location_name)
    return data;
}

async function render_three_span_wether(location_name) {
  const weatherData = await get_three_span_weather(location_name)
  console.log(weatherData)

  //三個時段的天氣資料
  const weather1 = weatherData["weather_data"][0]
  const weather2 = weatherData["weather_data"][1]
  const weather3 = weatherData["weather_data"][2]

  //三個時間段
  const span1 = weather1["description"]
  const span2 = weather2["description"]
  const span3 = weather3["description"]

  //三個時段降雨機率
  const popValue1 = weather1["pop"]
  const popValue2 = weather2["pop"]
  const popValue3 = weather3["pop"]

  //三個時段最低溫
  const minTValue1 = weather1["minT"]
  const minTValue2 = weather2["minT"]
  const minTValue3 = weather3["minT"]

  //三個時段最高溫
  const maxTValue1 = weather1["maxT"]
  const maxTValue2 = weather2["maxT"]
  const maxTValue3 = weather3["maxT"]

  //第一個時段
  
  weatherToday.querySelector(".weather-subtitle").innerText = span1
  weatherToday.querySelector("#today-temperature").innerText = `${minTValue1}~${maxTValue1}`;
  weatherToday.querySelector("#today-precipitation").innerText = `降雨率：${popValue1}`;

  const weatherWx = weatherData["weather_data"][0]["wx"]
  console.log(weatherWx)
  document.getElementById("today-img").src = `image/0${weatherWx}.svg`;
  
  //第二第三時段的時段文字
  const weatherItemContainer2 = document.querySelectorAll(".weather-items-container")[1]
  const weatherItems = weatherItemContainer2.querySelectorAll(".weather-item")
  const weatherItem1 = weatherItems[0]
  const weatherItem2 = weatherItems[1]
  
  weatherItem1.querySelector(".weather-subtitle").innerText = span2
  weatherItem2.querySelector(".weather-subtitle").innerText = span3

  //第二第三 的最低溫 最高溫
  weatherItem1.querySelector("#tomorrow-day-temperature").innerText = `${minTValue2}~${maxTValue2}`;
  weatherItem2.querySelector("#tomorrow-night-temperature").innerText = `${minTValue3}~${maxTValue3}`;

  //第二第三 的降雨機率
  weatherItem1.querySelector("#tomorrow-day-precipitation").innerText = `降雨率：${popValue2}`;
  weatherItem2.querySelector("#tomorrow-night-precipitation").innerText = `降雨率：${popValue3}`;
}

render_three_span_wether("臺北市");
export { render_three_span_wether };
