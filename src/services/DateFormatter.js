


const FormatDateFromString = (str) =>
{
    if (!str)
        return ''
        
    return `${str.substr(8,2)}/${str.substr(5,2)}/${str.substr(0,4)}`;
}







module.exports = {
    FormatDateFromString : FormatDateFromString,
}