

import { Characteristic } from "../Mapping"

export enum CharacTypeGen_5_2 {

    PROTOCOL_VERSION = "protocol_version",
    NETWORK_LOST_CONFIG = "network_lost_config",
}


export interface ProtocolVersionType {
    type: CharacTypeGen_5_2.PROTOCOL_VERSION
    version: 1 | 2
}

export interface NetworkLostConfigType {
    type: CharacTypeGen_5_2.NETWORK_LOST_CONFIG
    adr_ack_limit: number
    adr_ack_delay: number
    confirmed_nack_retry: number
    periodic_unjoin_delay: number
}



export const Charac_DB_Gen5_2: Record<CharacTypeGen_5_2, Characteristic> = {
    protocol_version: {
        uuid: "AA01",
        charac_name: "Protocol Version",
        payload_size: "1",
        ble: "r",
        lora: "r|w|wr",
        type: CharacTypeGen_5_2.PROTOCOL_VERSION
    },
    network_lost_config: {
        uuid: "F811",
        charac_name: "Network Lost Config",
        payload_size: "5",
        ble: "r",
        lora: "r|w|wr",
        type: CharacTypeGen_5_2.NETWORK_LOST_CONFIG
    },

};

