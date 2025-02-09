import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import WildcardContainer from '../components/WildcardContainer';
import '../styles/WildcardSelection.css';

function WildcardSelection() {
  const [wildcards, setWildcards] = useState([]);
  const [selectedWildcard, setSelectedWildcard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWildcards = async () => {
      try {
        const response = await api.get('/wildcards');
        console.log('Wildcards fetched:', response.data); // Log the response data
        setWildcards(response.data.wildcards);
      } catch (error) {
        console.error('Failed to fetch wildcards', error);
      }
    };
    fetchWildcards();
  }, []);

  const handleConfirm = async () => {
    if (selectedWildcard) {
      try {
        const response = await api.post(`/choose-wildcard/${selectedWildcard.id}`);
        if (response.status === 200) {
          navigate('/'); // Redirect to home after confirming
        } else {
          alert('Something went wrong');
        }
      } catch (error) {
        console.error('Error choosing wildcard', error);
        alert('Failed to choose wildcard');
      }
    } else {
      alert('Please select a wildcard');
    }
  };

  return (
    <div className="page-container">
      {wildcards.length === 0 ? (
        <p>Loading wildcards...</p>
      ) : (
        <div>
          <WildcardContainer
            wildcards={wildcards}
            selectedWildcard={selectedWildcard}
            setSelectedWildcard={setSelectedWildcard}
          />
          <div className="button-container">
            <button
              onClick={handleConfirm}
              className="confirm-button"
            >
              Confirm 
            </button>
          </div>
          <p className='wildcard-message'>Choose one from the three choices for your wildcard. Mouseover to see the persona you can get. Note: Each wildcard has different special fusions to create!</p>
        </div>
      )}
    </div>
  );
}


export default WildcardSelection;