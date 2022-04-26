

function setup() {
 console.log("Running");

 var button = select('#submit');
 button.mousePressed(submitWord);

 var buttonA = select('#analyze');
 buttonA.mousePressed(analyzeThis);

 
}

function submitWord(){
  var word = select('#word').value();
  var score = select('#score').value();
  console.log(word, score);
  //loadJSON is a GET request by default
  loadJSON('add/' + word + '/' + score, finishedAddingWord); //loadJSON is more of a GET, but we are using it as if it were POST
  function finishedAddingWord(data){
    console.log(data);
  }
    
}

function analyzeThis(){
  var txt = select('#textinput').value();
  var data = {
    text:txt
  }
  httpPost('analyze/', data, 'json', dataPosted, postErr);
}

function dataPosted(results){
  console.log(results);
}

function postErr(err){
  console.log(err);
}





  

