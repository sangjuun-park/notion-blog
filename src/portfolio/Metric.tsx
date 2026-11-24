import { Metric as MetricType } from "./content"

export const Metric = ({ metric }: { metric: MetricType }) => (
  <div>
    <div className="pf-metric-label">{metric.label}</div>
    {metric.kind === "fact" ? (
      <div className="pf-metric-value">
        <span className="pf-metric-fact">{metric.before}</span>
        <span className="pf-metric-arrow" aria-hidden="true">
          ·
        </span>
        <span className="pf-metric-fact">{metric.after}</span>
      </div>
    ) : (
      <div className="pf-metric-value">
        <span className="pf-metric-before">{metric.before}</span>
        <span className="pf-metric-arrow" aria-hidden="true">
          →
        </span>
        <span className="pf-metric-after">{metric.after}</span>
      </div>
    )}
    <div className="pf-metric-note">{metric.note}</div>
  </div>
)
