function init_device() {
    bluetooth.startUartService()
    basic.showIcon(IconNames.Happy)
}

function open_door(x: number) {
    let motor_door = NaN
    if (x == 1) {
        motor_door = motor.Motors.M1
    } else if (x == 2) {
        motor_door = motor.Motors.M2
    } else if (x == 3) {
        motor_door = motor.Motors.M3
    } else if (x == 4) {
        motor_door = motor.Motors.M4
    }
    
    if (motor_door != NaN) {
        basic.showNumber(motor_door)
        motor.MotorRun(motor_door, motor.Dir.CW, 255)
        basic.pause(800)
        motor.motorStop(motor_door)
    }
    
    update()
}

function update() {
    
    if (!connected) {
        return
    }
    
    bluetooth.uartWriteLine("" + input.temperature() + ":" + pins.digitalReadPin(DigitalPin.P0) + ":" + pins.digitalReadPin(DigitalPin.P1))
}

let connected = false
let door_1 = NaN
let door_2 = NaN
bluetooth.onBluetoothConnected(function on_bluetooth_connected() {
    basic.showIcon(IconNames.Yes)
})
bluetooth.onBluetoothDisconnected(function on_bluetooth_disconnected() {
    basic.showIcon(IconNames.No)
})
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.SemiColon), function on_uart_data_received() {
    let cmd = bluetooth.uartReadUntil(serial.delimiters(Delimiters.SemiColon))
    if (cmd == "?") {
        update()
        return
    } else if (cmd == "op 1") {
        open_door(1)
    } else if (cmd == "op 2") {
        open_door(2)
    } else if (cmd == "op 3") {
        open_door(3)
    } else if (cmd == "op 4") {
        open_door(4)
    }
    
})
forever(function on_forever() {
    
    
    door_1 = pins.digitalReadPin(DigitalPin.P0)
    pins.analogWritePin(AnalogPin.P16, (1 - door_1) * 1023)
    door_2 = pins.digitalReadPin(DigitalPin.P1)
    pins.analogWritePin(AnalogPin.P15, (1 - door_2) * 1023)
})
init_device()
