const getNewRef = require('./../src/services/refgenatator-service');


(async ()=>
{
    for (var i=0; i < 100; i++)
    {
        console.log(await getNewRef());
    }

})();