const fs = require("fs")
const path = require("path")

const getParametersArray = (package) => {
    const file = fs.readFileSync(path.resolve(__dirname, `../../motdata/${mapPackageToFilename(package)}.json`)).toString()

    const json = JSON.parse(file)

    const data = json.data

    const params = data.map(item => {return {param: item.param, value: null}}  )


    return params
}

const getDescriptionForItem = (param, value, package) => {
    const file = fs.readFileSync(path.resolve(__dirname, `../../motdata/${mapPackageToFilename(package)}.json`)).toString()

    const json = JSON.parse(file)

    const data = json.data

    const found = data.find(item => item.param === param)

    if (found)
    {
        if (value === "low")
        {
            return {desc: found.desc, low: found.low} 
        }else if (value === "high")
        {
            return {desc: found.desc, high: found.high} 
        }else if (value === "inRange")
        {
            return {desc: found.desc, inRange: found.inRange} 
        }
    }

    return "N/A"
}


const mapPackageToFilename = (package) => 
{
  switch (package) {
    case "WOMEN'S HEALTH ELITE MOT":
      return "women_over_40_elite";

    default:
      return "women_over_40_elite";
  }
}


module.exports = {
    getParametersArray: getParametersArray,
    getDescriptionForItem: getDescriptionForItem
}