import { FrequencyBoundariesError, FrequencyRangeError, InvalidValue, PeakRangeError, PresetRangeError, TimeOutOfRangeError, UnkownCharacTypeError, WindowingFunctionError, WindowRangeError } from "./Exceptions";
import { assert_range_inclusive, displayUint8ArrayAsHex, floatToByteArray, insertValueInByte, is_in_byte_range, is_in_range_inclusive, numberToByteArray, toByteArray, uint8ArrayToBase64 } from "./Helper";
import { CharacTypeVib4_1_4 } from "./Sensors/4.1.4/Vibration";
import { CharacTypeCommon_3_5_0 } from "./Sensors/3.5.0/Common";
import { CharacTypeMP_4_1_3, MultipointThresholdCommModeType, MultipointThresholdConfigType, MultipointThresholdLevelType } from "./Sensors/4.1.3/MP";
import { CharacTypeSP_3_5_0 } from "./Sensors/3.5.0/SP";
import { CharacTypeGen_5_2 } from "./Sensors/5.2/Generic";
import { CharacTypeSP_5_2 } from "./Sensors/5.2/Singlepoint";
import { CONFIG } from "./Config";
import { FirmwareVersion, FirmwareSupportMapType, FirmwareCharacs, FirmwareSupportMap, MultiFramePayload, UserPayloadType, Characteristic, Operation } from "./Sensors/Mapping";
import { CharacTypeVib_5_2, MultipointThresholdPresetChangeType, MultipointThresholdConfigType as MultipointThresholdConfigType_5_2, MultipointThresholdLevelType as MultipointThresholdLevelType_5_2, MultipointThresholdCommModeType as MultipointThresholdCommModeType_5_2 } from "./Sensors/5.2/Vibration";




/** High Level function to encode a frame.
 * 
 * See typescript schemas for the definition of input parameters.
 * 
 * @return Frame object
 * 
 */
export function encode(charac: Characteristic, operationChosen: Operation, userPayload?: UserPayloadType): Frame {



  if (charac.uuid) {
    if (charac.uuid.length !== 4) {
      throw new Error("UUID shall be 2 bytes long.")
    }
  }
  else {
    throw new Error("UUID field is missing in the characteristic.")
  }

  // TODO : Check charac has the correct shape

  var payload_header = new Uint8Array(3);

  // Operation code
  switch (operationChosen) {
    case "w":
      payload_header[0] = 0x01;
      break;
    case "wr":
      payload_header[0] = 0x02
      break;
    default:
      payload_header[0] = 0x00
  }

  // UUID
  var uuid = parseInt(charac.uuid, 16)
  payload_header[1] = (uuid >> 8) & 0xFF; // 1st byte
  payload_header[2] = uuid & 0xFF;  // 2nd byte



  var payload = new Uint8Array(0)

  // Creation of user payload if needed
  if (operationChosen === Operation.WRITE || operationChosen === Operation.WRITEREAD) {


    if (charac.lora) {
      const letterPattern = /(w|wr)/;
      if (letterPattern.test(charac.lora) === false) {
        throw new Error("This charactheristic is not writeable.")
      }
    }
    else
      throw new Error("LoRa rights needs to be mentionned inside the charac object. Check Schemas.")

    if (!userPayload) {
      throw new Error("A userPayload is mandatory for a Write or Write+Read operation.")
    }

    if (charac.type !== userPayload.type) {
      throw new Error("The payload does not fit with this charactheristic. Take a look at Schemas.")
    }

    if (!userPayload.type) {
      throw new Error("Payload needed")
    }


    payload = payloadFormatter(charac, userPayload)


  }



  // Concatenation of both array
  let frame = new Uint8Array(payload_header.length + payload.length);
  frame.set(payload_header, 0)
  frame.set(payload, payload_header.length)


  const returnedFrame = new Frame(frame)

  // if (isValidPayloadType(charac.type, CharacTypeSP) || isValidPayloadType(charac.type, CharacTypeMP) || isValidPayloadType(charac.type, CharacTypeCommon))
  returnedFrame.fport = 20


  return returnedFrame;
}


