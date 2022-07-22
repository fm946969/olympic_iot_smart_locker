def on_bluetooth_connected():
    basic.show_icon(IconNames.YES)

def on_bluetooth_disconnected():
    basic.show_icon(IconNames.NO)

def open_door(motor_door):
    motor.motor_run(motor_door, motor.Dir.CW, 255)
    basic.pause(800)
    motor.motor_stop(motor_door)
    update()

def update():
    global door_1
    global door_2
    bluetooth.uart_write_line("" + input.temperature() + ":" + door_1 + ":" + door_2)

def on_uart_data_received():
    cmd = bluetooth.uart_read_until(serial.delimiters(Delimiters.SEMI_COLON))
    if cmd == "?":
        update()
        return
    elif cmd == "op 1":
        open_door(1)
    elif cmd == "op 2":
        open_door(2)
    elif cmd == "op 3":
        open_door(3)
    elif cmd == "op 4":
        open_door(4)

def on_forever():
    global door_1
    global door_2
    #
    door_1 = pins.digital_read_pin(DigitalPin.P0)
    pins.digital_write_pin(DigitalPin.P16, 1-door_1)
    #
    door_2 = pins.digital_read_pin(DigitalPin.P1)
    pins.digital_write_pin(DigitalPin.P15, 1-door_2)
    #
    if door_1 == 0:
        basic.show_number(1)
    elif door_2 == 0:
        basic.show_number(2)
    else:
        pass
    #    basic.show_icon(IconNames.YES)
    #el
    #

connected = False
door_1 = na_n
door_2 = na_n

bluetooth.on_bluetooth_connected(on_bluetooth_connected)
bluetooth.on_bluetooth_disconnected(on_bluetooth_disconnected)
bluetooth.on_uart_data_received(serial.delimiters(Delimiters.SEMI_COLON), on_uart_data_received)

bluetooth.start_uart_service()
basic.pause(500)
basic.show_icon(IconNames.HAPPY)
forever(on_forever)