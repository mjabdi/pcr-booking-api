const fs = require("fs")
const path = require("path")

const getParametersArray = (package) => {
    const file = fs.readFileSync(path.resolve(__dirname, `../../motdata/${mapPackageToFilename(package)}.json`)).toString()

    const json = JSON.parse(file)

    const data = json.data

    const params = data.map(item => {return {param: item.param, value: null}}  )


    return params
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
    getParametersArray: getParametersArray
}