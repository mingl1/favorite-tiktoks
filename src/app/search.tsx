/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";
// import { useSearchFieldState } from "react-stately";
import { AriaSearchFieldProps, useSearchField } from "react-aria";
// import { SearchFieldAria } from "react-aria";
import React from "react";

export default function SearchField(props: AriaSearchFieldProps) {
  const { label } = props;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [state, setState] = React.useState("");
  const s = { value: state, setValue: setState };
  const ref = React.useRef(null);
  const { labelProps, inputProps } = useSearchField(props, s, ref);

  return (
    <div
      // style={{ display: "flex", flexDirection: "column", width: 200 }}
      className="mb-12 flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-zinc-700 sm:mx-0 md:mx-auto"
    >
      <label className="text-xl font-bold text-slate-50" {...labelProps}>
        {label}
      </label>
      <input
        {...inputProps}
        ref={ref}
        className="flex max-w-xs flex-col gap-4 rounded-lg bg-white/5 p-4 text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-50"
      />
    </div>
  );
}
