var final_transcript = '';
var final_span = document.getElementById('final_span');
var interim_span = document.getElementById('interim_span');
var recognizing = false;
var ignore_onend = false;
var start_timestamp;

var getCurrentTime = _ => new Date().getTime(); // to not create the same sentence
var lastTime = getCurrentTime(); // to not create the same sentence
const MAX_TIME_DIFFERENCE = 800; // max milliseconds between each 2D word generation
var word_size = 0.01;
var space_between_words = 35;


if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = function() {
    recognizing = true;
    };

    recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
        //showInfo('info_no_speech');
        ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
        //showInfo('info_no_microphone');
        ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
        if (event.timeStamp - start_timestamp < 100) {
        //showInfo('info_blocked');
        } else {
        //showInfo('info_denied');
        }
        ignore_onend = true;
    }
    };

    recognition.onend = function() {
        recognizing = false;
    };

    recognition.onresult = function(event) {
        var interim_transcript = '';
        if (typeof(event.results) == 'undefined') {
            recognition.onend = null;
            recognition.stop();
            upgrade();
            return;
        }

        // ----------------------MY_CODE_START-------------------------
        final_transcript = ''; // erase what's been said from the top bar
        // ----------------------MY_CODE_END---------------------------

        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else{
                interim_transcript += event.results[i][0].transcript;
            }
            
            // -----------------------MY_CODE_START------------------------
            if (event.results[i].isFinal ||
                getCurrentTime() - lastTime > MAX_TIME_DIFFERENCE){
                lastTime = getCurrentTime();
                let sentence = event.results[i][0].transcript.trim().toUpperCase();
                let sentence_array = sentence.split(' ');
                let last_indent = -200;
                processVoiceCommands(sentence_array);
                // randomize initial indent
                last_indent += Math.floor(Math.random() * 400);
                // add all words in sentence
                for (let i=0; i<sentence_array.length; i++){
                    let word = sentence_array[i];
                    last_indent += word.length * 25 + space_between_words;
                    addBodyFromString(word, last_indent, word_size=word_size); 
                }
            }
            // ------------------------MY_CODE_END-------------------------
            
        }
        final_transcript = capitalize(final_transcript);
        final_span.innerHTML = linebreak(final_transcript);
        interim_span.innerHTML = linebreak(interim_transcript);
    };
}

function upgrade() {
    start_button.style.visibility = 'hidden';
    //showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
    return s.replace(first_char, function(m) { return m.toUpperCase(); });
}


function copyButton() {
    if (recognizing) {
    recognizing = false;
    recognition.stop();
    }
    copy_button.style.display = 'none';
    copy_info.style.display = 'inline-block';
}

function processVoiceCommands(sentence_array){
    let sentence_dict = {};
    for (let word of sentence_array){
        sentence_dict[word] = null;
    }

    if ('CHANGE' in sentence_dict && 'SIZE' in sentence_dict){
        if (word_size === 0.01){
            word_size = 0.02;
            space_between_words = 150;
        } else{
            word_size = 0.01;
            space_between_words = 50;
        }
    }
}

recognition.start();