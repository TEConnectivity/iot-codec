import { createEncoder } from "../src/EncoderLib";
import { CharacTypeGen_5_2, ProtocolVersionType } from "../src/Sensors/5.2/Generic";
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
