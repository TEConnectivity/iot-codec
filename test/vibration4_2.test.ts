import { createEncoder } from "../src/EncoderLib";
import { CharacTypeVib4_2, ProtocolVersionType } from "../src/Sensors/4.2.0/Vibration";
import { DeviceModel, FirmwareVersion } from "../src/Sensors/Common";


const encoder = createEncoder(FirmwareVersion.V4_2_beta, DeviceModel.VIBRATION)

describe('Protocol Version', () => {

    it('Read Protocol Version', () => {
        expect(encoder.protocol_version.read().toHexString()).toEqual("00 AA 01")
        expect(encoder.protocol_version.read().fport).toEqual(20)

    });

    it('Write Protocol Version', () => {
        let payload: ProtocolVersionType = { version: 1, type: CharacTypeVib4_2.PROTOCOL_VERSION }
        expect(encoder.protocol_version.write(payload)[0].toHexString()).toEqual("01 AA 01 01")
        expect(encoder.protocol_version.write(payload)[0].fport).toEqual(20)
    });




})
