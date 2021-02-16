const {User} = require('./../models/User');

const uuid = require('uuid-random');
const { UserEmailMap } = require('./../models/UserEmailMap');

const CreatePortalLink = async (email, fullname) =>
{
    let targetPortal = `https://londonmedicalclinic.co.uk/medicalexpressclinic/patient`;
    const butonStylePortal = `box-shadow: 0px 1px 0px 0px #f0f7fa;background:linear-gradient(to bottom, #3cc9e8 5%, #00a1c5  100%);background-color:#3cc9e8;border-radius:6px;border:1px solid #3cc9e8;display:inline-block;cursor:pointer;color:#ffffff;font-family:Arial;font-size:15px;font-weight:bold;padding:6px 24px;text-decoration:none;text-shadow:0px -1px 0px #5b6178;`

    try{
        const user = await User.findOne({email : email.trim().toLowerCase()})
        if (!user)
        {
            const usermapping = await UserEmailMap.findOne({email: email.trim().toLowerCase()})
            if (usermapping)
            {
                targetPortal = `https://londonmedicalclinic.co.uk/medicalexpressclinic/patient/rapidsignup?token=${usermapping.refNo}`
            }else
            {
                const refNo = `${uuid()}${uuid()}`
                const newUserMap = UserEmailMap(
                    {
                        refNo: refNo,
                        email: email.trim().toLowerCase(),
                        fullname: fullname
                    }
                )

                await newUserMap.save()
                targetPortal = `https://londonmedicalclinic.co.uk/medicalexpressclinic/patient/rapidsignup?token=${refNo}`
            }
        }
    }catch(err)
    {
        console.log(err)
    }


    let content = ''

    content += '<p> You can always view, modify or cancel your appointments and results in our patient’s portal :'
    content += ` <a href="${targetPortal}" style="${butonStylePortal}" target="_blank"> Enter Patients Portal </a></p>`;

    return content

}

module.exports = CreatePortalLink