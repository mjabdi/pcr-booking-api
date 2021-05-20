const {GlobalParams} = require('./../../models/GlobalParams');

const getNewPatientID = async () =>
{
    const params = await GlobalParams.findOne({name:'lastPatientID'});
    if (!params)
    {
        const param = new GlobalParams(
            {
                name: "lastPatientID",
                lastExtRef: 521300
            }
        )
        await param.save()
        return `${param.lastExtRef}`
    }else
    {
        return `${params.lastExtRef + 1}`
    }
}

const increasePatientID = async () => {
    const params = await GlobalParams.findOne({name:'lastPatientID'});
    if (!params)
    {
        const param = new GlobalParams(
            {
                name: "lastPatientID",
                lastExtRef: 521300
            }
        )
        await param.save()
    }else
    {
        await GlobalParams.updateOne({name:'lastPatientID'}, {lastExtRef : params.lastExtRef + 1});
    }
}

module.exports = {
    getNewPatientID : getNewPatientID,
    increasePatientID: increasePatientID
}

