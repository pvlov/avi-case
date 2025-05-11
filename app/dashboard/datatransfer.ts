import { TimelineItem, CategoryItem, PersonalInfoItem } from "@/types/dashboard";
import { MedicalDocument, VaccinationEntry, DocType, Medication, Procedure } from "@/types/medical";
import { useMedicalStore } from "@/lib/store";

export interface MedicalData {
  documents: TimelineItem[];
  medications: CategoryItem[];
  vaccinations: CategoryItem[];
  labResults: CategoryItem[];
  procedures: CategoryItem[];
  personalInfo: PersonalInfoItem;
}

function convertMedicalDocumentToTimeline(doc: MedicalDocument): TimelineItem {
  const docId = crypto.randomUUID();
  return {
    id: crypto.randomUUID(),
    date: new Date(doc.dateIssued || ''),
    type: 'document',
    title: doc.diagnosis.join(', ') || 'Medical Document',
    description: doc.diagnosis.join(', '),
    doctorName: doc.doctorName || '',
    documentId: docId
  };
}

function convertMedicationsToCategory(
  doc: MedicalDocument,
  docId: string,
): (CategoryItem & Partial<Medication>)[] {
  return doc.medications.map((med) => ({
    id: crypto.randomUUID(),
    title: med.name,
    date: new Date(doc.dateIssued || ""),
    type: "medication",
    documentId: docId,
    dosage: med.dosage || undefined,
    frequency: med.frequency || undefined,
    duration: med.duration || undefined,
  }));
}

function convertVaccinationToCategory(vac: VaccinationEntry): CategoryItem & Partial<VaccinationEntry> {
  return {
    id: crypto.randomUUID(),
    title: `${vac.vaccine} ${vac.trade_name ? `(${vac.trade_name})` : ""}`,
    date: vac.date,
    type: "vaccination",
    documentId: crypto.randomUUID(),
    trade_name: vac.trade_name,
    batch_number: vac.batch_number,
    doctor: vac.doctor,
    location: vac.location,
    notes: vac.notes,
  };
}

function convertLabResultsToCategory(doc: MedicalDocument, docId: string): CategoryItem[] {
  return doc.lab_parameters.map((lab) => ({
    id: crypto.randomUUID(),
    title: `${lab.name}: ${lab.quantity} ${lab.unit}`,
    date: new Date(doc.dateIssued || ""),
    type: "labresult",
    documentId: docId,
  }));
}

export function transformStoreDataToDashboard(): MedicalData {
  const state = useMedicalStore.getState();
  
  // Transform records to timeline items
  const timelineItems: TimelineItem[] = state.records
    .filter(record => record.docType === DocType.DOCUMENT)
    .map(record => ({
      id: record.id,
      date: new Date((record.data as MedicalDocument).dateIssued || record.createdAt),
      type: "document",
      title: record.title,
      description: record.notes || "",
      doctorName: (record.data as MedicalDocument).doctorName || "",
      documentId: record.id,
      isHighlighted: false
    }));

  // Transform vaccination records
  const vaccinations: CategoryItem[] = state.records
    .filter(record => record.docType === DocType.VACCINEPASS)
    .flatMap(record => 
      (record.data.vaccinations as VaccinationEntry[]).map(vac => ({
        id: record.id + "-" + vac.vaccine,
        title: `${vac.vaccine} ${vac.trade_name ? `(${vac.trade_name})` : ""}`,
        date: vac.date,
        type: "vaccination",
        documentId: record.id,
        trade_name: vac.trade_name,
        batch_number: vac.batch_number,
        doctor: vac.doctor,
        location: vac.location,
        notes: vac.notes
      }))
    );

  // Transform medication records
  const medications: CategoryItem[] = state.records
    .filter(record => record.docType === DocType.DOCUMENT)
    .flatMap(record => 
      (record.data as MedicalDocument).medications.map(med => ({
        id: record.id + "-" + med.name,
        title: med.name,
        date: new Date(record.data.dateIssued || record.createdAt),
        type: "medication",
        documentId: record.id,
        dosage: med.dosage || undefined,
        frequency: med.frequency || undefined,
        duration: med.duration || undefined
      }))
    );

  // Transform procedures
  const procedures: CategoryItem[] = state.records
    .filter(record => record.docType === DocType.DOCUMENT)
    .flatMap(record => 
      (record.data as MedicalDocument).procedures.map(proc => ({
        id: record.id + "-" + proc.name,
        title: proc.name,
        date: new Date(proc.date || record.data.dateIssued || record.createdAt),
        type: "procedure",
        documentId: record.id,
        indication: proc.indication || undefined,
        findings: proc.findings || undefined
      }))
    );

  // Get insurance data
  const insuranceRecord = state.records.find(record => 
    record.docType === DocType.INSURANCECARD
  );

  const personalInfo: PersonalInfoItem = {
    insuranceData: insuranceRecord ? insuranceRecord.data : {
      givenName: state.currentUser?.name || "",
      familyName: "",
      dateOfBirth: state.currentUser?.dateOfBirth || new Date(),
      insurerName: "",
      insurerId: "",
      memberId: "",
      cardNumber: "",
      cardSerialNumber: "",
      validFrom: new Date(),
      validTo: new Date()
    }
  };

  return {
    documents: timelineItems,
    medications,
    vaccinations,
    procedures,
    personalInfo,
    labResults: [] // Not implemented yet
  };
}
