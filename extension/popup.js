document.addEventListener('DOMContentLoaded', () => {
    console.log("Hello");
    preventNegativeNumbers();
    loadData();
    addEventListeners();
    disableEnableInput();
});

const loadData = () => {
    chrome.storage.sync.get(['thresholdMinutes'], (value) => {
        $('#thresholdMinutes').val(value.thresholdMinutes);
    });
    chrome.storage.sync.get(['notifySound'], (value) => {
        $('#notifySound').prop("checked", value.notifySound);
    });
    chrome.storage.sync.get(['notifyMessage'], (value) => {
        $('#notifyMessage').prop("checked", value.notifyMessage);
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
    $("#showMessage").on('click', (event) => {
        chrome.extension.getBackgroundPage().showFinishedCellNotification();
    });
    $("#playSound").on('click', (event) => {
        chrome.extension.getBackgroundPage().playFinishedCellAudio();
    });
}


async function disableEnableInput() {
    const notifySound = (await chrome.extension.getBackgroundPage().getValueFromStorage('notifySound')).notifySound;
    const notifyMessage = (await chrome.extension.getBackgroundPage().getValueFromStorage('notifyMessage')).notifyMessage;

    if(!notifySound && !notifyMessage) {
        $('#thresholdMinutes').prop("disabled", true);
    } else {
        $('#thresholdMinutes').prop("disabled", false);
    }
}


const preventNegativeNumbers = () => {
    $('#thresholdMinutes').on('keydown', (e) => {
        if (!((e.keyCode > 95 && e.keyCode < 106)
            || (e.keyCode > 47 && e.keyCode < 58)
            || e.keyCode == 8)) {
            return false;
        }
    })
}