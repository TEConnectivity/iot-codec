import { Characteristic } from "./Common"

export enum CharacTypeSP {

    //SP
    DATALOG_ANALYSIS = "datalog_analysis",
    DATALOG_DATA = "datalog_data",
    MEAS_INTERVAL = "meas_interval",

}


/**
 * Only available on singlepoint.
 */
export interface DatalogArrayType {
    type: CharacTypeSP.DATALOG_DATA
    datalog_type: number,
    index: number,
    length: number
}

/**
 * Only available on singlepoint.
 */
export interface DatalogAnalysisType {
    type: CharacTypeSP.DATALOG_ANALYSIS
    length: number
}



export const Charac_DB_SP: Record<CharacTypeSP, Characteristic> = {
    // SINGLEPOINT
    datalog_data: {
        uuid: "DB01",
        charac_name: "Datalog data",
        payload_size: "4",
        ble: "r|w|n",
        lora: "wr",
        type: CharacTypeSP.DATALOG_DATA
    },
    datalog_analysis: {
        uuid: "DB02",
        charac_name: "Datalog analysis request",
        payload_size: "3",
        ble: "r|w|n",
        lora: "wr",
        type: CharacTypeSP.DATALOG_ANALYSIS
    },
    meas_interval: {
        uuid: "B302",
        charac_name: "Measurement interval",
        payload_size: "3",
        ble: "r|w",
        lora: "r|w|wr",
        type: CharacTypeSP.MEAS_INTERVAL
    },
}
