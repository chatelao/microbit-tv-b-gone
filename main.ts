/**
 * This is a demo on how to send SAMSUNG ir codes.
 * 
 * The code expects an IR led to be connected to Pin 0
 * 
 * A SAMSUNG IR code has the following form
 * 
 * START SIGNAL
 * 
 * 32 bits i.e. 32 time ONE or ZERO signal
 * 
 * END SIGNAL
 * 
 * Each of these 4 signals is encoded by a certain time of a 38 khz
 * 
 * pulsed signal (on) followed by a certain time off.
 * 
 * START SIGNAL: 4500 μs on, 4500 μs off
 * 
 * ONE SIGNAL: 560 μs on, 1600 μs off
 * 
 * ZERO SIGNAL: 560 μs on, 530 μs off
 * 
 * END SIGNAL: 560 μs on, 4500 μs off
 */
function ledOn (d: number) {
    r = d * FACTOR
    while (r > 26) {
        pins.digitalWritePin(DigitalPin.P0, 1)
        control.waitMicros(2)
        pins.digitalWritePin(DigitalPin.P0, 0)
        r = r - 26
    }
}
function ledOff (d: number) {
    control.waitMicros(d * FACTOR)
}
// Button A sends code
input.onButtonPressed(Button.A, function () {
    if (code == 0) {
        command(224, 224, 64, 191)
    } else if (code == 1) {
        command(224, 224, 208, 47)
    } else if (code == 2) {
        command(224, 224, 224, 31)
    }
})
// send 8 bit
function send (code: number) {
    for (let i = 7; i > -1; i--) {
        if (1 << i & code) {
            ledOn(PULSE_BIT);
            ledOff(PULSE_ONE);
        } else {
            ledOn(PULSE_BIT);
            ledOff(PULSE_ZERO);
        }
    }
}
// Button A+B changes between demo and real mode
// Demo is 200 times slower
input.onButtonPressed(Button.AB, function () {
    if (FACTOR == 1) {
        FACTOR = 200
    } else {
        FACTOR = 1
    }
    basic.showLeds(`
        # . . . #
        . # . # .
        . . # . .
        . # . # .
        # . . . #
        `)
})
// Button B changes code
input.onButtonPressed(Button.B, function () {
    code = (code + 1) % 3
})
// send 32 bit with appropriate start and end
function command (ir1: number, ir2: number, ir3: number, ir4: number) {
    ledOn(LEADER_PULSE)
    ledOff(LEADER_PULSE)
    send(ir1)
    send(ir2)
    send(ir3)
    send(ir4)
    ledOn(PULSE_BIT)
    ledOff(LEADER_PULSE)
}
let r = 0
let FACTOR = 0
let PULSE_BIT = 0
let LEADER_PULSE = 0
// current code
// 0 : turn on / off
// 1 : volume down
// 2 : volume up
let code = 0
// timing constants
LEADER_PULSE = 4500
PULSE_BIT = 560
let PULSE_ONE = 1600
let PULSE_ZERO = 530
// slow down factor for demo, at about 100 or 200 times slower
// you can see what is going on
FACTOR = 1
// show symbol for current code
basic.forever(function () {
    if (code == 0) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . . . . .
            . . . . .
            `)
    } else if (code == 1) {
        basic.showLeds(`
            . . # . .
            . . # . .
            # . # . #
            . # # # .
            . . # . .
            `)
    } else if (code == 2) {
        basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
            `)
    }
    basic.pause(500)
})
