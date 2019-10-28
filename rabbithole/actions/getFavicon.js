const getFavicons = require("get-website-favicon")

module.exports = async url => {

  const data = await getFavicons(url)
  let icon;
  if (data.icons && data.icons[0] && data.icons[0].src) {
    icon = data.icons[0].src;
  }

  console.log("icon url: " + icon);
  return {
    icon
  }

}
