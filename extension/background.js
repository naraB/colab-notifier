chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ thresholdMinutes: 15, notifySound: true, notifyMessage: true });
});

let audio = new Audio('./assets/sounds/zapsplat.mp3');


function showFinishedCellNotification() {
    let timestamp = new Date().getTime();
    let notificationOptions = {
        type: 'basic',
        title: 'Your Colab cell finished running!',
        message: 'Check it out',
        iconUrl: './assets/icons/round-check-circle-outline.svg'
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


    if (message.runtimeMs >= thresholdMs) {
        if (notifySound) {
            playFinishedCellAudio();
        }
        if (notifyMessage) {
            showFinishedCellNotification();
        }
        return (true);
    }
    return (false);
}
