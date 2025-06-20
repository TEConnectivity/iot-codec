import { Characteristic } from "../Common"

export enum CharacTypeVib4_2 {

    // MP
    PROTOCOL_VERSION = "protocol_version"

}

export interface ProtocolVersionType {
    type: CharacTypeVib4_2.PROTOCOL_VERSION
    version: 1 | 2
}

export const Charac_DB_Vib4_2: Record<CharacTypeVib4_2, Characteristic> = {
    protocol_version: {
        uuid: "AA01",
        charac_name: "Protocol Version",
        payload_size: "1",
        ble: "r",
        lora: "r|w|wr",
        type: CharacTypeVib4_2.PROTOCOL_VERSION
    }
};

