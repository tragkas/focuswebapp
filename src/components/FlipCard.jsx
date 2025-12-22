import './FlipCard.css';

const FlipCard = ({ digit }) => {
    return (
        <div className="flip-card">
            <span>{digit}</span>
        </div>
    );
};

export default FlipCard;
