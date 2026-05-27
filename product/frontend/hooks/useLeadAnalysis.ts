// product/frontend/hooks/useLeadAnalysis.ts
// Hook para llamar POST /api/leads/analyze y gestionar loading/error/data.
// Cubre: R11, R12, R13, R14, R15

import { useState, useEffect } from "react";
import type { LeadAnalysis } from "../../types/lead_analysis";

interface UseLeadAnalysisResult {
  analysis: LeadAnalysis | null;
  isLoading: boolean;
  error: string | null;
}

export function useLeadAnalysis(leadId: string | null): UseLeadAnalysisResult {
  const [analysis, setAnalysis] = useState<LeadAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset siempre que cambia el leadId (R15)
    setAnalysis(null);
    setError(null);

    if (!leadId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true); // R13

    const controller = new AbortController();

    fetch("/api/leads/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          // R14: error con mensaje de la respuesta
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        return res.json() as Promise<LeadAnalysis>;
      })
      .then((data) => {
        setAnalysis(data); // R12
        setIsLoading(false);
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setError(err.message); // R14
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [leadId]);

  return { analysis, isLoading, error };
}
