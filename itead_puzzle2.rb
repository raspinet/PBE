require "gtk3"
require "thread"
require "puzzle1"

@rf = Rfid.new
@window = Gtk::Window.new("Rfid Window")
@window.set_size_request(600,150)
@window.set_border_width(5)
@uid = ""

@blue = Gdk::RGBA::new(0,0,1,1)
@white = Gdk::RGBA::new(1,1,1,1)
@red = Gdk::RGBA::new(1,0,0,1)

@window_button = Gtk::Button::new(:label => "Por favor, acerca tu tarjeta de identidad de la uni")
@window_button.override_background_color(:normal, @blue)
@window_button.override_color(:normal, @white)
@button = Gtk::Button::new(:label => "Clear")

@fixed = Gtk::Fixed.new
@button.set_size_request(540,40)
@window_button.set_size_request(540,100)
@fixed.put(@window_button,30,0)
@fixed.put(@button,30,110)
@window.add(@fixed)

@button.signal_connect"clicked" do |_widget|
    if @uid != ""
        @uid = ""
        @window_button.override_background_color(:normal, @blue)
        @window_button.set_label("Por favor, acerca tu tarjeta de identidad de la uni")
        
        threads
    end
end

def threads
    thr = Thread.new {
        lectura
        puts "END THREAD"
        thr.exit
    }
end
threads

def lectura
    puts "Esperando id"
    @uid = @rf.read_uid
    GLib::Idle.add{gestion_UI}
end

def gestion_UI
    if @uid != ""
        @window_button.set_label(@uid)
        @window_button.override_background_color(:normal, @red)
    end
end

@window.signal_connect("delete-event"){|_widget| Gtk.main_quit}
@window.show_all
Gtk.main
