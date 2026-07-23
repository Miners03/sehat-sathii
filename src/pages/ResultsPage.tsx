import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Phone, MapPin, ShieldAlert, ArrowLeft, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fetchCheckinHistoryService, requestEscalationService } from "@/services/checkinService";
import type { CheckinHistoryItem, TriageLevel } from "@/types";

export const ResultsPage: React.FC = () => {
  const { checkinId } = useParams<{ checkinId: string }>();
  const [item, setItem] = useState<CheckinHistoryItem | null>(null);
  const [escalatedSent, setEscalatedSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCheckinHistoryService()
      .then((history) => {
        const found = history.find((h) => h.id === checkinId) || history[0];
        setItem(found || null);
        if (found?.triageLevel === "escalate") {
          requestEscalationService(found.id);
        }
      })
      .finally(() => setLoading(false));
  }, [checkinId]);

  if (loading) {
    return <Card className="p-8 text-center text-text-muted">Loading triage results...</Card>;
  }

  if (!item) {
    return (
      <Card className="p-8 text-center space-y-4">
        <p className="text-text-muted">Check-in session not found.</p>
        <Link to="/home"><Button variant="primary">Return Home</Button></Link>
      </Card>
    );
  }

  const triageTextMap: Record<TriageLevel, { title: string; desc: string }> = {
    self_care: {
      title: "Self-Care & Home Monitoring",
      desc: "Your reported symptoms appear mild. Rest well, stay hydrated, and take light nutrition. Most mild symptoms improve within 48 hours.",
    },
    monitor: {
      title: "Active Symptom Monitoring Recommended",
      desc: "Your symptoms warrant daily monitoring. Keep track of temperature and symptom progression. Consult a PHC nurse or doctor if symptoms worsen.",
    },
    escalate: {
      title: "Medical Consultation Advised",
      desc: "Your symptoms require prompt attention from a local healthcare professional or Community Health Worker (ASHA).",
    },
  };

  const currentTriageInfo = triageTextMap[item.triageLevel];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/home" className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>
        <span className="text-xs text-text-muted">Date: {item.date}</span>
      </div>

      <Card className="p-8 space-y-6 shadow-md border-2 border-text-muted/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-text-muted/10 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Triage Level</span>
            <h1 className="text-2xl font-bold text-text">{currentTriageInfo.title}</h1>
          </div>
          <div>
            <Badge tone={item.triageLevel} className="text-base px-4 py-1.5" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-text">Primary Symptom Evaluated</h2>
          <p className="text-base font-semibold text-primary bg-primary/10 p-3 rounded-xl inline-block">
            {item.primarySymptom}
          </p>
          <p className="text-base text-text leading-relaxed pt-2">{currentTriageInfo.desc}</p>
        </div>

        <div className="p-4 bg-bg border border-text-muted/20 rounded-2xl space-y-1.5 text-sm text-text-muted">
          <div className="flex items-center gap-2 text-text font-semibold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-monitor" /> Important Medical Disclaimer
          </div>
          <p className="text-sm leading-relaxed">
            SehatSaathi helps you understand what you're feeling and points you to the right next step. It does not diagnose any condition. For anything serious or urgent, please contact a qualified health worker or call the KIRAN helpline (1800-599-0019).
          </p>
        </div>
      </Card>

      {item.triageLevel === "escalate" && (
        <Card className="bg-escalate/10 border-2 border-escalate/30 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-escalate text-white flex items-center justify-center shrink-0 shadow-sm">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">Nearest ASHA / PHC Contact</h2>
              <p className="text-xs text-text-muted">Assigned local community health representative</p>
            </div>
          </div>

          <div className="bg-surface p-4 rounded-xl space-y-2 border border-text-muted/10 text-sm">
            <div className="flex items-center justify-between font-semibold text-text">
              <span>{item.summary?.ashaName || "Sunita Sharma (ASHA Worker)"}</span>
              <span className="text-xs text-escalate font-semibold bg-escalate/15 px-2 py-0.5 rounded-md">
                Available Nearby
              </span>
            </div>
            <div className="flex items-center gap-2 text-text-muted text-xs">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{item.summary?.phcName || "Sub-District Health Center, Sector 4"}</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted text-xs">
              <Phone className="w-4 h-4 text-primary" />
              <a href={`tel:${item.summary?.contactPhone || "+919876543210"}`} className="font-semibold text-primary hover:underline">
                {item.summary?.contactPhone || "+91 98765 43210"}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <a href={`tel:${item.summary?.contactPhone || "+919876543210"}`} className="w-full">
              <Button fullWidth variant="primary" size="md">
                <Phone className="w-4 h-4 mr-2" /> Call ASHA Worker Now
              </Button>
            </a>
            <Button
              variant="secondary"
              size="md"
              disabled={escalatedSent}
              onClick={() => setEscalatedSent(true)}
              className="whitespace-nowrap"
            >
              {escalatedSent ? "Contact Request Sent ✓" : "Request Visit"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
