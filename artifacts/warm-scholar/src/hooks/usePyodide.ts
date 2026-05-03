import { useState, useCallback } from "react";

declare global {
  interface Window {
    loadPyodide: (opts: { indexURL: string }) => Promise<PyodideAPI>;
  }
}
interface PyodideAPI {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
}

export type RunStatus = "idle" | "loading-pyodide" | "running" | "done" | "error";

let _instance: PyodideAPI | null = null;
let _loading: Promise<PyodideAPI> | null = null;

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/";

async function getPyodide(): Promise<PyodideAPI> {
  if (_instance) return _instance;
  if (_loading) return _loading;

  _loading = new Promise<PyodideAPI>((resolve, reject) => {
    const load = async () => {
      try {
        const py = await window.loadPyodide({ indexURL: PYODIDE_URL });
        _instance = py;
        resolve(py);
      } catch (e) { reject(e); }
    };

    if (typeof window.loadPyodide === "function") {
      load();
    } else {
      const s = document.createElement("script");
      s.src = PYODIDE_URL + "pyodide.js";
      s.onload = load;
      s.onerror = () => reject(new Error("Failed to load Pyodide CDN script."));
      document.head.appendChild(s);
    }
  });

  return _loading;
}

export function usePyodide() {
  const [status, setStatus] = useState<RunStatus>("idle");
  const [output, setOutput] = useState<string>("");

  const run = useCallback(async (code: string) => {
    setStatus("loading-pyodide");
    setOutput("");
    try {
      const py = await getPyodide();
      setStatus("running");
      const lines: string[] = [];
      py.setStdout({ batched: (t) => lines.push(t) });
      py.setStderr({ batched: (t) => lines.push(`[stderr] ${t}`) });
      await py.runPythonAsync(code);
      setOutput(lines.join("\n") || "✓ (no output)");
      setStatus("done");
    } catch (e: unknown) {
      setOutput(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => { setStatus("idle"); setOutput(""); }, []);

  return { run, reset, status, output };
}
