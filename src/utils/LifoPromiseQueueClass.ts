export class LifoPromiseQueue {
    queue: any[];
    isRunning: boolean;
    constructor() {
        this.queue = [];
        this.isRunning = false;
    }
    add(fn:any):void {
        this.queue.push(fn);
        this.run();
    }
    async run():Promise<void> {
        if (!this.isRunning) {
            this.isRunning = true;
            await this.queue.pop()();
            this.isRunning = false;
            if (this.queue.length > 0) {
                this.run();
            }
        }
    }
}