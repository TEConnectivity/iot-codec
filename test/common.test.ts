import { encode } from "../src/EncoderLib";
import { CharacTypeCommon, Charac_DB_common, Characteristic, Operation, SensorFamily, TriggerMeasType, UserPayloadType } from "../src/Sensors/Common";
import { CharacTypeMP, Charac_DB_MP, PresetSelectionType } from "../src/Sensors/MP";


describe('ERROR HANDLING', () => {

    test('Should throw error when missing UUID', () => {
        var charac = { charac_name: "test", ble: "r", lora: "r", payload_size: "3", type: CharacTypeCommon.APP_EUI } as Characteristic
        expect(() => encode(charac, Operation.READ, {} as UserPayloadType, SensorFamily.Singlepoint)).toThrow("UUID field is missing in the characteristic.")
    });

    test('Should throw error when wrong payload format', () => {
        expect(() => encode(Charac_DB_common.battery, Operation.WRITE, {} as UserPayloadType, SensorFamily.Singlepoint)).toThrow("The payload does not fit with this charactheristic. Take a look at Schemas.")
    });

    test('Should throw error when Wrong UUID size', () => {
        var charac: Characteristic = { charac_name: "test", ble: "r", lora: "r", payload_size: "3", uuid: "A", type: CharacTypeCommon.APP_EUI }
        expect(() => encode(charac, Operation.WRITE, {} as UserPayloadType, SensorFamily.Singlepoint)).toThrow("UUID shall be 2 bytes long.")
    });

    test('Should throw error when LoRa rights missing from charac object', () => {
        var charac = { charac_name: "test", ble: "r", payload_size: "3", uuid: "AABB", type: CharacTypeCommon.APP_EUI } as Characteristic
        expect(() => encode(charac, Operation.WRITE, {} as UserPayloadType, SensorFamily.Singlepoint)).toThrow("LoRa rights needs to be mentionned inside the charac object. Check Schemas.")
    });

    test('Should throw error when trying to write a read-only parameter', () => {
        expect(() => encode(Charac_DB_common.app_eui, Operation.WRITE, {} as UserPayloadType, SensorFamily.Singlepoint)).toThrow("This charactheristic is not writeable.")
    });

    test('Should throw error when trying to write an unsupported payload with a mismatched sensorFamily', () => {
        var payload: PresetSelectionType = { main_preset: 1, type: CharacTypeMP.PRESET_SELECTION }
        expect(() => encode(Charac_DB_MP.preset_selection, Operation.WRITE, payload, SensorFamily.Singlepoint)).toThrow("This payload does not exist on this sensorFamily.")
    });

})

describe('TRIGGER MEAS', () => {

    test('Write trigger measurement', () => {
        var payload: TriggerMeasType = { disconnect: true, type: CharacTypeCommon.TRIGGER_MEASUREMENT }
        expect(encode(Charac_DB_common.trig_meas, Operation.WRITE, payload, SensorFamily.Singlepoint).toHexString()).toEqual("01 B3 03 81")
    });
})

describe('BASE64', () => {

    test('Base64 conversion', () => {
        var payload: TriggerMeasType = { disconnect: true, type: CharacTypeCommon.TRIGGER_MEASUREMENT }
        expect(encode(Charac_DB_common.trig_meas, Operation.WRITE, payload, SensorFamily.Singlepoint).toBase64()).toEqual("AbMDgQ==")
    });

})

