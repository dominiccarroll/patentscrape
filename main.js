const request = require('request');

let Parser = require('rss-parser');
let parser = new Parser({
        timeout: 5000,
        headers: {'User-Agent': 'Dominic Carroll dom@dominiccarroll.com'}
    });


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
            request(requestOptions, function (error, response, body) {
                // console.error('error:', error); 
                // console.log('statusCode:', response && response.statusCode);
                let foo = 'no';
                if (body.toLowerCase().includes('license')) {       // HAVE A WEIGHTED SCORE WITH VARIOUS KEYWORDS AND SCORE WILL BE PROBABILITY(IS IP LICENSE)
                    foo = textUrl;
                }
                console.log(foo); 
            });
            await timeout(1000);
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