package vg.leonardo.huaman.hackathon.model;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "fichas")
public class fichasModel {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_fichas")
    private Long idFichas;

    @Column(name = "tipo_documento_id")
    private Long tipoDocumentoId;

    // Relación con TipoDocumento para obtener el nombre
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tipo_documento_id", insertable = false, updatable = false)
    private TipoDocumento tipoDocumento;

    @Column(name = "autor")
    private String autor;

    @Column(name = "titulo")
    private String titulo;

    @Column(name = "año_publicacion")
    private Integer añoPublicacion;

    @Column(name = "editorial")
    private String editorial;

    @Column(name = "numero_edicion")
    private String numeroEdicion;

    @Column(name = "numero_paginas")
    private Integer numeroPaginas;

    @Column(name = "tema")
    private String tema;

    @Column(name = "estado")
    private Boolean estado = true;

    @Column(name = "fecha_agregada", updatable = false)
    private LocalDate fechaAgregada = LocalDate.now();


}
