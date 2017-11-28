
export class Busy {
    active: number = 0;
    on() { this.active++; }
    off() {
        if (this.active !== 0)
            this.active--;
    }
}