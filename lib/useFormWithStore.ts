import { useState } from 'react';
import { useMedicalStore } from './store';
import { DocType } from '@/types/medical';

// Utility hook to connect forms with the store
export function useFormWithStore<T>(docType: DocType, options?: { 
  onSuccess?: (data: T) => void,
  title?: string
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addRecord = useMedicalStore(state => state.addRecord);
  
  const handleSubmit = async (data: T) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Add record to the store
      addRecord({
        docType,
        title: options?.title || `${docType} Record`, 
        data,
      });
      
      // Call onSuccess callback if provided
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    handleSubmit,
    isSubmitting,
    error,
  };
} 