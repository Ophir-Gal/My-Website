'use strict';

let lastX = null, lastY = null, recorder;

function main() {
    document.addEventListener('mousedown', 
        () => document.addEventListener('mousemove', processMousePosition));
    document.addEventListener('mouseup', stopProcessingMousePosition);
    recorder = new Recorder();
    setButtonListeners(recorder);
}

function setButtonListeners(recorder) {
    document.querySelector('#recStopButton').addEventListener('click',
        () => recorder.toggleRecStop());
    document.querySelector('#playPauseButton').addEventListener('click',
        () => recorder.togglePlayPause());
    document.querySelector('#saveButton').addEventListener('click',
        () => recorder.saveRecording());
    document.querySelector('#retrieveButton').addEventListener('click',
        () => recorder.retrieveSavedRecording());
    document.querySelector('#clearButton').addEventListener('click',
        () => recorder.clearScreen());
    document.querySelector('#downButton').addEventListener('mouseover', () => {
        let dl = document.querySelector('#downLink');
        dl.href = document.querySelector('#canvas').toDataURL("image/png");
    });
}

/** Handles mouse movement */
function processMousePosition(evt) {
    draw(evt.pageX, evt.pageY, getSelectedColor());
}

function stopProcessingMousePosition(){
    document.removeEventListener('mousemove', processMousePosition);
    detachPath();
}

function detachPath() {
    lastX = lastY = null;
}

function getSelectedColor() {
    return document.querySelector('#colorSelect').value;
}

/** Draws given xy coordinate on canvas element */
function draw(xPos, yPos, strokeColor) {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    xPos -= canvas.offsetLeft;  // Offset x coordinate
    yPos -= canvas.offsetTop;  // Offset y coordinate
    // draw at offeset position if has reference coordinate
    if (lastX){
        context.beginPath();
        context.moveTo(xPos, yPos);
        context.lineTo(lastX, lastY);
        context.strokeStyle = strokeColor;
        context.lineWidth = 3;
        context.stroke();
    }
    [lastX, lastY] = [xPos, yPos];
}

/**
 * Classes
 */

/** Singly Linked List */
class LinkedList {
    /** A constructor that takes a comparison function as parameter
     *  that is used to find elements in the list. The comparison function 
     *  should receive two data values and return a negative number, 0,
     *  or positive number to indicate order (like Java's comprator interface).
     */
    constructor(callBack) {
        this.head = null;
        this.tail = null;
        this.compare = callBack;
        this._size = 0;
    }

    /** Add element to the front of the list. */
    addToFront(data) {
        if (this.head) {
            this.head = {data:data, next:this.head};
        } else {
            this.head = this.tail = {data:data, next:null};
        }
        this._size++;
    } 

    /** Add element to the end of the list. */ 
    addToEnd(data) {
        if (this.tail) {
            this.tail.next = {data:data, next:null};
            this.tail = this.tail.next;
        } else {
            this.head = this.tail = {data:data, next:null};
        }
        this._size++;
    }

    /** Add element in the middle of the list. */
    addToMiddle(data) {
        if (this.head) {
            if (this.compare(data, this.head.data) < 0) {
                this.addToFront(data);
                return;
            } else {
                let prev = this.head;
                let curr = this.head.next;
                while (curr) {
                    if (this.compare(data, curr.data) < 0) {
                        prev.next = {data:data, next:curr};
                        this._size++;
                        return;
                    }
                    prev = curr;
                    curr = curr.next;
                }
                this.addToEnd(data);  // if gone thru entire list, append it
            }
        } else {
            this.addToEnd(data);
        }
    }

    /** Inserts data after a node that's assumed to be part of the list. 
     *  Returns the new node or null if given node was null.
    */
    addAfterNode(data, node) {
        if (node) {  // ensure node isn't null
            node.next = {data:data, next:node.next};
            this._size++;
            return node.next;
        }
        return null;
    }

    /** Find element (returns the object or null if not found)*/ 
    findElement(elem) {
        if (!elem) {
            return null;
        }
        let curr = this.head;
        while (curr) {
            if (this.compare(curr.data, elem.data) === 0) {
                return curr;
            }
            curr = curr.next;
        }
        return null;
    }

    /** Size of the list */
    size() {
        return this._size;
    }

    // for testing purposes
    toString() {
        let n = this.head;
        let s = '[';
        while(n) {
            s += String(n.data) + ', ';
            n = n.next;
        }
        return s + ']';
    } 
}


/** Singly Linked List */
class Recorder {
    constructor(){
        this.currentRec = null;
        this.currentFrame = null;
        this.timeVar = null;  // id variable for setInterval()
        this.state = 'stopped';
        this.pathStarter = this.startOnceGenerator();
        this.recsCount = 1;
    }

    /** BEGIN Record/Edit Handler Functions */
    recordMousePos = e => {
        let color = getSelectedColor();
        this.currentRec.addToEnd({x:e.pageX, y:e.pageY, color:color,
                                  start:this.pathStarter.next().value});
    };
    
    editMousePos = e => {
        let color = getSelectedColor();
        this.currentFrame = this.currentRec.addAfterNode(
            {x:e.pageX, y:e.pageY, color:color, start:this.pathStarter.next().value},
            this.currentFrame);
    };
    
    mouseDownHandlerRec = () => document.addEventListener('mousemove', this.recordMousePos);
    
    mouseUpHandlerRec = () => {
        document.removeEventListener('mousemove', this.recordMousePos);
        this.pathStarter = this.startOnceGenerator();
    };
    
    mouseDownHandlerEdit = () => document.addEventListener('mousemove', this.editMousePos);
    
