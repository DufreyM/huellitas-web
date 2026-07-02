import { savePetImage } from "./uploads";

export interface PetFieldValues {
  name: string;
  speciesId: number;
  breedName: string;
  genderId: number;
  sizeId: number;
  statusId: number;
  estimatedBirthDate: Date | null;
  weightLbs: number | null;
  temperament: string | null;
  traits: string[];
  rescueStory: string | null;
  healthNotes: string[];
  needs: string[];
}

function parseCsv(value: FormDataEntryValue | null): string[] | undefined {
  if (value === null) return undefined;
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

// Every field falls back to `defaults` when absent from the form, so this
// same reader supports both creating a pet (defaults = empty/required values)
// and partially updating one (defaults = the pet's current values) — e.g. the
// admin list's quick status toggle only sends `statusId`.
export function readPetFields(formData: FormData, defaults: PetFieldValues): PetFieldValues {
  const raw = (key: string) => (formData.has(key) ? String(formData.get(key)) : undefined);

  const estimatedBirthDateRaw = raw("estimatedBirthDate");
  const weightLbsRaw = raw("weightLbs");

  return {
    name: raw("name")?.trim() || defaults.name,
    speciesId: raw("speciesId") ? Number(raw("speciesId")) : defaults.speciesId,
    breedName: raw("breed")?.trim() || defaults.breedName,
    genderId: raw("genderId") ? Number(raw("genderId")) : defaults.genderId,
    sizeId: raw("sizeId") ? Number(raw("sizeId")) : defaults.sizeId,
    statusId: raw("statusId") ? Number(raw("statusId")) : defaults.statusId,
    estimatedBirthDate: formData.has("estimatedBirthDate")
      ? (estimatedBirthDateRaw ? new Date(estimatedBirthDateRaw) : null)
      : defaults.estimatedBirthDate,
    weightLbs: formData.has("weightLbs")
      ? (weightLbsRaw ? Number(weightLbsRaw) : null)
      : defaults.weightLbs,
    temperament: formData.has("temperament") ? (raw("temperament") || null) : defaults.temperament,
    traits: parseCsv(formData.get("traits")) ?? defaults.traits,
    rescueStory: formData.has("rescueStory") ? (raw("rescueStory") || null) : defaults.rescueStory,
    healthNotes: parseCsv(formData.get("healthNotes")) ?? defaults.healthNotes,
    needs: parseCsv(formData.get("needs")) ?? defaults.needs,
  };
}

export function validatePetFields(fields: PetFieldValues): string | null {
  if (!fields.name) return "El nombre es obligatorio";
  if (!fields.speciesId) return "La especie es obligatoria";
  if (!fields.genderId) return "El género es obligatorio";
  if (!fields.sizeId) return "El tamaño es obligatorio";
  if (!fields.statusId) return "El estado es obligatorio";
  return null;
}

export async function readPetPhoto(formData: FormData): Promise<string | undefined> {
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    return savePetImage(photo);
  }
  return undefined;
}
