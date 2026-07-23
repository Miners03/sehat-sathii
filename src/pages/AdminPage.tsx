import React, { useEffect, useState } from "react";
import { UserCheck, Check, Phone } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fetchCheckinHistoryService, markContactedService } from "@/services/checkinService";
import type { CheckinHistoryItem } from "@/types";

export const AdminPage: React.FC = () => {
  const [items, setItems] = useState<CheckinHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "escalate" | "pending">("all");

  useEffect(() => {
    fetchCheckinHistoryService()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const handleMarkContacted = (id: string) => {
    const updated = markContactedService(id);
    setItems(updated);
  };

  const filteredItems = items.filter((item) => {
    if (filter === "escalate") return item.triageLevel === "escalate";
    if (filter === "pending") return !item.contactedByASHA;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-primary" />
            ASHA Worker / Community Health Dashboard
          </h1>
          <p className="text-sm text-text-muted">
            Desktop-first overview of escalated symptom triage cases requiring community health worker follow-up.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface p-1.5 rounded-xl border border-text-muted/15">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filter === "all" ? "bg-primary text-white" : "text-text-muted hover:text-text"
            }`}
          >
            All Cases ({items.length})
          </button>
          <button
            onClick={() => setFilter("escalate")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filter === "escalate" ? "bg-escalate text-white" : "text-text-muted hover:text-text"
            }`}
          >
            Escalated ({items.filter((i) => i.triageLevel === "escalate").length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filter === "pending" ? "bg-monitor text-white" : "text-text-muted hover:text-text"
            }`}
          >
            Pending Follow-up ({items.filter((i) => !i.contactedByASHA).length})
          </button>
        </div>
      </div>

      {loading ? (
        <Card className="p-8 text-center text-text-muted">Loading dashboard cases...</Card>
      ) : filteredItems.length === 0 ? (
        <Card className="p-8 text-center text-text-muted">No cases found matching filter.</Card>
      ) : (
        <Card className="p-0 overflow-hidden border border-text-muted/15 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-bg border-b border-text-muted/15 text-text-muted font-semibold text-xs uppercase tracking-wider">
                  <th className="p-4">Case ID / Date</th>
                  <th className="p-4">Primary Symptoms</th>
                  <th className="p-4">Triage Level</th>
                  <th className="p-4">Structured Summary</th>
                  <th className="p-4">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-text-muted/10">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-bg/50 transition-colors">
                    <td className="p-4 font-mono font-medium text-text whitespace-nowrap">
                      <div>{item.id}</div>
                      <div className="text-xs font-sans text-text-muted">{item.date}</div>
                    </td>

                    <td className="p-4 font-semibold text-text max-w-xs">
                      {item.primarySymptom}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <Badge tone={item.triageLevel} />
                    </td>

                    <td className="p-4 max-w-sm text-xs text-text-muted space-y-1">
                      <p><strong className="text-text">Severity:</strong> {item.summary?.severity || "N/A"}</p>
                      <p><strong className="text-text">Duration:</strong> {item.summary?.duration || "N/A"}</p>
                      <p className="line-clamp-2">{item.summary?.notes}</p>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {item.contactedByASHA ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-self-care/15 text-self-care font-semibold text-xs border border-self-care/30">
                          <Check className="w-3.5 h-3.5" /> Contacted
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant={item.triageLevel === "escalate" ? "primary" : "secondary"}
                          onClick={() => handleMarkContacted(item.id)}
                          className="text-xs py-1.5 px-3"
                        >
                          <Phone className="w-3.5 h-3.5 mr-1" /> Mark Contacted
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
