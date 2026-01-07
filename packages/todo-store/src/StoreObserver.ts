import type { Observer, Subject } from "./Observer.js";

/**
 * Concrete Observers react to the updates issued by the Subject they had been
 * attached to.
 */
export class StoreObserver implements Observer {
    private onUpdate?: () => void;

    constructor(onUpdate?: () => void) {
        this.onUpdate = onUpdate;
     }
    update(subject: Subject): void {
        if (this.onUpdate) this.onUpdate();
        else console.log('ConcreteObserver: ...', subject);
    }
}