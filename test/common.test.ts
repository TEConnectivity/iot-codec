import { encode } from "../src/EncoderLib";
import { CharacTypeCommon, Charac_DB_common, Characteristic, Operation, TriggerMeasType, UserPayloadType } from "../src/Sensors/Common";



describe('ERROR HANDLING', () => {

    test('Should throw error when missing UUID', () => {
        var charac = { charac_name: "test", ble: "r", lora: "r", payload_size: "3", type: CharacTypeCommon.APP_EUI } as Characteristic
        expect(() => encode(charac, Operation.READ, {} as UserPayloadType)).toThrow("UUID field is missing in the characteristic.")
    });

    test('Should throw error when wrong payload format', () => {
        expect(() => encode(Charac_DB_common.battery, Operation.WRITE, {} as UserPayloadType)).toThrow("The payload does not fit with this charactheristic. Take a look at Schemas.")
    });

    test('Should throw error when Wrong UUID size', () => {
        var charac: Characteristic = { charac_name: "test", ble: "r", lora: "r", payload_size: "3", uuid: "A", type: CharacTypeCommon.APP_EUI }
        expect(() => encode(charac, Operation.WRITE, {} as UserPayloadType)).toThrow("UUID shall be 2 bytes long.")
    });

    test('Should throw error when LoRa rights missing from charac object', () => {
        var charac = { charac_name: "test", ble: "r", payload_size: "3", uuid: "AABB", type: CharacTypeCommon.APP_EUI } as Characteristic
        expect(() => encode(charac, Operation.WRITE, {} as UserPayloadType)).toThrow("LoRa rights needs to be mentionned inside the charac object. Check Schemas.")
    });

    test('Should throw error when trying to write a read-only parameter', () => {
        expect(() => encode(Charac_DB_common.app_eui, Operation.WRITE, {} as UserPayloadType)).toThrow("This charactheristic is not writeable.")
    });


})

describe('TRIGGER MEAS', () => {

    test('Write trigger measurement', () => {
        var payload: TriggerMeasType = { disconnect: true, type: CharacTypeCommon.TRIGGER_MEASUREMENT }
        expect(encode(Charac_DB_common.trig_meas, Operation.WRITE, payload).toHexString()).toEqual("01 B3 03 81")
    });
})

describe('BASE64', () => {

    test('Base64 conversion', () => {
        var payload: TriggerMeasType = { disconnect: true, type: CharacTypeCommon.TRIGGER_MEASUREMENT }
        expect(encode(Charac_DB_common.trig_meas, Operation.WRITE, payload).toBase64()).toEqual("AbMDgQ==")
    });

})


describe('MODEL NUMBER', () => {

    test('Read model number', () => {
        expect(encode(Charac_DB_common.model_number, Operation.READ, {} as UserPayloadType).toHexString()).toEqual("00 2A 24")
        expect(encode(Charac_DB_common.model_number, Operation.READ, {} as UserPayloadType).fport).toEqual(20)
    });
})

