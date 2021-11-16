class EventService {
    constructor() {
        this.handlers = {

        };
    }
    on(name, handle) {
        if (!this.handlers[name]) {
            this.handlers[name] = [];
        }
        this.handlers[name].push(handle);
    }

    off(name, handle) {
        let handles = this.handlers[name];
        if (handles) {
            let idx = handles.findIndex(x => x == handle);
            handles.splice(idx, 1);
        }
    }

    trigger() {
        let [name, ...eventArgs] = arguments;
        if (!this.handlers[name]) {
            return;
        }
        for (let handle of this.handlers[name]) {
            handle(...eventArgs);
        }
    }
}

let engine = new EventService();