type EncoderAccessors = {
  read: () => Frame;
  write: (payload: UserPayloadType | MultiFramePayload) => Frame[];
  writeread: (payload: UserPayloadType | MultiFramePayload) => Frame[];
};

type AccessorMap<Characs> = {
  [K in keyof Characs]: EncoderAccessors;
};

export class Encoder<
  V extends FirmwareVersion,
  M extends keyof FirmwareSupportMapType[V]
> {
  fwVersion: V;
  model: M;

  constructor(
    fwVersion: V,
    model: M,
    // @ts-ignore - Used dynamically in constructor
    private readonly characMap: FirmwareCharacs<V, M>
  ) {
    this.fwVersion = fwVersion;
    this.model = model;

    // Dynamically bind all accessors
    (Object.keys(characMap as unknown as object) as Array<keyof FirmwareCharacs<V, M>>).forEach((key) => {
      const charac = characMap[key];
      (this as any)[key] = {
        read: () => encode(charac as unknown as Characteristic, Operation.READ),
        write: (payload: UserPayloadType | MultiFramePayload) => {
          if (isMultiFramePayload(payload)) {  // or check payload.type for multi types
            return encode_multi_frame(charac as unknown as Characteristic, Operation.WRITE, payload);
          }
          return [encode(charac as unknown as Characteristic, Operation.WRITE, payload)];
        },
        writeread: (payload: UserPayloadType) => {
          if (isMultiFramePayload(payload)) {  // or check payload.type for multi types
            return encode_multi_frame(charac as unknown as Characteristic, Operation.WRITEREAD, payload);
          }
          return [encode(charac as unknown as Characteristic, Operation.WRITEREAD, payload)];
        },
      };
    });
  }
}

/**
 * Create a high level Encoder object.
 * 
 * @param fw Firmware version of your sensor 
 * @param model Model of your sensor
 * @returns Encoder object, where you can directly request object on.
 * 
 * @example 
 * const encoder = createEncoder(FirmwareVersion.V4_2_beta, DeviceModel.VIBRATION);
 * encoder.protocol_version.read().toHexString()
 * 
 */
export function createEncoder<
  V extends FirmwareVersion,
  M extends keyof FirmwareSupportMapType[V]
>(
  fw: V,
  model: M
): Encoder<V, M> & AccessorMap<FirmwareCharacs<V, M>> {
  const fwSupport = FirmwareSupportMap[fw];
  const characMap = fwSupport ? fwSupport[model] : undefined;
  if (!characMap) {
    throw new Error(`Unsupported firmware/model: ${fw} / ${String(model)}`);
  }
  return new Encoder(fw, model, characMap) as Encoder<V, M> & AccessorMap<FirmwareCharacs<V, M>>;
}

function isMultiFramePayload(payload: UserPayloadType | MultiFramePayload): payload is MultiFramePayload {
  return 'multi_frame' in payload && payload.multi_frame === true;
}


/**
 * Function used to encode special multi-frame charachteristic such as Threshold.
 * 
 * Example : Configuring a threshold require several frames (conf, level, comm mode, meas interv...), this function generates them all.
 * 
 * 
 */
