package vg.leonardo.huaman.hackathon.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vg.leonardo.huaman.hackathon.model.TipoDocumento;

@Repository
public interface TipoDocumentoRepository extends JpaRepository<TipoDocumento, Long> {
    
    // Buscar tipo de documento por nombre
    Optional<TipoDocumento> findByNombreTipo(String nombreTipo);
    
    
}
