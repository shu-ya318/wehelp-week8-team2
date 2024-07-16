async function weather(location){
    fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWA-A25CF329-C737-4132-8E89-07F9DEC00AA2&locationName=${location}`)
    .then(response => {return response.json()})
    .then(result => {
        let data = result["records"]["locations"][0]["location"][0];
        let weatherData = data["weatherElement"][6]["time"];
        //console.log(weatherData);
        let minData = data["weatherElement"][8]["time"];
        let maxData = data["weatherElement"][12]["time"];
        let filteredWeatherData = weatherData.filter(item => !item.startTime.includes("18:00:00"));
        let filteredMinData = minData.filter(item => !item.startTime.includes("18:00:00"));
        let filteredMaxData = maxData.filter(item => !item.startTime.includes("18:00:00"));
        //console.log(filteredWeatherData ,filteredMinData, filteredMaxData);
        const arrays = [filteredWeatherData ,filteredMinData, filteredMaxData];
        const weekList = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        const mergedArray = arrays.reduce((acc, currArray) => {
            currArray.forEach(item => {
              // 將 startTime 轉換為 Date 對象並獲取星期幾
              const dateObject = new Date(item.startTime);
              const weekday = weekList[dateObject.getDay()]; // 獲取星期幾
          
              const existingItem = acc.find(
                accItem => accItem.startTime === item.startTime && accItem.endTime === item.endTime
              );
              if (existingItem) {
                existingItem.elementValue = existingItem.elementValue.concat(item.elementValue);
              } else {
                acc.push({ ...item, weekday }); // 添加星期幾到項目中
              }
            });
            return acc;
          }, []);
        //console.log(mergedArray);
        const cleanedArray = mergedArray.map(item => {
            return {
              startTime: item.startTime,
              endTime: item.endTime,
              weekday: item.weekday,
              weather: item.elementValue[0]?.value,
              number: item.elementValue[1]?.value,
              minT: item.elementValue[2]?.value,
              maxT: item.elementValue[3]?.value
            };
        });       
        //console.log(cleanedArray);
        renderWeather(cleanedArray);
    })
}


function renderWeather(cleanedArray) {
    for (let i = 0; i < 7; i++) {
        const data = cleanedArray[i];
        const textElement = document.getElementById(`text${i + 1}`);
        const imgElement = document.getElementById(`img${i + 1}`);
        const tempElement = document.getElementById(`temperature${i + 1}`);
  
        textElement.textContent = data["weekday"];
        imgElement.src = `image/${data["number"]}.svg`;
        tempElement.textContent = `${data["minT"]}°C~${data["maxT"]}°C`;
    }
}


weather("臺北市");

export { weather };
