
let connected = false
let door_1 = NaN
let door_2 = NaN

function open_door(motor_door: number) {
    motor.MotorRun(motor_door, motor.Dir.CW, 255)
    basic.pause(800)
    motor.motorStop(motor_door)
    update()
}

function update() {
    bluetooth.uartWriteLine("" + input.temperature() + ":" + door_1 + ":" + door_2)
}

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
    pins.digitalWritePin(DigitalPin.P16, (1 - door_1))
    door_2 = pins.digitalReadPin(DigitalPin.P1)
    pins.digitalWritePin(DigitalPin.P15, (1 - door_2))
    
    if (door_1 == 1 && door_2 == 1) {
        basic.showIcon(IconNames.Yes)
    } else if (door_1 == 0) {
        basic.showNumber(1)
    } else if (door_2 == 0) {
        basic.showNumber(2)
    }
})
bluetooth.startUartService()
basic.showIcon(IconNames.Happy)
