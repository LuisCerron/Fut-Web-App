import { Attribute, AttributeType, ScaleType, Evaluation, EvaluationStatus, EvaluationType, EvaluationDetail, Player } from "@/modules/core/types/db.types";

// Mock Data for Attributes
const INITIAL_MOCK_ATTRIBUTES: Attribute[] = [
  { id: "1", tenant_id: "t1", name: "Velocidad", type: "Físico", scale_type: "Numérica 1-10", min_value: 1, max_value: 10, unit: "puntos" },
  { id: "2", tenant_id: "t1", name: "Pase Corto", type: "Técnico", scale_type: "Numérica 1-10", min_value: 1, max_value: 10, unit: "puntos" },
  { id: "3", tenant_id: "t1", name: "Decisión", type: "Mental", scale_type: "Numérica 1-10", min_value: 1, max_value: 10, unit: "puntos" },
  { id: "4", tenant_id: "t1", name: "Táctica Posicional", type: "Táctico", scale_type: "Numérica 1-10", min_value: 1, max_value: 10, unit: "puntos" },
];

const LOCAL_STORAGE_ATTRIBUTES_KEY = "mock_attributes";

function getLocalStorageAttributes(): Attribute[] {
  if (typeof window === "undefined") return [];
  const storedAttributes = localStorage.getItem(LOCAL_STORAGE_ATTRIBUTES_KEY);
  if (storedAttributes) {
    return JSON.parse(storedAttributes);
  }
  localStorage.setItem(LOCAL_STORAGE_ATTRIBUTES_KEY, JSON.stringify(INITIAL_MOCK_ATTRIBUTES));
  return INITIAL_MOCK_ATTRIBUTES;
}

function setLocalStorageAttributes(attributes: Attribute[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_ATTRIBUTES_KEY, JSON.stringify(attributes));
}

// Mock Data for Evaluations
const INITIAL_MOCK_EVALUATIONS: Evaluation[] = [
  {
    id: "e1", tenant_id: "t1", player_id: "1", evaluator_user_id: "2",
    evaluation_date: "2024-01-15T10:00:00Z", evaluation_type: "Inicial",
    general_comments: "Buena primera evaluación.", status: "Completada"
  },
  {
    id: "e2", tenant_id: "t1", player_id: "1", evaluator_user_id: "2",
    evaluation_date: "2024-03-15T14:30:00Z", evaluation_type: "Periódica",
    general_comments: "Mostró mejoras en velocidad.", status: "Completada"
  },
  {
    id: "e3", tenant_id: "t1", player_id: "2", evaluator_user_id: "2",
    evaluation_date: "2024-02-01T09:00:00Z", evaluation_type: "Inicial",
    general_comments: "Jugador con gran potencial.", status: "Completada"
  },
];

const LOCAL_STORAGE_EVALUATIONS_KEY = "mock_evaluations";

function getLocalStorageEvaluations(): Evaluation[] {
  if (typeof window === "undefined") return [];
  const storedEvaluations = localStorage.getItem(LOCAL_STORAGE_EVALUATIONS_KEY);
  if (storedEvaluations) {
    return JSON.parse(storedEvaluations);
  }
  localStorage.setItem(LOCAL_STORAGE_EVALUATIONS_KEY, JSON.stringify(INITIAL_MOCK_EVALUATIONS));
  return INITIAL_MOCK_EVALUATIONS;
}

function setLocalStorageEvaluations(evaluations: Evaluation[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_EVALUATIONS_KEY, JSON.stringify(evaluations));
}

// Mock Data for Evaluation Details
const INITIAL_MOCK_EVALUATION_DETAILS: EvaluationDetail[] = [
  { id: "ed1", evaluation_id: "e1", attribute_id: "1", numeric_value: 7, comments: "Aceptable" },
  { id: "ed2", evaluation_id: "e1", attribute_id: "2", numeric_value: 8, comments: "Bueno" },
  { id: "ed3", evaluation_id: "e2", attribute_id: "1", numeric_value: 8, comments: "Mejoró" },
  { id: "ed4", evaluation_id: "e2", attribute_id: "2", numeric_value: 8, comments: "Mantiene el nivel" },
  { id: "ed5", evaluation_id: "e3", attribute_id: "1", numeric_value: 9, comments: "Excelente" },
  { id: "ed6", evaluation_id: "e3", attribute_id: "3", numeric_value: 7, comments: "Necesita mejorar" },
];

const LOCAL_STORAGE_EVALUATION_DETAILS_KEY = "mock_evaluation_details";

function getLocalStorageEvaluationDetails(): EvaluationDetail[] {
  if (typeof window === "undefined") return [];
  const storedDetails = localStorage.getItem(LOCAL_STORAGE_EVALUATION_DETAILS_KEY);
  if (storedDetails) {
    return JSON.parse(storedDetails);
  }
  localStorage.setItem(LOCAL_STORAGE_EVALUATION_DETAILS_KEY, JSON.stringify(INITIAL_MOCK_EVALUATION_DETAILS));
  return INITIAL_MOCK_EVALUATION_DETAILS;
}

function setLocalStorageEvaluationDetails(details: EvaluationDetail[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_EVALUATION_DETAILS_KEY, JSON.stringify(details));
}


