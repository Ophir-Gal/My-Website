var final_transcript = '';
var final_span = document.getElementById('final_span');
var interim_span = document.getElementById('interim_span');
var recognizing = false;
var ignore_onend = false;
var start_timestamp;

var last_sentence = null; // to not create the same sentence

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
        final_transcript = ''; // erase what's been said
        // ----------------------MY_CODE_END---------------------------

        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
                // -----------------------MY_CODE_START------------------------
                let sentence = event.results[i][0].transcript.trim().split(' ');
                console.log(sentence);
                let last_indent = 0;
                // randomize initial indent
                last_indent += Math.floor(Math.random() * 200 + 50);
                // add all words in sentence
                for (let i=0; i<sentence.length; i++){
                    let word = sentence[i].toUpperCase();
                    last_indent += word.length * 25 + 35;
                    addBodyFromString(word, last_indent); 
                }
                // ------------------------MY_CODE_END-------------------------
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
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

recognition.start();