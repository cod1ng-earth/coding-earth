const getFavicons = require('get-website-favicon')


const getMetaData = async url => {
  getFavicons(url).then(data => {
    const iconUrlFavicon = data.icons ? data.icons[0].src : null;
    console.log("ICON URL: " + iconUrlFavicon);
    return {
      iconUrlFavicon,
    };
  }).catch(console.log);
};

module.exports = getMetaData;
