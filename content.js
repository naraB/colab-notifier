let runningCell = null;
const cellRunningObserverConfig = { attributes: true, hildList: true, subtree: true };

const cellRunningObserver = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.target.title && mutation.target.title.includes("Interrupt execution") && runningCell === null) {
            const startTime = new Date();
            console.log("running");
            runningCell = mutation.target;
            observeCell(startTime);
        }
    }
});

const runningCellFinishedCallback = () => {
    console.log("changed");
    if (!runningCell.title.includes("Interrupt execution")) {
        console.log("stopped");
        runningCell = null;
    }
};

const observeCell = (startTime) => {
    const observer = new MutationObserver((mutations) => {
        if (!runningCell.title.includes("Interrupt execution") && runningCell !== null) {
            var endTime = new Date();
            console.log("closed", millisToMinutesAndSeconds(endTime - startTime));
            runningCell = null;
            observer.disconnect();
        }
    });
    observer.observe(runningCell, {
        attributes: true,
        attributeFilter: ['title']
    });
};

millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

cellRunningObserver.observe(document.body, cellRunningObserverConfig);