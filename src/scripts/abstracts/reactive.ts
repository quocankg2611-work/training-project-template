export type ReactiveValue<T> = {
    get: () => T;
    set: (newValue: T) => void;
    subscribe: (onChange: (updatedValue: T) => void) => void;
}

export function createReactiveValue<T>(
    initialValue: T,
): ReactiveValue<T> {
    let value = initialValue;
    const subscribers: ((updatedValue: T) => void)[] = [];

    function getValue(): T {
        return value;
    }

    function setValue(newValue: T): void {
        value = newValue;
        subscribers.forEach(callback => callback(value));
    }

    function subscribe(onChange: (updatedValue: T) => void): void {
        subscribers.push(onChange);
    }

    return {
        get: getValue,
        set: setValue,
        subscribe: subscribe
    };
}
