import { createEncoder } from "../src/EncoderLib";
import { Multipoint_Threshold_ID_DATA } from "../src/Sensors/4.1.3/MP";
import { CharacTypeVib_5_2, MultipointThresholdHL } from "../src/Sensors/5.2/Vibration";
import { DeviceModel, FirmwareVersion } from "../src/Sensors/Mapping";


const encoder = createEncoder(FirmwareVersion.V5_2, DeviceModel.VIBRATION)


describe('THRESHOLD CONFIGURATION', () => {



    it('Write Multi-frame Threshold configuration (v2 interface)', () => {
        let payload: MultipointThresholdHL = { change_preset: true, preset_id_slot0: 10, preset_id_slot1: 11, id_data: Multipoint_Threshold_ID_DATA.X_Analysis_window_RMS_of_window_1, ble_mode: "silent", lora_mode: "on_measurement", auto_clear: true, event_flag: false, enabled: true, direction: "above", level: 59000, set_ble_mode: true, set_lora_mode: false, type: CharacTypeVib_5_2.MULTIPOINT_THRESHOLD_MULTI, multi_frame: true }
        let frame_array = encoder.multipoint_threshold_multi5_2.write(payload)
        const string_frame_array = frame_array.map((frame) => frame.toHexString())
        expect(string_frame_array).toEqual(["01 B2 01 14 01 47 66 78 00", "01 B2 01 14 03 02 00 00 00", "01 B2 01 14 00 74 00 00 00", "01 B2 01 14 04 0A 0B 00 00"])
        // Check fport for each frame in the array
        frame_array.forEach((frame) => {
            expect(frame.fport).toEqual(20)
        })
    });


})


