import { encode, encode_multi_frame } from "../src/EncoderLib";
import { Operation, SensorFamily, UserPayloadType } from "../src/Sensors/Common";
import { AxisSelectionType, Charac_DB_MP, CharacTypeMP, Multipoint_Threshold_ID_DATA, MultipointThresholdCommModeType, MultipointThresholdConfigType, MultipointThresholdHL, MultipointThresholdLevelType, MultipointThresholdRequestType, PresetConfigurationType, PresetRequestType, PresetSelectionType, RawTimeDataType, WindowConfigurationType, WindowingFunctionType, WindowRequestType } from "../src/Sensors/MP";


describe('AXIS SELECTION', () => {

    it('Read Axis selection', () => {
        expect(encode(Charac_DB_MP.axis_selection, Operation.READ, {} as UserPayloadType, SensorFamily.Multipoint).toHexString()).toEqual("00 FA 01")
    });

    it('Write X+Y Axis Selection', () => {
        let payload: AxisSelectionType = { axis_selected: ["x", "y"], type: CharacTypeMP.AXIS_SELECTION }
        expect(encode(Charac_DB_MP.axis_selection, Operation.WRITE, payload, SensorFamily.Multipoint).toHexString()).toEqual("01 FA 01 06")
    });

})


describe('PRESET SELECTION', () => {

    it('Read Preset selection', () => {
        expect(encode(Charac_DB_MP.preset_selection, Operation.READ, {} as UserPayloadType, SensorFamily.Multipoint).toHexString()).toEqual("00 FA 02")
    });

    it('Write Select Preset 2 for Meas slot 1', () => {
        let payload: PresetSelectionType = { main_preset: 2, type: CharacTypeMP.PRESET_SELECTION }
        expect(encode(Charac_DB_MP.preset_selection, Operation.WRITE, payload, SensorFamily.Multipoint).toHexString()).toEqual("01 FA 02 02 FF")
    });

    it('Write Select Preset 2 for Meas slot 1 and Preset 6 for Meas slot 2 (rotating)', () => {
        let payload: PresetSelectionType = { main_preset: 2, secondary_preset: 6, type: CharacTypeMP.PRESET_SELECTION }
        expect(encode(Charac_DB_MP.preset_selection, Operation.WRITE, payload, SensorFamily.Multipoint).toHexString()).toEqual("01 FA 02 02 06")
    });

})

describe('WINDOWING FUNCTION SELECTION', () => {

    it('Read Windowing function selection', () => {
        expect(encode(Charac_DB_MP.windowing_function, Operation.READ, {} as UserPayloadType, SensorFamily.Multipoint).toHexString()).toEqual("00 FA 03")
    });

    it('Write Windowing Flat top', () => {
        let payload: WindowingFunctionType = { function: "flattop", type: CharacTypeMP.WINDOWING_FUNCTION }
        expect(encode(Charac_DB_MP.windowing_function, Operation.WRITE, payload, SensorFamily.Multipoint).toHexString()).toEqual("01 FA 03 02")
    });

})



describe('PRESET CONFIGURATION', () => {

    it('Read Preset configuration', () => {
        expect(encode(Charac_DB_MP.preset_request, Operation.READ, {} as UserPayloadType, SensorFamily.Multipoint).toHexString()).toEqual("00 FA 10")
    });

    it('Request Preset configuration', () => {
        let payload: PresetRequestType = { preset_id: 15, type: CharacTypeMP.PRESET_REQUEST }
        expect(encode(Charac_DB_MP.preset_request, Operation.WRITE, payload, SensorFamily.Multipoint).toHexString()).toEqual("01 FA 10 0F")
    });

    it('Write Preset configuration', () => {
        let payload: PresetConfigurationType = { preset_id: 15, frame_format: 1, bandwidth_mode: 10, meas_interval_hour: 255, meas_interval_minute: 15, meas_interval_second: 10, type: CharacTypeMP.PRESET_CONFIGURATION }
        expect(encode(Charac_DB_MP.preset_configuration, Operation.WRITE, payload, SensorFamily.Multipoint).toHexString()).toEqual("01 FA 10 0F 01 0A FF 0F 0A")
    });

})