export const evaluationsService = {
  // Attributes
  getAttributes: async (): Promise<Attribute[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(getLocalStorageAttributes()), 300));
  },

  createAttribute: async (attribute: Partial<Attribute>): Promise<Attribute> => {
    return new Promise((resolve) => {
      const attributes = getLocalStorageAttributes();
      const newAttribute = {
        ...attribute,
        id: (attributes.length + 1).toString(), // Simple ID generation
        tenant_id: "t1", // Default tenant
      } as Attribute;
      attributes.push(newAttribute);
      setLocalStorageAttributes(attributes);
      setTimeout(() => resolve(newAttribute), 500);
    });
  },

  updateAttribute: async (id: string, data: Partial<Attribute>): Promise<Attribute> => {
    return new Promise((resolve, reject) => {
      const attributes = getLocalStorageAttributes();
      const index = attributes.findIndex((a) => a.id === id);
      if (index === -1) {
        reject(new Error("Attribute not found"));
        return;
      }
      attributes[index] = { ...attributes[index], ...data };
      setLocalStorageAttributes(attributes);
      setTimeout(() => resolve(attributes[index]), 500);
    });
  },

  deleteAttribute: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      let attributes = getLocalStorageAttributes();
      attributes = attributes.filter((a) => a.id !== id);
      setLocalStorageAttributes(attributes);
      setTimeout(() => resolve(), 300);
    });
  },

  // Evaluations
  getEvaluations: async (): Promise<Evaluation[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(getLocalStorageEvaluations()), 500));
  },

  getEvaluationById: async (id: string): Promise<Evaluation | undefined> => {
    return new Promise((resolve) => {
      const evaluations = getLocalStorageEvaluations();
      const evaluation = evaluations.find((e) => e.id === id);
      setTimeout(() => resolve(evaluation), 300);
    });
  },

  createEvaluation: async (evaluation: Partial<Evaluation>, details: Partial<EvaluationDetail>[]): Promise<Evaluation> => {
    return new Promise((resolve) => {
      const evaluations = getLocalStorageEvaluations();
      const newEvaluation = {
        ...evaluation,
        id: (evaluations.length + 1).toString(), // Simple ID generation
        tenant_id: "t1", // Default tenant
        evaluation_date: evaluation.evaluation_date || new Date().toISOString(),
        status: evaluation.status || "Borrador",
      } as Evaluation;
      evaluations.push(newEvaluation);
      setLocalStorageEvaluations(evaluations);

      // Save associated details
      const allDetails = getLocalStorageEvaluationDetails();
      const newDetails = details.map((d, index) => ({
        ...d,
        id: `ed-${newEvaluation.id}-${index}`, // Simple ID for details
        evaluation_id: newEvaluation.id,
      })) as EvaluationDetail[];
      setLocalStorageEvaluationDetails([...allDetails, ...newDetails]);

      setTimeout(() => resolve(newEvaluation), 500);
    });
  },

  updateEvaluation: async (id: string, data: Partial<Evaluation>, details: Partial<EvaluationDetail>[]): Promise<Evaluation> => {
    return new Promise((resolve, reject) => {
      const evaluations = getLocalStorageEvaluations();
      const index = evaluations.findIndex((e) => e.id === id);
      if (index === -1) {
        reject(new Error("Evaluation not found"));
        return;
      }
      evaluations[index] = { ...evaluations[index], ...data };
      setLocalStorageEvaluations(evaluations);

      // Update associated details
      let allDetails = getLocalStorageEvaluationDetails();
      allDetails = allDetails.filter((ed) => ed.evaluation_id !== id); // Remove old details for this evaluation
      const updatedDetails = details.map((d, index) => ({
        ...d,
        id: d.id || `ed-${id}-${index}`, // Keep existing ID if present, else generate new
        evaluation_id: id,
      })) as EvaluationDetail[];
      setLocalStorageEvaluationDetails([...allDetails, ...updatedDetails]);

      setTimeout(() => resolve(evaluations[index]), 500);
    });
  },

  deleteEvaluation: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      let evaluations = getLocalStorageEvaluations();
      evaluations = evaluations.filter((e) => e.id !== id);
      setLocalStorageEvaluations(evaluations);

      // Delete associated details
      let allDetails = getLocalStorageEvaluationDetails();
      allDetails = allDetails.filter((ed) => ed.evaluation_id !== id);
      setLocalStorageEvaluationDetails(allDetails);

      setTimeout(() => resolve(), 300);
    });
  },

  getEvaluationDetailsForEvaluation: async (evaluationId: string): Promise<EvaluationDetail[]> => {
    return new Promise((resolve) => {
      const allDetails = getLocalStorageEvaluationDetails();
      const details = allDetails.filter((ed) => ed.evaluation_id === evaluationId);
      setTimeout(() => resolve(details), 300);
    });
  },

  getEvaluationDetailsForPlayerAttribute: async (playerId: string, attributeId: string): Promise<EvaluationDetail[]> => {
    return new Promise((resolve) => {
      const allDetails = getLocalStorageEvaluationDetails();
      const evaluations = getLocalStorageEvaluations();
      
      const playerEvaluations = evaluations.filter(e => e.player_id === playerId);
      const playerAttributeDetails = allDetails.filter(
        ed => playerEvaluations.some(pe => pe.id === ed.evaluation_id) && ed.attribute_id === attributeId
      );
      setTimeout(() => resolve(playerAttributeDetails), 300);
    });
  },
};

