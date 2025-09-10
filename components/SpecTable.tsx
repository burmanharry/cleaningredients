"use client";

import * as React from "react";

type Pair = [string, React.ReactNode | null | undefined];

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function SpecTable({ pairs }: { pairs: Pair[] }) {
  const rows = chunk(pairs, 2); // 2 pairs per row

  return (
    <div className="mt-10 overflow-x-auto">
      <table className="w-full border-separate border-spacing-0 rounded-2xl ring-1 ring-neutral-200">
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="even:bg-neutral-50">
              {r.map(([label, value], ci) => (
                <React.Fragment key={ci}>
                  <th className="w-56 bg-neutral-50 text-left align-top px-4 py-3 text-sm font-medium text-neutral-500">
                    {label}
                  </th>
                  <td className="px-4 py-3 text-sm text-neutral-800">
                    {value ?? "—"}
                  </td>
                </React.Fragment>
              ))}
              {r.length === 1 && (
                <>
                  <th className="w-56 bg-neutral-50 px-4 py-3"></th>
                  <td className="px-4 py-3"></td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
