# Description

This NPM module is the TE Connectivity encoding library allowing an user to generate a LoRaWAN configuration downlink frame. It is provided as an NPM module to ease the integreation.

The license is MIT, this piece of sotware is hence provided "as-is" without any warranty.

## Installation

Inside your module, run ```npm install @te-connectivity/iot-codec```. 

## Usage


The encoding is done using the ```encode``` function. All the input schemas are available on the reference file [Schemas.ts](src/Schemas.ts).

Input :

- ```charac```: Its Typescript type is ```Characteristic```. It holds information about the parameter being configured, typically its *uuid* and *payload_length*, for the encoder to know how to build the frame. The list of charac depends on the sensor, please check the technical specification. For convienence, a list of charac are already defined and are available inside the ```Charac_DB``` object.
- ```operationChosen```: Its Typescript type is ```Operation```. It contains the type of operation : *read*, *write* or *readwrite*. The ```user_payload``` is ignored in case of *read* operation.
- ```userPayload```: Its Typescript type is ```UserPayloadType```. The actual data configured. It's a Union type, so please refer to the schemas to check the shape of this argument.
- ```sensorFamily```:  Its Typescript type is ```SensorFamily```: [*Optional*]. The family of sensor configured. The default value is ```SensorFamily.SinglePoint```.

Output :

A ```Frame``` object. Has three methods :
- toHexString() : to return the frame in Hex string "AA BB", easily printable for the end user.
- toByteArray() : to return the frame in byte array [0xAA, 0xBB]
- toBase64() : convenience function to generate a Base64 frames, ready to be sent to integrate with other systems.


### Example


```JavaScript

    import { Charac_DB, encode, Operation, UserPayloadType, SensorFamily } from '@te-connectivity/iot-codec';

    // Read battery level
    var encoded = encode(Charac_DB.battery, Operation.READ, {} as UserPayloadType, SensorFamily.Singlepoint) 

    console.log(encoded.toHexString());
    // Output string "00 2A 19"
```

For a full example, please check [example](/example/index.ts) folder, or run ```npm run example```.


# Version

This librarie encodes frames for the following sensor families : 

| Sensor        | Encoding |
| ------------- | -------- |
| 8931  (4.0.1) | ❌        |
| 8911  (4.0.1) | ❌        |
| 59XX  (3.5.0) | ✅        |
| 69XX  (3.5.0) | ✅        |
| 79XX  (3.5.0) | ✅        |


# Roadmap

- Integration of the decoding librarie, currently hosted on another repository. Link to be updated soon.
- Support of Multipoint


# Contributing

Pull request are welcome. 

NPM scripts : 
- `npm run build` : build the project
- `npm run start` : watch the project (build on file change)
- `npm run size` : estimate size of project
- `npm run example` : run the examples present in index.ts
- `npm run test` : run the tests files
