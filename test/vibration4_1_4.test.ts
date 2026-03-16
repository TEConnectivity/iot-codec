import { createEncoder } from "../src/EncoderLib";
import { CharacTypeVib4_1_4, RawTimeDataType } from "../src/Sensors/4.1.4/Vibration";
import { DeviceModel, FirmwareVersion } from "../src/Sensors/Mapping";


const encoder = createEncoder(FirmwareVersion.V5_2, DeviceModel.VIBRATION)

describe('Raw Time Data', () => {

    it('Request Raw time data', () => {
        let payload: RawTimeDataType = { axis_selected: "x", index: 255, length: 6, type: CharacTypeVib4_1_4.RAW_TIME_DATA }


        for (var i = 90; i < 4096; i += 90) {
            let test: RawTimeDataType = { axis_selected: "x", index: i, length: 90, type: CharacTypeVib4_1_4.RAW_TIME_DATA }
            console.log(encoder.raw_time_data.writeread(test)[0].toHexString())
        }
        expect(encoder.raw_time_data.writeread(payload)[0].toHexString()).toEqual("02 DA 03 04 00 FF 06")
        expect(encoder.raw_time_data.writeread(payload)[0].fport).toEqual(20)
    });


})
