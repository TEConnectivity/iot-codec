import { createEncoder } from "../src/EncoderLib";
import { CharacTypeVib5_2, RawTimeDataType } from "../src/Sensors/5.2.0/Vibration";
import { DeviceModel, FirmwareVersion } from "../src/Sensors/Common";


const encoder = createEncoder(FirmwareVersion.V5_2_beta, DeviceModel.VIBRATION)

describe('Raw Time Data', () => {

    it('Request Raw time data', () => {
        let payload: RawTimeDataType = { axis_selected: "x", index: 255, length: 6, type: CharacTypeVib5_2.RAW_TIME_DATA }

        expect(encoder.raw_time_data.writeread(payload)[0].toHexString()).toEqual("02 DA 03 04 00 FF 06")
        expect(encoder.raw_time_data.writeread(payload)[0].fport).toEqual(20)
    });


})
