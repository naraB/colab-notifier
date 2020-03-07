chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ thresholdMinutes: 15, notifySound: true, notifyMessage: true });
});

let audio = new Audio('./assets/sounds/zapsplat.mp3');


function showFinishedCellNotification(runtime) {
    let timestamp = new Date().getTime();
    let notificationOptions = {
        type: 'basic',
        title: 'Your Colab cell finished running!',
        message: 'Runtime: ' + msToTime(runtime),
        iconUrl: './assets/icons/icon-128px.png'
    }
    chrome.notifications.create('id ' + timestamp, notificationOptions);
}

function playFinishedCellAudio() {
    audio.play()
}

async function getValueFromStorage(key) {
    const value = new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], (value) => resolve(value));
    });
    return await value;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    finishedRunning(message).then(sendResponse);
    return true;
});

async function finishedRunning(message) {

    const thresholdMs = parseInt((await getValueFromStorage('thresholdMinutes')).thresholdMinutes) * 60000;
    const notifySound = (await getValueFromStorage('notifySound')).notifySound;
    const notifyMessage = (await getValueFromStorage('notifyMessage')).notifyMessage;

    if(isNaN(thresholdMs)) {
        thresholdMs = 15 * 60000;
    }

    if (message.runtimeMs >= thresholdMs) {
        if (notifySound) {
            playFinishedCellAudio();
        }
        if (notifyMessage) {
            showFinishedCellNotification(message.runtimeMs);
        }
        return (true);
    }
    return (false);
}

function msToTime(duration) {
    if (!duration) {
        return '42';
    }
    let milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : Math.floor(seconds);

    return hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
}
