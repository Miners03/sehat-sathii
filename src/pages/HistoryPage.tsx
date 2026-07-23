import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Calendar, ChevronRight, FileText, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fetchCheckinHistoryService } from "@/services/checkinService";
import type { CheckinHistoryItem } from "@/types";

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<CheckinHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCheckinHistoryService()
      .then(setHistory)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Check-in History</h1>
          <p className="text-sm text-text-muted">Chronological timeline of your previous health assessments</p>
        </div>
        <Link to="/checkin">
          <Button variant="primary" size="sm">
            <Sparkles className="w-4 h-4 mr-1.5" /> New Check-in
          </Button>
        </Link>
      </div>

      {loading ? (
        <Card className="p-8 text-center text-text-muted">Loading history timeline...</Card>
      ) : history.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <FileText className="w-12 h-12 text-text-muted mx-auto opacity-50" />
          <h2 className="text-lg font-bold text-text">No check-ins recorded yet</h2>
          <p className="text-sm text-text-muted max-w-sm mx-auto">
            When you complete a symptom evaluation, your timeline history will appear here in plain language.
          </p>
          <Link to="/checkin">
            <Button variant="primary">Start Your First Check-in</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card
              key={item.id}
              className="p-6 hover:shadow-md border border-text-muted/15 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-text-muted/10 pb-3">
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-text">{item.date}</span>
                  <span>• ID: {item.id}</span>
                </div>
                <Badge tone={item.triageLevel} />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-text">{item.primarySymptom}</h3>
                <p className="text-sm text-text-muted">{item.statusText}</p>
              </div>

              {item.summary && (
                <div className="bg-bg p-3.5 rounded-xl text-xs text-text-muted space-y-1">
                  <p>
                    <strong className="text-text">Symptoms noted:</strong> {item.summary.symptoms.join(", ")}
                  </p>
                  <p>
                    <strong className="text-text">Duration:</strong> {item.summary.duration}
                  </p>
                </div>
              )}

              <div className="pt-1 flex items-center justify-end">
                <Link
                  to={`/results/${item.id}`}
                  className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
                >
                  View Details <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
