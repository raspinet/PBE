require 'mfrc522' # Requiere la librería para interactuar con el lector RFID-RC522

class Rfid
  def get_uid
    begin
      r = MFRC522.new # Creamos una instancia de MFRC522

      r.picc_request(MFRC522::PICC_REQA) # Enviamos una solicitud a la RFID para establecer comunicación

      uid_dec, _ = r.picc_select # Intentamos leer la UID y almacenamos en "uid_dec"

    rescue CommunicationError # Capturamos excepciones de comunicación y reintentamos
      retry # Reintentamos en caso de error
    end

    uid = uid_dec.map { |dec| dec.to_s(16) }.join('').upcase # Convertimos el UID a hexadecimal y lo concatenamos

    return uid # Retornamos el UID en mayúsculas
  end
end

if __FILE__ == $0 # Para inicializar el programa
  rf = Rfid.new # Creamos una instancia de Rfid
  uid = rf.get_uid # Método para leer el UID de la tarjeta
  puts "UID: #{uid}" # Imprimimos el UID por pantalla
end
