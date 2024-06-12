import { encode } from "../src/EncoderLib";
import { BatteryType, CharacType, Charac_DB, Characteristic, Operation, SensorFamily, UserPayloadType } from "../src/Schemas";



test('Should throw error when missing UUID', () => {
    var charac = { charac_name: "test", ble: "r", lora: "r", payload_size: "3", type: CharacType.APP_EUI } as Characteristic
    expect(() => encode(charac, Operation.READ, {} as UserPayloadType, SensorFamily.Singlepoint)).toThrow("UUID field is missing in the characteristic.")
});

test('Should throw error when wrong payload format', () => {
    expect(() => encode(Charac_DB.battery, Operation.WRITE, {} as UserPayloadType, SensorFamily.Singlepoint)).toThrow("The payload does not fit with this charactheristic. Take a look at Schemas.")
});

test('Should throw error when Wrong UUID size', () => {
    var charac: Characteristic = { charac_name: "test", ble: "r", lora: "r", payload_size: "3", uuid: "A", type: CharacType.APP_EUI }
    expect(() => encode(charac, Operation.WRITE, {} as UserPayloadType, SensorFamily.Singlepoint)).toThrow("UUID shall be 2 bytes long.")
});

test('Should throw error when LoRa rights missing from charac object', () => {
    var charac = { charac_name: "test", ble: "r", payload_size: "3", uuid: "AABB", type: CharacType.APP_EUI } as Characteristic
    expect(() => encode(charac, Operation.WRITE, {} as UserPayloadType, SensorFamily.Singlepoint)).toThrow("LoRa rights needs to be mentionned inside the charac object. Check Schemas.")
});

test('Read Battery level', () => {
    expect(encode(Charac_DB.battery, Operation.READ, {} as UserPayloadType, SensorFamily.Singlepoint).toHexString()).toEqual("00 2A 19")
});

test('Write Battery reset', () => {
    let payload: BatteryType = { reset: true, type: CharacType.BATTERY }
    expect(encode(Charac_DB.battery, Operation.WRITE, payload, SensorFamily.Singlepoint).toHexString()).toEqual("01 2A 19 FF")
});


