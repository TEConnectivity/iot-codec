# Description

This NPM module is the TE Connectivity encoding library allowing an user to generate a LoRaWAN configuration downlink frame. It is provided as an NPM module to ease the integration.

It is MIT licensed, this piece of sotware is hence provided "as-is" without any warranty.

## Installation

Inside your module, run ```npm install @te-connectivity/iot-codec```. 

## Usage


The encoding is done using the ```encode``` function. All the input schemas are available on the reference file [Schemas.ts](src/Schemas.ts).

Input :

- ```charac```: Its Typescript type is ```Characteristic```. It holds information about the parameter being configured, typically its *uuid* and *payload_length*, for the encoder to know how to build the frame. The list of charac depends on the sensor, please check the technical specification. For convienence, a list of charac are already defined and are available inside the ```Charac_DB``` object.
- ```operationChosen```: Its Typescript type is ```Operation```. It contains the type of operation : *read*, *write* or *write+read*. The ```user_payload``` is ignored in case of *read* operation.
- ```userPayload```: Its Typescript type is ```UserPayloadType```. The actual data configured. It's a Union type, so please refer to the schemas to check the shape of this argument.
- ```sensorFamily```:  Its Typescript type is ```SensorFamily```: [*Optional*]. The family of sensor configured. The default value is ```SensorFamily.SinglePoint```.

Output :

A ```Frame``` object. Has three methods :
- toHexString() : to return the frame in Hex string "AA BB", easily printable for the end user.
- toByteArray() : to return the frame in byte array [0xAA, 0xBB]
- toBase64() : convenience function to generate a Base64 frames, ready to be sent to integrate with other systems.

And one field :
- fport : the LoRa fPort on which this frame should be sent.


### Example


```JavaScript

    import { Charac_DB, encode, Operation, UserPayloadType, SensorFamily } from '@te-connectivity/iot-codec';

    // Read battery level
    var encoded = encode(Charac_DB.battery, Operation.READ, {} as UserPayloadType, SensorFamily.Singlepoint) 

    console.log(encoded.toHexString());
    // Output string "00 2A 19"
```

For a full example, please check [example](/example/index.ts) folder, or run ```npm run example```.

For several examples with a lot of different characteristics, please take a look at the [test folder](/test).


### Multi-frame support

For complex characheteristic such as threshold, which needs to be configured by sending several successives frames, a higher level interface is available, with the `encode_multi_frame` function. It is used with `MultiFramePayload`.  

Using this function will generate an array of frame, and each frame should be sent in the order given.


# Version mapping 

This librarie encodes frames for the following sensor families : 

| Sensor        | Encoding |
| ------------- | -------- |
| 8931  (4.1.x) | ✅        |
| 8911  (4.1.x) | ✅        |
| 59XX  (3.5.0) | ✅        |
| 69XX  (3.5.0) | ✅        |
| 79XX  (3.5.0) | ✅        |

3.X branch is commonly referred as "Singlepoint" (because measurement has only one point, let's say temperature) while 4.X branch is commonly referred as "Multipoint" (because the measurement is composed of 4096 time sample).

# Roadmap

- Integration of the decoding librarie, currently hosted on another repository. Link to be updated soon.
- Singlepoint :
  - Addition of threshold in user-friendly way (same as in MP)


# Contributing

Pull request are welcome. 

NPM scripts : 
- `npm run build` : build the project
- `npm run start` : watch the project (build on file change)
- `npm run size` : estimate size of project
- `npm run example` : run the examples present in index.ts
- `npm run test` : run the tests files
- `npm run test:watch` : run the tests files in watch mode


Typical usage to publish NPM package: 

- `npm run test` : Validate all the test
- Increase version number (match git tag) in package.json
- git add / commit / push / tag
- `npm login` : Login to the NPM registry
- `npm publish` : Push the package to NPM
