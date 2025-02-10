const SortBy = ({ onSortChange }) => {
    return (
      <div>
        <label htmlFor="sort-by">Sort by:</label>
        <select
          id="sort-by"
          onChange={(e) => onSortChange(e.target.value)}  // Trigger the sorting when selection changes
        >
          <option value="name">A-Z (Name)</option>
          <option value="level">Level</option>
        </select>
      </div>
    );
  };
  
  export default SortBy;