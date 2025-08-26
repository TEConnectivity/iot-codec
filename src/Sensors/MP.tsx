import { Characteristic } from "./Common"

export enum CharacTypeMP {

    // MP
    AXIS_SELECTION = "axis_selection",
    PRESET_SELECTION = "preset_selection",
    WINDOWING_FUNCTION = "windowing_function",
    PRESET_CONFIGURATION = "preset_configuration",
    PRESET_REQUEST = "preset_request",
    WINDOW_CONFIGURATION = "window_configuration",
    WINDOW_REQUEST = "window_request",
    MULTIPOINT_THRESHOLD = "multipoint_threshold",
    MULTIPOINT_THRESHOLD_REQUEST = "multipoint_threshold_request",
    MULTIPOINT_THRESHOLD_MULTI = "multipoint_threshold_multi",
    MEAS_INTERVAL = "meas_interval",

}


export interface AxisSelectionType {
    type: CharacTypeMP.AXIS_SELECTION
    axis_selected: ("x" | "y" | "z")[]
}

/**
 * If secondary_preset is present, rotating mode will be enabled
 */
export interface PresetSelectionType {
    type: CharacTypeMP.PRESET_SELECTION
    main_preset: number,
    secondary_preset?: number
}

export interface WindowingFunctionType {
    type: CharacTypeMP.WINDOWING_FUNCTION
    function: "hann" | "flattop" | "none"
}


/**
 * This frame configure a preset.
 */
export interface PresetConfigurationType {
    type: CharacTypeMP.PRESET_CONFIGURATION
    preset_id: number,
    frame_format: 0 | 1 | 2,
    bandwidth_mode: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    meas_interval_hour: number,
    meas_interval_minute: number,
    meas_interval_second: number
}

/**
 * Send this frame to request the configuration of a given preset.
 */
export interface PresetRequestType {
    type: CharacTypeMP.PRESET_REQUEST
    preset_id: number,
}


export interface WindowConfigurationType {
    type: CharacTypeMP.WINDOW_CONFIGURATION
    preset_id: number,
    window_id: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
    enable: boolean,
    /**
     * Shall be between 0 and 64
     */
    peak_count: number
    /**
     * Shall be between 0 and 20k
     */
    frequency_min: number,
    /**
     * Shall be between 0 and 20k
     */
    frequency_max: number
}

export interface WindowRequestType {
    type: CharacTypeMP.WINDOW_REQUEST
    preset_id: number,
    window_id: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
}

/**
 * Threshold is a highly dynamic frame. Refer to documentation for more info.
 */
interface MultipointThreshold {
    type: CharacTypeMP.MULTIPOINT_THRESHOLD
    id_data: Multipoint_Threshold_ID_DATA
}

export interface MultipointThresholdConfigType extends MultipointThreshold {
    param_sel: "ths_config"

    event_flag: false,
    enabled: boolean,
    direction: "above" | "below",
    auto_clear: boolean
    set_ble_mode: boolean,
    set_lora_mode: boolean,
}

export interface MultipointThresholdLevelType extends MultipointThreshold {
    param_sel: "ths_level"

    /**
     * Four-byte number containing Float32. May be mg or °C, if the selected threshold is vibration or temperature.
     */
    level: number
}

export interface MultipointThresholdCommModeType extends MultipointThreshold {
    param_sel: "communication_mode";
    ble_mode: "burst+periodic" | "burst" | "silent" | "periodic"
    lora_mode: "on_measurement"
}

export interface MultipointThresholdRequestType {
    type: CharacTypeMP.MULTIPOINT_THRESHOLD_REQUEST
    id_data: Multipoint_Threshold_ID_DATA
    param_sel: "ths_config" | "ths_level" | "communication_mode"
}

/**
 * High Level interface which generate multiple threshold frames to configure it at once. Used with encode_multi_frame function.
 * 
 * Several optional field depending on what's needed
 */
export interface MultipointThresholdHL {
    type: CharacTypeMP.MULTIPOINT_THRESHOLD_MULTI
    multi_frame: true
    id_data: Multipoint_Threshold_ID_DATA

    // Conf frame
    enabled: boolean,
    direction: MultipointThresholdConfigType["direction"]
    auto_clear: boolean
    event_flag: false
    set_ble_mode: boolean,
    set_lora_mode: boolean,

    // Level frame
    level: number

    // Comm mode frame
    ble_mode: MultipointThresholdCommModeType["ble_mode"]
    lora_mode: MultipointThresholdCommModeType["lora_mode"]
}




