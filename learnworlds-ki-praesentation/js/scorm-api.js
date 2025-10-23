// SCORM 1.2 API Wrapper
var scormAPI = null;
var scormInitialized = false;

function findSCORMAPI(win) {
    var findAPITries = 0;
    while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
        findAPITries++;
        if (findAPITries > 500) {
            return null;
        }
        win = win.parent;
    }
    return win.API;
}

function initSCORM() {
    scormAPI = findSCORMAPI(window);
    if (scormAPI == null) {
        console.log("SCORM API not found - running in standalone mode");
        return false;
    }

    var result = scormAPI.LMSInitialize("");
    if (result == "true") {
        scormInitialized = true;
        console.log("SCORM initialized successfully");
        return true;
    } else {
        console.log("SCORM initialization failed");
        return false;
    }
}

function setSCORMValue(element, value) {
    if (scormInitialized && scormAPI) {
        scormAPI.LMSSetValue(element, value);
        scormAPI.LMSCommit("");
    }
}

function getSCORMValue(element) {
    if (scormInitialized && scormAPI) {
        return scormAPI.LMSGetValue(element);
    }
    return "";
}

function finishSCORM() {
    if (scormInitialized && scormAPI) {
        setSCORMValue("cmi.core.lesson_status", "completed");
        setSCORMValue("cmi.core.score.min", "0");
        setSCORMValue("cmi.core.score.max", "100");
        setSCORMValue("cmi.core.score.raw", "100");
        scormAPI.LMSFinish("");
    }
}

// Initialize on load
window.addEventListener('load', function() {
    initSCORM();
    setSCORMValue("cmi.core.lesson_status", "incomplete");
});

// Cleanup on unload
window.addEventListener('beforeunload', function() {
    finishSCORM();
});
