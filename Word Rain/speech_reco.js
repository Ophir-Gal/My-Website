var final_transcript = '';
var final_span = document.getElementById('final_span');
var interim_span = document.getElementById('interim_span');
var recognizing = false;
var ignore_onend = false;
var start_timestamp;
var recognition;

var getCurrentTime = _ => new Date().getTime(); // to not create the same sentence
var lastTime = getCurrentTime(); // to not create the same sentence
var min_time_difference = 600; // max milliseconds between each 2D word generation
var word_size = 0.01;
var space_between_words = 35;
var bounciness = 0.4;
var randomSizesFlag = false;
var colors = ['#004cff','#517dc9','#665191','#a05195', '#d45087',
              '#f95d6a','#ff7c43','#ffa600'];

const all_colors = ["#000000","#FFFF00","#1CE6FF","#FF34FF","#FF4A46",
"#008941","#006FA6","#A30059","#FFDBE5","#7A4900","#0000A6","#63FFAC",
"#B79762","#004D43","#8FB0FF","#997D87","#5A0007","#809693","#FEFFE6",
"#1B4400","#4FC601","#3B5DFF","#4A3B53","#FF2F80","#61615A","#BA0900",
"#6B7900","#00C2A0","#FFAA92","#FF90C9","#B903AA","#D16100","#DDEFFF",
"#000035","#7B4F4B","#A1C299","#300018","#0AA6D8","#013349","#00846F",
"#372101","#FFB500","#C2FFED","#A079BF","#CC0744","#C0B9B2","#C2FF99",
"#001E09","#00489C","#6F0062","#0CBD66","#EEC3FF","#456D75","#B77B68",
"#7A87A1","#788D66","#885578","#FAD09F","#FF8A9A","#D157A0","#BEC459",
"#456648","#0086ED","#886F4C","#34362D","#B4A8BD","#00A6AA","#452C2C",
"#636375","#A3C8C9","#FF913F","#938A81","#575329","#00FECF","#B05B6F",
"#8CD0FF","#3B9700","#04F757","#C8A1A1","#1E6E00","#7900D7","#A77500",
"#6367A9","#A05837","#6B002C","#772600","#D790FF","#9B9700","#549E79",
"#FFF69F","#201625","#72418F","#BC23FF","#99ADC0","#3A2465","#922329",
"#5B4534","#FDE8DC","#404E55","#0089A3","#CB7E98","#A4E804","#324E72",
"#6A3A4C","#83AB58","#001C1E","#D1F7CE","#004B28","#C8D0F6","#A3A489",
"#806C66","#222800","#BF5650","#E83000","#66796D","#DA007C","#FF1A59",
"#8ADBB4","#1E0200","#5B4E51","#C895C5","#320033","#FF6832","#66E1D3",
"#CFCDAC","#D0AC94","#7ED379","#012C58","#7A7BFF","#D68E01","#353339",
"#78AFA1","#FEB2C6","#75797C","#837393","#943A4D","#B5F4FF","#D2DCD5",
"#9556BD","#6A714A","#001325","#02525F","#0AA3F7","#E98176","#DBD5DD",
"#5EBCD1","#3D4F44","#7E6405","#02684E","#962B75","#8D8546","#9695C5",
"#E773CE","#D86A78","#3E89BE","#CA834E","#518A87","#5B113C","#55813B",
"#E704C4","#00005F","#A97399","#4B8160","#59738A","#FF5DA7","#F7C9BF",
"#643127","#513A01","#6B94AA","#51A058","#A45B02","#1D1702","#E20027",
"#E7AB63","#4C6001","#9C6966","#64547B","#97979E","#006A66","#391406",
"#F4D749","#0045D2","#006C31","#DDB6D0","#7C6571","#9FB2A4","#00D891",
"#15A08A","#BC65E9","#FFFFFE","#C6DC99","#203B3C","#671190","#6B3A64",
"#F5E1FF","#FFA0F2","#CCAA35","#374527","#8BB400","#797868","#C6005A",
"#3B000A","#C86240","#29607C","#402334","#7D5A44","#CCB87C","#B88183",
"#AA5199","#B5D6C3","#A38469","#9F94F0","#A74571","#B894A6","#71BB8C",
"#00B433","#789EC9","#6D80BA","#953F00","#5EFF03","#E4FFFC","#1BE177",
"#BCB1E5","#76912F","#003109","#0060CD","#D20096","#895563","#29201D",
"#5B3213","#A76F42","#89412E","#1A3A2A","#494B5A","#A88C85","#F4ABAA",
"#A3F3AB","#00C6C8","#EA8B66","#958A9F","#BDC9D2","#9FA064","#BE4700",
"#658188","#83A485","#453C23","#47675D","#3A3F00","#061203","#DFFB71",
"#868E7E","#98D058","#6C8F7D","#D7BFC2","#3C3E6E","#D83D66","#2F5D9B",
"#6C5E46","#D25B88","#5B656C","#00B57F","#545C46","#866097","#365D25",
"#252F99","#00CCFF","#674E60","#FC009C","#92896B"];

