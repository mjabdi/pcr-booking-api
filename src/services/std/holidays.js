const TimeSlot = require("../../models/TimeSlot");
const dateformat = require("dateformat");
const { OffDays } = require("./../../models/medex/OffDays");
const { WorkingHours } = require("./../../models/medex/WorkingHours");

const getHolidays = async () => {
  const offDays = await OffDays.find({
    $or: [{ service: "std" }, { service: "clinic" }],
  });
  offDays.map((el) => el.date);
  const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  let result = [
    ...offDays.map((el) => new Date(el.date.getTime() - el.offset * 60000)),
    yesterday,
  ];
  return result;
};

const getDefaultTimeSlots = async (date) => {
  // console.log(date);
  const someDate = new Date(date);
  //   console.log(someDate);

  const result = await WorkingHours.findOne({ service: "std" });

  const startingHour = result?.startingHour || 9.75;
  const endingHour = result?.endingHour || 17.5;
  const unavailabelTimes = result?.unavailabelTimes || [];
  const period = result?.period || 0.25;

  const weekendStartingHour = result?.weekendStartingHour || 10;
  const weekendEndingHour = result?.weekendEndingHour || 13.75;
  const weekendUnavailabelTimes = result?.weekendUnavailabelTimes || [];
  const weekendPeriod = result?.weekendPeriod || 0.25;

  const normalTimeSlots = [];

  const weekendTimeSlots = [];

  for (let h = startingHour; h <= endingHour; h += period) {
    const time = `${
      h < 13
        ? Math.floor(h).toLocaleString("en-UK", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })
        : Math.floor(h - 12).toLocaleString("en-UK", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })
    }:${Math.floor((h % 1) * 60).toLocaleString("en-UK", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })} ${h < 12 ? "AM" : "PM"}`;
    if (!unavailabelTimes.includes(time)) {
      normalTimeSlots.push(new TimeSlot(time, true));
    }
  }
  for (
    let h = weekendStartingHour;
    h <= weekendEndingHour;
    h += weekendPeriod
  ) {
    const time = `${
      h < 13
        ? Math.floor(h).toLocaleString("en-UK", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })
        : Math.floor(h - 12).toLocaleString("en-UK", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })
    }:${Math.floor((h % 1) * 60).toLocaleString("en-UK", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })} ${h < 12 ? "AM" : "PM"}`;
    if (!weekendUnavailabelTimes.includes(time)) {
      weekendTimeSlots.push(new TimeSlot(time, true));
    }
  }
  var results = [];
  var finalResults = [];

  if (isWeekend(someDate)) {
    results = weekendTimeSlots;
  } else {
    results = normalTimeSlots;
  }

  const dateStr = dateformat(someDate, "yyyy-mm-dd");
  const todayStr = dateformat(new Date(), "yyyy-mm-dd");
  const isToday = dateStr === todayStr;

  const isDateHoliday = await isHoliday(date);
  if (isDateHoliday) {
    for (var i = 0; i < results.length; i++) {
      finalResults.push(new TimeSlot(results[i].time, false));
    }
  } else
    for (var i = 0; i < results.length; i++) {
      if (isToday && TimePast(results[i].time)) {
        finalResults.push(new TimeSlot(results[i].time, false));
      } else {
        finalResults.push(results[i]);
      }
    }
  return finalResults;
};

function TimePast(time) {
  const currentTime = new Date(getNow());

  var hour = parseInt(time.substr(0, 2));
  var minute = parseInt(time.substr(3, 2));
  if (time.toLowerCase().indexOf("pm") > 0 && hour < 12) {
    hour += 12;
  }

  if (
    hour > currentTime.getHours() ||
    (hour === currentTime.getHours() && minute + 10 > currentTime.getMinutes())
  ) {
    return false;
  } else {
    return true;
  }
}

function getNow() {
  //const now = new Date(moment().tz("Europe/London").format());

  return new Date();
}

const isWeekend = (date) => {
  return date.getDay() === 0 || date.getDay() === 6; /// Weekend
};

const isHoliday = async (date) => {
  const todayStr = dateformat(new Date(), "yyyy-mm-dd");
  const holidays = await getHolidays();
  return (
    holidays.find(
      (element) =>
        dateformat(element, "yyyy-mm-dd") === dateformat(date, "yyyy-mm-dd")
    ) || dateformat(date, "yyyy-mm-dd") < todayStr
  );
};

module.exports = {
  getHolidays: getHolidays,
  isWeekend: isWeekend,
  getDefaultTimeSlots: getDefaultTimeSlots,
};
