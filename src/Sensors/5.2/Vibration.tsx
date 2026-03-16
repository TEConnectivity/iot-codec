import { Characteristic } from "../Mapping"
import { Multipoint_Threshold_ID_DATA } from "../4.1.3/MP"

export enum CharacTypeVib_5_2 {

    MULTIPOINT_THRESHOLD = "multipoint_threshold5_2",
    MULTIPOINT_THRESHOLD_REQUEST = "multipoint_threshold_request5_2",
    MULTIPOINT_THRESHOLD_MULTI = "multipoint_threshold_multi5_2",

}



export interface MultipointThresholdRequestType {
    type: CharacTypeVib_5_2.MULTIPOINT_THRESHOLD_REQUEST
    id_data: Multipoint_Threshold_ID_DATA
    param_sel: "ths_config" | "ths_level" | "communication_mode" | "preset_id"
}


/**
 * Threshold is a highly dynamic frame. Refer to documentation for more info.
 */
interface MultipointThreshold {
    type: CharacTypeVib_5_2.MULTIPOINT_THRESHOLD
    id_data: Multipoint_Threshold_ID_DATA
}

///////////// Type of threshold

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

export interface MultipointThresholdPresetChangeType extends MultipointThreshold {
    param_sel: "preset_change";
    preset_id_slot0: number
    preset_id_slot1: number
}

/**
 * High Level interface which generate multiple threshold frames to configure it at once. Used with encode_multi_frame function.
 * 
 * Several optional field depending on what's needed
 */
export interface MultipointThresholdHL {
    type: CharacTypeVib_5_2.MULTIPOINT_THRESHOLD_MULTI
    multi_frame: true
    id_data: Multipoint_Threshold_ID_DATA

    // Conf frame
    enabled: boolean,
    direction: "above" | "below"
    auto_clear: boolean
    event_flag: false
    set_ble_mode: boolean,
    set_lora_mode: boolean,
    change_preset: boolean

    // Level frame
    level: number

    // Preset change
    preset_id_slot0: number
    preset_id_slot1: number

    // Comm mode frame
    ble_mode: MultipointThresholdCommModeType["ble_mode"]
    lora_mode: MultipointThresholdCommModeType["lora_mode"]
}





export const Charac_DB_Vib5_2: Record<CharacTypeVib_5_2, Characteristic> = {
    multipoint_threshold5_2: {
        uuid: "B201",
        charac_name: "Multipoint Threshold",
        payload_size: "6",
        ble: "r|w|n",
        lora: "w|wr",
        type: CharacTypeVib_5_2.MULTIPOINT_THRESHOLD
    },
    multipoint_threshold_request5_2: {
        uuid: "B201",
        charac_name: "Multipoint Threshold Request",
        payload_size: "2",
        ble: "r|w|n",
        lora: "w|wr",
        type: CharacTypeVib_5_2.MULTIPOINT_THRESHOLD_REQUEST
    },
    multipoint_threshold_multi5_2: {
        uuid: "B201",
        charac_name: "Multipoint Threshold Multiframe",
        payload_size: "6",
        ble: "r|w|n",
        lora: "w|wr",
        type: CharacTypeVib_5_2.MULTIPOINT_THRESHOLD_MULTI
    },
};

