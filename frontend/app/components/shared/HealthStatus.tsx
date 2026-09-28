'use client';

import { useEffect, useState } from 'react';

type HealthState =
  | { status: 'checking' }
  | { status: 'up'; body: unknown }
  | { status: 'down'; error: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

/**
 * Proves the frontend can reach the backend by making a real call to the
 * gateway's public /api/health route. This is the only real backend call
 * made by the app right now; all other data still comes from the mock API
 * (see lib/utils/mock-api.ts) pending a follow-up wiring step.
 */
export function HealthStatus() {
  const [state, setState] = useState<HealthState>({ status: 'checking' });

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_URL}/api/health`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((body) => {
        if (!cancelled) setState({ status: 'up', body });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: 'down',
            error: error instanceof Error ? error.message : 'unknown error',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === 'checking') {
    return <span className="text-xs text-gray-400">Checking backend…</span>;
  }

  if (state.status === 'up') {
    return (
      <span className="text-xs text-green-700">
        Backend reachable: {JSON.stringify(state.body)}
      </span>
    );
  }

  return (
    <span className="text-xs text-red-600">
      Backend unreachable ({API_URL}): {state.error}
    </span>
  );
}
