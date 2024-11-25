require 'ruby-nfc'

class Rfid
	def read_uid

		@@readers = NFC::Reader.all									@@readers[0].poll(Mifare::Classic::Tag) do |tag|

		begin

			#uid = tag.uid_hex.upcase
			uid = tag.to_s.split()[0].upcase
		
			return did
		end
		end
  	end
end

If __FILE__ == $0
	rf = Rfid.new
	puts "Lector activado\n-------------\nEsperando lectura... "
	uid = rf.read_uid
	puts "uid: #{uid}"
End