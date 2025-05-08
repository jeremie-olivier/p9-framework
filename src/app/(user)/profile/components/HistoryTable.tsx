// app/profile/components/HistoryTable.tsx
"use client";

import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/Dialog";
import { useState } from "react";

interface Assessment {
  id: string;
  archetype: string;
  createdAt: string;
  dimensionScores?: Record<string, number>;
}

interface Props {
  assessments: Assessment[];
}

export default function HistoryTable({ assessments }: Props) {
  const [selected, setSelected] = useState<Assessment | null>(null);

  if (assessments.length === 0) {
    return <p>No previous assessments.</p>;
  }
  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="bg-zinc-100">
          <th className="p-2 text-left">Date</th>
          <th className="p-2 text-left">Archetype</th>
          <th className="p-2"></th>
        </tr>
      </thead>
      <tbody>
        {assessments.map((a) => (
          <tr key={a.id} className="border-t">
            <td className="p-2">
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }).format(new Date(a.createdAt))}
            </td>
            <td className="p-2">{a.archetype}</td>
            <td className="p-2 text-right">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="text-blue-600 underline"
                    aria-label={`View assessment taken on ${a.createdAt}`}
                    onClick={() => setSelected(a)}
                  >
                    View
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle className="text-xl font-semibold mb-2">Assessment Details</DialogTitle>
                  {selected && (
                    <div className="space-y-2">
                      <p><strong>ID:</strong> {selected.id}</p>
                      <p><strong>Archetype:</strong> {selected.archetype}</p>
                      <p><strong>Date:</strong> {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }).format(new Date(selected.createdAt))}</p>
                      {selected.dimensionScores && (
                        <div>
                          <h4 className="font-medium mt-4">Dimension Scores</h4>
                          <ul className="list-disc list-inside">
                            {Object.entries(selected.dimensionScores).map(([key, value]) => (
                              <li key={key}>
                                {key}: {value.toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}