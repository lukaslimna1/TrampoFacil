import './JobDetailSkeleton.css';
import './JobCardSkeleton.css'; // Reusing some base lines like .skeleton-line

export function JobDetailSkeleton({ isInline }) {
  return (
    <div className={`container job-detail-page skeleton-page ${isInline ? 'inline-mode' : ''}`}>
      <div className="job-detail-layout">
        <div className="job-detail-main">
          
          <div className="job-detail-header skeleton-header-detail">
            <div className="skeleton-icon-large"></div>
            <div className="skeleton-text-block">
              <div className="skeleton-line title" style={{ height: '24px', width: '60%' }}></div>
              <div className="skeleton-line subtitle" style={{ width: '40%' }}></div>
            </div>
          </div>
          
          <div className="jd-primary-actions-bar mt-4">
            <div className="skeleton-button-large"></div>
            <div className="skeleton-button-circle"></div>
            <div className="skeleton-button-circle"></div>
          </div>
          
          <div className="jd-tabs-container skeleton-tabs mt-4">
            <div className="skeleton-tab"></div>
            <div className="skeleton-tab"></div>
            <div className="skeleton-tab"></div>
          </div>
          
          <div className="jd-main-info-grid">
            <div className="jd-hero-meta">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="jd-hero-item skeleton-grid-item"></div>
              ))}
            </div>
          </div>
          
          <div className="job-blocks mt-4">
            <div className="job-block block-premium skeleton-block">
              <div className="skeleton-line title mb-4" style={{ width: '30%' }}></div>
              <div className="skeleton-line mb-2"></div>
              <div className="skeleton-line mb-2"></div>
              <div className="skeleton-line mb-2"></div>
              <div className="skeleton-line" style={{ width: '80%' }}></div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
