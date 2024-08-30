import { encode } from "../src/EncoderLib";
import { BatteryType, CharacTypeCommon, Charac_DB_common, MeasIntervalType, Operation, SensorFamily, UserPayloadType } from "../src/Sensors/Common";
import { CharacTypeSP, Charac_DB_SP } from "../src/Sensors/SP";


test('Read Battery level', () => {
    expect(encode(Charac_DB_common.battery, Operation.READ, {} as UserPayloadType, SensorFamily.Singlepoint).toHexString()).toEqual("00 2A 19")
});

test('Write Battery reset', () => {
    let payload: BatteryType = { reset: true, type: CharacTypeCommon.BATTERY }
    expect(encode(Charac_DB_common.battery, Operation.WRITE, payload, SensorFamily.Singlepoint).toHexString()).toEqual("01 2A 19 FF")
});

test('Write + read Battery reset', () => {
    let payload: BatteryType = { reset: true, type: CharacTypeCommon.BATTERY }
    expect(encode(Charac_DB_common.battery, Operation.READWRITE, payload, SensorFamily.Singlepoint).toHexString()).toEqual("02 2A 19 FF")
});

test('Fport value', () => {
    expect(encode(Charac_DB_common.battery, Operation.READ, {} as UserPayloadType, SensorFamily.Singlepoint).fport).toEqual(20)
});

test('Change meas interval', () => {
    let payload: MeasIntervalType = { hour: "10", minute: "60", second: "01", type: CharacTypeSP.MEAS_INTERVAL }
    expect(encode(Charac_DB_SP.meas_interval, Operation.WRITE, payload, SensorFamily.Singlepoint).toHexString()).toEqual("01 B3 02 0A 3C 01")
});
