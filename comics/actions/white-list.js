const whiteListDomains = new Map();
whiteListDomains.set('www.monkeyuser.com', () => {
    console.log('Monkey user works');
});

module.exports = whiteListDomains;