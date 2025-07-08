package vg.leonardo.huaman.hackathon.service;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import vg.leonardo.huaman.hackathon.model.fichasModel;
import vg.leonardo.huaman.hackathon.repository.fichasRepository;
import javax.sql.DataSource;


@Slf4j
@Service
@AllArgsConstructor
public class fichasService {
    private fichasRepository fichasRepository;
    private DataSource dataSource;

    // CRUD Básico para el frontend
    
    // Listar TODAS las fichas de la base de datos (activas e inactivas)
    public List<fichasModel> getAll(){
        log.info("Obteniendo TODAS las fichas de la base de datos");
        return fichasRepository.findAll();
    }
    
    // Listar todas las fichas activas
    public List<fichasModel> getAllActive(){
        log.info("Obteniendo todas las fichas activas");
        return fichasRepository.findByEstadoTrue();
    }
    
    // Listar todas las fichas inactivas (eliminadas lógicamente)
    public List<fichasModel> getAllInactive(){
        log.info("Obteniendo todas las fichas inactivas");
        return fichasRepository.findByEstadoFalse();
    }
    
    // Buscar ficha por ID
    public Optional<fichasModel> findById(Long id){
        log.info("Buscando ficha con ID: {}", id);
        return fichasRepository.findById(id);
    }
    
    // Guardar nueva ficha
    public fichasModel save(fichasModel ficha){
        log.info("Guardando nueva ficha: {}", ficha.getTitulo());
        // Establecer fecha agregada automáticamente
        if(ficha.getFechaAgregada() == null) {
            ficha.setFechaAgregada(LocalDate.now());
        }
        // Establecer estado activo por defecto
        if(ficha.getEstado() == null) {
            ficha.setEstado(true);
        }
        return fichasRepository.save(ficha);
    }
    
    // Actualizar ficha existente
    public fichasModel update(fichasModel ficha){
        log.info("Actualizando ficha con ID: {}", ficha.getIdFichas());
        
        // Preservar la fecha original si no se proporciona
        if(ficha.getFechaAgregada() == null) {
            Optional<fichasModel> fichaExistente = fichasRepository.findById(ficha.getIdFichas());
            if(fichaExistente.isPresent()) {
                ficha.setFechaAgregada(fichaExistente.get().getFechaAgregada());
            }
        }
        
        return fichasRepository.save(ficha);
    }
    
    // Eliminado lógico (cambiar estado a false)
    public void deleteLogical(Long id){
        log.info("Eliminado lógico de ficha con ID: {}", id);
        Optional<fichasModel> ficha = fichasRepository.findById(id);
        if(ficha.isPresent()) {
            fichasModel fichaToUpdate = ficha.get();
            fichaToUpdate.setEstado(false);
            fichasRepository.save(fichaToUpdate);
        }
    }
    
    // Restaurar ficha eliminada lógicamente (cambiar estado a true)
    public void restore(Long id){
        log.info("Restaurando ficha con ID: {}", id);
        Optional<fichasModel> ficha = fichasRepository.findById(id);
        if(ficha.isPresent()) {
            fichasModel fichaToRestore = ficha.get();
            fichaToRestore.setEstado(true);
            fichasRepository.save(fichaToRestore);
        }
    }
    
    // Búsquedas para filtros del frontend
    
    // Buscar por tema
    public List<fichasModel> findByTema(String tema){
        log.info("Buscando fichas por tema: {}", tema);
        return fichasRepository.findByTemaContainingIgnoreCase(tema);
    }
    
    // Buscar por autor
    public List<fichasModel> findByAutor(String autor){
        log.info("Buscando fichas por autor: {}", autor);
        return fichasRepository.findByAutorContainingIgnoreCase(autor);
    }
    
    // Buscar por tipo de documento (usando nombre)
    public List<fichasModel> findByTipoDocumento(String tipoDocumento){
        log.info("Buscando fichas por tipo: {}", tipoDocumento);
        return fichasRepository.findByTipoDocumentoNombre(tipoDocumento);
    }
    
    // Buscar por tipo de documento (usando ID)
    public List<fichasModel> findByTipoDocumentoId(Long tipoDocumentoId){
        log.info("Buscando fichas por tipo ID: {}", tipoDocumentoId);
        return fichasRepository.findByTipoDocumentoId(tipoDocumentoId);
    }

    // Generar reporte PDF con JasperReports
    public byte[] generateJasperPdfReport() throws Exception {
        // Cargar archivo .jasper en src/main/resources/reports (SIN USAR IMÁGENES EN EL JASPER)
        InputStream jasperStream = new ClassPathResource("reports/hackaton.jasper").getInputStream();
        // Sin parámetros
        HashMap<String, Object> params = new HashMap<>();
        // Llenar reporte con conexión a SQL Server con application.yml
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperStream, params, dataSource.getConnection());
        // Exportar a PDF
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

}
