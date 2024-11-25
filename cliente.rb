require 'gtk3'
require 'thread'
require_relative 'vr2.rb'
require_relative 'lcd_controller' 

BLUE = Gdk::RGBA.new(0, 0, 1, 0.65)
RED = Gdk::RGBA.new(1, 0, 0, 0.65)
WHITE = Gdk::RGBA.new(1, 1, 1, 1)
TEXTO_INICIAL = "Introdueix la targeta o clauer"

class Rfid_Reader
  attr_reader :last_uid # Permite acceder al ultimo UID leido

  def initialize(reader, handler)
    @reader = reader
    @handler = handler
    @last_uid = nil # Variable para almacenar el ultimo UID leido
  end

  def read_uid
    Thread.new do
      uid = @reader.read_uid
      @last_uid = uid # Guardar el UID en la variable de instancia
      uid = nil if uid.nil?
      GLib::Idle.add { @handler.call("#{uid}") }
    end
  end
end

# Inicializar LCD (asegurate de tener la clase LCDController configurada)
$lcd = LCDController.new

# Crear ventana GTK
window = Gtk::Window.new("Rfid_gtk.rb")
window.set_border_width(10)
window.set_position(Gtk::WindowPosition::CENTER)
window.signal_connect("delete_event") do
  Gtk.main_quit
  false
end

# Crear caja
vbox = Gtk::VBox.new(false, 5)
window.add(vbox)

# Etiqueta para mostrar el estado
$tag = Gtk::Label.new(TEXTO_INICIAL)
$tag.override_background_color(:normal, BLUE)
$tag.override_color(:normal, WHITE)
$tag.set_size_request(350, 65)
vbox.add($tag)

# Boton para limpiar el estado
button = Gtk::Button.new(label: "Clear")
vbox.add(button)
button.signal_connect("clicked") do |_w|
  $tag.set_text(TEXTO_INICIAL)
  $tag.override_background_color(:normal, BLUE)
  $rfid.read_uid
end

# Metodo para actualizar la ventana y el LCD
def update_window(uid)
  $tag.set_text("UID: #{uid}")
  $tag.override_background_color(:normal, RED)

  # Mostrar UID en el LCD
  if uid
    $lcd.printLCD("UID: #{uid}") # Asegï¿½rate de que este mï¿½todo estï¿½ definido en LCDController
  else
    $lcd.printLCD("Lectura fallida")
  end
end

# Instanciar lector RFID
$rfid = Rfid_Reader.new(Rfid_PN532.new, method(:update_window))
$rfid.read_uid

# Mostrar ventana GTK
window.show_all
Gtk.main