    mouseUpHandlerEdit = () => {
        document.removeEventListener('mousemove', this.editMousePos);
        this.pathStarter = this.startOnceGenerator();
    };
    /** END Record/Edit handler functions */

    _setState(state) {
        document.querySelector('#state').innerHTML = state;
        if (state === 'recording' || state === 'editing') {
            let val = '<svg height="20" width="20" class="flickering"> \
                         <circle cx="10" cy="10" r="8" fill="red" /> \
                       </svg>' + state;
            document.querySelector('#state').innerHTML = val;
        }
        this.state = state;
    }

    *startOnceGenerator() {
        yield true;
        while (true) yield false;
    }
    
    startRecording() {
        this._setState('recording');
        document.querySelector('#playPauseButton').disabled = true;  // disable play/pause button
        this.currentRec = new LinkedList(() => null);
        document.addEventListener('mousedown', this.mouseDownHandlerRec);
        document.addEventListener('mouseup', this.mouseUpHandlerRec);
        document.querySelector('#recStopButton').innerHTML = '⬛ Stop Recording';
    }
    
    stopRecording() {
        this._setState('stopped');
        document.querySelector('#playPauseButton').disabled = false;  // enable play/pause button
        document.removeEventListener('mousedown', this.mouseDownHandlerRec);
        document.removeEventListener('mouseup', this.mouseUpHandlerRec);
        document.querySelector('#recStopButton').innerHTML = '🔴 Start Recording';
    }

    toggleRecStop() {
        if (this.state === 'stopped') {
            this.startRecording();
        } else if (this.state === 'playing' || this.state === 'paused'){
            if (confirm('Do you want to edit the recording?')) {
                this.pause();
                this.startEditing();
            }  // else, no processing will occur
        } else if (this.state === 'editing') {
            this.stopEditing();
        } else if (this.state === 'recording') {
            this.stopRecording();
        }
    }

    startEditing () {
        this._setState('editing');
        document.querySelector('#playPauseButton').disabled = true;  // disable play/pause button
        document.addEventListener('mousedown', this.mouseDownHandlerEdit);
        document.addEventListener('mouseup', this.mouseUpHandlerEdit);
        document.querySelector('#recStopButton').innerHTML = '⬛ Stop Recording';
    }

    stopEditing() {
        document.removeEventListener('mousedown', this.mouseDownHandlerEdit);
        document.removeEventListener('mouseup', this.mouseUpHandlerEdit);
        document.querySelector('#recStopButton').innerHTML = '🔴 Start Recording';
        document.querySelector('#playPauseButton').disabled = false;  // enable play/pause button
        // detach the added piece
        detachPath();
        this.currentFrame = this.currentFrame.next;
        if (this.currentFrame) { this.currentFrame.data.start = true; }
        // resume playback
        this.play();
    }

    togglePlayPause() {
        if (this.state === 'playing') {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        if (!this.currentRec) {
            alert('There is no available recording!');
        } else {
            document.querySelector('#speed').disabled = true;  // disable speed slider
            if (this.state !== 'paused' && this.state !== 'editing') {
                this.clearScreen();
            }
            this._setState('playing');
            document.querySelector('#playPauseButton').innerHTML = '<b>❚❚</b> Pause';
            this.currentFrame = this.currentFrame ? this.currentFrame : this.currentRec.head;
            let playbackSpeed = 20 / parseFloat(document.querySelector('#speed').value);
            this.timeVar = setInterval(this._playback, playbackSpeed);  // ms per frame
        }
    }

    _playback = () => {
        if (this.state !== 'paused') {
            if(this.currentFrame) {
                if (this.currentFrame.data.start) {
                    detachPath();
                } else {
                    draw(this.currentFrame.data.x, 
                         this.currentFrame.data.y, 
                         this.currentFrame.data.color);
                }
                this.currentFrame = this.currentFrame.next;
            } else {
                clearInterval(this.timeVar);
                this.currentFrame = null;
                stopProcessingMousePosition();
                document.querySelector('#playPauseButton').innerHTML = '▶ Play';
                this._setState('stopped');
                document.querySelector('#speed').disabled = false;  // enable speed slider
            }
        }
    }

    pause() {
        document.querySelector('#speed').disabled = false;  // enable speed slider
        this._setState('paused');
        clearInterval(this.timeVar);
        document.querySelector('#playPauseButton').innerHTML = '▶ Play';
        stopProcessingMousePosition();
    }
    
    saveRecording() {
        if (this.state === 'recording') {
            alert('Cannot save while recording!');
        } else {
            let recName = prompt("Save as:", `rec${this.recsCount}`);
            if (recName) {
                localStorage.setItem(recName, JSON.stringify(this.currentRec));
                alert(`\"${recName}\" was saved.`);
                this.recsCount++;
            }
        }
    }
    
    retrieveSavedRecording() {
        let recName = prompt("Enter name of recording:", `rec${this.recsCount-1}`);
        if (recName) {
            let result = JSON.parse(localStorage.getItem(recName));
            if (result) {
                this.currentRec = result;
                // Add Linked List methods to current recording object
                this.currentRec.__proto__ = LinkedList.prototype
                alert(`\"${recName}\" loaded successfully.`);
            } else {
                alert(`\"${recName}\" wasn't found.`);
            }
        }
    }
    
    clearScreen() {
        let oldCanvas = document.getElementById('canvas');
        let newCanvas = document.createElement('canvas');
        newCanvas.id = 'canvas';
        newCanvas.className = 'w3-container w3-cell box-shadow-3d   ';
        [newCanvas.width, newCanvas.height] = [600, 350];
        oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);
    }
}