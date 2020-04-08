let runningCell = null;
let startTime = null;
const runningCellObserverConfig = { attributes: true, hildList: true, subtree: true };
const finishedCellObserverConfig = { attibutes: true, attributeFilter: ['title'] };

// Observers
const runningCellObserver = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.target.title && mutation.target.title.includes('Interrupt execution') && runningCell === null) {
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
    if (!runningCell.title.includes('Interrupt execution')) {
        runningCell = null;
        cellFinishedRunning();
    }
});


const cellFinishedRunning = () => {
    const endTime = new Date();
    const runtimeMs = endTime - startTime;
    startTime = null;

    const port = chrome.runtime.connect({ name: "cell-finished" });
    port.postMessage({ runtimeMs });
    port.onMessage.addListener(response => {
        if (response) {
            finishedCellObserver.disconnect();
            port.disconnect();
        }
    });
};

const observeCell = () => finishedCellObserver.observe(runningCell, finishedCellObserverConfig);

runningCellObserver.observe(document.body, runningCellObserverConfig);