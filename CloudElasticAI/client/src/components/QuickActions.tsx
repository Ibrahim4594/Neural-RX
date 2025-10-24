import { Activity, Heart, Pill, Apple, Brain, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  question: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    icon: <Activity className="h-5 w-5" />,
    label: "Symptoms",
    question: "What are the symptoms of diabetes?",
    color: "text-blue-500 dark:text-blue-400",
  },
  {
    icon: <Pill className="h-5 w-5" />,
    label: "Medications",
    question: "Treatment options for hypertension",
    color: "text-green-500 dark:text-green-400",
  },
  {
    icon: <Heart className="h-5 w-5" />,
    label: "Heart Health",
    question: "How can I improve my heart health?",
    color: "text-red-500 dark:text-red-400",
  },
  {
    icon: <Brain className="h-5 w-5" />,
    label: "Mental Health",
    question: "What are common signs of depression?",
    color: "text-purple-500 dark:text-purple-400",
  },
  {
    icon: <Apple className="h-5 w-5" />,
    label: "Nutrition",
    question: "What is a healthy balanced diet?",
    color: "text-orange-500 dark:text-orange-400",
  },
  {
    icon: <Stethoscope className="h-5 w-5" />,
    label: "Checkups",
    question: "What regular health checkups should I have?",
    color: "text-cyan-500 dark:text-cyan-400",
  },
];

interface QuickActionsProps {
  onSelect: (question: string) => void;
}

export function QuickActions({ onSelect }: QuickActionsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          How can I help you today?
        </h2>
        <p className="text-muted-foreground">
          Click on a topic below or ask your own question
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickActions.map((action) => (
          <Card
            key={action.label}
            className="hover-elevate cursor-pointer transition-all"
            onClick={() => onSelect(action.question)}
            data-testid={`quick-action-${action.label.toLowerCase()}`}
          >
            <div className="p-4 flex flex-col items-center text-center gap-3">
              <div className={`${action.color}`}>{action.icon}</div>
              <div>
                <div className="font-medium text-sm text-foreground">
                  {action.label}
                </div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {action.question}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
