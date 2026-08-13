import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    "https://naturesnationalindia.onrender.com",
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // FIX: this previously always wrapped the failure in a brand new
    // `new Error(message)`, discarding the original error entirely —
    // including its `.name` ("CanceledError") and `.code` ("ERR_CANCELED").
    // Callers that debounce+abort in-flight requests (HeaderSearch's
    // search-as-you-type, which cancels the previous request on every
    // keystroke — a normal, constant, harmless occurrence) rely on exactly
    // those fields to tell "superseded by a newer keystroke" apart from a
    // genuine network failure. With that identity stripped, every single
    // cancelled request looked identical to a real failure downstream, so
    // ordinary fast typing surfaced spurious "[search] Request failed:
    // Error: Network Error" — the request usually wasn't failing at all,
    // it was being correctly cancelled and then misreported.
    //
    // Now: pass a genuine cancellation straight through untouched (so
    // `axios.isCancel()` / `.name === "CanceledError"` / `.code ===
    // "ERR_CANCELED"` still work for callers), and for a real failure,
    // normalize `.message` on the *original* AxiosError instead of
    // replacing it — callers that need `.code` (ERR_NETWORK, ECONNABORTED,
    // etc.) for their own diagnostics still can.
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    error.message =
      error.response?.data?.message ?? error.message ?? "Something went wrong";
    return Promise.reject(error);
  },
);

export default apiClient;
