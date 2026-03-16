

import { Characteristic } from "../Mapping"

export enum CharacTypeSP_5_2 {

    MERGE_MEASUREMENT = "merge_measurement",
    LORA_MODE = "lora_mode5_2"

}


// TODO Add FUOTA status


export interface LoramodeType {
    type: CharacTypeSP_5_2.LORA_MODE
    mode: "on_measurement" | "silent" | "merged"
}

export interface MergedMeasurementType {
    type: CharacTypeSP_5_2.MERGE_MEASUREMENT
    measurement_number: number,
    measurement_counter: boolean,
    timestamp: boolean,
    secondary_temperature: boolean
}

export const Charac_DB_SP5_2: Record<CharacTypeSP_5_2, Characteristic> = {
    merge_measurement: {
        uuid: "F807",
        charac_name: "Merged Measurement",
        payload_size: "2",
        ble: "r",
        lora: "r|w|wr",
        type: CharacTypeSP_5_2.MERGE_MEASUREMENT
    },
    lora_mode5_2: {
        uuid: "F810",
        charac_name: "LoRaWAN Mode Configuration",
        payload_size: "1",
        ble: "r|w",
        lora: "r|w|wr",
        type: CharacTypeSP_5_2.LORA_MODE
    },
};


