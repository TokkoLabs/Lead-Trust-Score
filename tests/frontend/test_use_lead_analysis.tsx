/**
 * tests/frontend/test_use_lead_analysis.tsx
 * Tests for the useLeadAnalysis hook.
 * Cubre: R11, R12, R13, R14, R15, R22
 */

import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useLeadAnalysis } from "../../product/frontend/hooks/useLeadAnalysis";
import type { LeadAnalysis } from "../../product/types/lead_analysis";

// Mock navigator.clipboard
Object.defineProperty(navigator, "clipboard", {
  value: { writeText: jest.fn() },
  writable: true,
});

const mockAnalysis: LeadAnalysis = {
  trust_score: 80,
  conversion_score: 70,
  urgency_score: 60,
  is_spam: false,
  detected_intent: "compra",
  suggested_action: "Llamar hoy",
  ai_summary: "Lead muy interesado en comprar",
  property_match_ids: ["prop-01", "prop-02"],
};

// Test harness component that renders hook state
interface HarnessProps {
  leadId: string | null;
}

function HookHarness({ leadId }: HarnessProps) {
  const { analysis, isLoading, error } = useLeadAnalysis(leadId);
  return (
    <div>
      <span data-testid="is-loading">{String(isLoading)}</span>
      <span data-testid="error">{error ?? "null"}</span>
      <span data-testid="trust-score">
        {analysis ? String(analysis.trust_score) : "null"}
      </span>
    </div>
  );
}

// Controllable wrapper to test leadId changes
interface ControlWrapperState {
  leadId: string | null;
}

class ControlWrapper extends React.Component<
  Record<string, unknown>,
  ControlWrapperState
> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = { leadId: null };
  }
  render() {
    return <HookHarness leadId={this.state.leadId} />;
  }
}

beforeEach(() => {
  jest.clearAllMocks();
});

// --- Test: isLoading is true immediately when leadId is provided --- R13
test("isLoading_starts_true_when_leadId_provided", async () => {
  // Never resolving fetch to freeze in loading state
  global.fetch = jest.fn(
    () =>
      new Promise(() => {
        // intentionally pending
      })
  ) as jest.Mock;

  render(<HookHarness leadId="lead-01" />);

  expect(screen.getByTestId("is-loading").textContent).toBe("true");
});

// --- Test: analysis updated when fetch resolves with 200 --- R12, R13
test("analysis_updated_on_successful_fetch", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockAnalysis),
      text: () => Promise.resolve(JSON.stringify(mockAnalysis)),
    })
  ) as jest.Mock;

  render(<HookHarness leadId="lead-01" />);

  await waitFor(() => {
    expect(screen.getByTestId("is-loading").textContent).toBe("false");
  });

  expect(screen.getByTestId("trust-score").textContent).toBe("80");
  expect(screen.getByTestId("error").textContent).toBe("null");
});

// --- Test: error updated when fetch resolves with 500 --- R14
test("error_updated_on_failed_fetch", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve("Internal Server Error"),
    })
  ) as jest.Mock;

  render(<HookHarness leadId="lead-01" />);

  await waitFor(() => {
    expect(screen.getByTestId("is-loading").textContent).toBe("false");
  });

  expect(screen.getByTestId("error").textContent).toBe(
    "Internal Server Error"
  );
  expect(screen.getByTestId("trust-score").textContent).toBe("null");
});

// Helper mock response object (avoids using global Response which is unavailable in jsdom)
function makeMockResponse(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  };
}

// --- Test: state resets when leadId changes --- R15
test("state_resets_when_leadId_changes", async () => {
  type MockResponse = ReturnType<typeof makeMockResponse>;
  let resolveFetch: (value: MockResponse) => void;

  global.fetch = jest.fn(
    () =>
      new Promise<MockResponse>((resolve) => {
        resolveFetch = resolve;
      })
  ) as jest.Mock;

  const ref = React.createRef<ControlWrapper>();

  render(<ControlWrapper ref={ref} />);

  // Set first leadId to trigger loading
  await act(async () => {
    ref.current!.setState({ leadId: "lead-01" });
  });

  expect(screen.getByTestId("is-loading").textContent).toBe("true");

  // Change to a different leadId — state should reset
  await act(async () => {
    ref.current!.setState({ leadId: "lead-02" });
  });

  // analysis should still be null (new request pending, no response yet)
  expect(screen.getByTestId("trust-score").textContent).toBe("null");
  expect(screen.getByTestId("error").textContent).toBe("null");

  // Resolve the pending fetch for lead-02
  await act(async () => {
    resolveFetch!(makeMockResponse(mockAnalysis, 200));
  });

  await waitFor(() => {
    expect(screen.getByTestId("is-loading").textContent).toBe("false");
  });

  expect(screen.getByTestId("trust-score").textContent).toBe("80");
});

// --- Test: when leadId is null, isLoading is false and analysis is null --- R15
test("null_leadId_resets_to_idle_state", async () => {
  global.fetch = jest.fn() as jest.Mock;

  render(<HookHarness leadId={null} />);

  expect(screen.getByTestId("is-loading").textContent).toBe("false");
  expect(screen.getByTestId("trust-score").textContent).toBe("null");
  expect(screen.getByTestId("error").textContent).toBe("null");
  expect(global.fetch).not.toHaveBeenCalled();
});
