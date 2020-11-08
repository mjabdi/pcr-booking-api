function NormalizeTime(str)
{
    var hour = parseInt(str.substr(0,2));
    const minutesStr = str.substr(3,2);
    const isPM = str.toLowerCase().indexOf('pm') > 0;

    if (isPM && hour < 12)
    {
        hour += 12;
    }

    if (!isPM && hour === 12)
    {
        hour = 0;
    }

    var hourStr = `${hour}`;
    if (hourStr.length < 2)
        hourStr = `0${hourStr}`;

    return `${hourStr}:${minutesStr}`;    
}

const time = "01:30 AM";

console.log(NormalizeTime(time));