async function renderSunRaiseAndSet(location) {
  const date = getDate();
  const response = await fetch(
    "https://opendata.cwa.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=CWB-840CF1E7-FC59-4E06-81C9-F4BB79253855&Date=" +
      date +
      "&CountyName=" +
      location,
    { method: "GET" }
  );
  const data = await response.json();
  const sun = {
    rise: data.records.locations.location[0].time[0].SunRiseTime,
    set: data.records.locations.location[0].time[0].SunSetTime,
  };
  document.querySelector("#today-date").innerText = date;
  document.querySelector("#selected-district").innerText = location;

  document.querySelector("#sunrise").innerText = sun.rise;
  document.querySelector("#sunset").innerText = sun.set;
}
function getDate() {
  let fulldate = new Date();
  const year = fulldate.getFullYear();
  const month =
    fulldate.getMonth() + 1 < 10
      ? "0" + (fulldate.getMonth() + 1)
      : fulldate.getMonth() + 1;
  const date =
    fulldate.getDate() < 10 ? "0" + fulldate.getDate() : fulldate.getDate();
  return year + "-" + month + "-" + date;
}

renderSunRaiseAndSet("臺北市");

export { renderSunRaiseAndSet };
