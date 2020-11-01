const {ReferenceNumber} = require('../models/ReferenceNumber');

const getNewRef = async () =>
{
    var newRef = null;
    var error = true;
    var referenceNumber = null;

    while (error)
    {
        newRef = createNewRef();
        referenceNumber = new ReferenceNumber({refNo : newRef});
        try{
            await referenceNumber.save();
            error = false;
        }
        catch(err)
        {
            error = true;
        }
    }

    return newRef;
}

function createNewRef () 
{
    const rand1 = random(100,999);
    const rand2 = random(0,999);
    const rand3 = random(0,999);

    var rand1Str = `${rand1}`;
    var rand2Str = `${rand2}`;
    var rand3Str = `${rand3}`;

    if (rand2Str.length === 1)
    {
        rand2Str = `00${rand2Str}`
    }else if (rand2Str.length === 2)
    {
        rand2Str = `0${rand2Str}`
    }

    if (rand3Str.length === 1)
    {
        rand3Str = `00${rand3Str}`
    }else if (rand3Str.length === 2)
    {
        rand3Str = `0${rand3Str}`
    }
    
    return `${rand1Str}-${rand2Str}-${rand3Str}`;
}

function random(min, max){
    return Math.floor(Math.random() * (max - min + 1) ) + min; 
}

module.exports = getNewRef;