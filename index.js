//Initialize instance
var request = require("request");
var cheerio = require("cheerio");
var fs = require('fs');
var readline = require('readline');

// var requestUrl = "http://blogos.com/";
// var requestUrl2 = "http://voice-fleak.com/suwa-nanaka-profile/";


/*--- main process ---*/
var sourceURLcsv = process.argv[2];
HTMLSourceTextGet();




/*------ functions ------*/

function ListGet () {
  for (var i = 100; i < 200; i ++) {
    var requestUrl = "https://www.google.co.jp/search?q=%E6%9C%AC%E5%90%8D%E3%82%84%E6%81%8B%E4%BA%BA%E3%81%AF%EF%BC%9F&start="+ i +"0&"
    getUrls(requestUrl, grepURlsFromGoogle).then( function (result) {
      for (var j = 0; j < result.length; j ++) {
        var line = result[j] + "\n";
        fs.appendFileSync('scrapeURLList.csv', line ,'utf8');
      }
    });
  }
}

function SourceGet () {
  var rs = fs.createReadStream(sourceURLcsv);
  var rl = readline.createInterface(rs, {});

  rl.on('line', function(line) {
    getUrls(line, grepURls).then( function (result) {
      for (var j = 0; j < result.length; j ++) {
        var line = result[j] + "\n";
        fs.appendFileSync('scrapeSourceList2.csv', line ,'utf8');
      }
    });
  });  
}

function HTMLSourceGet () {
  var rs = fs.createReadStream(sourceURLcsv);
  var rl = readline.createInterface(rs, {});

  rl.on('line', function(line) {
    getUrls(line, returnHTML).then( function (result) {
      var let = result + "\n";
      fs.appendFileSync('scrapeHTMLsource.csv', let ,'utf8');
      
    });
  });  
}

function HTMLSourceTextGet () {
  var rs = fs.createReadStream(sourceURLcsv);
  var rl = readline.createInterface(rs, {});

  // rl.on('line', function(line) {
    getUrls("http://muutnet.com/category/%e3%82%b9%e3%83%9d%e3%83%bc%e3%83%84", grepContents).then( function (result) {
      // var let = result + "\n";
      // fs.appendFileSync('scrapeHTMLsource.csv', let ,'utf8');
      
    });
  // });  
}

function LFCut () {
  var rs = fs.createReadStream(sourceURLcsv);
  var rl = readline.createInterface(rs, {});

  rl.on('line', function(line) {
    getUrls(line, returnHTML).then( function (result) {
      var let = result.replace("¥", "");
      fs.appendFileSync('scrapeHTMLsource2.csv', let ,'utf8');
      
    });
  });  
}



function getUrls(requestURL, grepFunc) {
  return new Promise( function (resolve, reject) {
    request({ url: requestURL }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        
        $ = cheerio.load(body); // Create cheerio instance

        // Get response data
        var url = response.request.href;
        var title = $("title").text();
        // console.log(url);
        // console.log(title);

        var responseUrls = grepFunc();
      } else {    
        if (error && "code" in error) {
          console.log("Error Code:" + error.code);
        }
        if (error && "errno" in error) {
          console.log("Error No:" + error.errno);
        }
        if (error && "syscall" in error) {
          console.log("Error Syscall:" + error.syscall);
        }
        if (response && "statusCode" in response) {
          console.log("Status Code:" +  response.statusCode);
        }
      }
      resolve(responseUrls);
    });
  });
} 

function grepURlsFromGoogle () {
  var ret = [];
  $("a").each(function(i, elem) {
    var urlgrep = $(elem).attr("href").match(/\q\=.+?\&/);
    if (urlgrep) {
      if( /http\:/.test(urlgrep[0]) && !/webcache/.test(urlgrep[0]) ) {
        ret.push(urlgrep[0].replace("q=", "").replace("&", ""));
      }
    }
    // ret.push(elem);
    // console.log(i + ': ' + elem.name);
  });
  return ret;
}

function grepURls () {
  var ret = [];
  $("a").each(function(i, elem) {
    var urlgrep = $(elem).attr("href");
    if (urlgrep) {
      if( /http\:/.test(urlgrep) && !/webcache/.test(urlgrep) ) {
        ret.push(urlgrep);
      }
    }
    // console.log(i + ': ' + elem.name);
  });
  return ret;
}

function grepContents () {
  var ret = [];
    console.log($.text());
    //console.log($(".desc").text());
    // console.log(i + ': ' + elem.name);
  return ret;
}

function returnHTML () {
  return $.html();
}



