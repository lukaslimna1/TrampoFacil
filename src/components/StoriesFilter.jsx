import './StoriesFilter.css';

export function StoriesFilter({ stories = [], activeFilter, onFilterSelect }) {
  if (!stories || stories.length === 0) return null;

  return (
    <div className="stories-container">
      <div className="stories-track">
        {stories.map(story => (
          <button
            key={story.id}
            className={`story-bubble ${activeFilter === story.id ? 'active' : ''} ${story.isHot ? 'is-hot' : ''}`}
            onClick={() => onFilterSelect(story.id)}
          >
            <div className="story-icon-ring">
               <div className="story-icon">{story.icon}</div>
            </div>
            <span className="story-label">{story.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
