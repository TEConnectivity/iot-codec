import { createEncoder } from "../src/EncoderLib";
import { CharacTypeGen_5_2, NetworkLostConfigType, ProtocolVersionType } from "../src/Sensors/5.2/Generic";
import { DeviceModel, FirmwareVersion } from "../src/Sensors/Mapping";


const encoder = createEncoder(FirmwareVersion.V5_2, DeviceModel.VIBRATION)

describe('Protocol Version', () => {

    it('Read Protocol Version', () => {
        expect(encoder.protocol_version.read().toHexString()).toEqual("00 AA 01")
        expect(encoder.protocol_version.read().fport).toEqual(20)

    });

    it('Write Protocol Version', () => {
        let payload: ProtocolVersionType = { version: 1, type: CharacTypeGen_5_2.PROTOCOL_VERSION }
        expect(encoder.protocol_version.write(payload)[0].toHexString()).toEqual("01 AA 01 01")
        expect(encoder.protocol_version.write(payload)[0].fport).toEqual(20)
    });

})

describe('Network Lost Config', () => {

    it('Read Network Lost Config', () => {
        expect(encoder.network_lost_config.read().toHexString()).toEqual("00 F8 11")
        expect(encoder.network_lost_config.read().fport).toEqual(20)

    });

    it('Write Network Lost Config', () => {
        let payload: NetworkLostConfigType = { adr_ack_limit: 10, adr_ack_delay: 11, confirmed_nack_retry: 13, periodic_unjoin_delay: 256, type: CharacTypeGen_5_2.NETWORK_LOST_CONFIG }
        expect(encoder.network_lost_config.write(payload)[0].toHexString()).toEqual("01 F8 11 0A 0B 0D 01 00")
        expect(encoder.network_lost_config.write(payload)[0].fport).toEqual(20)
    });

})
