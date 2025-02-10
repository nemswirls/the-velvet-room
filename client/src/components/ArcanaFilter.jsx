const ArcanaFilter = ({ onFilterChange }) => {
    const arcanaOptions = [
      'All', // Option for "All Arcana"
      'Fool',
      'Magician',
      'Priestess',
      'Empress',
      'Emperor',
      'Hierophant',
      'Lovers',
      'Chariot',
      'Justice',
      'Hermit',
      'Fortune',
      'Strength',
      'Hanged Man',
      'Death',
      'Temperance',
      'Devil',
      'Tower',
      'Star',
      'Moon',
      'Sun',
      'Judgement',
      'Aeon',
      'World',
    ];
  
    const handleArcanaSelect = (event) => {
      const selectedArcana = event.target.value;
      onFilterChange(selectedArcana === 'All' ? '' : selectedArcana); // Send '' for all or selected arcana
    };
  
    return (
      <div>
        <label htmlFor="arcana-filter">Filter by Arcana: </label>
        <select id="arcana-filter" onChange={handleArcanaSelect}>
          {arcanaOptions.map((arcana) => (
            <option key={arcana} value={arcana}>
              {arcana}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default ArcanaFilter;