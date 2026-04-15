import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell.jsx";
import { cancelOverride, createOverride, getOverride } from "../services/api.js";

const Overrides = () => {
  const today = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const [date, setDate] = useState(today);
  const [mode, setMode] = useState("BLOCKED"); // BLOCKED | HOURS
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [hasOverride, setHasOverride] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!date) return;
    let isActive = true;
    setLoading(true);
    setError("");
    setNotice("");

    (async () => {
      try {
        const res = await getOverride(date);
        const ov = res.data?.data || null;
        if (!isActive) return;

        if (!ov) {
          // default state when no override exists
          setHasOverride(false);
          setMode("BLOCKED");
          setStartTime("09:00");
          setEndTime("17:00");
          return;
        }

        setHasOverride(true);
        if (ov.is_available) {
          setMode("HOURS");
          setStartTime(String(ov.start_time || "09:00").slice(0, 5));
          setEndTime(String(ov.end_time || "17:00").slice(0, 5));
        } else {
          setMode("BLOCKED");
        }
      } catch (e) {
        if (!isActive) return;
        setError("Unable to load override for this date.");
      } finally {
        if (!isActive) return;
        setLoading(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [date]);

  const onSave = async () => {
    if (!date) return;
    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (mode === "HOURS") {
        if (!startTime || !endTime) {
          setError("Start and end times are required.");
          return;
        }
      }

      const payload =
        mode === "BLOCKED"
          ? { override_date: date, is_available: false }
          : {
            override_date: date,
            is_available: true,
            start_time: startTime,
            end_time: endTime,
          };

      await createOverride(payload);
      setHasOverride(true);
      setNotice("Override saved. Check the public booking page for this date.");
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to save override.");
    } finally {
      setSaving(false);
    }
  };

  const onCancelOverride = async () => {
    if (!date) return;
    setCancelling(true);
    setError("");
    setNotice("");

    try {
      await cancelOverride(date);
      setHasOverride(false);
      setMode("BLOCKED");
      setStartTime("09:00");
      setEndTime("17:00");
      setNotice("Override cancelled. Default schedule is active for this date.");
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to cancel override.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <AppShell
      title="Date overrides"
      right={
        <div className="flex items-center gap-2">
          <button
            onClick={onCancelOverride}
            disabled={!hasOverride || cancelling || saving || loading || !date}
            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelling ? "Cancelling…" : "Cancel override"}
          </button>
          <button
            onClick={onSave}
            disabled={saving || cancelling || loading || !date}
            className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {saving ? "Saving…" : "Save override"}
          </button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-1">
          <div className="text-sm font-semibold">Pick a date</div>
          <div className="mt-3 rounded-xl border border-neutral-200 p-4">
            <label className="text-xs font-medium text-neutral-600">
              Override date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            />
            <div className="mt-3 text-xs text-neutral-500">
              Overrides change availability for a single date (block the day or
              set different hours).
            </div>
          </div>
        </section>

        <section className="lg:col-span-2 space-y-4">
          <div className="text-sm font-semibold">Override settings</div>

          {notice ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              {notice}
            </div>
          ) : null}
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="text-sm font-medium text-neutral-900">
                  What should happen on this date?
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  {loading ? "Loading existing override…" : " "}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50">
                <input
                  type="radio"
                  name="mode"
                  value="BLOCKED"
                  checked={mode === "BLOCKED"}
                  onChange={() => setMode("BLOCKED")}
                  className="mt-1"
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium">Block the entire day</div>
                  <div className="mt-1 text-xs text-neutral-500">
                    No time slots will be offered for this date.
                  </div>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50">
                <input
                  type="radio"
                  name="mode"
                  value="HOURS"
                  checked={mode === "HOURS"}
                  onChange={() => setMode("HOURS")}
                  className="mt-1"
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium">Set custom hours</div>
                  <div className="mt-1 text-xs text-neutral-500">
                    Replace your normal working hours for this date.
                  </div>
                </div>
              </label>
            </div>

            {mode === "HOURS" ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-neutral-600">
                    Start time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-600">
                    End time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                  />
                </div>
                <div className="sm:col-span-2 text-xs text-neutral-500">
                  After saving, open any booking link and pick this date to see
                  the updated available slots.
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default Overrides;

