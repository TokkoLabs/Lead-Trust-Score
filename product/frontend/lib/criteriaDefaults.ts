/**
 * criteriaDefaults — fuente de verdad de la vista Criterios (feature 15).
 *
 * Centraliza el estado por defecto del configurador (`CriteriaState`) para que
 * tanto `CriteriaView` como sus tests usen el MISMO baseline. El botón
 * "Restablecer defaults" debe poder volver a estos valores sin recargar la
 * página: el consumidor hace `setState(CRITERIA_DEFAULTS)`.
 *
 * Los valores reproducen el HTML target
 * (ui-ux/lead-trust-dashboard-tokko (3).html, sección `#view-criteria`,
 * líneas 831-888):
 *
 *  - Datos de contacto: 3 criterios con toggle on + peso Media/Alta/Media.
 *  - Propiedad y fuente: 2 criterios con toggle on + peso Alta/Media.
 *  - Mensaje: 2 criterios con toggle on + peso Media/Baja.
 *  - Pesos de dimensiones: Trust 40 / Conversión 40 / Urgencia 20 (suma 100).
 *  - Filtros automáticos: 4 toggles (3 on, "Ignorar sin mensaje" off).
 *  - Keywords positivas: visita, interesado, mudanza, comprar, urgente.
 *  - Keywords negativas: prueba, test, demo.
 */

export type Weight = "Alta" | "Media" | "Baja";

export const WEIGHT_OPTIONS: Weight[] = ["Alta", "Media", "Baja"];

export interface CriterionConfig {
  id: string;
  enabled: boolean;
  weight: Weight;
}

export interface CriteriaState {
  contacto: {
    email: CriterionConfig;
    telefono: CriterionConfig;
    telefonoCompleto: CriterionConfig;
  };
  propiedadFuente: {
    solicitudVisita: CriterionConfig;
    portalVerificado: CriterionConfig;
  };
  mensaje: {
    noVacio: CriterionConfig;
    extenso: CriterionConfig;
  };
  pesos: {
    trust: number;
    conversion: number;
    urgency: number;
  };
  filtrosAutomaticos: {
    bloquearInvalidos: boolean;
    detectarSpam: boolean;
    filtrarDuplicados: boolean;
    ignorarSinMensaje: boolean;
  };
  keywords: {
    positivas: string[];
    negativas: string[];
  };
}

export const CRITERIA_DEFAULTS: CriteriaState = {
  contacto: {
    email: { id: "email", enabled: true, weight: "Media" },
    telefono: { id: "telefono", enabled: true, weight: "Alta" },
    telefonoCompleto: {
      id: "telefonoCompleto",
      enabled: true,
      weight: "Media",
    },
  },
  propiedadFuente: {
    solicitudVisita: {
      id: "solicitudVisita",
      enabled: true,
      weight: "Alta",
    },
    portalVerificado: {
      id: "portalVerificado",
      enabled: true,
      weight: "Media",
    },
  },
  mensaje: {
    noVacio: { id: "noVacio", enabled: true, weight: "Media" },
    extenso: { id: "extenso", enabled: true, weight: "Baja" },
  },
  pesos: { trust: 40, conversion: 40, urgency: 20 },
  filtrosAutomaticos: {
    bloquearInvalidos: true,
    detectarSpam: true,
    filtrarDuplicados: true,
    ignorarSinMensaje: false,
  },
  keywords: {
    positivas: ["visita", "interesado", "mudanza", "comprar", "urgente"],
    negativas: ["prueba", "test", "demo"],
  },
};

/**
 * Clona profundo el baseline para que mutaciones del estado de UI no
 * contaminen el objeto exportado (los arrays de keywords son mutables si se
 * comparten por referencia).
 */
export function cloneDefaults(): CriteriaState {
  return {
    contacto: {
      email: { ...CRITERIA_DEFAULTS.contacto.email },
      telefono: { ...CRITERIA_DEFAULTS.contacto.telefono },
      telefonoCompleto: { ...CRITERIA_DEFAULTS.contacto.telefonoCompleto },
    },
    propiedadFuente: {
      solicitudVisita: {
        ...CRITERIA_DEFAULTS.propiedadFuente.solicitudVisita,
      },
      portalVerificado: {
        ...CRITERIA_DEFAULTS.propiedadFuente.portalVerificado,
      },
    },
    mensaje: {
      noVacio: { ...CRITERIA_DEFAULTS.mensaje.noVacio },
      extenso: { ...CRITERIA_DEFAULTS.mensaje.extenso },
    },
    pesos: { ...CRITERIA_DEFAULTS.pesos },
    filtrosAutomaticos: { ...CRITERIA_DEFAULTS.filtrosAutomaticos },
    keywords: {
      positivas: [...CRITERIA_DEFAULTS.keywords.positivas],
      negativas: [...CRITERIA_DEFAULTS.keywords.negativas],
    },
  };
}
