import { SearchResult } from "@shared/schema";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Pill, AlertCircle } from "lucide-react";

interface SearchResultCardProps {
  result: SearchResult;
}

export function SearchResultCard({ result }: SearchResultCardProps) {
  const severityColors = {
    Mild: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Moderate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    Severe: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <Card
      className="hover-elevate transition-shadow duration-200"
      data-testid={`card-result-${result.id}`}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-card-foreground" data-testid="text-condition-name">
            {result.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs" data-testid={`badge-category-${result.category}`}>
              {result.category}
            </Badge>
            <Badge
              className={severityColors[result.severity as keyof typeof severityColors] || ""}
              data-testid={`badge-severity-${result.severity}`}
            >
              {result.severity}
            </Badge>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            Relevance
          </span>
          <span className="text-sm font-medium text-primary" data-testid="text-relevance-score">
            {Math.round(result.relevanceScore * 100)}%
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-card-foreground">
          {result.description}
        </p>

        {result.symptoms && result.symptoms.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Common Symptoms</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.symptoms.slice(0, 5).map((symptom, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs"
                  data-testid={`badge-symptom-${idx}`}
                >
                  {symptom}
                </Badge>
              ))}
              {result.symptoms.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{result.symptoms.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {result.treatments && result.treatments.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Pill className="h-4 w-4" />
              <span>Treatment Options</span>
            </div>
            <ul className="space-y-1 text-sm text-card-foreground">
              {result.treatments.slice(0, 3).map((treatment, idx) => (
                <li key={idx} className="flex items-start gap-2" data-testid={`text-treatment-${idx}`}>
                  <span className="text-primary mt-1">•</span>
                  <span>{treatment}</span>
                </li>
              ))}
              {result.treatments.length > 3 && (
                <li className="text-xs text-muted-foreground pl-4">
                  +{result.treatments.length - 3} more treatment options
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
