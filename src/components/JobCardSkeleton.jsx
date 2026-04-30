import './JobCardSkeleton.css';

export function JobCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-icon"></div>
        <div className="skeleton-text-block">
          <div className="skeleton-line title"></div>
          <div className="skeleton-line subtitle"></div>
        </div>
      </div>
      <div className="skeleton-pills">
        <div className="skeleton-pill"></div>
        <div className="skeleton-pill"></div>
      </div>
      <div className="skeleton-benefits">
        <div className="skeleton-benefit"></div>
        <div className="skeleton-benefit"></div>
        <div className="skeleton-benefit"></div>
      </div>
      <div className="skeleton-button"></div>
    </div>
  );
}
