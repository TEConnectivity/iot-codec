import { Characteristic } from "../Common"

export enum CharacTypeVib5_2 {


    RAW_TIME_DATA = "raw_time_data",

}

export interface RawTimeDataType {
    type: CharacTypeVib5_2.RAW_TIME_DATA
    axis_selected: ("x" | "y" | "z")
    index: number,
    length: number
}

export const Charac_DB_Vib5_2: Record<CharacTypeVib5_2, Characteristic> = {
    raw_time_data: {
        uuid: "DA03",
        charac_name: "Raw Time Data",
        payload_size: "4",
        ble: "r",
        lora: "wr",
        type: CharacTypeVib5_2.RAW_TIME_DATA
    },
};

