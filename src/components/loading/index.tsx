
import './style.css';

const Loading = () => {
    return (
        <div className="loading-container">
            <div className="loading-content">
                <div className="loading-spinner"></div>
                <div className="loading-text">Loading projects...</div>
            </div>
        </div>
    );
};

export default Loading;