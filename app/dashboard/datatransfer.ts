import { TimelineItem, CategoryItem, PersonalInfoItem } from '@/types/dashboard';
import { MedicalDocument, Vaccination, DocType, Medication, Procedure } from '@/types/medical';

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
    title: doc.generatedTitle || '',
    description: doc.diagnosis.join(', '),
    doctorName: doc.doctorName || '',
    documentId: docId
  };
}

function convertMedicationsToCategory(doc: MedicalDocument, docId: string): (CategoryItem & Partial<Medication>)[] {
  return doc.medications.map(med => ({
    id: crypto.randomUUID(),
    title: med.name,
    date: new Date(doc.dateIssued || ''),
    type: 'medication',
    documentId: docId,
    dosage: med.dosage || undefined,
    frequency: med.frequency || undefined,
    duration: med.duration || undefined
  }));
}

function convertVaccinationToCategory(vac: Vaccination): CategoryItem & Partial<Vaccination> {
  return {
    id: crypto.randomUUID(),
    title: `${vac.vaccine} ${vac.trade_name ? `(${vac.trade_name})` : ''}`,
    date: vac.date,
    type: 'vaccination',
    documentId: crypto.randomUUID(),
    trade_name: vac.trade_name,
    batch_number: vac.batch_number,
    doctor: vac.doctor,
    location: vac.location,
    notes: vac.notes
  };
}

function convertLabResultsToCategory(doc: MedicalDocument, docId: string): CategoryItem[] {
  return doc.lab_parameters.map(lab => ({
    id: crypto.randomUUID(),
    title: lab,
    date: new Date(doc.dateIssued || ''),
    type: 'labresult',
    documentId: docId
  }));
}