export function encode_multi_frame(charac: Characteristic, operationChosen: Operation, userPayload: MultiFramePayload): Frame[] {

  const frame_array: Frame[] = []

  switch (userPayload.type) {
    case (CharacTypeMP_4_1_3.MULTIPOINT_THRESHOLD_MULTI): {
      // Shallow copy to avoid modifying by reference the object
      const _charac = { ...charac }
      _charac.type = CharacTypeMP_4_1_3.MULTIPOINT_THRESHOLD

      // Level
      const payload_level: MultipointThresholdLevelType = { ...userPayload, level: userPayload.level, param_sel: "ths_level", type: CharacTypeMP_4_1_3.MULTIPOINT_THRESHOLD }
      frame_array.push(encode(_charac, operationChosen, payload_level))

      // Comm mode, only if LoRa bit is set
      if (userPayload.set_lora_mode || userPayload.set_ble_mode) {
        const payload_comm: MultipointThresholdCommModeType = { ...userPayload, param_sel: "communication_mode", type: CharacTypeMP_4_1_3.MULTIPOINT_THRESHOLD }
        frame_array.push(encode(_charac, operationChosen, payload_comm))
      }

      // Conf        
      const payload_conf: MultipointThresholdConfigType = { ...userPayload, param_sel: "ths_config", type: CharacTypeMP_4_1_3.MULTIPOINT_THRESHOLD }
      frame_array.push(encode(_charac, operationChosen, payload_conf))
      break;

    }
    case (CharacTypeVib_5_2.MULTIPOINT_THRESHOLD_MULTI): {
      // Shallow copy to avoid modifying by reference the object
      const _charac = { ...charac }
      _charac.type = CharacTypeVib_5_2.MULTIPOINT_THRESHOLD

      // Level
      const payload_level: MultipointThresholdLevelType_5_2 = { ...userPayload, level: userPayload.level, param_sel: "ths_level", type: CharacTypeVib_5_2.MULTIPOINT_THRESHOLD }
      frame_array.push(encode(_charac, operationChosen, payload_level))

      // Comm mode, only if LoRa bit is set
      if (userPayload.set_lora_mode || userPayload.set_ble_mode) {
        const payload_comm: MultipointThresholdCommModeType_5_2 = { ...userPayload, param_sel: "communication_mode", type: CharacTypeVib_5_2.MULTIPOINT_THRESHOLD }
        frame_array.push(encode(_charac, operationChosen, payload_comm))
      }

      // Conf        
      const payload_conf: MultipointThresholdConfigType_5_2 = { ...userPayload, param_sel: "ths_config", type: CharacTypeVib_5_2.MULTIPOINT_THRESHOLD }
      frame_array.push(encode(_charac, operationChosen, payload_conf))

      // Preset change
      if (userPayload.change_preset) {
        const payload_preset: MultipointThresholdPresetChangeType = { ...userPayload, param_sel: "preset_change", type: CharacTypeVib_5_2.MULTIPOINT_THRESHOLD }
        frame_array.push(encode(_charac, operationChosen, payload_preset))
      }
      break;
    }


  }

  return frame_array
}



// payloadFormatter could have sensorFamily as parameter and call different version of decoding depending on what's needed

