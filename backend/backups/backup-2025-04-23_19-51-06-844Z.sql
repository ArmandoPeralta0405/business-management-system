/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: articulo
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `articulo` (
  `id_articulo` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del artículo',
  `codigo_alfanumerico` varchar(20) NOT NULL COMMENT 'Código interno principal (único)',
  `descripcion` varchar(100) NOT NULL COMMENT 'Nombre completo del artículo',
  `id_categoria` int(11) NOT NULL COMMENT 'Categoría principal',
  `id_linea` int(11) NOT NULL COMMENT 'Línea específica',
  `id_marca` int(11) NOT NULL COMMENT 'Marca del producto',
  `id_tipo` int(11) NOT NULL COMMENT 'Tipo: Adquirido/Producido/Servicio',
  `id_unidad` int(11) NOT NULL COMMENT 'Unidad de medida base',
  `id_impuesto` int(11) NOT NULL COMMENT 'Impuesto por defecto',
  `estado` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_articulo`),
  UNIQUE KEY `uq_codigo` (`codigo_alfanumerico`),
  KEY `fk_articulo_categoria` (`id_categoria`),
  KEY `fk_articulo_linea` (`id_linea`),
  KEY `fk_articulo_marca` (`id_marca`),
  KEY `fk_articulo_tipo` (`id_tipo`),
  KEY `fk_articulo_unidad` (`id_unidad`),
  KEY `fk_articulo_impuesto` (`id_impuesto`),
  CONSTRAINT `fk_articulo_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`),
  CONSTRAINT `fk_articulo_impuesto` FOREIGN KEY (`id_impuesto`) REFERENCES `impuesto` (`id_impuesto`),
  CONSTRAINT `fk_articulo_linea` FOREIGN KEY (`id_linea`) REFERENCES `linea` (`id_linea`),
  CONSTRAINT `fk_articulo_marca` FOREIGN KEY (`id_marca`) REFERENCES `marca` (`id_marca`),
  CONSTRAINT `fk_articulo_tipo` FOREIGN KEY (`id_tipo`) REFERENCES `tipo_articulo` (`id_tipo`),
  CONSTRAINT `fk_articulo_unidad` FOREIGN KEY (`id_unidad`) REFERENCES `unidad_medida` (`id_unidad`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Tabla principal de artículos';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: categoria
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `categoria` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID único de la categoría',
  `descripcion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL COMMENT 'Nombre de la categoría (Ej: Ferretería, Electricidad, Pinturas)',
  PRIMARY KEY (`id_categoria`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Categorías principales de artículos';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: categoria_programa
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `categoria_programa` (
  `id_categoria_programa` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador de la categoria de programas',
  `descripcion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL COMMENT 'Descripción de la categoria del programa',
  PRIMARY KEY (`id_categoria_programa`)
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Tabla de categorías de programas';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: ciudad
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `ciudad` (
  `id_ciudad` int(11) NOT NULL AUTO_INCREMENT,
  `id_departamento` int(11) NOT NULL COMMENT 'Referencia al departamento',
  `descripcion` varchar(100) NOT NULL COMMENT 'Nombre de la ciudad',
  `capital` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1=Es capital departamental',
  `codigo_postal` varchar(10) DEFAULT NULL COMMENT 'Código postal principal',
  PRIMARY KEY (`id_ciudad`),
  UNIQUE KEY `uq_ciudad_departamento` (`id_departamento`, `descripcion`),
  CONSTRAINT `fk_ciudad_departamento` FOREIGN KEY (`id_departamento`) REFERENCES `departamento` (`id_departamento`)
) ENGINE = InnoDB AUTO_INCREMENT = 92 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Ciudades de departamentos';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: codigo_barra
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `codigo_barra` (
  `id_codigo` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del código de barra',
  `id_articulo` int(11) NOT NULL COMMENT 'ID del artículo relacionado',
  `codigo_barra` varchar(100) NOT NULL COMMENT 'Código de barra del artículo',
  `id_tipo` int(11) NOT NULL COMMENT 'ID del tipo de código de barra',
  `estado` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1=Activo, 0=Deshabilitado',
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_codigo`),
  KEY `fk_codigo_barra_articulo` (`id_articulo`),
  KEY `fk_codigo_barra_tipo` (`id_tipo`),
  CONSTRAINT `fk_codigo_barra_articulo` FOREIGN KEY (`id_articulo`) REFERENCES `articulo` (`id_articulo`) ON DELETE CASCADE,
  CONSTRAINT `fk_codigo_barra_tipo` FOREIGN KEY (`id_tipo`) REFERENCES `tipo_barra` (`id_tipo`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Relación de código de barra con los artículos';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: departamento
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `departamento` (
  `id_departamento` int(11) NOT NULL AUTO_INCREMENT,
  `id_pais` int(11) NOT NULL COMMENT 'Referencia a país (Paraguay=1)',
  `descripcion` varchar(100) NOT NULL COMMENT 'Nombre del departamento',
  PRIMARY KEY (`id_departamento`),
  UNIQUE KEY `uq_departamento_pais` (`id_pais`, `descripcion`),
  CONSTRAINT `fk_departamento_pais` FOREIGN KEY (`id_pais`) REFERENCES `pais` (`id_pais`)
) ENGINE = InnoDB AUTO_INCREMENT = 18 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Departamentos/estados/provincias';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: deposito
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `deposito` (
  `id_deposito` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador del depósito',
  `descripcion` varchar(100) NOT NULL COMMENT 'Descripción del depósito',
  `id_sucursal` int(11) NOT NULL,
  `id_empresa` int(11) NOT NULL,
  PRIMARY KEY (`id_deposito`),
  KEY `fk_deposito_sucursal` (`id_sucursal`, `id_empresa`),
  CONSTRAINT `fk_deposito_sucursal` FOREIGN KEY (`id_sucursal`, `id_empresa`) REFERENCES `sucursal` (`id_sucursal`, `id_empresa`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Tabla para almacenar los depósitos de artículos';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: empresa
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `empresa` (
  `id_empresa` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la empresa',
  `razon_social` varchar(200) NOT NULL COMMENT 'Razón social de la empresa',
  `nombre_comercial` varchar(200) DEFAULT NULL COMMENT 'Nombre comercial (si difiere de razón social)',
  `ruc` varchar(20) NOT NULL COMMENT 'RUC de la empresa (formato paraguayo 80000000-1)',
  `dv` varchar(2) NOT NULL COMMENT 'Dígito verificador del RUC',
  `direccion` varchar(200) DEFAULT NULL COMMENT 'Dirección fiscal',
  `telefono` varchar(50) DEFAULT NULL COMMENT 'Teléfono de contacto',
  `email` varchar(100) DEFAULT NULL COMMENT 'Correo electrónico',
  `id_ciudad` int(11) NOT NULL COMMENT 'Ciudad donde opera',
  `fecha_constitucion` date DEFAULT NULL COMMENT 'Fecha de constitución legal',
  `representante_legal` varchar(200) DEFAULT NULL COMMENT 'Nombre del representante legal',
  `estado` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Estado de la empresa (1=activo, 0=inactivo)',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Fecha de registro en el sistema',
  `fecha_actualizacion` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'Fecha de última actualización',
  PRIMARY KEY (`id_empresa`),
  UNIQUE KEY `ruc` (`ruc`),
  KEY `fk_empresa_ciudad` (`id_ciudad`),
  CONSTRAINT `fk_empresa_ciudad` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudad` (`id_ciudad`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Tabla para almacenar datos de empresas';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: impuesto
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `impuesto` (
  `id_impuesto` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID único del impuesto',
  `descripcion` varchar(100) NOT NULL COMMENT 'Descripción del impuesto (Ej: IVA 10%)',
  `valor_calculo` int(11) NOT NULL COMMENT 'Divisor para cálculo (Ej: 11 para IVA 10%)',
  `abreviacion` varchar(10) NOT NULL COMMENT 'Abreviación del impuesto (Ej: IVA10)',
  PRIMARY KEY (`id_impuesto`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Tabla de impuestos con divisores de cálculo';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: linea
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `linea` (
  `id_linea` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID único de la línea',
  `descripcion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL COMMENT 'Nombre específico de la línea',
  `id_categoria` int(11) NOT NULL COMMENT 'Categoría a la que pertenece',
  PRIMARY KEY (`id_linea`),
  KEY `FK_linea_categoria` (`id_categoria`),
  CONSTRAINT `FK_linea_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Líneas específicas de artículos por categoría';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: marca
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `marca` (
  `id_marca` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la marca',
  `descripcion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL COMMENT 'Nombre descriptivo de la marca',
  PRIMARY KEY (`id_marca`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Catálogo de marcas de artículos';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: modulo
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `modulo` (
  `id_modulo` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) NOT NULL COMMENT 'Nombre del módulo (ej: Sistema General, Finanzas, etc.)',
  `icono` varchar(50) DEFAULT 'folder' COMMENT 'Icono para el menú (ej: fas fa-home)',
  `orden` int(11) DEFAULT 0 COMMENT 'Orden de aparición en el menú',
  `estado` tinyint(1) DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_modulo`),
  UNIQUE KEY `uq_modulo_descripcion` (`descripcion`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Módulos principales del sistema';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: pais
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `pais` (
  `id_pais` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) NOT NULL COMMENT 'Nombre oficial del país',
  `nacionalidad` varchar(50) DEFAULT NULL COMMENT 'Gentilicio (paraguayo/a)',
  `codigo_iso3` char(3) DEFAULT NULL COMMENT 'Código ISO Alpha-3 (PRY)',
  PRIMARY KEY (`id_pais`),
  UNIQUE KEY `codigo_iso3` (`codigo_iso3`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Tabla de países simplificada';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: programa
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `programa` (
  `id_programa` int(11) NOT NULL AUTO_INCREMENT,
  `id_modulo` int(11) NOT NULL COMMENT 'Clave foránea al módulo',
  `nombre` varchar(100) NOT NULL COMMENT 'Nombre del programa',
  `ruta` varchar(255) NOT NULL COMMENT 'Ruta del programa (ej: /finanzas/reportes)',
  `estado` tinyint(1) DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `id_categoria` int(11) NOT NULL COMMENT 'Clave foránea a categoria de programas',
  PRIMARY KEY (`id_programa`),
  KEY `FK_PROGRAMA_CATEGORIA_PROGRAMA` (`id_categoria`),
  KEY `programa_ibfk_1` (`id_modulo`),
  CONSTRAINT `FK_PROGRAMA_CATEGORIA_PROGRAMA` FOREIGN KEY (`id_categoria`) REFERENCES `categoria_programa` (`id_categoria_programa`),
  CONSTRAINT `programa_ibfk_1` FOREIGN KEY (`id_modulo`) REFERENCES `modulo` (`id_modulo`)
) ENGINE = InnoDB AUTO_INCREMENT = 19 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Programas asociados a los módulos';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: rol
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `rol` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador del rol',
  `descripcion` varchar(100) NOT NULL COMMENT 'Descripción del rol',
  PRIMARY KEY (`id_rol`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Tabla para almacenar los roles de usuario';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: sucursal
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `sucursal` (
  `id_sucursal` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la sucursal',
  `id_empresa` int(11) NOT NULL COMMENT 'Empresa a la que pertenece la sucursal',
  `descripcion` varchar(100) NOT NULL COMMENT 'Nombre o descripción de la sucursal',
  `direccion` varchar(200) DEFAULT NULL COMMENT 'Dirección física de la sucursal',
  `telefono` varchar(50) DEFAULT NULL COMMENT 'Teléfono de contacto principal',
  `email` varchar(100) DEFAULT NULL COMMENT 'Correo electrónico de contacto',
  `id_ciudad` int(11) NOT NULL COMMENT 'Ciudad donde se encuentra la sucursal',
  `casa_central` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1=Es la casa central/matriz',
  `estado` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1=Activa, 0=Inactiva',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Fecha de creación del registro',
  `fecha_actualizacion` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'Fecha de última modificación',
  PRIMARY KEY (`id_sucursal`, `id_empresa`) USING BTREE,
  UNIQUE KEY `uq_sucursal_empresa` (`id_empresa`, `descripcion`),
  KEY `fk_sucursal_ciudad` (`id_ciudad`),
  CONSTRAINT `fk_sucursal_ciudad` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudad` (`id_ciudad`),
  CONSTRAINT `fk_sucursal_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Sucursales de empresas registradas en el sistema';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: tipo_articulo
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `tipo_articulo` (
  `id_tipo` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID único del tipo de artículo',
  `descripcion` varchar(100) NOT NULL COMMENT 'Tipo: Adquirido/Producido/Servicio',
  PRIMARY KEY (`id_tipo`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Clasificación básica de artículos';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: tipo_barra
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `tipo_barra` (
  `id_tipo` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID único del tipo de barra',
  `descripcion` varchar(100) NOT NULL COMMENT 'Descripción del tipo de barra (Ej: UPC, EAN13, QR, etc.)',
  PRIMARY KEY (`id_tipo`)
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Catálogo de tipos de código de barra';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: unidad_medida
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `unidad_medida` (
  `id_unidad` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID único de la unidad',
  `descripcion` varchar(100) NOT NULL COMMENT 'Nombre completo de la unidad',
  `abreviacion` varchar(10) NOT NULL COMMENT 'Símbolo o código corto',
  PRIMARY KEY (`id_unidad`),
  UNIQUE KEY `abreviacion` (`abreviacion`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Unidades de medida básicas';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: usuario
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del usuario',
  `nombre` varchar(100) NOT NULL COMMENT 'Nombre del usuario',
  `apellido` varchar(100) NOT NULL COMMENT 'Apellido del usuario',
  `cedula` varchar(20) NOT NULL COMMENT 'Cédula de identidad del usuario',
  `telefono` varchar(15) NOT NULL COMMENT 'Teléfono de contacto del usuario',
  `direccion` varchar(255) NOT NULL COMMENT 'Dirección física del usuario',
  `correo_electronico` varchar(100) NOT NULL COMMENT 'Correo electrónico del usuario',
  `alias` varchar(50) NOT NULL COMMENT 'Alias o nombre de usuario para login',
  `clave` varchar(255) NOT NULL COMMENT 'Contraseña encriptada del usuario',
  `estado` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Estado del usuario (1=activo, 0=inactivo)',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Fecha de creación automática',
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Fecha de actualización automática',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `cedula_UNIQUE` (`cedula`),
  UNIQUE KEY `correo_electronico_UNIQUE` (`correo_electronico`),
  UNIQUE KEY `alias_UNIQUE` (`alias`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Tabla de usuarios del sistema';

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: articulo_view
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `articulo_view` AS
select
  `a`.`id_articulo` AS `id_articulo`,
  `a`.`codigo_alfanumerico` AS `codigo_alfanumerico`,
  `a`.`descripcion` AS `descripcion`,
  `a`.`id_categoria` AS `id_categoria`,
  `c`.`descripcion` AS `categoria_descripcion`,
  `a`.`id_linea` AS `id_linea`,
  `l`.`descripcion` AS `linea_descripcion`,
  `a`.`id_marca` AS `id_marca`,
  `m`.`descripcion` AS `marca_descripcion`,
  `a`.`id_tipo` AS `id_tipo`,
  `tp`.`descripcion` AS `tipo_articulo_descripcion`,
  `a`.`id_unidad` AS `id_unidad`,
  `um`.`abreviacion` AS `unidad_medida_descripcion`,
  `a`.`id_impuesto` AS `id_impuesto`,
  `i`.`abreviacion` AS `impuesto_descripcion`,case
  when `a`.`estado` = 1 then 'Activo'
  else 'Inactivo'
  end AS `estado`,
  `a`.`fecha_creacion` AS `fecha_creacion`,
  `a`.`fecha_actualizacion` AS `fecha_actualizacion`
from
  (
  (
    (
    (
      (
      (
        `articulo` `a`
        join `categoria` `c` on(`c`.`id_categoria` = `a`.`id_categoria`)
      )
      join `linea` `l` on(`l`.`id_linea` = `a`.`id_linea`)
      )
      join `marca` `m` on(`m`.`id_marca` = `a`.`id_marca`)
    )
    join `tipo_articulo` `tp` on(`tp`.`id_tipo` = `a`.`id_tipo`)
    )
    join `unidad_medida` `um` on(`um`.`id_unidad` = `a`.`id_unidad`)
  )
  join `impuesto` `i` on(`i`.`id_impuesto` = `a`.`id_impuesto`)
  );

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: ciudad_view
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `ciudad_view` AS
select
  `c`.`id_ciudad` AS `id_ciudad`,
  `c`.`id_departamento` AS `id_departamento`,
  `d`.`descripcion` AS `departamento_descripcion`,
  `c`.`descripcion` AS `descripcion`,case
  when `c`.`capital` = 1 then 'Si'
  else 'No'
  end AS `capital`,
  `c`.`codigo_postal` AS `codigo_postal`
from
  (
  `ciudad` `c`
  join `departamento` `d` on(`d`.`id_departamento` = `c`.`id_departamento`)
  );

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: codigo_barra_view
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `codigo_barra_view` AS
select
  `cb`.`id_codigo` AS `id_codigo`,
  `cb`.`id_articulo` AS `id_articulo`,
  `a`.`descripcion` AS `articulo_descripcion`,
  `cb`.`codigo_barra` AS `codigo_barra`,
  `cb`.`id_tipo` AS `id_tipo`,
  `tb`.`descripcion` AS `tipo_barra_descripcion`,case
  when `cb`.`estado` = 1 then 'Activo'
  else 'Inactivo'
  end AS `estado`,
  `cb`.`fecha_creacion` AS `fecha_creacion`,
  `cb`.`fecha_actualizacion` AS `fecha_actualizacion`
from
  (
  (
    `codigo_barra` `cb`
    join `articulo` `a` on(`a`.`id_articulo` = `cb`.`id_articulo`)
  )
  join `tipo_barra` `tb` on(`tb`.`id_tipo` = `cb`.`id_tipo`)
  );

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: departamento_view
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `departamento_view` AS
select
  `d`.`id_departamento` AS `id_departamento`,
  `d`.`id_pais` AS `id_pais`,
  `p`.`descripcion` AS `pais_descripcion`,
  `d`.`descripcion` AS `descripcion`
from
  (
  `departamento` `d`
  join `pais` `p` on(`p`.`id_pais` = `d`.`id_pais`)
  );

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: deposito_view
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `deposito_view` AS
select
  `d`.`id_deposito` AS `id_deposito`,
  `d`.`descripcion` AS `descripcion`,
  `d`.`id_sucursal` AS `id_sucursal`,
  `s`.`descripcion` AS `sucursal_descripcion`,
  `d`.`id_empresa` AS `id_empresa`,
  `e`.`razon_social` AS `empresa_descripcion`
from
  (
  (
    `deposito` `d`
    join `sucursal` `s` on(
    `s`.`id_sucursal` = `d`.`id_sucursal`
    and `s`.`id_empresa` = `d`.`id_empresa`
    )
  )
  join `empresa` `e` on(`e`.`id_empresa` = `s`.`id_empresa`)
  );

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: empresa_view
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `empresa_view` AS
select
  `e`.`id_empresa` AS `id_empresa`,
  `e`.`razon_social` AS `razon_social`,
  `e`.`nombre_comercial` AS `nombre_comercial`,
  `e`.`ruc` AS `ruc`,
  `e`.`dv` AS `dv`,
  `e`.`direccion` AS `direccion`,
  `e`.`telefono` AS `telefono`,
  `e`.`email` AS `email`,
  `e`.`id_ciudad` AS `id_ciudad`,
  `c`.`descripcion` AS `ciudad_descripcion`,
  `e`.`fecha_constitucion` AS `fecha_constitucion`,
  `e`.`representante_legal` AS `representante_legal`,case
  when `e`.`estado` = 1 then 'Activo'
  else 'Inactivo'
  end AS `estado`,
  `e`.`fecha_registro` AS `fecha_registro`,
  `e`.`fecha_actualizacion` AS `fecha_actualizacion`
from
  (
  `empresa` `e`
  join `ciudad` `c` on(`c`.`id_ciudad` = `e`.`id_ciudad`)
  );

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: linea_view
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `linea_view` AS
select
  `l`.`id_linea` AS `id_linea`,
  `l`.`descripcion` AS `descripcion`,
  `l`.`id_categoria` AS `id_categoria`,
  `c`.`descripcion` AS `categoria_descripcion`
from
  (
  `linea` `l`
  join `categoria` `c` on(`c`.`id_categoria` = `l`.`id_categoria`)
  );

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: modulo_view
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `modulo_view` AS
select
  `modulo`.`id_modulo` AS `id_modulo`,
  `modulo`.`descripcion` AS `descripcion`,
  `modulo`.`icono` AS `icono`,
  `modulo`.`orden` AS `orden`,case
  when `modulo`.`estado` = 1 then 'Activo'
  else 'Inactivo'
  end AS `estado`,
  `modulo`.`fecha_creacion` AS `fecha_creacion`,
  `modulo`.`fecha_actualizacion` AS `fecha_actualizacion`
from
  `modulo`;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: programa_view
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `programa_view` AS
select
  `p`.`id_programa` AS `id_programa`,
  `p`.`id_modulo` AS `id_modulo`,
  `m`.`descripcion` AS `modulo_descripcion`,
  `p`.`nombre` AS `nombre`,
  `p`.`ruta` AS `ruta`,case
  when `p`.`estado` = 1 then 'Activo'
  else 'Inactivo'
  end AS `estado`,
  `p`.`fecha_creacion` AS `fecha_creacion`,
  `p`.`fecha_actualizacion` AS `fecha_actualizacion`,
  `p`.`id_categoria` AS `id_categoria`,
  `cp`.`descripcion` AS `categoria_programa_descripcion`
from
  (
  (
    `programa` `p`
    join `modulo` `m` on(`m`.`id_modulo` = `p`.`id_modulo`)
  )
  join `categoria_programa` `cp` on(
    `cp`.`id_categoria_programa` = `p`.`id_categoria`
  )
  );

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: sucursal_view
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `sucursal_view` AS
select
  `s`.`id_sucursal` AS `id_sucursal`,
  `s`.`id_empresa` AS `id_empresa`,
  `e`.`razon_social` AS `empresa_razon_social`,
  concat(`e`.`ruc`, '-', `e`.`dv`) AS `empresa_ruc`,
  `s`.`descripcion` AS `descripcion`,
  `s`.`direccion` AS `direccion`,
  `s`.`telefono` AS `telefono`,
  `s`.`email` AS `email`,
  `s`.`id_ciudad` AS `id_ciudad`,
  `c`.`descripcion` AS `ciudad_descripcion`,case
  when `s`.`casa_central` = 1 then 'Si'
  else 'No'
  end AS `casa_central`,case
  when `s`.`estado` = 1 then 'Activo'
  else 'Inactivo'
  end AS `estado`,
  `s`.`fecha_registro` AS `fecha_registro`,
  `s`.`fecha_actualizacion` AS `fecha_actualizacion`
from
  (
  (
    `sucursal` `s`
    join `empresa` `e` on(`e`.`id_empresa` = `s`.`id_empresa`)
  )
  join `ciudad` `c` on(`c`.`id_ciudad` = `s`.`id_ciudad`)
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: articulo
# ------------------------------------------------------------

INSERT INTO
  `articulo` (
    `id_articulo`,
    `codigo_alfanumerico`,
    `descripcion`,
    `id_categoria`,
    `id_linea`,
    `id_marca`,
    `id_tipo`,
    `id_unidad`,
    `id_impuesto`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`
  )
VALUES
  (
    1,
    'MPADSATE25X25',
    'Mouse Pad Sate 25cm x 25cm',
    4,
    4,
    4,
    1,
    1,
    3,
    1,
    '2025-04-23 15:31:58',
    NULL
  );
INSERT INTO
  `articulo` (
    `id_articulo`,
    `codigo_alfanumerico`,
    `descripcion`,
    `id_categoria`,
    `id_linea`,
    `id_marca`,
    `id_tipo`,
    `id_unidad`,
    `id_impuesto`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`
  )
VALUES
  (
    2,
    'BORRADOGOMA',
    'Borrador de goma rojo FC',
    5,
    5,
    5,
    1,
    1,
    3,
    1,
    '2025-04-23 15:37:29',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: categoria
# ------------------------------------------------------------

INSERT INTO
  `categoria` (`id_categoria`, `descripcion`)
VALUES
  (1, 'Sin categoria');
INSERT INTO
  `categoria` (`id_categoria`, `descripcion`)
VALUES
  (2, 'Artículos para tereré y mate');
INSERT INTO
  `categoria` (`id_categoria`, `descripcion`)
VALUES
  (3, 'Aceo personal');
INSERT INTO
  `categoria` (`id_categoria`, `descripcion`)
VALUES
  (4, 'Accesorios PC');
INSERT INTO
  `categoria` (`id_categoria`, `descripcion`)
VALUES
  (5, 'Accesorios Escolares');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: categoria_programa
# ------------------------------------------------------------

INSERT INTO
  `categoria_programa` (`id_categoria_programa`, `descripcion`)
VALUES
  (1, 'Mantenimientos');
INSERT INTO
  `categoria_programa` (`id_categoria_programa`, `descripcion`)
VALUES
  (2, 'Movimientos');
INSERT INTO
  `categoria_programa` (`id_categoria_programa`, `descripcion`)
VALUES
  (3, 'Consultas');
INSERT INTO
  `categoria_programa` (`id_categoria_programa`, `descripcion`)
VALUES
  (4, 'Procesos');
INSERT INTO
  `categoria_programa` (`id_categoria_programa`, `descripcion`)
VALUES
  (5, 'Esporadicos');
INSERT INTO
  `categoria_programa` (`id_categoria_programa`, `descripcion`)
VALUES
  (6, 'Otros');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: ciudad
# ------------------------------------------------------------

INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (1, 1, 'Concepción', 1, '8700');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (2, 1, 'Horqueta', 0, '8750');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (3, 1, 'Belén', 0, '8720');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (4, 1, 'Loreto', 0, '8740');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (5, 1, 'San Carlos del Apa', 0, '8710');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (6, 2, 'San Pedro de Ycuamandiyú', 1, '8000');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (7, 2, 'Antequera', 0, '8040');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (8, 2, 'Choré', 0, '8030');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (9, 2, 'General Elizardo Aquino', 0, '8050');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (10, 2, 'Itacurubí del Rosario', 0, '8020');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (11, 3, 'Caacupé', 1, '8500');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (12, 3, 'Atyrá', 0, '8510');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (13, 3, 'Altos', 0, '8520');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (14, 3, 'Piribebuy', 0, '8530');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (15, 3, 'Eusebio Ayala', 0, '8540');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (16, 4, 'Villarrica', 1, '5000');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (17, 4, 'Mbocayaty', 0, '5040');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (18, 4, 'Ñumí', 0, '5030');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (19, 4, 'Borja', 0, '5020');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (20, 4, 'Itapé', 0, '5010');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (21, 5, 'Coronel Oviedo', 1, '3300');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (22, 5, 'Caaguazú', 0, '3400');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (23, 5, 'Doctor Juan Manuel Frutos', 0, '3500');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (24, 5, 'Repatriación', 0, '3600');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (25, 5, 'San José de los Arroyos', 0, '3700');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (26, 6, 'Caazapá', 1, '5600');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (27, 6, 'Yuty', 0, '5650');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (28, 6, 'Abaí', 0, '5640');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (29, 6, 'Buena Vista', 0, '5630');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (30, 6, 'San Juan Nepomuceno', 0, '5620');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (31, 7, 'Encarnación', 1, '6000');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (32, 7, 'Cambyretá', 0, '6050');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (33, 7, 'Capitán Miranda', 0, '6040');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (34, 7, 'Carlos Antonio López', 0, '6030');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (35, 7, 'Fram', 0, '6020');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (36, 8, 'San Juan Bautista', 1, '5200');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (37, 8, 'Ayolas', 0, '5250');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (38, 8, 'San Ignacio', 0, '5240');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (39, 8, 'Santa María', 0, '5230');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (40, 8, 'Santiago', 0, '5220');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (41, 9, 'Paraguarí', 1, '4000');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (42, 9, 'Carapeguá', 0, '4040');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (43, 9, 'Acahay', 0, '4030');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (44, 9, 'Quiindy', 0, '4020');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (45, 9, 'Ybycuí', 0, '4010');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (46, 10, 'Ciudad del Este', 1, '7000');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (47, 10, 'Minga Guazú', 0, '7050');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (48, 10, 'Hernandarias', 0, '7040');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (49, 10, 'Presidente Franco', 0, '7030');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (50, 10, 'Santa Rita', 0, '7020');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (51, 11, 'Areguá', 1, '2000');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (52, 11, 'Asunción', 0, '1000');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (53, 11, 'Capiatá', 0, '2050');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (54, 11, 'Fernando de la Mora', 0, '2040');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (55, 11, 'Lambaré', 0, '2020');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (56, 11, 'Limpio', 0, '2060');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (57, 11, 'Luque', 0, '2030');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (58, 11, 'Mariano Roque Alonso', 0, '2070');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (59, 11, 'Ñemby', 0, '2080');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (60, 11, 'San Lorenzo', 0, '2010');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (61, 11, 'Villa Elisa', 0, '2090');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (62, 12, 'Pilar', 1, '2800');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (63, 12, 'Alberdi', 0, '2840');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (64, 12, 'Cerrito', 0, '2830');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (65, 12, 'Desmochados', 0, '2820');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (66, 12, 'Villa Franca', 0, '2810');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (67, 13, 'Pedro Juan Caballero', 1, '8500');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (68, 13, 'Bella Vista', 0, '8550');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (69, 13, 'Capitán Bado', 0, '8540');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (70, 13, 'Zanja Pytá', 0, '8530');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (71, 13, 'Karapaí', 0, '8520');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (72, 14, 'Salto del Guairá', 1, '7800');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (73, 14, 'Corpus Christi', 0, '7850');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (74, 14, 'Itanará', 0, '7840');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (75, 14, 'Katueté', 0, '7830');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (76, 14, 'Ypehú', 0, '7820');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (77, 15, 'Villa Hayes', 1, '9900');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (78, 15, 'Benjamín Aceval', 0, '9950');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (79, 15, 'Nanawa', 0, '9940');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (80, 15, 'Puerto Pinasco', 0, '9930');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (81, 15, 'Tte. Irala Fernández', 0, '9920');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (82, 16, 'Filadelfia', 1, '9300');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (83, 16, 'Loma Plata', 0, '9350');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (84, 16, 'Mariscal Estigarribia', 0, '9340');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (85, 16, 'Neuland', 0, '9330');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (86, 16, 'Tte. Esteban Martínez', 0, '9320');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (87, 17, 'Fuerte Olimpo', 1, '9000');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (88, 17, 'Bahía Negra', 0, '9050');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (89, 17, 'Capitán Carmelo Peralta', 0, '9040');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (90, 17, 'Puerto Casado', 0, '9030');
INSERT INTO
  `ciudad` (
    `id_ciudad`,
    `id_departamento`,
    `descripcion`,
    `capital`,
    `codigo_postal`
  )
VALUES
  (91, 17, 'Puerto Guaraní', 0, '9020');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: codigo_barra
# ------------------------------------------------------------

INSERT INTO
  `codigo_barra` (
    `id_codigo`,
    `id_articulo`,
    `codigo_barra`,
    `id_tipo`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`
  )
VALUES
  (
    1,
    1,
    '7891360624000',
    1,
    1,
    '2025-04-23 15:33:22',
    '2025-04-23 15:35:02'
  );
INSERT INTO
  `codigo_barra` (
    `id_codigo`,
    `id_articulo`,
    `codigo_barra`,
    `id_tipo`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`
  )
VALUES
  (
    2,
    2,
    '7891360629566',
    1,
    1,
    '2025-04-23 15:37:57',
    '2025-04-23 16:43:22'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: departamento
# ------------------------------------------------------------

INSERT INTO
  `departamento` (`id_departamento`, `id_pais`, `descripcion`)
VALUES
  (17, 1, 'Alto Paraguay');
INSERT INTO
  `departamento` (`id_departamento`, `id_pais`, `descripcion`)
VALUES
  (10, 1, 'Alto Paraná');
INSERT INTO
  `departamento` (`id_departamento`, `id_pais`, `descripcion`)
VALUES
  (13, 1, 'Amambay');
INSERT INTO
  `departamento` (`id_departamento`, `id_pais`, `descripcion`)
VALUES
  (16, 1, 'Boquerón');
INSERT INTO
  `departamento` (`id_departamento`, `id_pais`, `descripcion`)
VALUES
  (5, 1, 'Caaguazú');
INSERT INTO
  `departamento` (`id_departamento`, `id_pais`, `descripcion`)
VALUES
  (6, 1, 'Caazapá');
INSERT INTO
  `departamento` (`id_departamento`, `id_pais`, `descripcion`)
VALUES
  (14, 1, 'Canindeyú');
INSERT INTO
  `departamento` (`id_departamento`, `id_pais`, `descripcion`)
VALUES
  (11, 1, 'Central');
INSERT INTO
  `departamento` (`id_departamento`, `id_pais`, `descripcion`)
VALUES
  (1, 1, 'Concepción');
INSERT INTO
  `departamento` (`id_departamento`, `id_pais`, `descripcion`)
VALUES
  (3, 1, 'Cordillera');
INSERT INTO
  `departamento` (`id_departamento`, `id_pais`, `descripcion`)
VALUES
  (4, 1, 'Guairá');
INSERT INTO
  `departamento` (`id_departamento`, `id_pais`, `descripcion`)
VALUES
  (7, 1, 'Itapúa');
INSERT INTO
  `departamento` (`id_departamento`, `id_pais`, `descripcion`)
VALUES
  (8, 1, 'Misiones');
INSERT INTO
  `departamento` (`id_departamento`, `id_pais`, `descripcion`)
VALUES
  (12, 1, 'Ñeembucú');
INSERT INTO
  `departamento` (`id_departamento`, `id_pais`, `descripcion`)
VALUES
  (9, 1, 'Paraguarí');
INSERT INTO
  `departamento` (`id_departamento`, `id_pais`, `descripcion`)
VALUES
  (15, 1, 'Presidente Hayes');
INSERT INTO
  `departamento` (`id_departamento`, `id_pais`, `descripcion`)
VALUES
  (2, 1, 'San Pedro');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: deposito
# ------------------------------------------------------------

INSERT INTO
  `deposito` (
    `id_deposito`,
    `descripcion`,
    `id_sucursal`,
    `id_empresa`
  )
VALUES
  (1, 'Salon de Ventas(Casa Central)', 1, 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: empresa
# ------------------------------------------------------------

INSERT INTO
  `empresa` (
    `id_empresa`,
    `razon_social`,
    `nombre_comercial`,
    `ruc`,
    `dv`,
    `direccion`,
    `telefono`,
    `email`,
    `id_ciudad`,
    `fecha_constitucion`,
    `representante_legal`,
    `estado`,
    `fecha_registro`,
    `fecha_actualizacion`
  )
VALUES
  (
    1,
    'Business Management Systems',
    'BMS',
    '5955455',
    '0',
    'Barrio Virgen Serrana',
    '0975489075',
    'armando.peralta.0405@gmail.com',
    22,
    '2020-01-01',
    'Armando Ariel Peralta Martinez',
    1,
    '2025-04-15 16:56:34',
    '2025-04-15 16:56:58'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: impuesto
# ------------------------------------------------------------

INSERT INTO
  `impuesto` (
    `id_impuesto`,
    `descripcion`,
    `valor_calculo`,
    `abreviacion`
  )
VALUES
  (1, 'Excentas', 0, 'Excenta');
INSERT INTO
  `impuesto` (
    `id_impuesto`,
    `descripcion`,
    `valor_calculo`,
    `abreviacion`
  )
VALUES
  (2, 'Impuesto al valor agregado al 5%', 21, 'IVA 5%');
INSERT INTO
  `impuesto` (
    `id_impuesto`,
    `descripcion`,
    `valor_calculo`,
    `abreviacion`
  )
VALUES
  (
    3,
    'Impuesto al valor agregado al 10%',
    11,
    'IVA 10%'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: linea
# ------------------------------------------------------------

INSERT INTO
  `linea` (`id_linea`, `descripcion`, `id_categoria`)
VALUES
  (1, 'Sin Línea', 1);
INSERT INTO
  `linea` (`id_linea`, `descripcion`, `id_categoria`)
VALUES
  (2, 'Termos y Jarras Térmicas', 2);
INSERT INTO
  `linea` (`id_linea`, `descripcion`, `id_categoria`)
VALUES
  (3, 'Prestobarbas', 3);
INSERT INTO
  `linea` (`id_linea`, `descripcion`, `id_categoria`)
VALUES
  (4, 'Mouse Pad', 4);
INSERT INTO
  `linea` (`id_linea`, `descripcion`, `id_categoria`)
VALUES
  (5, 'Borradores de goma', 5);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: marca
# ------------------------------------------------------------

INSERT INTO
  `marca` (`id_marca`, `descripcion`)
VALUES
  (1, 'Sin Marca');
INSERT INTO
  `marca` (`id_marca`, `descripcion`)
VALUES
  (2, 'Stanley');
INSERT INTO
  `marca` (`id_marca`, `descripcion`)
VALUES
  (3, 'BIG');
INSERT INTO
  `marca` (`id_marca`, `descripcion`)
VALUES
  (4, 'SATE');
INSERT INTO
  `marca` (`id_marca`, `descripcion`)
VALUES
  (5, 'Faber Castel');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: modulo
# ------------------------------------------------------------

INSERT INTO
  `modulo` (
    `id_modulo`,
    `descripcion`,
    `icono`,
    `orden`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`
  )
VALUES
  (
    1,
    'Sistema General',
    'fas fa-user-cog',
    0,
    1,
    '2025-04-15 16:58:38',
    '2025-04-16 14:45:19'
  );
INSERT INTO
  `modulo` (
    `id_modulo`,
    `descripcion`,
    `icono`,
    `orden`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`
  )
VALUES
  (
    2,
    'Finanzas',
    'fas fa-cash-register',
    0,
    1,
    '2025-04-15 16:59:06',
    '2025-04-16 14:45:33'
  );
INSERT INTO
  `modulo` (
    `id_modulo`,
    `descripcion`,
    `icono`,
    `orden`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`
  )
VALUES
  (
    3,
    'Compras',
    'fas fa-shopping-cart',
    0,
    1,
    '2025-04-15 16:59:21',
    '2025-04-16 14:45:48'
  );
INSERT INTO
  `modulo` (
    `id_modulo`,
    `descripcion`,
    `icono`,
    `orden`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`
  )
VALUES
  (
    4,
    'Control de Stock',
    'fas fa-box',
    0,
    1,
    '2025-04-15 16:59:55',
    '2025-04-16 14:46:10'
  );
INSERT INTO
  `modulo` (
    `id_modulo`,
    `descripcion`,
    `icono`,
    `orden`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`
  )
VALUES
  (
    5,
    'Otros',
    'fas fa-tags',
    0,
    1,
    '2025-04-16 14:47:07',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: pais
# ------------------------------------------------------------

INSERT INTO
  `pais` (
    `id_pais`,
    `descripcion`,
    `nacionalidad`,
    `codigo_iso3`
  )
VALUES
  (1, 'Paraguay', 'paraguayo/a', 'PRY');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: programa
# ------------------------------------------------------------

INSERT INTO
  `programa` (
    `id_programa`,
    `id_modulo`,
    `nombre`,
    `ruta`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`,
    `id_categoria`
  )
VALUES
  (
    1,
    1,
    'Cambio a Futuro',
    '/sin_ruta',
    1,
    '2025-04-15 17:00:40',
    '2025-04-16 15:11:59',
    1
  );
INSERT INTO
  `programa` (
    `id_programa`,
    `id_modulo`,
    `nombre`,
    `ruta`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`,
    `id_categoria`
  )
VALUES
  (
    2,
    1,
    'Departamentos',
    '/sistema_general/mantenimientos/departamentos',
    1,
    '2025-04-15 17:00:54',
    '2025-04-16 15:12:05',
    1
  );
INSERT INTO
  `programa` (
    `id_programa`,
    `id_modulo`,
    `nombre`,
    `ruta`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`,
    `id_categoria`
  )
VALUES
  (
    3,
    1,
    'Ciudades',
    '/sistema_general/mantenimientos/ciudades',
    1,
    '2025-04-15 17:01:12',
    '2025-04-16 15:12:11',
    1
  );
INSERT INTO
  `programa` (
    `id_programa`,
    `id_modulo`,
    `nombre`,
    `ruta`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`,
    `id_categoria`
  )
VALUES
  (
    4,
    1,
    'Empresas',
    '/sistema_general/mantenimientos/empresas',
    1,
    '2025-04-15 17:02:03',
    '2025-04-16 15:12:20',
    1
  );
INSERT INTO
  `programa` (
    `id_programa`,
    `id_modulo`,
    `nombre`,
    `ruta`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`,
    `id_categoria`
  )
VALUES
  (
    5,
    1,
    'Sucursales',
    '/sistema_general/mantenimientos/sucursales',
    1,
    '2025-04-15 17:02:15',
    '2025-04-16 14:32:04',
    1
  );
INSERT INTO
  `programa` (
    `id_programa`,
    `id_modulo`,
    `nombre`,
    `ruta`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`,
    `id_categoria`
  )
VALUES
  (
    6,
    1,
    'Depósitos',
    '/sistema_general/mantenimientos/depositos',
    1,
    '2025-04-15 17:02:31',
    '2025-04-16 14:32:05',
    1
  );
INSERT INTO
  `programa` (
    `id_programa`,
    `id_modulo`,
    `nombre`,
    `ruta`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`,
    `id_categoria`
  )
VALUES
  (
    7,
    1,
    'Roles',
    '/sistema_general/mantenimientos/roles',
    1,
    '2025-04-15 17:02:47',
    '2025-04-16 14:32:07',
    1
  );
INSERT INTO
  `programa` (
    `id_programa`,
    `id_modulo`,
    `nombre`,
    `ruta`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`,
    `id_categoria`
  )
VALUES
  (
    8,
    1,
    'Módulos',
    '/sistema_general/mantenimientos/modulos',
    1,
    '2025-04-15 17:03:28',
    '2025-04-16 14:32:10',
    1
  );
INSERT INTO
  `programa` (
    `id_programa`,
    `id_modulo`,
    `nombre`,
    `ruta`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`,
    `id_categoria`
  )
VALUES
  (
    9,
    1,
    'Programas',
    '/sistema_general/mantenimientos/programas',
    1,
    '2025-04-15 17:03:40',
    '2025-04-16 14:32:13',
    1
  );
INSERT INTO
  `programa` (
    `id_programa`,
    `id_modulo`,
    `nombre`,
    `ruta`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`,
    `id_categoria`
  )
VALUES
  (
    10,
    1,
    'Categorias de Programas',
    '/sistema_general/mantenimientos/categorias-programas',
    1,
    '2025-04-16 14:55:44',
    NULL,
    1
  );
INSERT INTO
  `programa` (
    `id_programa`,
    `id_modulo`,
    `nombre`,
    `ruta`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`,
    `id_categoria`
  )
VALUES
  (
    11,
    4,
    'Impuestos',
    '/control_stock/mantenimientos/impuestos',
    1,
    '2025-04-18 20:15:52',
    '2025-04-22 13:20:23',
    1
  );
INSERT INTO
  `programa` (
    `id_programa`,
    `id_modulo`,
    `nombre`,
    `ruta`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`,
    `id_categoria`
  )
VALUES
  (
    12,
    4,
    'Marcas',
    '/control_stock/mantenimientos/marcas',
    1,
    '2025-04-18 21:00:09',
    '2025-04-22 13:26:32',
    1
  );
INSERT INTO
  `programa` (
    `id_programa`,
    `id_modulo`,
    `nombre`,
    `ruta`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`,
    `id_categoria`
  )
VALUES
  (
    13,
    4,
    'Categorías',
    '/control_stock/mantenimientos/categorias',
    1,
    '2025-04-18 21:57:13',
    '2025-04-22 13:18:02',
    1
  );
INSERT INTO
  `programa` (
    `id_programa`,
    `id_modulo`,
    `nombre`,
    `ruta`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`,
    `id_categoria`
  )
VALUES
  (
    14,
    4,
    'Líneas',
    '/control_stock/mantenimientos/lineas',
    1,
    '2025-04-18 22:22:51',
    '2025-04-22 13:25:11',
    1
  );
INSERT INTO
  `programa` (
    `id_programa`,
    `id_modulo`,
    `nombre`,
    `ruta`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`,
    `id_categoria`
  )
VALUES
  (
    15,
    4,
    'Tipos de Artículos',
    '/control_stock/mantenimientos/tipos_articulos',
    1,
    '2025-04-19 10:51:37',
    '2025-04-22 13:28:30',
    1
  );
INSERT INTO
  `programa` (
    `id_programa`,
    `id_modulo`,
    `nombre`,
    `ruta`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`,
    `id_categoria`
  )
VALUES
  (
    16,
    4,
    'Unidades de Medidas',
    '/control_stock/mantenimientos/unidades_medidas',
    1,
    '2025-04-19 14:19:10',
    '2025-04-22 13:30:27',
    1
  );
INSERT INTO
  `programa` (
    `id_programa`,
    `id_modulo`,
    `nombre`,
    `ruta`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`,
    `id_categoria`
  )
VALUES
  (
    17,
    4,
    'Artículos',
    '/control_stock/mantenimientos/articulos',
    1,
    '2025-04-20 21:56:32',
    NULL,
    1
  );
INSERT INTO
  `programa` (
    `id_programa`,
    `id_modulo`,
    `nombre`,
    `ruta`,
    `estado`,
    `fecha_creacion`,
    `fecha_actualizacion`,
    `id_categoria`
  )
VALUES
  (
    18,
    4,
    'Tipos de Barras',
    '/control_stock/mantenimientos/tipos_barras',
    1,
    '2025-04-22 13:05:21',
    '2025-04-22 13:43:00',
    1
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: rol
# ------------------------------------------------------------

INSERT INTO
  `rol` (`id_rol`, `descripcion`)
VALUES
  (1, 'Programador/a');
INSERT INTO
  `rol` (`id_rol`, `descripcion`)
VALUES
  (2, 'Administrador/a');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: sucursal
# ------------------------------------------------------------

INSERT INTO
  `sucursal` (
    `id_sucursal`,
    `id_empresa`,
    `descripcion`,
    `direccion`,
    `telefono`,
    `email`,
    `id_ciudad`,
    `casa_central`,
    `estado`,
    `fecha_registro`,
    `fecha_actualizacion`
  )
VALUES
  (
    1,
    1,
    'Casa Central',
    'Barrio Virgen Serrana',
    '0975489075',
    'armando.peralta.0405@gmail.com',
    22,
    1,
    1,
    '2025-04-15 16:57:44',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: tipo_articulo
# ------------------------------------------------------------

INSERT INTO
  `tipo_articulo` (`id_tipo`, `descripcion`)
VALUES
  (1, 'Adquiridos');
INSERT INTO
  `tipo_articulo` (`id_tipo`, `descripcion`)
VALUES
  (2, 'Producidos');
INSERT INTO
  `tipo_articulo` (`id_tipo`, `descripcion`)
VALUES
  (3, 'Servicios');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: tipo_barra
# ------------------------------------------------------------

INSERT INTO
  `tipo_barra` (`id_tipo`, `descripcion`)
VALUES
  (1, 'EAN-13');
INSERT INTO
  `tipo_barra` (`id_tipo`, `descripcion`)
VALUES
  (2, 'EAN-8');
INSERT INTO
  `tipo_barra` (`id_tipo`, `descripcion`)
VALUES
  (3, 'UPC');
INSERT INTO
  `tipo_barra` (`id_tipo`, `descripcion`)
VALUES
  (4, 'ITF-14');
INSERT INTO
  `tipo_barra` (`id_tipo`, `descripcion`)
VALUES
  (5, 'GS1-128');
INSERT INTO
  `tipo_barra` (`id_tipo`, `descripcion`)
VALUES
  (6, 'BIDIMENSIONAL');
INSERT INTO
  `tipo_barra` (`id_tipo`, `descripcion`)
VALUES
  (7, 'QR ESTÁNDAR DE GS1');
INSERT INTO
  `tipo_barra` (`id_tipo`, `descripcion`)
VALUES
  (8, 'DATA MATRIX');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: unidad_medida
# ------------------------------------------------------------

INSERT INTO
  `unidad_medida` (`id_unidad`, `descripcion`, `abreviacion`)
VALUES
  (1, 'Unidades', 'UM');
INSERT INTO
  `unidad_medida` (`id_unidad`, `descripcion`, `abreviacion`)
VALUES
  (2, 'Kilogramos', 'KG');
INSERT INTO
  `unidad_medida` (`id_unidad`, `descripcion`, `abreviacion`)
VALUES
  (3, 'Metros', 'MT');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: usuario
# ------------------------------------------------------------

INSERT INTO
  `usuario` (
    `id_usuario`,
    `nombre`,
    `apellido`,
    `cedula`,
    `telefono`,
    `direccion`,
    `correo_electronico`,
    `alias`,
    `clave`,
    `estado`,
    `fecha_registro`,
    `fecha_actualizacion`
  )
VALUES
  (
    1,
    'Administrador',
    'Del Sistema',
    '9999999',
    '9999999999',
    'SIN DATOS',
    'admin@gmail.com',
    'Admin',
    '$2b$10$kAaKepkVgKoV1L.VqFmCUek5JH1VtAW7IF3BLGnZ94OGv4nKxYAL2',
    1,
    '2025-04-04 11:40:49',
    '2025-04-04 11:40:49'
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
