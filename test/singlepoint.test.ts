import { encode } from "../src/EncoderLib";
import { BatteryType, CharacType, Charac_DB, MeasIntervalType, Operation, SensorFamily, UserPayloadType } from "../src/Schemas";


test('Read Battery level', () => {
    expect(encode(Charac_DB.battery, Operation.READ, {} as UserPayloadType, SensorFamily.Singlepoint).toHexString()).toEqual("00 2A 19")
});

test('Write Battery reset', () => {
    let payload: BatteryType = { reset: true, type: CharacType.BATTERY }
    expect(encode(Charac_DB.battery, Operation.WRITE, payload, SensorFamily.Singlepoint).toHexString()).toEqual("01 2A 19 FF")
});

test('Write + read Battery reset', () => {
    let payload: BatteryType = { reset: true, type: CharacType.BATTERY }
    expect(encode(Charac_DB.battery, Operation.READWRITE, payload, SensorFamily.Singlepoint).toHexString()).toEqual("02 2A 19 FF")
});

test('Fport value', () => {
    expect(encode(Charac_DB.battery, Operation.READ, {} as UserPayloadType, SensorFamily.Singlepoint).fport).toEqual(20)
});

test('Change meas interval', () => {
    let payload: MeasIntervalType = { hour: "10", minute: "60", second: "01", type: CharacType.MEAS_INTERVAL }
    expect(encode(Charac_DB.meas_interval, Operation.WRITE, payload, SensorFamily.Singlepoint).toHexString()).toEqual("01 B3 02 0A 3C 01")
});