function payloadFormatter(charac: Characteristic, user_payload: UserPayloadType) {

  var encoded_input = new Uint8Array(parseInt(charac.payload_size, 10))

  let bytesArray: number[];


  switch (user_payload.type) {
    case (CharacTypeCommon_3_5_0.BLE_ACTIVATION):
      encoded_input[0] = user_payload.checked ? 1 : 0;
      break;
    case (CharacTypeCommon_3_5_0.BATTERY):
      encoded_input[0] = user_payload.reset ? 0xFF : 0;
      break;
    case (CharacTypeCommon_3_5_0.KEEPALIVE):
      encoded_input[0] = insertValueInByte(encoded_input[0], parseInt(user_payload.keepaliveInterval), 0)
      encoded_input[0] = insertValueInByte(encoded_input[0], parseInt(user_payload.keepaliveMode), 3)
      break;
    case (CharacTypeCommon_3_5_0.LORA_MODE):
      let value = user_payload.mode
      switch (user_payload.mode) {
        case "on_measurement":
          encoded_input[0] = 0
          break;
        case "silent":
          encoded_input[0] = 1
          break;
        default:
          throw new InvalidValue(charac.charac_name, value)
          break;
      }
      break;
    case (CharacTypeCommon_3_5_0.LORA_PERCENTAGE):
      encoded_input[0] = user_payload.percentage
      break;
    case (CharacTypeCommon_3_5_0.TRIGGER_MEASUREMENT):
      encoded_input[0] = user_payload.disconnect ? 0x81 : 0x01
      break;

    // SINGLEPOINT
    case (CharacTypeSP_3_5_0.THRESHOLD):
      encoded_input[0] = parseInt(user_payload.id_data, 16)
      encoded_input[1] = parseInt(user_payload.param_sel, 16)
      bytesArray = toByteArray(user_payload.data32, 4)
      encoded_input.set(bytesArray, 2)
      break;
    case (CharacTypeSP_3_5_0.MEAS_INTERVAL):
      encoded_input[0] = parseInt(user_payload.hour, 10) //Hour
      encoded_input[1] = parseInt(user_payload.minute, 10) //Minute
      encoded_input[2] = parseInt(user_payload.second, 10) //Second
      break;
    case (CharacTypeSP_3_5_0.DATALOG_DATA):
      encoded_input[0] = user_payload.datalog_type
      encoded_input.set(numberToByteArray(user_payload.index, 2), 1)
      encoded_input[3] = user_payload.length
      break;
    case (CharacTypeSP_3_5_0.DATALOG_ANALYSIS):
      encoded_input[0] = 0x02 // check spec, always 2
      encoded_input.set(numberToByteArray(user_payload.length, 2), 1)
      break;

    // MULTIPOINT
    case (CharacTypeMP_4_1_3.AXIS_SELECTION):
      if (user_payload.axis_selected.includes("x"))
        encoded_input[0] = encoded_input[0] | 0x04
      if (user_payload.axis_selected.includes("y"))
        encoded_input[0] = encoded_input[0] | 0x02
      if (user_payload.axis_selected.includes("z"))
        encoded_input[0] = encoded_input[0] | 0x01
      break;
    case (CharacTypeMP_4_1_3.PRESET_SELECTION):

      encoded_input[0] = user_payload.main_preset
      if (!is_in_byte_range(user_payload.main_preset))
        throw new PresetRangeError()

      encoded_input[1] = user_payload.secondary_preset ?? 0xFF
      if (!is_in_byte_range(encoded_input[1]))
        throw new PresetRangeError()


      break;
    case (CharacTypeMP_4_1_3.WINDOWING_FUNCTION):
      if (user_payload.function == "none")
        encoded_input[0] = 0x00
      else if (user_payload.function == "hann")
        encoded_input[0] = 0x01
      else if (user_payload.function == "flattop")
        encoded_input[0] = 0x02
      else
        throw new WindowingFunctionError()
      break;
    case (CharacTypeMP_4_1_3.PRESET_CONFIGURATION):
      if (!is_in_byte_range(user_payload.meas_interval_hour))
        throw new PresetRangeError()
      encoded_input[0] = user_payload.preset_id

      encoded_input[1] = user_payload.frame_format

      encoded_input[2] = user_payload.bandwidth_mode

      if (!is_in_byte_range(user_payload.meas_interval_hour))
        throw new TimeOutOfRangeError()
      encoded_input[3] = user_payload.meas_interval_hour

      if (!is_in_byte_range(user_payload.meas_interval_minute))
        throw new TimeOutOfRangeError()
      encoded_input[4] = user_payload.meas_interval_minute

      if (!is_in_byte_range(user_payload.meas_interval_second))
        throw new TimeOutOfRangeError()
      encoded_input[5] = user_payload.meas_interval_second

      break;
    case (CharacTypeMP_4_1_3.PRESET_REQUEST):
      if (!is_in_byte_range(user_payload.preset_id))
        throw new PresetRangeError()
      encoded_input[0] = user_payload.preset_id
      break;
    case (CharacTypeMP_4_1_3.WINDOW_CONFIGURATION):
      if (!is_in_byte_range(user_payload.preset_id))
        throw new PresetRangeError()
      encoded_input[0] = user_payload.preset_id

      if (!is_in_range_inclusive(1, 8, user_payload.window_id))
        throw new WindowRangeError()
      encoded_input[1] = user_payload.window_id

      encoded_input[2] = user_payload.enable == true ? 0x01 : 0x00

      if (!is_in_range_inclusive(1, 64, user_payload.peak_count))
        throw new PeakRangeError()
      encoded_input[3] = user_payload.peak_count

      if (user_payload.frequency_min >= user_payload.frequency_max)
        throw new FrequencyBoundariesError()

      if (!is_in_range_inclusive(0, 20800, user_payload.frequency_min) || !is_in_range_inclusive(0, 20800, user_payload.frequency_max))
        throw new FrequencyRangeError()
      encoded_input[3] = user_payload.peak_count

      encoded_input.set(numberToByteArray(user_payload.frequency_min, 2), 4)
      encoded_input.set(numberToByteArray(user_payload.frequency_max, 2), 6)
      break;
    case (CharacTypeMP_4_1_3.WINDOW_REQUEST):
      if (!is_in_byte_range(user_payload.preset_id))
        throw new PresetRangeError()
      encoded_input[0] = user_payload.preset_id

      if (!is_in_range_inclusive(1, 8, user_payload.window_id))
        throw new WindowRangeError()
      encoded_input[1] = user_payload.window_id
      break;
    case (CharacTypeMP_4_1_3.MULTIPOINT_THRESHOLD):
      // ID_DATA(1) | PARAM_SEL(1) | DATA32(4)
      encoded_input[0] = user_payload.id_data

      if (user_payload.param_sel === "ths_config") {
        encoded_input[1] = 0x00

        if (user_payload.event_flag)
          encoded_input[2] |= 0x80
        if (user_payload.enabled)
          encoded_input[2] |= 0x40
        if (user_payload.direction == "above")
          encoded_input[2] |= 0x20
        if (user_payload.auto_clear)
          encoded_input[2] |= 0x10
        if (user_payload.set_ble_mode)
          encoded_input[2] |= 0x04
        if (user_payload.set_lora_mode)
          encoded_input[2] |= 0x02
      }
      else if (user_payload.param_sel === "ths_level") {
        encoded_input[1] = 0x01
        encoded_input.set(floatToByteArray(user_payload.level), 2)
      }
      else if (user_payload.param_sel === "communication_mode") {
        encoded_input[1] = 0x03
        switch (user_payload.ble_mode) {
          case "burst+periodic":
            encoded_input[2] = 0x00
            break;
          case "burst":
            encoded_input[2] = 0x01
            break;
          case "silent":
            encoded_input[2] = 0x02
            break;
          case "periodic":
            encoded_input[2] = 0x03
            break;
        }
        switch (user_payload.lora_mode) {
          case "on_measurement":
            encoded_input[3] = 0x00
            break;
        }
      }
      break;
    case (CharacTypeMP_4_1_3.MULTIPOINT_THRESHOLD_REQUEST):
      encoded_input[0] = user_payload.id_data
      switch (user_payload.param_sel) {
        case "ths_config":
          encoded_input[1] = 0x00
          break;
        case "ths_level":
          encoded_input[1] = 0x01
          break;
        case "communication_mode":
          encoded_input[1] = 0x03
          break;
      }
      break;

    // Vib 4.1_4
    case (CharacTypeVib4_1_4.RAW_TIME_DATA):
      switch (user_payload.axis_selected) {
        case "x":
          encoded_input[0] = 0x04
          break;
        case "y":
          encoded_input[0] = 0x02
          break;
        case "z":
          encoded_input[0] = 0x01
          break;
      }
      encoded_input.set(numberToByteArray(user_payload.index, 2), 1)
      encoded_input[3] = user_payload.length
      break;

    // Generic 5.2
    case (CharacTypeGen_5_2.PROTOCOL_VERSION):
      encoded_input[0] = user_payload.version
      break;

    case (CharacTypeGen_5_2.NETWORK_LOST_CONFIG):
      assert_range_inclusive(CONFIG.network_lost_config.adr_ack_limit_min, CONFIG.network_lost_config.adr_ack_limit_max, user_payload.adr_ack_limit)
      encoded_input[0] = user_payload.adr_ack_limit

      assert_range_inclusive(CONFIG.network_lost_config.adr_ack_delay_min, CONFIG.network_lost_config.adr_ack_delay_max, user_payload.adr_ack_delay)
      encoded_input[1] = user_payload.adr_ack_delay

      assert_range_inclusive(CONFIG.network_lost_config.confirmed_nack_retry_min, CONFIG.network_lost_config.confirmed_nack_retry_max, user_payload.confirmed_nack_retry)
      encoded_input[2] = user_payload.confirmed_nack_retry

      assert_range_inclusive(CONFIG.network_lost_config.periodic_unjoin_delay_min, CONFIG.network_lost_config.periodic_unjoin_delay_max, user_payload.periodic_unjoin_delay)
      encoded_input.set(numberToByteArray(user_payload.periodic_unjoin_delay, 2), 3)
      break;

    // SP 5.2

    case (CharacTypeSP_5_2.LORA_MODE):
      switch (user_payload.mode) {
        case "on_measurement":
          encoded_input[0] = 0
          break;
        case "silent":
          encoded_input[0] = 1
          break;
        case "merged":
          encoded_input[0] = 2
          break;
        default:
          break;
      }
      break;

    case (CharacTypeSP_5_2.MERGE_MEASUREMENT):

      assert_range_inclusive(CONFIG.merged_mode.meas_number_min, CONFIG.merged_mode.meas_number_max, user_payload.measurement_number)
      encoded_input[0] = user_payload.measurement_number

      encoded_input[1] = 0x00
      if (user_payload.measurement_counter)
        encoded_input[1] |= 0x01
      if (user_payload.timestamp)
        encoded_input[1] |= 0x02
      if (user_payload.secondary_temperature)
        encoded_input[1] |= 0x04

      break;


    // Vib 5.2

    case (CharacTypeVib_5_2.MULTIPOINT_THRESHOLD):
      // ID_DATA(1) | PARAM_SEL(1) | DATA32(4)
      encoded_input[0] = user_payload.id_data

      if (user_payload.param_sel === "ths_config") {
        encoded_input[1] = 0x00

        if (user_payload.event_flag)
          encoded_input[2] |= 0x80
        if (user_payload.enabled)
          encoded_input[2] |= 0x40
        if (user_payload.direction == "above")
          encoded_input[2] |= 0x20
        if (user_payload.auto_clear)
          encoded_input[2] |= 0x10
        if (user_payload.set_ble_mode)
          encoded_input[2] |= 0x04
        if (user_payload.set_lora_mode)
          encoded_input[2] |= 0x02
      }
      else if (user_payload.param_sel === "ths_level") {
        encoded_input[1] = 0x01
        encoded_input.set(floatToByteArray(user_payload.level), 2)
      }
      else if (user_payload.param_sel === "communication_mode") {
        encoded_input[1] = 0x03
        switch (user_payload.ble_mode) {
          case "burst+periodic":
            encoded_input[2] = 0x00
            break;
          case "burst":
            encoded_input[2] = 0x01
            break;
          case "silent":
            encoded_input[2] = 0x02
            break;
          case "periodic":
            encoded_input[2] = 0x03
            break;
        }
        switch (user_payload.lora_mode) {
          case "on_measurement":
            encoded_input[3] = 0x00
            break;
        }
      }
      else if (user_payload.param_sel === "preset_change") {
        encoded_input[1] = 0x04
        encoded_input[2] = user_payload.preset_id_slot0
        encoded_input[3] = user_payload.preset_id_slot1
      }
      break;

    default:
      throw new UnkownCharacTypeError()
  }

  return encoded_input

}


export class Frame {
  private frame: Uint8Array;

  public fport: number;

  constructor(frame: Uint8Array, fport?: number) {
    this.fport = fport ?? 0;
    this.frame = frame;
  }

  /** Method to convert the frame to hex string (e.g. [0x00,0xAA] to "00 AA")
  */
  toHexString(): string {
    return displayUint8ArrayAsHex(this.frame);
  }

  /** Return byte array representation of the frame (e.g. [0x00,0xAA])
  */
  toByteArray(): Uint8Array {
    return this.frame;
  }

  /** Convenience function to return Base64 encoded version of the frame.
  */
  toBase64(): string {
    return uint8ArrayToBase64(this.frame)
  }

}
