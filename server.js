console.log('Server is starting...');

//var words (we first hardcoded things in)
// now we have a json file that we can write to so that the data can persist even if the server goes down

var fs = require('fs'); //this already come with now, but to use it you much import/reference it
var data = fs.readFileSync('additional.json'); //this gets raw data, sync is blocking...the pgm will not run until the file is loaded
var additional = JSON.parse(data);
var afinnData = fs.readFileSync('afinn111.json'); //this gets raw data, sync is blocking...the pgm will not run until the file is loaded
var afinn = JSON.parse(afinnData);

var express = require('express'); //like an import statement, the whole package is a reference to a function
var app = express(); // execute express
var server = app.listen(3000, listening);

var bodyParser = require('body-parser'); 
var cors = require('cors');
function listening(){
    console.log("Listening...")
}
app.use(express.static('website'));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cores());

//create the GET request
// http://localhost:3000/index.html/flower
// this is a specific, hardcoded request
app.get('/index.html/sunflower', sendSunflower);
// every web transaction has two arguements
// the request arguement contains information about/frp, the client
// the response arguement contains information about/from the server
function sendSunflower(request, response){
  response.send("I love sunflowers too!");
}

//what if I want to have input, not just sunflowers, but any flower the user asks for
/* app.get('/index.html/search/:flower', sendFlower);
function sendFlower(request, response){
    var data = request.params;
    response.send("I love " + data.flower + " too!");
  } */

//------------------ "Database" example -------------------------//
app.get('/all', sendAll);
function sendAll(request, response){
    var data = {
        additional: additional,
        afinn: afinn
    }
    response.send(data); // automatically sent as in JSON format
}

app.post('/analyze', analyzeThis);
function analyzeThis(request, response){
    var txt = request.body.text;
    var words = txt.split(/\W+/);
    var totalScore = 0;
    var wordlist = [];
    for ( var i = 0; i < words.length; i++ ){
        var word = words[i];
        var score = 0;
      if (additional.hasOwnProperty(word)){
          score = Number(additional[word]);
          wordlist.push(
              {
                  word: word,
                  score: score
              }
          )
      }
      else if (afinn.hasOwnProperty(word)){
        score = Number(afinn[word]);
        wordlist.push(
            {
                word: word,
                score: score
            }
        )
    }
    totalScore += score;
    }

    var comp = totalScore/ words.length;
    var reply = {
        score: totalScore,
        comparative: comp,
        words: wordlist

    }
    response.send(reply);
}
// ? at the end of score makes it optional
// some error handling can be put...make score required
// this is more like a post request...we can make do with a GET because the data is small
// what if we had a huge paragraph...we dont want that in the URL
// or what about login/username? what about security
//POST above
app.get('/add/:word/:score?', addWord);
function addWord(request, response){
    var data = request.params;
    var word = data.word;
    var score = Number(data.score);
    
    var reply;
    if( !score){
    reply = {
        msg: "Score is required."
    };
    }
    else{
        additional[word] = score; //add the new word-score pair value into the "database" 
        var data = JSON.stringify(additional, null, 2);
        fs.writeFile('additional.json', data, finishedAddingWord); //ask yourself, what form does the data need to be in to be written to the file
        function finishedAddingWord(err){
            console.log("All set. ");
        }
        reply = {
            msg: "Thank you for your word."
        };
    }
    response.send(reply);
}
  
app.get('/search/:word', searchWords);
function searchWords(request, response){
    var word = request.params.word;
    var reply;
    if (words[word])
    {
        reply = {
            status: "found",
            word: word,
            score: words[word]
        };
    }
    else
    {
        reply = {
            status: "Not Fount",
        };
    }
    response.send(reply);
  }