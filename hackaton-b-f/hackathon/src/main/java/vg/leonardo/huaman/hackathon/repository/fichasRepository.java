package vg.leonardo.huaman.hackathon.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vg.leonardo.huaman.hackathon.model.fichasModel;

@Repository
public interface fichasRepository extends JpaRepository<fichasModel, Long> {
    
    // Métodos para el frontend - Spring Boot los genera automáticamente:
    
    // Buscar por tema (para filtros de búsqueda)
    List<fichasModel> findByTemaContainingIgnoreCase(String tema);
    
    // Buscar por autor (para filtros de búsqueda)  
    List<fichasModel> findByAutorContainingIgnoreCase(String autor);
    
    // Buscar solo fichas activas (eliminado lógico)
    List<fichasModel> findByEstadoTrue();
    
    // Buscar solo fichas inactivas (eliminadas lógicamente)
    List<fichasModel> findByEstadoFalse();
    
    // Buscar por tipo de documento usando el ID
    List<fichasModel> findByTipoDocumentoId(Long tipoDocumentoId);
    
    // Buscar por tipo de documento usando el nombre (con SQL nativo)
    @Query(value = "SELECT f.* FROM fichas f INNER JOIN tipo_documento td ON f.tipo_documento_id = td.id_tipo_documento WHERE td.nombre = :nombreTipo", nativeQuery = true)
    List<fichasModel> findByTipoDocumentoNombre(@Param("nombreTipo") String nombreTipo);
    
    // Obtener fichas activas con nombre del tipo de documento (consulta personalizada)
    @Query(value = "SELECT f.id_fichas, f.tipo_documento_id, td.nombre as nombre_tipo, f.autor, f.titulo, f.año_publicacion, f.editorial, f.numero_edicion, f.numero_paginas, f.tema, f.estado, f.fecha_agregada FROM fichas f INNER JOIN tipo_documento td ON f.tipo_documento_id = td.id_tipo_documento WHERE f.estado = 1 ORDER BY f.fecha_agregada DESC", nativeQuery = true)
    List<Object[]> findFichasActivasConTipo();
    
    // Obtener todas las fichas con nombre del tipo de documento
    @Query(value = "SELECT f.id_fichas, f.tipo_documento_id, td.nombre as nombre_tipo, f.autor, f.titulo, f.año_publicacion, f.editorial, f.numero_edicion, f.numero_paginas, f.tema, f.estado, f.fecha_agregada FROM fichas f INNER JOIN tipo_documento td ON f.tipo_documento_id = td.id_tipo_documento ORDER BY f.fecha_agregada DESC", nativeQuery = true)
    List<Object[]> findTodasLasFichasConTipo();
}