export const Charac_DB_MP: Record<CharacTypeMP, Characteristic> = {
    // MULTIPOINT
    axis_selection: {
        uuid: "FA01",
        charac_name: "Axis selection",
        payload_size: "1",
        ble: "r|w",
        lora: "r|w|wr",
        type: CharacTypeMP.AXIS_SELECTION
    },
    preset_selection: {
        uuid: "FA02",
        charac_name: "Preset selection",
        payload_size: "2",
        ble: "r|w",
        lora: "r|w|wr",
        type: CharacTypeMP.PRESET_SELECTION
    },
    windowing_function: {
        uuid: "FA03",
        charac_name: "Windowing function",
        payload_size: "1",
        ble: "r|w",
        lora: "r|w|wr",
        type: CharacTypeMP.WINDOWING_FUNCTION
    },
    preset_configuration: {
        uuid: "FA10",
        charac_name: "Preset configuration",
        payload_size: "6",
        ble: "r|w",
        lora: "r|w|wr",
        type: CharacTypeMP.PRESET_CONFIGURATION
    },
    preset_request: {
        uuid: "FA10",
        charac_name: "Preset request configuration",
        payload_size: "1",
        ble: "r|w",
        lora: "wr",
        type: CharacTypeMP.PRESET_REQUEST
    },
    window_configuration: {
        uuid: "FA11",
        charac_name: "Window Configuration",
        payload_size: "8",
        ble: "r|w",
        lora: "r|w|wr",
        type: CharacTypeMP.WINDOW_CONFIGURATION
    },
    window_request: {
        uuid: "FA11",
        charac_name: "Window Request",
        payload_size: "2",
        ble: "r|w",
        lora: "wr",
        type: CharacTypeMP.WINDOW_REQUEST
    },
    multipoint_threshold: {
        uuid: "B201",
        charac_name: "Multipoint Threshold",
        payload_size: "6",
        ble: "r|w|n",
        lora: "w|wr",
        type: CharacTypeMP.MULTIPOINT_THRESHOLD
    },
    multipoint_threshold_request: {
        uuid: "B201",
        charac_name: "Multipoint Threshold Request",
        payload_size: "2",
        ble: "r|w|n",
        lora: "w|wr",
        type: CharacTypeMP.MULTIPOINT_THRESHOLD_REQUEST
    },
    multipoint_threshold_multi: {
        uuid: "B201",
        charac_name: "Multipoint Threshold Multiframe",
        payload_size: "6",
        ble: "r|w|n",
        lora: "w|wr",
        type: CharacTypeMP.MULTIPOINT_THRESHOLD_MULTI
    },
    meas_interval: {
        uuid: "B302",
        charac_name: "Measurement interval",
        payload_size: "3",
        ble: "r",
        lora: "r",
        type: CharacTypeMP.MEAS_INTERVAL
    },

};


export enum Multipoint_Threshold_ID_DATA {
    X_TS_MAG_RMS_threshold = 0x10,
    X_TS_P2P_threshold = 0x11,
    X_FS_Magnitude_RMS = 0x12,
    X_FS_Velocity_RMS_threshold = 0x13,
    X_Analysis_window_RMS_of_window_1 = 0x14,
    X_Analysis_window_RMS_of_window_2 = 0x15,
    X_Analysis_window_RMS_of_window_3 = 0x16,
    X_Analysis_window_RMS_of_window_4 = 0x17,
    X_Analysis_window_RMS_of_window_5 = 0x18,
    X_Analysis_window_RMS_of_window_6 = 0x19,
    X_Analysis_window_RMS_of_window_7 = 0x1A,
    X_Analysis_window_RMS_of_window_8 = 0x1B,
    Y_TS_MAG_RMS_threshold = 0x30,
    Y_TS_P2P_threshold = 0x31,
    Y_FS_Magnitude_RMS = 0x32,
    Y_FS_Velocity_RMS_threshold = 0x33,
    Y_Analysis_window_RMS_of_window_1 = 0x34,
    Y_Analysis_window_RMS_of_window_2 = 0x35,
    Y_Analysis_window_RMS_of_window_3 = 0x36,
    Y_Analysis_window_RMS_of_window_4 = 0x37,
    Y_Analysis_window_RMS_of_window_5 = 0x38,
    Y_Analysis_window_RMS_of_window_6 = 0x39,
    Y_Analysis_window_RMS_of_window_7 = 0x3A,
    Y_Analysis_window_RMS_of_window_8 = 0x3B,
    Z_TS_MAG_RMS_threshold = 0x50,
    Z_TS_P2P_threshold = 0x51,
    Z_FS_Magnitude_RMS = 0x52,
    Z_FS_Velocity_RMS_threshold = 0x53,
    Z_Analysis_window_RMS_of_window_1 = 0x54,
    Z_Analysis_window_RMS_of_window_2 = 0x55,
    Z_Analysis_window_RMS_of_window_3 = 0x56,
    Z_Analysis_window_RMS_of_window_4 = 0x57,
    Z_Analysis_window_RMS_of_window_5 = 0x58,
    Z_Analysis_window_RMS_of_window_6 = 0x59,
    Z_Analysis_window_RMS_of_window_7 = 0x5A,
    Z_Analysis_window_RMS_of_window_8 = 0x5B,
    Temperature = 0x02
}