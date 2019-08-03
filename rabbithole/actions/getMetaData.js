const getFavicons = require('get-website-favicon')


const getMetaData = async url => {
  getFavicons(url).then(data => {
    const iconUrlFavicon = data.icons ? data.icons[0].src : null;
    console.log("ICON URL: " + iconUrl);
    return {
      iconUrlFavicon,
    };
  });
};

module.exports = getMetaData;
