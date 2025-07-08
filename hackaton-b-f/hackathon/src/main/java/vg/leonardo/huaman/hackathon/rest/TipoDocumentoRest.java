package vg.leonardo.huaman.hackathon.rest;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.AllArgsConstructor;
import vg.leonardo.huaman.hackathon.model.TipoDocumento;
import vg.leonardo.huaman.hackathon.repository.TipoDocumentoRepository;
import vg.leonardo.huaman.hackathon.service.fichasService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/tipos-documento")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class TipoDocumentoRest {

    private TipoDocumentoRepository tipoDocumentoRepository;


    // GET /api/tipos-documento - Listar todos los tipos de documento
    @GetMapping
    public ResponseEntity<List<TipoDocumento>> getAllTipos() {
        try {
            List<TipoDocumento> tipos = tipoDocumentoRepository.findAll();
            return ResponseEntity.ok(tipos);
        } catch (Exception e) {
            System.err.println("Error al listar tipos de documento: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/tipos-documento/{id} - Obtener tipo por ID
    @GetMapping("/{id}")
    public ResponseEntity<TipoDocumento> getTipoById(@PathVariable Long id) {
        try {
            return tipoDocumentoRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Error al buscar tipo por ID " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // POST /api/tipos-documento - Crear nuevo tipo
    @PostMapping
    public ResponseEntity<TipoDocumento> createTipo(@RequestBody TipoDocumento tipo) {
        try {
            TipoDocumento nuevoTipo = tipoDocumentoRepository.save(tipo);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoTipo);
        } catch (Exception e) {
            System.err.println("Error al crear tipo de documento: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}
