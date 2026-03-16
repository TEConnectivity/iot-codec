import { encode } from "../src/EncoderLib";
import { BatteryType, CharacTypeCommon_3_5_0, Charac_DB_common, MeasIntervalType } from "../src/Sensors/3.5.0/Common";
import { CharacTypeSP_3_5_0, Charac_DB_SP } from "../src/Sensors/3.5.0/SP";
import { FirmwareVersion, DeviceModel, Characteristic, Operation, UserPayloadType } from "../src/Sensors/Mapping";


test('Read Battery level', () => {
    expect(encode(Charac_DB_common.battery, Operation.READ, {} as UserPayloadType).toHexString()).toEqual("00 2A 19")
    expect(encode(Charac_DB_common.battery, Operation.READ, {} as UserPayloadType).fport).toEqual(20)
});

test('Write Battery reset', () => {
    let payload: BatteryType = { reset: true, type: CharacTypeCommon_3_5_0.BATTERY }
    expect(encode(Charac_DB_common.battery, Operation.WRITE, payload).toHexString()).toEqual("01 2A 19 FF")
    expect(encode(Charac_DB_common.battery, Operation.WRITE, payload).fport).toEqual(20)
});

test('Write + read Battery reset', () => {
    let payload: BatteryType = { reset: true, type: CharacTypeCommon_3_5_0.BATTERY }
    expect(encode(Charac_DB_common.battery, Operation.WRITEREAD, payload).toHexString()).toEqual("02 2A 19 FF")
    expect(encode(Charac_DB_common.battery, Operation.WRITEREAD, payload).fport).toEqual(20)
});

test('Change meas interval', () => {
    let payload: MeasIntervalType = { hour: "10", minute: "60", second: "01", type: CharacTypeSP_3_5_0.MEAS_INTERVAL }
    expect(encode(Charac_DB_SP.meas_interval, Operation.WRITE, payload).toHexString()).toEqual("01 B3 02 0A 3C 01")
    expect(encode(Charac_DB_SP.meas_interval, Operation.WRITE, payload).fport).toEqual(20)
});
