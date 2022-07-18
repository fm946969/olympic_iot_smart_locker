def init_device():
    bluetooth.start_uart_service()
    basic.pause(500)
    basic.show_icon(IconNames.HAPPY)

def on_bluetooth_connected():
    basic.show_icon(IconNames.YES)
    basic.pause(200)
    basic.clear_screen()

def on_bluetooth_disconnected():
    basic.show_icon(IconNames.NO)
    basic.pause(200)
    basic.show_icon(IconNames.HAPPY)

def on_uart_data_received():
    global p16
    cmd = bluetooth.uart_read_until(serial.delimiters(Delimiters.SEMI_COLON))
    tokens = cmd.split(" ")
    if tokens[0] == "op_door":
        motor_door = na_n
        if tokens[1] == "#01":
            motor_door = motor.Motors.M1
        elif tokens[1] == "#02":
            motor_door = motor.Motors.M2
        elif tokens[1] == "#03":
            motor_door = motor.Motors.M3
        elif tokens[1] == "#04":
            motor_door = motor.Motors.M4
        if motor_door != na_n:
            basic.show_number(motor_door % 10)
            motor.motor_run(motor_door, motor.Dir.CW, 255)
            basic.pause(500)
            motor.motor_stop(motor_door)
            basic.show_icon(IconNames.HAPPY)
    elif tokens[0] == "?temp":
        bluetooth.uart_write_value("temp", input.temperature())
    elif tokens[0] == "P16":
        p16 = 1023 - p16
        pins.analog_write_pin(AnalogPin.P16, p16)
            

def on_button_pressed_a():
    #bluetooth.uart_write_line("Event Button A")
    bluetooth.uart_write_string("Hi Everyone")
    basic.show_string("A")
    #bluetooth.uart_write_number(102)
    #bluetooth.uart_write_value("x", 0)

def doSomething():
    motor.motor_run(motor.Motors.M1, motor.Dir.CW, 0)
    pins.digital_write_pin(DigitalPin.P0, 0)

txt = ""
p16 = 1023
input.on_button_pressed(Button.A, on_button_pressed_a)
bluetooth.on_bluetooth_connected(on_bluetooth_connected)
bluetooth.on_bluetooth_disconnected(on_bluetooth_disconnected)
bluetooth.on_uart_data_received(serial.delimiters(Delimiters.SEMI_COLON), on_uart_data_received)
bluetooth.start_uart_service()
basic.show_icon(IconNames.HAPPY)