let runningCell = null;
let startTime = null;
const runningCellObserverConfig = { attributes: true, hildList: true, subtree: true };
const finishedCellObserverConfig = { attibutes: true, attributeFilter: ['title'] };

// Observers
const runningCellObserver = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.target.title && mutation.target.title.includes("Interrupt execution") && runningCell === null) {
            startTime = new Date();
            runningCell = mutation.target;
            observeCell();
        }
    }
});
const finishedCellObserver = new MutationObserver(() => {
    if (runningCell === null) {
        return;
    };
    if (!runningCell.title.includes("Interrupt execution")) {
        runningCell = null;
        cellFinishedRunning(startTime);
    }
});


const cellFinishedRunning = () => {
    const endTime = new Date();
    const runtimeMs = endTime - startTime;
    startTime = null;

    chrome.runtime.sendMessage({ runtimeMs }, (response) => {
        if (response) {
            finishedCellObserver.disconnect();
        }
    });
};

const millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
};

const observeCell = () => finishedCellObserver.observe(runningCell, finishedCellObserverConfig);

runningCellObserver.observe(document.body, runningCellObserverConfig);