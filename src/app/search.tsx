"use client";
import { useSearchField } from "react-aria";
import React from "react";
import type { AriaSearchFieldProps } from "react-aria";
interface myProps extends AriaSearchFieldProps {
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}
export default function SearchField(props: myProps) {
  const { label, defaultValue, state, setState } = props;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // const [state, setState] = React.useState("");
  const ref = React.useRef(null);

  const { labelProps, inputProps } = useSearchField(
    props,
    { value: state, setValue: setState },
    ref
  );

  return (
    <div
      // style={{ display: "flex", flexDirection: "column", width: 200 }}
      className="mb-4 flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 tracking-widest text-zinc-700 md:mb-12"
    >
      <label className="text-xl font-bold text-slate-50" {...labelProps}>
        {label}
      </label>
      <input
        {...inputProps}
        ref={ref}
        placeholder={defaultValue}
        className="flex max-w-xs flex-col gap-4 rounded-lg bg-white/5 p-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-50"
      />
    </div>
  );
}
