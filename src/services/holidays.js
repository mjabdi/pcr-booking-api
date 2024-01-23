const TimeSlot = require("../models/TimeSlot");
const dateformat = require("dateformat");
const { OffDays } = require("./../models/medex/OffDays");
const { WorkingHours } = require("./../models/medex/WorkingHours");

const getHolidays = async () => {
  const offDays = await OffDays.find({});
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
  const {
    startingHourMonday,
    endingHourMonday,
    periodMonday,
    startingHourTuesday,
    endingHourTuesday,
    periodTuesday,
    startingHourWednesday,
    endingHourWednesday,
    periodWednesday,
    startingHourThursday,
    endingHourThursday,
    periodThursday,
    startingHourFriday,
    endingHourFriday,
    periodFriday,
    startingHourSaturday,
    endingHourSaturday,
    periodSaturday,
    startingHourSunday,
    endingHourSunday,
    periodSunday,
  } = await WorkingHours.findOne({ service: "clinic" });
  const results = [];
  const finalResults = [];

  let startingHour = null;
  let endingHour = null;
  let period = null;
  if (dayOfWeek(someDate) === 1) {
    [startingHour, endingHour, period] = [
      startingHourMonday,
      endingHourMonday,
      periodMonday,
    ];
  } else if (dayOfWeek(someDate) === 2) {
    [startingHour, endingHour, period] = [
      startingHourTuesday,
      endingHourTuesday,
      periodTuesday,
    ];
  } else if (dayOfWeek(someDate) === 3) {
    [startingHour, endingHour, period] = [
      startingHourWednesday,
      endingHourWednesday,
      periodWednesday,
    ];
  } else if (dayOfWeek(someDate) === 4) {
    [startingHour, endingHour, period] = [
      startingHourThursday,
      endingHourThursday,
      periodThursday,
    ];
  } else if (dayOfWeek(someDate) === 5) {
    [startingHour, endingHour, period] = [
      startingHourFriday,
      endingHourFriday,
      periodFriday,
    ];
  } else if (dayOfWeek(someDate) === 6) {
    [startingHour, endingHour, period] = [
      startingHourSaturday,
      endingHourSaturday,
      periodSaturday,
    ];
  } else if (dayOfWeek(someDate) === 0) {
    [startingHour, endingHour, period] = [
      startingHourSunday,
      endingHourSunday,
      periodSunday,
    ];
  }
  if (startingHour && endingHour && period) {
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
      results.push(new TimeSlot(time, true));
    }
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

const dayOfWeek = (date) => {
  return date.getDay();
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
