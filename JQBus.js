/**
 * Emit events for others objects
 */
export const JQBus = {
    events: {},
    on(event, callback) {
        if(!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    },
    emit(event, data) {
        if(this.events[event]) this.events[event].forEach(cb => cb(data));
    }
}