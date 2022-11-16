let Parser = require('rss-parser');
let parser = new Parser({
        timeout: 5000,
        headers: {'User-Agent': 'Dominic Carroll dom@dominiccarroll.com'}
    });

(async () => {

    let url = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&CIK=&type=&company=&dateb=&owner=include&start=0&count=40&output=atom";
    let feed = await parser.parseURL(url);

    return feed.title;

})().then(
    (value) => {
        console.log("Returned: " + value);
    },
    (error) => {
        if (error) {
            console.log("error: " + error);
        }
    }
)