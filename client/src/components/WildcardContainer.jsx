import './WildcardContainer.css'; // Import the styles here

const WildcardContainer = ({ wildcards, selectedWildcard, setSelectedWildcard }) => {
  // Check if wildcards is an array before trying to map
  if (!Array.isArray(wildcards)) {
    return <p>Loading wildcards...</p>; // Show loading message while data is being fetched
  }
// Mapping of persona IDs to images
const personaImages = {
    1: 'persona1.png',  
    2: 'persona2.png',
    3: 'persona3.png',
  
  };
  return (
    <div className="wildcard-container">
      {wildcards.map((wildcard) => (
        <div
          key={wildcard.id || wildcard.name}
          onClick={() => setSelectedWildcard(wildcard)}
          className={`wildcard-card ${selectedWildcard === wildcard ? 'selected' : ''}`}
        >
          <img
            src={`/images/wildcards/${wildcard.image}`}
            alt={wildcard.name}
            className="wildcard-image"
          />
          <div className="persona-overlay">
            <img
             src={`/images/personas/${personaImages[wildcard.persona_id]}`}
              alt={`Initial persona of ${wildcard.name}`}
              className="persona-image"
            />
          </div>
          <p className="wildcard-name">{wildcard.name}</p>
          </div>
      ))}
    </div>
  );
};
  export default WildcardContainer;