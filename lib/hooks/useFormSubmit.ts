"use client";

import { useState, useCallback } from 'react';

interface FormSubmitState {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string | null;
}

interface UseFormSubmitOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
  resetOnSuccess?: boolean;
}

export function useFormSubmit<T extends Record<string, unknown>>(
  endpoint: string,
  options: UseFormSubmitOptions = {}
) {
  const { onSuccess, onError, resetOnSuccess = true } = options;

  const [state, setState] = useState<FormSubmitState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    message: null,
  });

  const submit = useCallback(
    async (data: T, formRef?: HTMLFormElement | null) => {
      setState({
        isSubmitting: true,
        isSuccess: false,
        isError: false,
        message: null,
      });

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Something went wrong');
        }

        setState({
          isSubmitting: false,
          isSuccess: true,
          isError: false,
          message: result.message || 'Submitted successfully!',
        });

        if (resetOnSuccess && formRef) {
          formRef.reset();
        }

        onSuccess?.(result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to submit';

        setState({
          isSubmitting: false,
          isSuccess: false,
          isError: true,
          message: errorMessage,
        });

        onError?.(errorMessage);
      }
    },
    [endpoint, onSuccess, onError, resetOnSuccess]
  );

  const reset = useCallback(() => {
    setState({
      isSubmitting: false,
      isSuccess: false,
      isError: false,
      message: null,
    });
  }, []);

  return {
    ...state,
    submit,
    reset,
  };
}
