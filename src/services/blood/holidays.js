const TimeSlot = require("../../models/TimeSlot");
const dateformat = require('dateformat');

const holidays = [

        new Date(2020,11,25,0,0,0,0),
        new Date(2020,11,26,0,0,0,0),
        new Date(2021,0,1,0,0,0,0),
        new Date(2021,7,29,0,0,0),
        new Date(2021,11,24,0,0,0,0),
        new Date(2021,11,25,0,0,0,0),
        new Date(2021,11,26,0,0,0,0),
        new Date(2021,11,28,0,0,0,0),

        new Date(2022,0,1,0,0,0,0),
        new Date(2022,0,3,0,0,0,0),
        new Date(2022,3,17,0,0,0,0),

        new Date(2022,5,3,0,0,0,0),

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


const TIME_SLOTS_NORMAL = [
    // new TimeSlot('09:00 AM', true),
    // new TimeSlot('09:15 AM', true),
    // new TimeSlot('09:30 AM', true),
    new TimeSlot('09:45 AM', true),
    new TimeSlot('10:00 AM', true),
    new TimeSlot('10:15 AM', true),
    new TimeSlot('10:30 AM', true),
    new TimeSlot('10:45 AM', true),
    new TimeSlot('11:00 AM', true),
    new TimeSlot('11:15 AM', true),
    new TimeSlot('11:30 AM', true),
    new TimeSlot('11:45 AM', true),
    new TimeSlot('12:00 PM', true),
    new TimeSlot('12:15 PM', true),
    new TimeSlot('12:30 PM', true),
    new TimeSlot('12:45 PM', true),
    new TimeSlot('01:00 PM', true),
    new TimeSlot('01:15 PM', true),
    new TimeSlot('01:30 PM', true),
    new TimeSlot('01:45 PM', true),
    new TimeSlot('02:00 PM', true),
    new TimeSlot('02:15 PM', true),
    new TimeSlot('02:30 PM', true),
    new TimeSlot('02:45 PM', true),
    new TimeSlot('03:00 PM', true),
    new TimeSlot('03:15 PM', true),
    new TimeSlot('03:30 PM', true),
    new TimeSlot('03:45 PM', true),
    new TimeSlot('04:00 PM', true),
    new TimeSlot('04:15 PM', true),
    new TimeSlot('04:30 PM', true),
    new TimeSlot('04:45 PM', true),
    new TimeSlot('05:00 PM', true),
    new TimeSlot('05:15 PM', true),
    new TimeSlot('05:30 PM', true),
    // new TimeSlot('05:45 PM', true)
];

const TIME_SLOTS_WEEKEND = [
    new TimeSlot('10:00 AM', true),
    new TimeSlot('10:15 AM', true),
    new TimeSlot('10:30 AM', true),
    new TimeSlot('10:45 AM', true),
    new TimeSlot('11:00 AM', true),
    new TimeSlot('11:15 AM', true),
    new TimeSlot('11:30 AM', true),
    new TimeSlot('11:45 AM', true),
    new TimeSlot('12:00 PM', true),
    new TimeSlot('12:15 PM', true),
    new TimeSlot('12:30 PM', true),
    new TimeSlot('12:45 PM', true),
    new TimeSlot('01:00 PM', true),
    new TimeSlot('01:15 PM', true),
    new TimeSlot('01:30 PM', true),
    new TimeSlot('01:45 PM', true),
];

const TIME_SLOTS_WEEKEND_30MIN = [
    new TimeSlot('10:00 AM', true),
    new TimeSlot('10:30 AM', true),
    new TimeSlot('11:00 AM', true),
    new TimeSlot('11:30 AM', true),
    new TimeSlot('12:00 PM', true),
    new TimeSlot('12:30 PM', true),
    new TimeSlot('01:00 PM', true),
    new TimeSlot('01:30 PM', true),
];


const TIME_SLOTS_NORMAL_LIMITED = [
    // new TimeSlot('09:00 AM', true),
    // new TimeSlot('09:15 AM', true),
    // new TimeSlot('09:30 AM', true),
    new TimeSlot('09:45 AM', true),
    new TimeSlot('10:00 AM', true),
    new TimeSlot('10:15 AM', true),
    new TimeSlot('10:30 AM', true),
    new TimeSlot('10:45 AM', true),
    new TimeSlot('11:00 AM', true),
    new TimeSlot('11:15 AM', true),
    new TimeSlot('11:30 AM', true),
    new TimeSlot('11:45 AM', true),
    new TimeSlot('12:00 PM', true),
    new TimeSlot('12:15 PM', true),
    new TimeSlot('12:30 PM', true),
    new TimeSlot('12:45 PM', true),
    new TimeSlot('01:00 PM', true),
    new TimeSlot('01:15 PM', true),
    new TimeSlot('01:30 PM', true),
    new TimeSlot('01:45 PM', true),
    new TimeSlot('02:00 PM', false),
    new TimeSlot('02:15 PM', false),
    new TimeSlot('02:30 PM', false),
    new TimeSlot('02:45 PM', false),
    new TimeSlot('03:00 PM', false),
    new TimeSlot('03:15 PM', false),
    new TimeSlot('03:30 PM', false),
    new TimeSlot('03:45 PM', false),
    new TimeSlot('04:00 PM', false),
    new TimeSlot('04:15 PM', false),
    new TimeSlot('04:30 PM', true),
    new TimeSlot('04:45 PM', true),
    new TimeSlot('05:00 PM', true),
    new TimeSlot('05:15 PM', true),
    new TimeSlot('05:30 PM', true),
    // new TimeSlot('05:45 PM', true)
];



const TIME_SLOTS_MIDDAY = [
    new TimeSlot('09:45 AM', true),
    new TimeSlot('10:00 AM', true),
    new TimeSlot('10:15 AM', true),
    new TimeSlot('10:30 AM', true),
    new TimeSlot('10:45 AM', true),
    new TimeSlot('11:00 AM', true),
    new TimeSlot('11:15 AM', true),
    new TimeSlot('11:30 AM', true),
    new TimeSlot('11:45 AM', true),
];


const TIME_SLOTS_10_14 = [
    new TimeSlot('10:00 AM', true),
    new TimeSlot('10:15 AM', true),
    new TimeSlot('10:30 AM', true),
    new TimeSlot('10:45 AM', true),
    new TimeSlot('11:00 AM', true),
    new TimeSlot('11:15 AM', true),
    new TimeSlot('11:30 AM', true),
    new TimeSlot('11:45 AM', true),
    new TimeSlot('12:00 PM', true),
    new TimeSlot('12:15 PM', true),
    new TimeSlot('12:30 PM', true),
    new TimeSlot('12:45 PM', true),
    new TimeSlot('01:00 PM', true),
    new TimeSlot('01:15 PM', true),
    new TimeSlot('01:30 PM', true),
    new TimeSlot('01:45 PM', true),
];



const getDefaultTimeSlots = (date) =>
{
    // console.log(date);
    const someDate = new Date(date);
    const someDateStr = dateformat(someDate, 'yyyy-mm-dd');

    // console.log(someDate);

    var results = [];
    var finalResults = [];

    // var is30Min = someDateStr === '2021-03-27' ||
    //               someDateStr === '2021-03-27' ||
    //               someDateStr === '2021-03-27' ||
    //               someDateStr === '2021-03-27' ||

    // if (is30Min)
    // {
    //     results = TIME_SLOTS_WEEKEND_30MIN;
    // }
    // else 



    
    if (isWeekend(someDate) && someDateStr !== '2020-12-27') /// Weekend
    {
        results = TIME_SLOTS_WEEKEND_30MIN;
    }
    else
    {
        results = TIME_SLOTS_NORMAL;
    }

    if (someDateStr === '2021-04-02' || someDateStr === '2021-04-05' || someDateStr === '2021-05-03' || someDateStr === '2021-05-31' || someDateStr === "2022-04-18")
    {
        results = TIME_SLOTS_WEEKEND_30MIN
    }



    const dateStr = dateformat(someDate, 'yyyy-mm-dd');
    const todayStr = dateformat(new Date(), 'yyyy-mm-dd');
    const is24Dec = (dateStr === '2020-12-24' || dateStr === '2020-12-31' );
    const is27Dec = (dateStr === '2020-12-27');
    const isToday = (dateStr === todayStr);


    const is20August = (dateStr === '2021-08-20');
    if (is20August)
    {
        results = TIME_SLOTS_NORMAL_LIMITED;
    }

    const is23Dec = (dateStr === '2021-12-23' || dateStr === '2021-12-27' || dateStr === '2021-12-28' || dateStr === '2021-12-31' || dateStr === '2022-05-02' || dateStr === '2022-06-02' || dateStr === '2022-09-19' || dateStr === '2022-12-27' )
    if (is23Dec)
    {
        results = TIME_SLOTS_10_14;
    }




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
    return (holidays.find(element => dateformat(element,'yyyy-mm-dd') === dateformat(date,'yyyy-mm-dd')) ||  dateformat(date,'yyyy-mm-dd') < todayStr);
}



module.exports = {

    getHolidays: getHolidays,
    isWeekend: isWeekend,
    TIME_SLOTS_WEEKEND: TIME_SLOTS_WEEKEND,
    TIME_SLOTS_NORMAL: TIME_SLOTS_NORMAL,
    getDefaultTimeSlots: getDefaultTimeSlots
}