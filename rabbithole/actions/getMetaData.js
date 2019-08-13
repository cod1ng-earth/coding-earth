const getFavicons = require("get-website-favicon");

const getMetaData = url => {
  return getFavicons(url)
    .then(data => {
      let iconUrlFavicon;
      if (data.icons && data.icons[0] && data.icons[0].src) {
        iconUrlFavicon = data.icons[0].src;
      }
      console.log("ICON URL: " + iconUrlFavicon);
      return {
        iconUrlFavicon
      };
    })
    .catch(console.log);
};

module.exports = getMetaData;