export async function fetchMedicalData(): Promise<MedicalData> {
  try {
    const mockMedicalDocs: MedicalDocument[] = [
      {
        generatedTitle: 'General Checkup Visit',
        dateIssued: '2024-02-15',
        doctorName: 'Dr. Schmidt',
        patient: {
          name: 'John Doe',
          birth_date: null,
          gender: null,
          height_cm: null,
          weight_kg: null,
          bmi: null
        },
        vitals: {
          blood_pressure: null,
          heart_rate: null,
          temperature_c: null
        },
        anamnesis: null,
        statusAtAdmission: null,
        diagnosis: ['Common Cold', 'Mild Fever'],
        therapy: [],
        progress: null,
        ekg: { date: null, details: null },
        lab_parameters: ['Blood Count: Normal', 'CRP: Slightly Elevated'],
        procedures: [
          {
            name: 'Blood Test',
            date: '2024-02-15',
            indication: 'Routine Check',
            findings: 'Normal blood count, slightly elevated CRP'
          },
          {
            name: 'ECG',
            date: '2024-02-15',
            indication: 'Preventive Check',
            findings: 'Normal sinus rhythm'
          }
        ],
        planned_procedures: [],
        medications: [
          {
            name: 'Ibuprofen',
            dosage: '400mg',
            frequency: '3x daily',
            duration: '5 days'
          },
          {
            name: 'Amoxicillin',
            dosage: '500mg',
            frequency: '2x daily',
            duration: '7 days'
          }
        ],
        discharge_notes: null
      },
      {
        generatedTitle: 'Cardiology Consultation',
        dateIssued: '2024-01-10',
        doctorName: 'Dr. Weber',
        patient: {
          name: 'John Doe',
          birth_date: null,
          gender: null,
          height_cm: null,
          weight_kg: null,
          bmi: null
        },
        vitals: {
          blood_pressure: null,
          heart_rate: null,
          temperature_c: null
        },
        anamnesis: null,
        statusAtAdmission: null,
        diagnosis: ['Mild Hypertension'],
        therapy: [],
        progress: null,
        ekg: { date: null, details: null },
        lab_parameters: ['Blood Count: Normal', 'CRP: Slightly Elevated'],
        procedures: [
          {
            name: 'ECG',
            date: '2024-01-10',
            indication: 'Chest Pain',
            findings: 'Normal sinus rhythm, no abnormalities'
          }
        ],
        planned_procedures: [],
        medications: [
          {
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: '1x daily',
            duration: '30 days'
          }
        ],
        discharge_notes: null
      },
      {
        generatedTitle: 'Orthopedic Evaluation',
        dateIssued: '2023-12-05',
        doctorName: 'Dr. Mueller',
        patient: {
          name: 'John Doe',
          birth_date: null,
          gender: null,
          height_cm: null,
          weight_kg: null,
          bmi: null
        },
        vitals: {
          blood_pressure: null,
          heart_rate: null,
          temperature_c: null
        },
        anamnesis: null,
        statusAtAdmission: null,
        diagnosis: ['Knee Osteoarthritis'],
        therapy: [],
        progress: null,
        ekg: { date: null, details: null },
        lab_parameters: ['Blood Count: Normal', 'CRP: Slightly Elevated'],
        procedures: [
          {
            name: 'Knee X-Ray',
            date: '2023-12-05',
            indication: 'Chronic Knee Pain',
            findings: 'Mild joint space narrowing'
          }
        ],
        planned_procedures: [],
        medications: [
          {
            name: 'Diclofenac',
            dosage: '75mg',
            frequency: '2x daily',
            duration: '14 days'
          }
        ],
        discharge_notes: null
      },
      {
        generatedTitle: 'Dermatology Visit',
        dateIssued: '2023-11-20',
        doctorName: 'Dr. Fischer',
        patient: {
          name: 'John Doe',
          birth_date: null,
          gender: null,
          height_cm: null,
          weight_kg: null,
          bmi: null
        },
        vitals: {
          blood_pressure: null,
          heart_rate: null,
          temperature_c: null
        },
        anamnesis: null,
        statusAtAdmission: null,
        diagnosis: ['Eczema'],
        therapy: [],
        progress: null,
        ekg: { date: null, details: null },
        lab_parameters: ['Blood Count: Normal', 'CRP: Slightly Elevated'],
        procedures: [
          {
            name: 'Skin Biopsy',
            date: '2023-11-20',
            indication: 'Suspicious Lesion',
            findings: 'Benign, no malignancy'
          }
        ],
        planned_procedures: [],
        medications: [
          {
            name: 'Hydrocortisone Cream',
            dosage: '1%',
            frequency: '2x daily',
            duration: '10 days'
          }
        ],
        discharge_notes: null
      }
    ];

    const mockVaccinations: Vaccination[] = [
      {
        vaccine: 'COVID-19',
        date: new Date('2024-01-20'),
        trade_name: 'Comirnaty',
        batch_number: 'BNT162b2-123',
        doctor: 'Dr. Mueller',
        location: 'City Clinic',
        notes: 'Booster shot'
      },
      {
        vaccine: 'Influenza',
        date: new Date('2023-11-15'),
        trade_name: 'Fluarix Tetra',
        batch_number: 'FLU2023-456',
        doctor: 'Dr. Weber',
        location: 'Family Practice',
        notes: 'Annual flu shot'
      },
      {
        vaccine: 'Tetanus',
        date: new Date('2023-09-10'),
        trade_name: 'Tetavax',
        batch_number: 'TET2023-789',
        doctor: 'Dr. Schmidt',
        location: 'General Hospital',
        notes: '10-year booster'
      }
    ];

    // Convert all documents to timeline items
    const timelineItems = mockMedicalDocs.map(doc => convertMedicalDocumentToTimeline(doc));
    
    // Combine all medications from all documents
    const allMedications = mockMedicalDocs.flatMap((doc, index) => 
      convertMedicationsToCategory(doc, timelineItems[index].documentId)
    );

    // Combine all procedures from all documents
    const allProcedures = mockMedicalDocs.flatMap((doc, index) => 
      doc.procedures.map(proc => ({
        id: crypto.randomUUID(),
        title: `${proc.name}`,
        date: new Date(proc.date || ''),
        type: 'procedure',
        documentId: timelineItems[index].documentId,
        indication: proc.indication,
        findings: proc.findings
      }))
    );

    return {
      documents: timelineItems,
      medications: allMedications,
      vaccinations: mockVaccinations.map(vac => convertVaccinationToCategory(vac)),
      labResults: convertLabResultsToCategory(mockMedicalDocs[0], timelineItems[0].documentId),
      procedures: allProcedures,
      personalInfo: {
        insuranceData: {
          insurerName: "TK",
          insurerId: "12345",
          memberId: "A123456789",
          givenName: "John",
          familyName: "Doe",
          dateOfBirth: new Date("1990-01-01"),
          validFrom: new Date("2024-01-01"),
          validTo: new Date("2024-12-31"),
          cardSerialNumber: "123456789",
          cardNumber: "987654321"
        }
      }
    };
  } catch (error) {
    console.error('Error fetching medical data:', error);
    return {
      documents: [],
      medications: [],
      vaccinations: [],
      labResults: [],
      procedures: [],
      personalInfo: {
        insuranceData: {
          insurerName: "TK",
          insurerId: "12345",
          memberId: "A123456789",
          givenName: "John",
          familyName: "Doe",
          dateOfBirth: new Date("1990-01-01"),
          validFrom: new Date("2024-01-01"),
          validTo: new Date("2024-12-31"),
          cardSerialNumber: "123456789",
          cardNumber: "987654321"
        }
      }
    };
  }
}
