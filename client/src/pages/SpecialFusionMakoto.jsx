import { useState, useEffect } from 'react';
import { api } from '../api';
import SpecialFusionSection from '../components/SpecialFusionSection';

const SpecialFusionMakoto = () => {
  const [specialFusions, setSpecialFusions] = useState([]);
  const [playerStock, setPlayerStock] = useState([]);
  const [fusionMessage, setFusionMessage] = useState(null);

  // Fetch player's stock
  const fetchPlayerStock = async () => {
    try {
      const res = await api.get('/stocks');
      setPlayerStock(res.data);
    } catch (error) {
      console.error('Error fetching stock:', error);
    }
  };

  // Fetch special fusions
  const fetchSpecialFusions = async () => {
    try {
      const res = await api.get('/special-fusions');
      setSpecialFusions(res.data);
    } catch (error) {
      console.error('Error fetching special fusions:', error);
    }
  };

  useEffect(() => {
    fetchPlayerStock();
    fetchSpecialFusions();
  }, []);

  const handleFusion = async (fusionName) => {
    try {
      const response = await api.post('/special-fusion', { fusion: fusionName });
      setFusionMessage(response.data.message);
      fetchPlayerStock();
    } catch (error) {
      console.error('Error finalizing fusion:', error.response || error);
      setFusionMessage(error.response?.data?.error || 'Fusion failed. Check if you have the required personas.');
    }
  };

  return (
    <div>
      <h2>Makoto&apos;s Special Fusions</h2>
      {fusionMessage && <p>{fusionMessage}</p>}
      {specialFusions.length === 0 ? (
        <p>No special fusions available.</p>
      ) : (
        specialFusions.map((fusion) => (
          <SpecialFusionSection
            key={fusion.name}
            fusion={fusion}
            requiredMaterials={fusion.materials}
            playerStock={playerStock}
            onFuse={handleFusion}
          />
        ))
      )}
    </div>
  );
};

export default SpecialFusionMakoto;