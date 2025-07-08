create database hackaton;

use hackaton;

-- Tabla de apoyo:
CREATE TABLE tipo_documento (
    id_tipo_documento INT IDENTITY(100,1) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Insertar los tipos de documento
INSERT INTO tipo_documento (nombre) VALUES 
('libro'),
('articulo'),
('tesis'),
('video'),
('periodico'),
('repositorio');

create table fichas(
    id_fichas INT IDENTITY(1,1) PRIMARY KEY,
    tipo_documento_id INT NOT NULL,
    autor NVARCHAR(255) NOT NULL,
    titulo NVARCHAR(255) NOT NULL,
    año_publicacion INT CHECK (año_publicacion <= YEAR(GETDATE())),
    editorial NVARCHAR(255), -- Solo si aplica
    numero_edicion NVARCHAR(50),
    numero_paginas INT CHECK (numero_paginas IS NULL OR numero_paginas > 0),
    tema NVARCHAR(255) NOT NULL,
    fecha_agregada DATE NOT NULL DEFAULT GETDATE(), -- Fecha automática
    estado BIT DEFAULT 1, -- Estado automático (activo)
    CONSTRAINT FK_fichas_tipo_documento 
    FOREIGN KEY (tipo_documento_id) REFERENCES tipo_documento(id_tipo_documento)
);

-- ========================================
-- INSERT INTO - 3 FICHAS POR CADA TIPO
-- ========================================

-- ========================================
-- LIBROS (tipo_documento_id = 100)
-- ========================================
INSERT INTO fichas (tipo_documento_id, autor, titulo, año_publicacion, editorial, numero_edicion, numero_paginas, tema) 
VALUES (100, 'Alonso Cueto', 'La hora azul', 2005, 'Planeta', '1ra', 256, 'Narrativa peruana');

INSERT INTO fichas (tipo_documento_id, autor, titulo, año_publicacion, editorial, numero_edicion, numero_paginas, tema) 
VALUES (100, 'Mario Vargas Llosa', 'Conversación en La Catedral', 1969, 'Seix Barral', '1ra', 720, 'Narrativa peruana');

INSERT INTO fichas (tipo_documento_id, autor, titulo, año_publicacion, editorial, numero_edicion, numero_paginas, tema) 
VALUES (100, 'José María Arguedas', 'Los ríos profundos', 1958, 'Losada', '1ra', 240, 'Indigenismo');

-- ========================================
-- ARTÍCULOS (tipo_documento_id = 101)
-- ========================================
INSERT INTO fichas (tipo_documento_id, autor, titulo, año_publicacion, editorial, numero_edicion, numero_paginas, tema) 
VALUES (101, 'María López', 'Perspectivas de la literatura moderna', 2021, 'Revista Letras', '3ra', 15, 'Literatura contemporánea');

INSERT INTO fichas (tipo_documento_id, autor, titulo, año_publicacion, editorial, numero_edicion, numero_paginas, tema) 
VALUES (101, 'Carlos Milla Batres', 'El boom latinoamericano revisitado', 2020, 'Revista Hispanoamericana', '5ta', 22, 'Boom latinoamericano');

INSERT INTO fichas (tipo_documento_id, autor, titulo, año_publicacion, editorial, numero_edicion, numero_paginas, tema) 
VALUES (101, 'Ana Núñez', 'Nuevas voces en la narrativa peruana', 2023, 'Letras Andinas', '1ra', 18, 'Narrativa contemporánea');

-- ========================================
-- TESIS (tipo_documento_id = 102)
-- ========================================
INSERT INTO fichas (tipo_documento_id, autor, titulo, año_publicacion, editorial, numero_edicion, numero_paginas, tema) 
VALUES (102, 'Juan Torres', 'Influencia del boom latinoamericano', 2019, 'UNMSM', '1ra', 140, 'Literatura hispanoamericana');

INSERT INTO fichas (tipo_documento_id, autor, titulo, año_publicacion, editorial, numero_edicion, numero_paginas, tema) 
VALUES (102, 'Rosa Mendoza', 'El indigenismo en la obra de José María Arguedas', 2021, 'PUCP', '1ra', 180, 'Indigenismo');

INSERT INTO fichas (tipo_documento_id, autor, titulo, año_publicacion, editorial, numero_edicion, numero_paginas, tema) 
VALUES (102, 'Pedro Sánchez', 'Análisis narrativo de Alonso Cueto', 2022, 'UNMSM', '1ra', 160, 'Narrativa contemporánea');

-- ========================================
-- VIDEOS (tipo_documento_id = 103)
-- ========================================
INSERT INTO fichas (tipo_documento_id, autor, titulo, año_publicacion, tema) 
VALUES (103, 'César Vallejo', 'Poética y sociedad', 2023, 'Poesía social');

INSERT INTO fichas (tipo_documento_id, autor, titulo, año_publicacion, tema) 
VALUES (103, 'Mario Vargas Llosa', 'Conferencia sobre la novela moderna', 2022, 'Narrativa peruana');

INSERT INTO fichas (tipo_documento_id, autor, titulo, año_publicacion, tema) 
VALUES (103, 'José Watanabe', 'Documentario sobre poesía nikkei', 2021, 'Poesía nikkei');

-- ========================================
-- PERIÓDICOS (tipo_documento_id = 104)
-- ========================================
INSERT INTO fichas (tipo_documento_id, autor, titulo, año_publicacion, tema) 
VALUES (104, 'Carlos Rodríguez', 'Análisis de la literatura contemporánea', 2024, 'Literatura peruana actual');

INSERT INTO fichas (tipo_documento_id, autor, titulo, año_publicacion, tema) 
VALUES (104, 'Lucía Vargas', 'El resurgimiento de la narrativa peruana', 2024, 'Narrativa contemporánea');

INSERT INTO fichas (tipo_documento_id, autor, titulo, año_publicacion, tema) 
VALUES (104, 'Miguel Reyes', 'Entrevista con jóvenes escritores peruanos', 2023, 'Literatura juvenil');

-- ========================================
-- REPOSITORIOS (tipo_documento_id = 105)
-- ========================================
INSERT INTO fichas (tipo_documento_id, autor, titulo, año_publicacion, tema) 
VALUES (105, 'Lucía Méndez', 'Estudios de narrativa breve', 2022, 'Narrativa breve peruana');

INSERT INTO fichas (tipo_documento_id, autor, titulo, año_publicacion, tema) 
VALUES (105, 'Roberto Castro', 'Análisis comparativo de cuentos peruanos', 2021, 'Narrativa breve peruana');

INSERT INTO fichas (tipo_documento_id, autor, titulo, año_publicacion, tema) 
VALUES (105, 'Elena Morales', 'Tesis sobre poesía peruana contemporánea', 2023, 'Poesía contemporánea');

-- ========================================
-- CONSULTAS DE VERIFICACIÓN
-- ========================================

-- Ver todos los tipos de documento
SELECT * FROM tipo_documento;

-- Ver todas las fichas con su tipo
SELECT 
    f.id_fichas,
    td.nombre as tipo_documento,
    f.autor,
    f.titulo,
    f.año_publicacion,
    f.tema,
    f.estado
FROM fichas f
INNER JOIN tipo_documento td ON f.tipo_documento_id = td.id_tipo_documento
ORDER BY td.nombre, f.autor;

-- Contar fichas por tipo
SELECT 
    td.nombre as tipo_documento,
    COUNT(f.id_fichas) as total_fichas
FROM tipo_documento td
LEFT JOIN fichas f ON td.id_tipo_documento = f.tipo_documento_id
GROUP BY td.nombre
ORDER BY td.nombre;