const request = require('request');

let Parser = require('rss-parser');
let parser = new Parser({
        timeout: 5000,
        headers: {'User-Agent': 'Dominic Carroll dom@dominiccarroll.com'}
    });

let keywordScores = {
    ["licensing agreement"]: 0.99,
    ["license agreement"]: 0.99,
    ["upfront fee"]: 0.9,
    ["milestone payment"]: 0.9,
    ["milestone payments"]: 0.9,
    ["patent"]: 0.7,
    ["intellectual property"]: 0.7,
    ["upfront"]: 0.7,
    ["milestone"]: 0.7
}


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    let output = '';
    let filingsIndex = [0, 40]
    

    // iterate through feed pages
    for (var i = 0; i < 20; i++) {
        let url = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&CIK=&type=8-k&company=&dateb=&owner=include&start=" + filingsIndex[0] + "&count=" + filingsIndex[1] + "&output=atom";
        let feed = await parser.parseURL(url);
        console.log('new page');
        for (let item of feed.items) {
            let textUrl = item.link.replace('-index.htm', '.txt');
            let requestOptions = {
                url: textUrl,
                headers: {
                    'User-Agent': 'Dominic Carroll dom@dominiccarroll.com'
                }
            }
            request(requestOptions, function (error, response, body) { //https://www.npmjs.com/package/request#custom-http-headers
                let wordEntries = Object.entries(keywordScores);
                let score = 1;
                for (let [wordKey, wordValue] of wordEntries) {
                    if (body.toLowerCase().includes(wordKey)) {
                        score = score * (1 + wordValue);
                    }
                }

                console.log("Score: " + score + "      Link: " + textUrl);
            });
            await timeout(500);
        }
        
        // New page
        filingsIndex[0] = filingsIndex[0] + 41;
        filingsIndex[1] = filingsIndex[1] + 40;


    }
    

    return output;

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