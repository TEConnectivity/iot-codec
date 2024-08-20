
export class PresetRangeError extends Error {
    constructor() {
        super("Preset number should be between 0 & 255");
    }
}

export class WindowingFunctionError extends Error {
    constructor() {
        super("Unknown windowing function");
    }
}

export class TimeOutOfRangeError extends Error {
    constructor() {
        super("Time should be between 0 and 255 (h/m/s)");
    }
}

export class UnkownCharacTypeError extends Error {
    constructor() {
        super("This type of frame cannot be decoded. Please raise a Github issue.");
    }
}

export class WindowRangeError extends Error {
    constructor() {
        super("Window ID should be between 0 and 8.");
    }
}

export class PeakRangeError extends Error {
    constructor() {
        super("Peak count should be between 0 and 64.");
    }
}

export class FrequencyBoundariesError extends Error {
    constructor() {
        super("A window lowest frequency should be lowest than its maximal frequency.");
    }
}

export class FrequencyRangeError extends Error {
    constructor() {
        super("Frequency should be between 0 and 20800 Hz.");
    }
}