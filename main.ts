function init_device() {
    bluetooth.startUartService()
    basic.pause(500)
    basic.showIcon(IconNames.Happy)
}

// bluetooth.uart_write_number(102)
// bluetooth.uart_write_value("x", 0)
function doSomething() {
    motor.MotorRun(motor.Motors.M1, motor.Dir.CW, 0)
    pins.digitalWritePin(DigitalPin.P0, 0)
}

let txt = ""
let p16 = 1023
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    // bluetooth.uart_write_line("Event Button A")
    bluetooth.uartWriteString("Hi Everyone")
    basic.showString("A")
})
bluetooth.onBluetoothConnected(function on_bluetooth_connected() {
    basic.showIcon(IconNames.Yes)
    basic.pause(200)
    basic.clearScreen()
})
bluetooth.onBluetoothDisconnected(function on_bluetooth_disconnected() {
    basic.showIcon(IconNames.No)
    basic.pause(200)
    basic.showIcon(IconNames.Happy)
})
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.SemiColon), function on_uart_data_received() {
    let motor_door: number;
    
    let cmd = bluetooth.uartReadUntil(serial.delimiters(Delimiters.SemiColon))
    let tokens = _py.py_string_split(cmd, " ")
    if (tokens[0] == "op_door") {
        motor_door = NaN
        if (tokens[1] == "#01") {
            motor_door = motor.Motors.M1
        } else if (tokens[1] == "#02") {
            motor_door = motor.Motors.M2
        } else if (tokens[1] == "#03") {
            motor_door = motor.Motors.M3
        } else if (tokens[1] == "#04") {
            motor_door = motor.Motors.M4
        }
        
        if (motor_door != NaN) {
            basic.showNumber(motor_door % 10)
            motor.MotorRun(motor_door, motor.Dir.CW, 255)
            basic.pause(500)
            motor.motorStop(motor_door)
            basic.showIcon(IconNames.Happy)
        }
        
    } else if (tokens[0] == "?temp") {
        bluetooth.uartWriteValue("temp", input.temperature())
    } else if (tokens[0] == "P16") {
        p16 = 1023 - p16
        pins.analogWritePin(AnalogPin.P16, p16)
    }
    
})
bluetooth.startUartService()
basic.showIcon(IconNames.Happy)
