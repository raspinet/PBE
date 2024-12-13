require 'i2c/drivers/lcd'

class LCDController
    def initialize
      @display = I2C::Drivers::LCD::Display.new('/dev/i2c-1', 0x27, rows: 4, cols: 20)
    end
  
    def printLCD(texto)
      @display.clear
      # Divide el texto en fragmentos de 20 caracteres
      lineas = texto.scan(/.{1,20}/)
      # Imprime cada l�nea hasta un m�ximo de 4
      lineas.each_with_index do |linea, index|
        @display.text(linea, index) if index < 4
      end
    end
  
    def printCenter(mensaje)
      # Divide el mensaje en l�neas seg�n saltos de l�nea
      lineas = mensaje.split("\n")
  
      # Centrar cada l�nea
      lineas_centradas = lineas.map do |linea|
        espacio = [(20 - linea.length) / 2, 0].max
        " " * espacio + linea
      end
  
      # Imprimir las l�neas centradas
      printLCD(lineas_centradas.join("\n"))
    end
  end
  
