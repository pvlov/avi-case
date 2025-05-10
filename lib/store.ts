import { create } from "zustand";
import { persist } from "zustand/middleware";
import { InsuranceCard, Vaccination, DocType } from "@/types/medical";

interface MedicalDocument {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  docType: DocType;
  title: string;
  notes?: string;
}

interface MedicalRecord extends MedicalDocument {
  data: InsuranceCard | Vaccination | any;
}

interface UserProfile {
  id: string;
  name: string;
  email?: string;
  dateOfBirth?: Date;
}

interface MedicalStore {
  // State
  currentUser: UserProfile | null;
  records: MedicalRecord[];
  isLoading: boolean;
  currentStep: number;

  // User actions
  setCurrentUser: (user: UserProfile) => void;
  clearCurrentUser: () => void;

  // Record actions
  addRecord: (record: Omit<MedicalRecord, "id" | "createdAt" | "updatedAt">) => void;
  updateRecord: (id: string, data: Partial<MedicalRecord>) => void;
  deleteRecord: (id: string) => void;

  // Records queries
  getRecordsByType: (docType: DocType) => MedicalRecord[];
  getRecordById: (id: string) => MedicalRecord | undefined;

  // UI state
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  setLoading: (isLoading: boolean) => void;
}

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Create the store with persistence middleware
export const useMedicalStore = create<MedicalStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      records: [],
      isLoading: false,
      currentStep: 1,

      // User actions
      setCurrentUser: (user) => set({ currentUser: user }),
      clearCurrentUser: () => set({ currentUser: null }),

      // Record actions
      addRecord: (record) =>
        set((state) => {
          const newRecord: MedicalRecord = {
            ...record,
            id: generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          return {
            records: [...state.records, newRecord],
          };
        }),

      updateRecord: (id, data) =>
        set((state) => ({
          records: state.records.map((record) =>
            record.id === id ? { ...record, ...data, updatedAt: new Date() } : record,
          ),
        })),

      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
        })),

      // Records queries
      getRecordsByType: (docType) => {
        return get().records.filter((record) => record.docType === docType);
      },

      getRecordById: (id) => {
        return get().records.find((record) => record.id === id);
      },

      // UI state
      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 4), // Assuming 4 steps based on what I've seen
        })),
      previousStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "medical-records-storage", // localStorage key
      partialize: (state) => ({
        // Only persist these parts of the store
        currentUser: state.currentUser,
        records: state.records,
        // Don't persist UI state like isLoading or currentStep
      }),
    },
  ),
);

// Helper hooks for specific document types
export const useInsuranceRecords = () => {
  const records = useMedicalStore((state) =>
    state.records.filter((record) => record.docType === DocType.INSURANCECARD),
  );
  return records as (MedicalRecord & { data: InsuranceCard })[];
};

export const useVaccinationRecords = () => {
  const records = useMedicalStore((state) =>
    state.records.filter((record) => record.docType === DocType.VACCINEPASS),
  );
  return records as (MedicalRecord & { data: Vaccination })[];
};
