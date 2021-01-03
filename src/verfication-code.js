
const CreateRandomVerificationCode = () =>
{
    const random = getRandomArbitrary(104098, 978320)
    return `${random}`
}

function getRandomArbitrary(min, max) {
    return  parseInt(Math.random() * (max - min) + min);
}


module.exports = {
    CreateRandomVerificationCode: CreateRandomVerificationCode
}