if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    startRecognition();
}

function startRecognition(){
    recognition = new webkitSpeechRecognition();
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

    // what to do when done recognizing
    recognition.onend = function() {
        recognizing = false;
        recognition.start();
    };

    // what to do when recognized words
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
                getCurrentTime() - lastTime > min_time_difference){
                lastTime = getCurrentTime();
                let sentence = event.results[i][0].transcript.trim().toUpperCase();
                let sentence_array = sentence.split(' ');
                let last_indent = -200;
                if (event.results[i].isFinal) processVoiceCommands(sentence_array);
                // randomize initial indent
                last_indent += Math.floor(Math.random() * 400);
                // add all words in sentence
                for (let i=0; i<sentence_array.length; i++){
                    let word = sentence_array[i];
                    last_indent += word.length * 25 + space_between_words;
                    addBodyFromString(word, last_indent, word_size, bounciness,
                                      colors, randomSizesFlag);
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
    // display upgrade message
    alert("This application requires Google Chrome 25 or later.")
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

function processVoiceCommands(sentence_array){

    if ((sentence_array.includes('BIG') ||
         sentence_array.includes('LARGE') ||
         sentence_array.includes('BIGGER')) &&
        sentence_array.includes('WORDS')){
        word_size = 0.02;
        space_between_words = 150;
    } else if ((sentence_array.includes('SMALL') ||
         sentence_array.includes('SMALLER')) &&
        sentence_array.includes('WORDS')){
        word_size = 0.01;
        space_between_words = 50;
    }

    if (sentence_array.includes('MORE') &&
        sentence_array.includes('BOUNCY')){
        bounciness = 0.99;
    } else if (sentence_array.includes('LESS') &&
        sentence_array.includes('BOUNCY')){
        bounciness = 0.4;
    }
    
    if (sentence_array.includes('CHANGE') &&
        sentence_array.includes('COLORS')){
        let randIdx = Math.floor(Math.random() * all_colors.length);
        colors = all_colors.slice(randIdx, randIdx+colors.length);
    } else if (sentence_array.includes('RESET') &&
        sentence_array.includes('COLORS')){
        colors = ['#004cff','#517dc9','#665191','#a05195', '#d45087',
                  '#f95d6a','#ff7c43','#ffa600'];
    }
    
    if (sentence_array.includes('ZERO') &&
        sentence_array.includes('GRAVITY')){
        world.gravity.scale = 0.00001;
    } else if (sentence_array.includes('NORMAL') &&
        sentence_array.includes('GRAVITY')){
        world.gravity.scale = 0.001;
    } else if (sentence_array.includes('STRONG') &&
        sentence_array.includes('GRAVITY')){
        world.gravity.scale = 0.01;
    }

    if (sentence_array.includes('LESS') &&
        sentence_array.includes('RESPONSIVE')){
        if (min_time_difference < 1000){
            min_time_difference += 200;
        }
    } else if (sentence_array.includes('MORE') &&
               sentence_array.includes('RESPONSIVE')){
        if (min_time_difference > 200){
            min_time_difference -= 200;
        }
    } else if (sentence_array.includes('RESET') &&
               sentence_array.includes('RESPONSIVENESS')){
        min_time_difference = 600;
    }
    
    if ((sentence_array.includes('RESET') &&
        sentence_array.includes('EVERYTHING')) ||
        sentence_array.includes('REFRESH')){
        location.reload();
    }

    if (sentence_array.includes('CLEAR') &&
        sentence_array.includes('WORLD')){
        World.clear(world, true);
    }

    if (sentence_array.includes('START') &&
        (sentence_array.includes('EXPLOSIONS') ||
         sentence_array.includes('EXPLODING'))){
        explosionActivated = true;
    } else if (sentence_array.includes('STOP') &&
               (sentence_array.includes('EXPLOSIONS') ||
                sentence_array.includes('EXPLODING'))){
        explosionActivated = false;
    }

    if (sentence_array.includes('EQUAL') &&
        sentence_array.includes('SIZES')){
        randomSizesFlag = false;
        word_size = 0.01;
        space_between_words = 50;
    } else if (sentence_array.includes('RANDOM') &&
               sentence_array.includes('SIZES')){
        randomSizesFlag = true;
        space_between_words = 200;
    }

    if (sentence_array.includes('START') &&
        sentence_array.includes('SHRINKING')){
        // start shrinkage
    } else if (sentence_array.includes('STOP') &&
               sentence_array.includes('SHRINKING')){
        // stop shrinkage
    }
}

recognition.start();

// TODO - add command for START/STOP SHRINKAGE 
