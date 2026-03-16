import { Characteristic } from "../Mapping"

export enum CharacTypeSP_3_5_0 {

    //SP
    DATALOG_ANALYSIS = "datalog_analysis",
    DATALOG_DATA = "datalog_data",
    MEAS_INTERVAL = "meas_interval",
    THRESHOLD = "threshold",

}

/**
 * This schema is compliant with both SP & MP threshold. 
 * 
 * DATA32 is a four byte array. Check related specification.
 */
export interface ThresholdType {
    type: CharacTypeSP_3_5_0.THRESHOLD
    id_data: string,
    param_sel: string,
    data32: string
}


/**
 * Only available on singlepoint.
 */
export interface DatalogArrayType {
    type: CharacTypeSP_3_5_0.DATALOG_DATA
    datalog_type: number,
    index: number,
    length: number
}

/**
 * Only available on singlepoint.
 */
export interface DatalogAnalysisType {
    type: CharacTypeSP_3_5_0.DATALOG_ANALYSIS
    length: number
}



export const Charac_DB_SP: Record<CharacTypeSP_3_5_0, Characteristic> = {
    // SINGLEPOINT
    datalog_data: {
        uuid: "DB01",
        charac_name: "Datalog data",
        payload_size: "4",
        ble: "r|w|n",
        lora: "wr",
        type: CharacTypeSP_3_5_0.DATALOG_DATA
    },
    datalog_analysis: {
        uuid: "DB02",
        charac_name: "Datalog analysis request",
        payload_size: "3",
        ble: "r|w|n",
        lora: "wr",
        type: CharacTypeSP_3_5_0.DATALOG_ANALYSIS
    },
    meas_interval: {
        uuid: "B302",
        charac_name: "Measurement interval",
        payload_size: "3",
        ble: "r|w",
        lora: "r|w|wr",
        type: CharacTypeSP_3_5_0.MEAS_INTERVAL
    },
    threshold: {
        uuid: "B201",
        charac_name: "Threshold",
        payload_size: "6",
        ble: "r|w|n",
        lora: "w|wr",
        type: CharacTypeSP_3_5_0.THRESHOLD
    },
}


