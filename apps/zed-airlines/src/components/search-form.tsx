"use client";

import { DateField, FieldSelect } from "@/components/field-controls";
import { useFlightSearch } from "@/components/flight-search";
import { airportCodes, type AirportCode } from "@/data/airline";
import { reposition } from "@/lib/motion";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useId, useState, type FormEvent } from "react";

type Trip = "round" | "one";

export function SearchForm({
  preset,
  className,
}: {
  preset?: { from?: AirportCode; to?: AirportCode; trip?: Trip };
  className?: string;
}) {
  const t = useTranslations("search");
  const airports = useTranslations("airports");
  const { search } = useFlightSearch();
  const [from, setFrom] = useState<AirportCode>(preset?.from ?? "CAP");
  const [to, setTo] = useState<AirportCode>(preset?.to ?? "MIA");
  const [trip, setTrip] = useState<Trip>(preset?.trip ?? "round");
  const [depart, setDepart] = useState("");
  const [ret, setRet] = useState("");
  const [adults, setAdults] = useState(1);
  const [error, setError] = useState("");
  const reduceMotion = useReducedMotion();
  const fromId = useId();
  const toId = useId();
  const passengersId = useId();
  const departId = useId();
  const returnId = useId();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (from === to) {
      setError(t("sameAirport"));
      return;
    }
    if (!depart) {
      setError(t("needDepart"));
      return;
    }
    if (trip === "round" && !ret) {
      setError(t("needReturn"));
      return;
    }
    if (trip === "round" && ret < depart) {
      setError(t("returnOrder"));
      return;
    }
    setError("");
    search({
      from,
      to,
      trip,
      depart,
      adults,
      ...(trip === "round" ? { ret } : {}),
    });
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <form
      id="recherche"
      onSubmit={submit}
      className={className ? `card text-ink ${className}` : "card text-ink"}
    >
      <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-x-4">
        <div>
          <label id={`${fromId}-label`} htmlFor={fromId} className="field-label">
            {t("from")}
          </label>
          <FieldSelect
            id={fromId}
            labelId={`${fromId}-label`}
            value={from}
            onChange={(next) => setFrom(next as AirportCode)}
            options={airportCodes.map((code) => ({
              value: code,
              label: `${airports(`${code}.city`)} · ${code}`,
            }))}
          />
        </div>
        <div className="hidden sm:mb-1 sm:block">
          <button
            type="button"
            onClick={swap}
            aria-label={t("swap")}
            className="press grid size-10 place-items-center rounded-full border border-black/10 bg-transparent p-0 text-[17px] leading-none text-ink"
          >
            ↔
          </button>
        </div>
        <div>
          <label id={`${toId}-label`} htmlFor={toId} className="field-label">
            {t("to")}
          </label>
          <FieldSelect
            id={toId}
            labelId={`${toId}-label`}
            value={to}
            onChange={(next) => setTo(next as AirportCode)}
            options={airportCodes.map((code) => ({
              value: code,
              label: `${airports(`${code}.city`)} · ${code}`,
            }))}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <fieldset>
          <legend className="field-label">{t("trip")}</legend>
          <div className="mt-2 flex gap-2">
            {(["round", "one"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTrip(option)}
                className={`press relative rounded-pill px-4 py-2.75 text-body-sm ${
                  trip === option ? "text-ink" : "text-mid"
                }`}
                aria-pressed={trip === option}
              >
                {trip === option ? (
                  reduceMotion ? (
                    <span className="absolute inset-0 rounded-pill bg-wash" />
                  ) : (
                    <motion.span
                      layoutId="trip-pill"
                      className="absolute inset-0 bg-wash"
                      style={{ borderRadius: 980 }}
                      transition={reposition}
                    />
                  )
                ) : null}
                <span className="relative z-10">{t(option)}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <label id={`${passengersId}-label`} htmlFor={passengersId} className="field-label">
            {t("passengers")}
          </label>
          <FieldSelect
            id={passengersId}
            labelId={`${passengersId}-label`}
            value={String(adults)}
            onChange={(next) => setAdults(Number(next))}
            options={Array.from({ length: 9 }, (_, index) => {
              const count = index + 1;
              return { value: String(count), label: t("passengerCount", { count }) };
            })}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label id={`${departId}-label`} htmlFor={departId} className="field-label">
            {t("depart")}
          </label>
          <DateField id={departId} labelId={`${departId}-label`} value={depart} onChange={setDepart} />
        </div>
        <div
          className="transition-opacity duration-200"
          style={{
            transitionTimingFunction: "var(--ease-out)",
            opacity: trip === "one" ? 0.4 : 1,
          }}
        >
          <label id={`${returnId}-label`} htmlFor={returnId} className="field-label">
            {t("return")}
          </label>
          <DateField
            id={returnId}
            labelId={`${returnId}-label`}
            value={ret}
            min={depart || undefined}
            disabled={trip === "one"}
            onChange={setRet}
          />
        </div>
      </div>

      {error ? (
        <p key={error} className="alert-in mt-4 text-body-sm text-ember" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className="btn-fill mt-8">
        {t("find")}
      </button>
    </form>
  );
}
