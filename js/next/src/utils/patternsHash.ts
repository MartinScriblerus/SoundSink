export class PatternsNode<T> {
    data: T;
    next: PatternsNode<T> | null | undefined;

    constructor(data: T) {
        this.data = data;
    }
}

export class LinkedList<T> {
    head: PatternsNode<T> | null | undefined = null;
    comparator: (a:T,b:T) => boolean;

    constructor(comparator: (a:T,b:T) => boolean) {
        this.comparator = comparator;
    }

    append(data: T) {
        if (!this.head) {
            this.head = new PatternsNode(data);
        } else {
            let current = this.head;
            while (current.next != null) {
                current = current.next;
            }
            current.next = new PatternsNode(data);
        }
    }

    delete(data: T) {
        if (!this.head) return;

        if (this.comparator(this.head.data, data)) {
            this.head = this.head.next;
            return;
        }

        let current = this.head.next;
        let previous = this.head;

        while (current) {
            if (this.comparator(current.data, data)) {
                current = null;
            } else {
                previous = current;
                current = current.next;
            }
        }

        previous.next = previous.next ? previous.next.next : null;
    }

    search(data: T) {
        let current = this.head;
        while (current) {
            if(this.comparator(current.data, data)) {
                return current;
            }
            current = current.next;
        }
        return null;
    }

    getNext() {
        let current = this.head;
        return current?.next;
    }
}

export class PatternsHashTable {
    private size: number;
    private data: LinkedList<string>[] = [];

    constructor(size: number) {
        this.size = size;
    }

    hash(value: any) {
        console.log("VALUE? ", value);
        const sum = value.data.split(',').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
        return sum % this.size;
    }

    insert(value: string) {
        const index = this.hash(value);
        if (!this.data[index]) {
            this.data[index] = new LinkedList<string>(
                (a: string, b: string) => a === b
            );
        }
    }

    search(value: string) {
        const index = this.hash(value);

        if (this.data[index]) {
            console.log("Search operation gives us: ", this.data[index]);
            return this.data[index].search(value);
        }
    }

    delete(value: string) {
        const index = this.hash(value);

        if (this.data[index]) {
            delete this.data[index];
            console.log("Delete operation leaves us: ", this.data[index]);
        }
    }
}