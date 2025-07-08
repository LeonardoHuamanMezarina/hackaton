package vg.leonardo.huaman.hackathon.rest;

import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import lombok.AllArgsConstructor;
import vg.leonardo.huaman.hackathon.model.fichasModel;
import vg.leonardo.huaman.hackathon.service.fichasService;

@RestController
@RequestMapping("/api/fichas")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class fichasRest {

    private fichasService fichasService;

    // GET /api/fichas/listar - Listar TODAS las fichas de la base de datos
    @GetMapping("/listar")
    public ResponseEntity<List<fichasModel>> getAllFichas() {
        try {
            List<fichasModel> fichas = fichasService.getAll();
            return ResponseEntity.ok(fichas);
        } catch (Exception e) {
            System.err.println("Error al listar fichas: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/fichas/{id} - Obtener ficha por ID
    @GetMapping("/{id}")
    public ResponseEntity<fichasModel> getFichaById(@PathVariable Long id) {
        try {
            Optional<fichasModel> ficha = fichasService.findById(id);
            return ficha.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Error al buscar ficha por ID " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/fichas/buscar/tema/{tema} - Buscar por tema
    @GetMapping("/buscar/tema/{tema}")
    public ResponseEntity<List<fichasModel>> buscarPorTema(@PathVariable String tema) {
        try {
            List<fichasModel> fichas = fichasService.findByTema(tema);
            return ResponseEntity.ok(fichas);
        } catch (Exception e) {
            System.err.println("Error al buscar por tema '" + tema + "': " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/fichas/buscar/autor/{autor} - Buscar por autor
    @GetMapping("/buscar/autor/{autor}")
    public ResponseEntity<List<fichasModel>> buscarPorAutor(@PathVariable String autor) {
        try {
            List<fichasModel> fichas = fichasService.findByAutor(autor);
            return ResponseEntity.ok(fichas);
        } catch (Exception e) {
            System.err.println("Error al buscar por autor '" + autor + "': " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/fichas/buscar/tipo/{tipo} - Buscar por tipo
    @GetMapping("/buscar/tipo/{tipo}")
    public ResponseEntity<List<fichasModel>> buscarPorTipo(@PathVariable String tipo) {
        try {
            List<fichasModel> fichas = fichasService.findByTipoDocumento(tipo);
            return ResponseEntity.ok(fichas);
        } catch (Exception e) {
            System.err.println("Error al buscar por tipo '" + tipo + "': " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/fichas/buscar/tipo-id/{id} - Buscar por tipo ID
    @GetMapping("/buscar/tipo-id/{id}")
    public ResponseEntity<List<fichasModel>> buscarPorTipoId(@PathVariable Long id) {
        try {
            List<fichasModel> fichas = fichasService.findByTipoDocumentoId(id);
            return ResponseEntity.ok(fichas);
        } catch (Exception e) {
            System.err.println("Error al buscar por tipo ID " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/fichas/test - Endpoint de prueba
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("API funcionando correctamente");
    }

    // POST /api/fichas/crear - Crear nueva ficha
    @PostMapping("/crear")
    public ResponseEntity<fichasModel> createFicha(@RequestBody fichasModel ficha) {
        try {
            // Validaciones básicas
            if (ficha.getTipoDocumentoId() == null) {
                return ResponseEntity.badRequest().build();
            }
            if (ficha.getAutor() == null || ficha.getAutor().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            if (ficha.getTitulo() == null || ficha.getTitulo().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            if (ficha.getTema() == null || ficha.getTema().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            fichasModel nuevaFicha = fichasService.save(ficha);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaFicha);
        } catch (Exception e) {
            System.err.println("Error al crear ficha: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // PUT /api/fichas/actualizar/{id} - Actualizar ficha
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<fichasModel> updateFicha(@PathVariable Long id, @RequestBody fichasModel ficha) {
        try {
            Optional<fichasModel> fichaExistente = fichasService.findById(id);
            if (fichaExistente.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            ficha.setIdFichas(id);
            fichasModel fichaActualizada = fichasService.update(ficha);
            return ResponseEntity.ok(fichaActualizada);
        } catch (Exception e) {
            System.err.println("Error al actualizar ficha ID " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // DELETE /api/fichas/eliminar/{id} - Eliminado lógico
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> deleteFicha(@PathVariable Long id) {
        try {
            Optional<fichasModel> ficha = fichasService.findById(id);
            if (ficha.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            fichasService.deleteLogical(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error al eliminar ficha ID " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // PUT /api/fichas/restaurar/{id} - Restaurar ficha eliminada lógicamente
    @PutMapping("/restaurar/{id}")
    public ResponseEntity<Void> restoreFicha(@PathVariable Long id) {
        try {
            Optional<fichasModel> ficha = fichasService.findById(id);
            if (ficha.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            fichasService.restore(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error al restaurar ficha ID " + id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/fichas/activas - Listar fichas activas
    @GetMapping("/true")
    public ResponseEntity<List<fichasModel>> getFichasActivas() {
        try {
            List<fichasModel> fichas = fichasService.getAllActive();
            return ResponseEntity.ok(fichas);
        } catch (Exception e) {
            System.err.println("Error al listar fichas activas: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET /api/fichas/inactivas - Listar fichas eliminadas lógicamente
    @GetMapping("/false")
    public ResponseEntity<List<fichasModel>> getFichasInactivas() {
        try {
            List<fichasModel> fichas = fichasService.getAllInactive();
            return ResponseEntity.ok(fichas);
        } catch (Exception e) {
            System.err.println("Error al listar fichas inactivas: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> generateJasperPdfReport() {
        try {
            byte[] pdf = fichasService.generateJasperPdfReport();
            return ResponseEntity.ok()
                    //Renombrar el archivo PDF al descargar
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte_fichas.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

}
