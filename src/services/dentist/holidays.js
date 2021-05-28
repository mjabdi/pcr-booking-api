const TimeSlot = require("../../models/TimeSlot");
const dateformat = require('dateformat');

const holidays = [
        new Date(2020,11,25,0,0,0,0),
        new Date(2020,11,26,0,0,0,0),
        new Date(2021,0,1,0,0,0,0),
        new Date(2021,1,12,0,0,0,0)
];

const getHolidays = () =>
{
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    let result = [...holidays, yesterday];
    return result;
}

const TIME_SLOTS_NORMAL = [
    new TimeSlot('08:00 AM', true),   
    new TimeSlot('08:30 AM', true),   
    new TimeSlot('09:00 AM', true),
    new TimeSlot('09:30 AM', true),
    new TimeSlot('10:00 AM', true),
    new TimeSlot('10:30 AM', true),
    new TimeSlot('11:00 AM', true),
    new TimeSlot('11:30 AM', true),
    new TimeSlot('12:00 PM', true),
    new TimeSlot('12:30 PM', true),
    new TimeSlot('01:00 PM', true),
    new TimeSlot('01:30 PM', true),
    new TimeSlot('02:00 PM', true),
    new TimeSlot('02:30 PM', true),
    new TimeSlot('03:00 PM', true),
    new TimeSlot('03:30 PM', true),
    new TimeSlot('04:00 PM', true),
    new TimeSlot('04:30 PM', true),
    new TimeSlot('05:00 PM', true),
    new TimeSlot('05:30 PM', true),
    new TimeSlot('06:00 PM', true),
    new TimeSlot('06:30 PM', true),

];

const isTeusday = (date) =>
{
    return (date.getDay() === 2) /// Tuesday
}

const isWednesday = (date) =>
{
    return (date.getDay() === 3) /// Wednesday
}

const isFriday = (date) =>
{
    return (date.getDay() === 5) /// Friday
}


 


const getDefaultTimeSlots = (date) =>
{
    const someDate = new Date(date);
    const someDateStr = dateformat(someDate, 'yyyy-mm-dd');

    var results = [];
    var finalResults = [];

    if (isTeusday(someDate) || isWednesday(someDate) || isFriday(someDate)) /// 
    {
        results = TIME_SLOTS_NORMAL;
    }
    else
    {
        result = [];
    }

    const dateStr = dateformat(someDate, 'yyyy-mm-dd');
    const todayStr = dateformat(new Date(), 'yyyy-mm-dd');
    const is24Dec = (dateStr === '2020-12-24' || dateStr === '2020-12-31' );
    const is27Dec = (dateStr === '2020-12-27');
    const isToday = (dateStr === todayStr);
    const is11February = (dateStr === '2021-02-11');


    for (var i=0; i < results.length; i++)
    {
        if (isHoliday(date))
        {
            finalResults.push(new TimeSlot(results[i].time, false));
        }
        else if (isToday && TimePast(results[i].time))
         {
             finalResults.push(new TimeSlot(results[i].time, false));
         }
         else if (is24Dec && results[i].time.toUpperCase().indexOf('PM') > 0)
         {
            finalResults.push(new TimeSlot(results[i].time, false));
         }
         else if (is27Dec && results[i].time.toUpperCase().indexOf('PM') > 0 &&  parseInt(results[i].time.substr(0,2)) >= 5 && parseInt(results[i].time.substr(0,2)) !== 12)
         {
            finalResults.push(new TimeSlot(results[i].time, false));
         }
         else if (is27Dec && results[i].time.toUpperCase().indexOf('AM') > 0 &&  parseInt(results[i].time.substr(0,2)) < 10)
         {
            finalResults.push(new TimeSlot(results[i].time, false));
         }
         else if (is11February && (results[i].time.startsWith("02:"))){
            finalResults.push(new TimeSlot(results[i].time, false));
         }
         else 
         {
             finalResults.push(results[i]);
         }  

        }
    return finalResults;
}

function TimePast(time)
{
    const currentTime = new Date(getNow());

    var hour = parseInt(time.substr(0,2));
    var minute = parseInt(time.substr(3,2));
    if (time.toLowerCase().indexOf('pm') > 0 && hour < 12)
    {
        hour += 12;
    }

    if (hour > currentTime.getHours() || (hour === currentTime.getHours() && (minute + 10) > currentTime.getMinutes()))
    {
        return false;
    }
    else
    {
        return true;
    }
}

function getNow()
{
    //const now = new Date(moment().tz("Europe/London").format());
    
    return new Date();
}



const isWeekend = (date) =>
{
    return (date.getDay() === 0 || date.getDay() === 6) /// Weekend
}


const isHoliday = (date) =>
{
    const todayStr = dateformat(new Date(),'yyyy-mm-dd');

    if (date <= '2021-06-21' || date === '2021-06-25')
    {
        return true
    }

    if (date >= '2021-07-19' && date <= '2021-07-30' )
    {
        return true
    }


    return (holidays.find(element => dateformat(element,'yyyy-mm-dd') === dateformat(date,'yyyy-mm-dd')) ||  dateformat(date,'yyyy-mm-dd') < todayStr);
}



module.exports = {

    getHolidays: getHolidays,
    isWeekend: isWeekend,
    getDefaultTimeSlots: getDefaultTimeSlots
}