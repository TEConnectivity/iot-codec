import * as V3_5 from "./3.5.0";
import * as V4_1 from "./4.1.3";
import * as V4_1_4 from "./4.1.4";
import * as V5_2 from "./5.2";



export interface Characteristic {
    uuid: string,
    charac_name: string,
    payload_size: string,
    ble: string,
    lora: string,
    type: CharacType,
}

export enum Operation {
    READ = "r",
    WRITEREAD = "wr",
    WRITE = "w"
}


export type CharacType = V3_5.CharacTypeCommon_3_5_0 |
    V3_5.CharacTypeSP_3_5_0 |
    V4_1.CharacTypeMP_4_1_3 |
    V4_1_4.CharacTypeVib4_1_4 |
    V5_2.CharacTypeGen_5_2 |
    V5_2.CharacTypeSP_5_2 |
    V5_2.CharacTypeVib_5_2


export type UserPayloadType = V3_5.MeasIntervalType |
    V3_5.TriggerMeasType |
    V3_5.BLEActivationType |
    V3_5.EmptyObject |
    V3_5.ThresholdType |
    V3_5.BatteryType |
    V3_5.KeepaliveType |
    V3_5.DatalogArrayType |
    V3_5.DatalogAnalysisType |
    V3_5.LoramodeType |
    V3_5.LorapercentageType |
    V4_1.AxisSelectionType |
    V4_1.PresetSelectionType |
    V4_1.WindowingFunctionType |
    V4_1.PresetConfigurationType |
    V4_1.PresetRequestType |
    V4_1.WindowConfigurationType |
    V4_1.WindowRequestType |
    V4_1.MultipointThresholdLevelType |
    V4_1.MultipointThresholdCommModeType |
    V4_1.MultipointThresholdConfigType |
    V4_1.MultipointThresholdRequestType |
    V4_1.MultipointThresholdHL |
    V4_1_4.RawTimeDataType |
    V5_2.ProtocolVersionType |
    V5_2.MergedMeasurementType |
    V5_2.NetworkLostConfigType |
    V5_2.LoramodeType |
    V5_2.MultipointThresholdRequestType |
    V5_2.MultipointThresholdHL |
    V5_2.MultipointThresholdPresetChangeType |
    V5_2.MultipointThresholdCommModeType |
    V5_2.MultipointThresholdConfigType |
    V5_2.MultipointThresholdLevelType



/**
 * These type of payload are special composite payload providing a high level
 *  structure allowing you to generate multiple frame at once (much simpler than generate all the single frame)
 * 
 * TODO : Support singlepoint Threshold
 */
export type MultiFramePayload = V4_1.MultipointThresholdHL | V5_2.MultipointThresholdHL









export type FirmwareSupportMapType = typeof FirmwareSupportMap;


// Enums for better autocomplete and documentation
export enum FirmwareVersion {
    /** Firmware applying to singlepoint sensors */
    V3_5 = "3.5",
    /** Firmware applying to vibration sensors. Called "multipoint" in the documentation. */
    V4_1 = "4.1",
    /** 5.2 Generic, applying to all PL */
    V5_2 = "5.2"
}

export enum DeviceModel {
    /** Humidity, Pressure, Temperature sensors : 59XXN, 69XXN, 79XXN */
    SINGLEPOINT = "SP",
    /** Vibration sensors : 8931N, 8911N */
    VIBRATION = "Vib"
}


export type FirmwareCharacs<
    V extends FirmwareVersion,
    M extends keyof FirmwareSupportMapType[V]
> = FirmwareSupportMapType[V][M];




/* Which feature is supported on which firmware & model */
export const FirmwareSupportMap = {
    [FirmwareVersion.V3_5]: {
        [DeviceModel.SINGLEPOINT]: {
            ...V3_5.Charac_DB_common,
            ...V3_5.Charac_DB_SP
        }
    },
    [FirmwareVersion.V4_1]: {
        [DeviceModel.VIBRATION]: {
            ...V3_5.Charac_DB_common,
            ...V4_1.Charac_DB_MP,
            raw_time_data: V4_1_4.Charac_DB_Vib4_1_4.raw_time_data
        }
    },
    [FirmwareVersion.V5_2]: {
        [DeviceModel.VIBRATION]: {
            ...V3_5.Charac_DB_common,

            // Keeping only the settings that were same between MP (4.1) and 5.2, threhsold changed because of Preset Change At Threshold
            axis_selection: V4_1.Charac_DB_MP.axis_selection,
            preset_selection: V4_1.Charac_DB_MP.preset_selection,
            windowing_function: V4_1.Charac_DB_MP.windowing_function,
            preset_configuration: V4_1.Charac_DB_MP.preset_configuration,
            preset_request: V4_1.Charac_DB_MP.preset_request,
            window_configuration: V4_1.Charac_DB_MP.window_configuration,
            window_request: V4_1.Charac_DB_MP.window_request,
            meas_interval: V4_1.Charac_DB_MP.meas_interval,

            ...V4_1_4.Charac_DB_Vib4_1_4,
            ...V5_2.Charac_DB_Gen5_2,
            ...V5_2.Charac_DB_Vib5_2

        },
        [DeviceModel.SINGLEPOINT]: {

            // LoRa Mode change, cannot use the same as defined in common
            model_number: V3_5.Charac_DB_common.model_number,
            serial_number: V3_5.Charac_DB_common.serial_number,
            firmware_resolution: V3_5.Charac_DB_common.firmware_resolution,
            hardware_revision: V3_5.Charac_DB_common.hardware_revision,
            manufacturer: V3_5.Charac_DB_common.manufacturer,
            sensor_diagnosis: V3_5.Charac_DB_common.sensor_diagnosis,
            communication_diagnosis: V3_5.Charac_DB_common.communication_diagnosis,
            battery_diagnosis: V3_5.Charac_DB_common.battery_diagnosis,
            device_status: V3_5.Charac_DB_common.device_status,
            battery: V3_5.Charac_DB_common.battery,
            ble_activation: V3_5.Charac_DB_common.ble_activation,
            internal_temperature: V3_5.Charac_DB_common.internal_temperature,
            keepalive: V3_5.Charac_DB_common.keepalive,
            meas_counter: V3_5.Charac_DB_common.meas_counter,
            last_data_acquired: V3_5.Charac_DB_common.last_data_acquired,
            dev_eui: V3_5.Charac_DB_common.dev_eui,
            app_eui: V3_5.Charac_DB_common.app_eui,
            region: V3_5.Charac_DB_common.region,
            net_id: V3_5.Charac_DB_common.net_id,
            lora_status: V3_5.Charac_DB_common.lora_status,
            lora_percentage: V3_5.Charac_DB_common.lora_percentage,
            trig_meas: V3_5.Charac_DB_common.trig_meas,

            ...V3_5.Charac_DB_SP,
            ...V5_2.Charac_DB_Gen5_2,
            ...V5_2.Charac_DB_SP5_2,

        }
    }
} as const;

