import { encode } from "../src/EncoderLib";
import { BatteryType, CharacType, Charac_DB, Operation, SensorFamily, UserPayloadType } from "../src/Schemas";


var user_payload = {} as UserPayloadType

// Read the battery level, payload is empty since it is a read request

// Return hex string frame
let frame = encode(Charac_DB.battery, Operation.READ, user_payload, SensorFamily.Singlepoint)
console.log(frame.toHexString()) // Output string "00 2A 19"
// Return byte array
console.log(frame.toByteArray()) // Output Big-endian byte array [0x00, 0x2A, 0x19] (also represented in Base 10 as [0,42,25])
// Return byte array
console.log(frame.toBase64()) // Output Base64 "ACoZ"



// Do a reset battery, it's a write operation, the characteristic is the same
var battery_reset_payload: BatteryType = { reset: true, type: CharacType.BATTERY }
console.log(encode(Charac_DB.battery, Operation.WRITE, battery_reset_payload).toHexString()) // Output string "01 2A 19 FF"

