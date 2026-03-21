window.QA = {
    logs: [],
    
    log: function(msg) {
        let time = new Date().toLocaleTimeString();
        let logMsg = `[${time}] ${msg}`;
        this.logs.unshift(logMsg);
        if(this.logs.length > 5) this.logs.pop();
        console.log("[QA]", msg);
    },
    
    getLastLogs: function() {
        return this.logs;
    }
};