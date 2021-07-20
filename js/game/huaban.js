// place your javascript code here

'use strict';

/* ------------||----------------------------------------------||-------------------------- */
/* ------------||-----------------Linked-List------------------||-------------------------- */
/* ------------\/----------------------------------------------\/-------------------------- */

class Node {
    constructor(val) {
        this.value = val;
        this.next = null;
    }
}


class LinkedList {
    constructor() {
        this.length = 0;
        this.head = null;
    }

    addToFront(data) {
        let fNode = new Node(data);

        if (this.head === null) {
            this.head = fNode;
        } else {
            fNode.next = this.head;
            this.head = fNode;
        }
        this.length++;
    }

    addToMid(element, index) {
        if (index < 0 || index > this.size()) {
            return alert("You enter a valid index.");
        }
        else {
            var mNode = new Node(element);
            var temp, prev;

            temp = this.head;

            if (index == 0) {
                mNode.next = this.head;
                this.head = mNode;
            } else {
                temp = this.head;
                var it = 0;

                while (it < index) {
                    it++;
                    prev = temp;
                    temp = temp.next;
                }
                mNode.next = temp;
                prev.next = mNode;
            }
            this.size++;
        }
    }

    addToEnd(data) {
        let eNode = new Node(data);

        if (!this.head) {
            this.head = eNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = eNode;
        }
        this.length++;
    }

    serchEle(item) {
        let sCurrNode = this.head;
        while (sCurrNode.value !== item) {
            sCurrNode = sCurrNode.next;
        }
        return sCurrNode;
    }

    getList() {
        let current = this.head;
        let getEle = new Array();
        while (current.next) {
            getEle.push(current.value);
            current = current.next;
        }
        getEle.push(current.value);
        return getEle;
    }

    size() {
        return this.length;
    }

}

/* ------------||----------------------------------------------||-------------------------- */
/* ------------||--------------Initialize Canvas---------------||-------------------------- */
/* ------------\/----------------------------------------------\/-------------------------- */

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

init();

ctx.fillStyle = "#FFFAF0";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let painting = false;
let recSta = false;
let isRetrieve = false;
let chooseColor;
let retrieveData;

let list = new LinkedList();
let startPoint = { x: undefined, y: undefined };

function init() {
    canvas.width = 600;
    canvas.height = 450;
}

class Recorder {

    constructor(data) {
        this.mouseEvent();
    }

    /* ------------||----------------------------------------------||-------------------------- */
    /* ------------||----------------Mouse Event-------------------||-------------------------- */
    /* ------------\/----------------------------------------------\/-------------------------- */

    mouseEvent() {

        canvas.onmousedown = function (e) {
            chooseColor = document.getElementById('color').value;
            ctx.strokeStyle = chooseColor
            let x = e.offsetX;
            let y = e.offsetY;
            painting = true;
            startPoint = { x: x, y: y, color: chooseColor };
        };

        document.onmousemove = function (e) {
            let x = e.offsetX;
            let y = e.offsetY;
            let newPoint = { x: x, y: y };
            if (painting) {
                rec.drawLine(startPoint.x, startPoint.y, newPoint.x, newPoint.y, chooseColor);

                /* save mouse track to Linked-List */
                if (recSta) {
                    let pointArr = [startPoint.x, startPoint.y, newPoint.x, newPoint.y, chooseColor];
                    list.addToEnd(pointArr);
                }
            }
            startPoint = newPoint;
        }

        document.onmouseup = function () {
            painting = false;
        };
    }

    /* ------------||----------------------------------------------||-------------------------- */
    /* ------------||--------------Drawing Function----------------||-------------------------- */
    /* ------------\/----------------------------------------------\/-------------------------- */

    drawLine(xStart, yStart, xEnd, yEnd, Col) {

        ctx.beginPath();
        ctx.strokeStyle = Col;
        ctx.lineWidth = 2;
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();
        ctx.closePath();
    }

    async rePlayDraw(listData) {
        let xS, xE, yS, yE, co, j;
        for (let i = 0; i < listData.length; i++) {
            j = 0;
            xS = listData[i][j];
            yS = listData[i][j + 1];
            xE = listData[i][j + 2];
            yE = listData[i][j + 3];
            co = listData[i][j + 4];

            rec.drawLine(xS, yS, xE, yE, co);

            await rec.sleep(20);
        }
        document.getElementById('stat').innerHTML = 'Ready';
    }

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    /* ------------||----------------------------------------------||-------------------------- */
    /* ------------||---------------Recorder Class-----------------||-------------------------- */
    /* ------------\/----------------------------------------------\/-------------------------- */

    stratRecording() {
        ctx.fillStyle = "#FFFAF0";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        recSta = true;

    }

    stopRecording() {
        recSta = false;
    }

    play() {
        let p = confirm("Are you sure you want to play save recording?\n(This will clear current canvas.)");
        if (p == true) {
            document.getElementById('stat').innerHTML = 'Playing recording...'
            /* clear screen */
            ctx.fillStyle = "#FFFAF0";
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            /* re-play and dely */
            /* re-play from Recording or Retrieve_Recording */
            if (isRetrieve) {
                rec.rePlayDraw(retrieveData);
            } else if (list.size() === 0) {
                alert("You have not recording anythin!\nPlease start recording first.");
                document.getElementById('stat').innerHTML = 'Ready';
            } else {
                let orgData = list.getList();
                rec.rePlayDraw(orgData);
            }

        } else {
            document.getElementById('stat').innerHTML = 'Ready';
        }
    }

    saveRecording() {
        /* use localStorage to save Linked-List  */
        const drowData = list.getList();
        const drowDataJSON = JSON.stringify(drowData);
        window.localStorage.setItem("drowList", drowDataJSON)   /* Name: drowList */
    }

    retrieveRecording() {
        isRetrieve = true;

        /* callback localStorage */
        let callData = localStorage.getItem("drowList");
        retrieveData = JSON.parse(callData);
    }


    clearCanvas() {
        let c = confirm("Clearing the canvcas will wipe any current recordings (in progress)");
        if (c == true) {
            ctx.fillStyle = "#FFFAF0";
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            document.getElementById('stat').innerHTML = 'Ready';
        }

    }
}

let rec = new Recorder();

