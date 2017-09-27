var spiritRest = {
    str: "spiritRest",
    timer: null,
    notification: new Notify('Spirit Rest', {
        icon: 'resources/spiritRest.png',
        body: 'Stop the spirit rest to start the cooldown!',
        notifyClose: onCloseNotification,
        timeout: 5
    })
};

var unitRefresh = {
    str: "unitRefresh",
    timer: null,
    notification: new Notify('Unit Refresh', {
        icon: 'resources/unitRefresh.png',
        body: 'New units has arrived!',
        notifyClose: onCloseNotification,
        timeout: 5
    })
};

var speedBoost = {
    str: "speedBoost",
    timer: null,
    notification: new Notify('Speed Boost', {
        icon: 'resources/speedBoost.png',
        body: 'Speed boost has run out, start a new one!',
        notifyClose: onCloseNotification,
        timeout: 5
    })
};

var notificationSounds = [
    new Howl({ src: ['resources/sound/beep.ogg'] }),
    new Howl({ src: ['resources/sound/dbz.wav'] }),
    new Howl({ src: ['resources/sound/seagulls.wav'] }),
    new Howl({ src: ['resources/sound/breathing.wav'] }),
    new Howl({ src: ['resources/sound/christmas.wav'] }),
    new Howl({ src: ['resources/sound/bells.ogg'] })
]

function setSound(obj) {
    localStorage.setItem(obj.str + "_sound", $("#" + obj.str + " .alertSound").val());
}

function setVolume(obj) {
    localStorage.setItem(obj.str + "_volume", $("#" + obj.str + " .volume").val())
}

function playSound(obj) {
    var idx = localStorage.getItem(obj.str + "_sound");
    Howler.volume(localStorage.getItem(obj.str + "_volume") / 100);
    notificationSounds[idx].play();
}


function onCloseNotification() {
    "use strict";
    
    notificationSound.stop();
}

function TimerUpdate(obj) {
    
    var start = localStorage.getItem(obj.str + "_start"),               //
        end = localStorage.getItem(obj.str + "_end"),                   //
        elapsed = Date.now() - new Date(start),                         // time that passed since the timer began
        remaining = new Date(end) - Date.now(),                         // time remaining until the timer stops
        percent = (1 - (new Date(elapsed) / new Date(new Date(end) - new Date(start)))) * 100,
        hours = Math.floor(remaining / 1000 / 60 / 60),                 //
        minutes = Math.floor(remaining / 1000 / 60) % 60,               //
        seconds = Math.floor(remaining / 1000) % 60,                    //
        newTimeStr = hours + "h " + minutes + "m " + seconds + "s ";    //
    
    //alert(percent);
    
    if (remaining < 0) {
        clearInterval(obj.timer);
        newTimeStr = "";
        percent = 100;
        $("#" + obj.str + " .value").css("background", "#050");
        
        notificationSound.play();
        /*
        if (!Notify.needsPermission) {
            obj.notification.show();
        }
        */
    }
    
    $("#" + obj.str + " .value").css("width", percent + "%");
    $("#" + obj.str + " .text").html(newTimeStr + Math.floor(percent) + "%");
    
    $("#" + obj.str + " .value").css("background", "#050");
}

function SetTimer(obj, time) {
    $("#spiritRest .value").animate({
        backgroundColor: "#005"
    }, 1000);
    
    localStorage.setItem(obj.str + "_start", Date.now());
    localStorage.setItem(obj.str + "_end", (time).minutes().fromNow());
    
    // Start a update method on 1s interval
    obj.timer = setInterval(function () { TimerUpdate(obj); }, 100);
}

function initialize(obj) {
    "use strict";
    
    // Get or set sound effect
	if (localStorage.getItem(obj.str + "_sound") === null) {
        localStorage.setItem(obj.str + "_sound", $("#" + obj.str + " .alertSound").val());
    } else {
        $("#" + obj.str + " .alertSound").val(localStorage.getItem(obj.str + "_sound"));
    }

    // Get or set volume slider
    if (localStorage.getItem(obj.str + "_volume") === null) {
        localStorage.setItem(obj.str + "_volume", $("#" + obj.str + " .volume").val());
    } else {
        $("#" + obj.str + " .volume").val(localStorage.getItem(obj.str + "_volume"));
    }

    // Get or set the time this timer ends
	if (localStorage.getItem(obj.str + "_end") === null) {
		obj.endTime = new Date(1970, 1, 1);
	} else {
		obj.endTime = localStorage.getItem(obj.str + "_end");
	}
	
    // Set the text and progress bar width
    if ((new Date(obj.endTime) - Date.now()) > 0) {
        obj.timer = setInterval(function () { TimerUpdate(obj); }, 100);
    } else {
        $("#" + obj.str + " .value").css("width", "100%");
        $("#" + obj.str + " .text").html("100%");
    }
}

function loadSettings() {
    "use strict";
    
    initialize(spiritRest);
    initialize(unitRefresh);
    initialize(speedBoost);
    //initialize(fake);
}

$(document).ready(function () {
    "use strict";
    
    loadSettings();

    if (Notify.needsPermission && Notify.isSupported()) {
		Notify.requestPermission();
	}
});
