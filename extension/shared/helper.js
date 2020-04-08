async function getValueFromStorage(key) {
    const value = new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], (value) => resolve(value));
    });
    return await value;
}

export default getValueFromStorage;