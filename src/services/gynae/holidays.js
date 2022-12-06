const TimeSlot = require("../../models/TimeSlot");
const dateformat = require('dateformat');

const holidays = [
        new Date(2020,11,25,0,0,0,0),
        new Date(2020,11,26,0,0,0,0),
        new Date(2021,0,1,0,0,0,0),
        new Date(2021,1,12,0,0,0,0),
        new Date(2021,7,29,0,0,0),
        new Date(2021,11,24,0,0,0,0),
        new Date(2021,11,25,0,0,0,0),
        new Date(2021,11,26,0,0,0,0),
        new Date(2021,11,28,0,0,0,0),
        new Date(2021,11,23,0,0,0,0),
        new Date(2022,0,1,0,0,0,0),
        new Date(2022,0,3,0,0,0,0),

        new Date(2022,5,2,0,0,0,0),
        new Date(2022,5,3,0,0,0,0),

        new Date(2022,8,15,0,0,0,0),
        new Date(2022,8,16,0,0,0,0),
        new Date(2022,9,27,0,0,0,0),
        new Date(2022,9,28,0,0,0,0),

        new Date(2022,7,29,0,0,0,0),

        new Date(2023,0,1,0,0,0,0),
        new Date(2023,0,2,0,0,0,0),

        new Date(2022,11,24,0,0,0,0),
        new Date(2022,11,25,0,0,0,0),
        new Date(2022,11,26,0,0,0,0),
        new Date(2022,11,31,0,0,0,0),




];

const getHolidays = () =>
{
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    let result = [...holidays, yesterday];
    return result;
}


const TIME_SLOTS_THURSDAY = [
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
];

const TIME_SLOTS_FRIDAY = [
    new TimeSlot('10:00 AM', true),
    new TimeSlot('10:30 AM', true),
    new TimeSlot('11:00 AM', true),
    new TimeSlot('11:30 AM', true),
    new TimeSlot('12:00 PM', true),
    new TimeSlot('12:30 PM', true),
    new TimeSlot('01:00 PM', true),
    new TimeSlot('01:30 PM', true),
    new TimeSlot('02:00 PM', true),
];

const TIME_SLOTS_FRIDAY_13 = [
    new TimeSlot('10:00 AM', true),
    new TimeSlot('10:30 AM', true),
    new TimeSlot('11:00 AM', true),
    new TimeSlot('11:30 AM', true),
    new TimeSlot('12:00 PM', true),
    new TimeSlot('12:30 PM', true),
    new TimeSlot('01:00 PM', true),
];


const TIME_SLOTS_19th = [
    new TimeSlot('02:00 PM', true),
    new TimeSlot('02:30 PM', true),
    new TimeSlot('03:00 PM', true),
    new TimeSlot('03:30 PM', true),
    new TimeSlot('04:00 PM', true),
    new TimeSlot('04:30 PM', true),
    new TimeSlot('05:00 PM', true),
    new TimeSlot('05:30 PM', true),
]




const TIME_SLOTS_NORMAL = [
    new TimeSlot('09:00 AM', true),
    new TimeSlot('09:45 AM', true),
    new TimeSlot('10:30 AM', true),
    new TimeSlot('11:15 AM', true),
    new TimeSlot('12:00 PM', true),
    new TimeSlot('12:45 PM', true),
    new TimeSlot('01:30 PM', true),
    new TimeSlot('02:15 PM', true),
    new TimeSlot('03:00 PM', true),
    new TimeSlot('03:45 PM', true),
    new TimeSlot('04:30 PM', true),
    new TimeSlot('05:15 PM', true),
];

const TIME_SLOTS_WEEKEND = [

];

const getDefaultTimeSlots = (date) =>
{
    // console.log(date);
    const someDate = new Date(date);
    const someDateStr = dateformat(someDate, 'yyyy-mm-dd');

    // console.log(someDate);

    var results = [];
    var finalResults = [];

    // if (isWeekend(someDate)) /// Weekend
    // {
    //     results = TIME_SLOTS_WEEKEND;
    // }
    // else
    // {
    //     results = TIME_SLOTS_NORMAL;
    // }




    if (someDateStr === '2021-09-23' || someDateStr === '2021-09-24')
    {
        results = [];
    }
    else if (isThursday(someDate)) /// Weekend
    {
        results = TIME_SLOTS_THURSDAY;
    }
    else if (isFriday(someDate))
    {
        results = TIME_SLOTS_FRIDAY;
    }
    else
    {
        result = []
    }

    if (someDateStr === '2021-11-19')
    {
        results = TIME_SLOTS_19th;
    }

    if (someDateStr === '2022-01-21')
    {
        results = TIME_SLOTS_FRIDAY_13;
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

const isThursday = (date) =>
{
    return (date.getDay() === 4) /// Thursday
}

const isFriday = (date) =>
{
    return (date.getDay() === 5) /// Friday
}

const isHoliday = (date) =>
{
    const todayStr = dateformat(new Date(),'yyyy-mm-dd');
    return (holidays.find(element => dateformat(element,'yyyy-mm-dd') === dateformat(date,'yyyy-mm-dd')) ||  dateformat(date,'yyyy-mm-dd') < todayStr);
}



module.exports = {

    getHolidays: getHolidays,
    isWeekend: isWeekend,
    TIME_SLOTS_WEEKEND: TIME_SLOTS_WEEKEND,
    TIME_SLOTS_NORMAL: TIME_SLOTS_NORMAL,
    getDefaultTimeSlots: getDefaultTimeSlots
}