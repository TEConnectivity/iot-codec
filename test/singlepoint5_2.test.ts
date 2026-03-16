import { createEncoder } from "../src/EncoderLib";
import { CharacTypeSP_5_2, LoramodeType, MergedMeasurementType } from "../src/Sensors/5.2";
import { DeviceModel, FirmwareVersion } from "../src/Sensors/Mapping";


const encoder = createEncoder(FirmwareVersion.V5_2, DeviceModel.SINGLEPOINT)

describe('LoRa Mode', () => {

    it('Write', () => {
        let payload: LoramodeType = {
            mode: "merged", type: CharacTypeSP_5_2.LORA_MODE
        }
        expect(encoder.lora_mode5_2.write(payload)[0].toHexString()).toEqual("01 F8 10 02")
        expect(encoder.lora_mode5_2.write(payload)[0].fport).toEqual(20)
    });


})

describe('Merged Measurement', () => {

    it('Write', () => {
        let payload: MergedMeasurementType = {
            measurement_number: 10, measurement_counter: true, timestamp: false, secondary_temperature: false, type: CharacTypeSP_5_2.MERGE_MEASUREMENT
        }
        expect(encoder.merge_measurement.write(payload)[0].toHexString()).toEqual("01 F8 07 0A 01")
        expect(encoder.merge_measurement.write(payload)[0].fport).toEqual(20)
    });


})
