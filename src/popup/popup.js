document.addEventListener('DOMContentLoaded', () => {
    inputFormatting();
    loadData();
    addEventListeners();
    disableEnableInput();
});

const loadData = () => {
    chrome.storage.sync.get(['thresholdMinutes'], (value) => {
        $('#thresholdMinutes').val(value.thresholdMinutes);
    });
    chrome.storage.sync.get(['notifySound'], (value) => {
        $('#notifySound').prop('checked', value.notifySound);
    });
    chrome.storage.sync.get(['notifyMessage'], (value) => {
        $('#notifyMessage').prop('checked', value.notifyMessage);
    });
}

const addEventListeners = () => {
    $('#thresholdMinutes').on('change', (event) => {
        chrome.storage.sync.set({ thresholdMinutes: event.target.valueAsNumber });
    });
    $('#notifySound').on('click', (event) => {
        chrome.storage.sync.set({ notifySound: event.target.checked });
        disableEnableInput();
    });
    $('#notifyMessage').on('click', (event) => {
        chrome.storage.sync.set({ notifyMessage: event.target.checked });
        disableEnableInput();
    });
    $('#showMessage').on('click', (event) => {
        const connection = chrome.runtime.connect({ name: "show-message" });
        connection.disconnect();
    });
    $('#playSound').on('click', (event) => {
        const connection = chrome.runtime.connect({ name: "play-audio" });
        connection.disconnect();
    });
}


async function disableEnableInput() {
    const notifySound = (await getValueFromStorage('notifySound')).notifySound;
    const notifyMessage = (await getValueFromStorage('notifyMessage')).notifyMessage;

    if(!notifySound && !notifyMessage) {
        $('#thresholdMinutes').prop('disabled', true);
    } else {
        $('#thresholdMinutes').prop('disabled', false);
    }
}


const inputFormatting = () => {
    let valueBefore;
    $('#thresholdMinutes').on('input', (e) => {
        if(e.target.valueAsNumber > 1000) {
            $('#thresholdMinutes').val(valueBefore);
        } else {
            valueBefore = e.target.valueAsNumber;
        }
    });
    $('#thresholdMinutes').on('keydown', (e) => {
        if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) 
        || e.keyCode === 8 || e.keyCode === 39 || e.keyCode === 37)) {
            return false;
        }
        valueBefore = e.target.valueAsNumber;
        
    });
}

async function getValueFromStorage(key) {
    const value = new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], (value) => resolve(value));
    });
    return await value;
}