describe('WINDOW CONFIGURATION', () => {

    it('Request Window configuration', () => {
        let payload: WindowRequestType = { preset_id: 255, window_id: 8, type: CharacTypeMP.WINDOW_REQUEST }
        expect(encode(Charac_DB_MP.window_request, Operation.WRITE, payload, SensorFamily.Multipoint).toHexString()).toEqual("01 FA 11 FF 08")
    });

    it('Write Window configuration', () => {
        let payload: WindowConfigurationType = { preset_id: 15, window_id: 2, enable: true, peak_count: 5, frequency_min: 600, frequency_max: 20000, type: CharacTypeMP.WINDOW_CONFIGURATION }
        expect(encode(Charac_DB_MP.window_configuration, Operation.WRITE, payload, SensorFamily.Multipoint).toHexString()).toEqual("01 FA 11 0F 02 01 05 02 58 4E 20")
    });

})

describe('THRESHOLD CONFIGURATION', () => {

    it('Request Threshold config configuration', () => {
        let payload: MultipointThresholdRequestType = { id_data: Multipoint_Threshold_ID_DATA.X_Analysis_window_RMS_of_window_1, param_sel: "communication_mode", type: CharacTypeMP.MULTIPOINT_THRESHOLD_REQUEST }
        expect(encode(Charac_DB_MP.multipoint_threshold_request, Operation.WRITE, payload, SensorFamily.Multipoint).toHexString()).toEqual("01 B2 01 14 03")
    });

    it('Write Threshold config configuration', () => {
        let payload: MultipointThresholdConfigType = { id_data: Multipoint_Threshold_ID_DATA.X_Analysis_window_RMS_of_window_1, auto_clear: true, event_flag: false, enabled: true, direction: "above", param_sel: "ths_config", set_ble_mode: true, set_lora_mode: false, type: CharacTypeMP.MULTIPOINT_THRESHOLD }
        expect(encode(Charac_DB_MP.multipoint_threshold, Operation.WRITE, payload, SensorFamily.Multipoint).toHexString()).toEqual("01 B2 01 14 00 74 00 00 00")
    });

    it('Write Threshold level configuration', () => {
        let payload: MultipointThresholdLevelType = { id_data: Multipoint_Threshold_ID_DATA.X_Analysis_window_RMS_of_window_1, level: 59000, param_sel: "ths_level", type: CharacTypeMP.MULTIPOINT_THRESHOLD }
        expect(encode(Charac_DB_MP.multipoint_threshold, Operation.WRITE, payload, SensorFamily.Multipoint).toHexString()).toEqual("01 B2 01 14 01 00 00 E6 78")
    });

    it('Write Threshold comm mode configuration', () => {
        let payload: MultipointThresholdCommModeType = { id_data: Multipoint_Threshold_ID_DATA.X_Analysis_window_RMS_of_window_1, param_sel: "communication_mode", ble_mode: "silent", lora_mode: "on_measurement", type: CharacTypeMP.MULTIPOINT_THRESHOLD }
        expect(encode(Charac_DB_MP.multipoint_threshold, Operation.WRITE, payload, SensorFamily.Multipoint).toHexString()).toEqual("01 B2 01 14 03 02 00 00 00")
    });


    it('Write Multi-frame Threshold configuration', () => {
        let payload: MultipointThresholdHL = { id_data: Multipoint_Threshold_ID_DATA.X_Analysis_window_RMS_of_window_1, ble_mode: "silent", lora_mode: "on_measurement", auto_clear: true, event_flag: false, enabled: true, direction: "above", level: 59000, set_ble_mode: true, set_lora_mode: false, type: CharacTypeMP.MULTIPOINT_THRESHOLD_MULTI }
        const frame_array = encode_multi_frame(Charac_DB_MP.multipoint_threshold, Operation.WRITE, payload, SensorFamily.Multipoint)
        const string_frame_array = frame_array.map((frame) => frame.toHexString())
        expect(string_frame_array).toEqual(["01 B2 01 14 01 00 00 E6 78", "01 B2 01 14 03 02 00 00 00", "01 B2 01 14 00 74 00 00 00"])
    });


})



describe('Raw Time Data', () => {

    it('Request Raw time data', () => {
        let payload: RawTimeDataType = { axis_selected:"x", index:255,length:6, type: CharacTypeMP.RAW_TIME_DATA }
        expect(encode(Charac_DB_MP.raw_time_data, Operation.READWRITE, payload, SensorFamily.Multipoint).toHexString()).toEqual("02 DA 03 04 00 FF 06")
    });



})
