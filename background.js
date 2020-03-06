chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ thresholdMinutes: 15, notifySound: true, notifyMessage: true });
});

function showFinishedCellNotification() {
    let timestamp = new Date().getTime();
    let notificationOptions = {
        type: 'basic',
        title: 'Your Colab cell finished running!',
        message: 'Check it out',
        iconUrl: './assets/icons/round-done-128.svg'
    }
    chrome.notifications.create('id ' + timestamp, notificationOptions);
}