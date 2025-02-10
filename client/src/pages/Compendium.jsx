import { useState, useEffect } from 'react';
import { api } from '../api';
import styled from 'styled-components';
import { DndContext, useDroppable} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ArcanaFilter from '../components/ArcanaFilter';
import SortBy from '../components/SortBy';

const PageWrapper = styled.div`
  display: flex;
  padding: 20px;
  background-color: #15155b;
`;

const LeftSection = styled.div`
  flex: 1;
  background-image: url('/images/elizabeth.png');  
  background-size: contain;
   background-repeat: no-repeat;
  background-position: center;
  height: 100vh;
 background-color: #15155b;
`;

const RightSection = styled.div`
  flex: 2;
  padding: 20px;
  background-color: 	#15155b;
  overflow-y: auto;
  
`;

const CompendiumWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: 	#272e7d
`;

const CompendiumRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 5px;
  cursor: move;
  width: 100%;
   transition: transform 200ms ease;
  div {
    margin-right: 15px;  // Add spacing between the divs
  }
`;

const BuySection = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  text-align: center;
  width: 100%;
  min-height: 100px;
  border: 2px dashed #000;  // Make it visually distinguishable
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Compendium = () => {
  const [personas, setPersonas] = useState([]);
  const [filteredPersonas, setFilteredPersonas] = useState([]);
  const [ arcanaFilter,setArcanaFilter] = useState('');
  const [ sortBy,setSortBy] = useState('');

  useEffect(() => {
    const fetchCompendium = async () => {
      try {
        const response = await api.get('/compendiums');
        setPersonas(response.data);
        setFilteredPersonas(response.data);
      } catch (error) {
        console.error('Error fetching compendium:', error);
      }
    };

    fetchCompendium();
  }, []);

  const handleArcanaFilterChange = (selectedArcana) => {
    setArcanaFilter(selectedArcana);
    setFilteredPersonas(
      personas.filter((persona) => persona.arcana.name === selectedArcana || selectedArcana === '')
    );
  };

  const handleSortByChange = (sortOption) => {
    setSortBy(sortOption);
    setFilteredPersonas((prev) => {
      if (sortOption === 'name') {
        return [...prev].sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOption === 'level') {
        return [...prev].sort((a, b) => a.level - b.level);
      }
      return prev;  // Return the list if no valid sort option
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
  
    if (over && over.id === 'buy-section') {
      const personaId = active.id;
  
      // Make API call to attempt the purchase of the persona
      api.post(`/buy-persona/${personaId}`)
        .then((response) => {
          if (response.data && response.data.message) {
            alert(`Persona purchased successfully! ${response.data.message}`);
          } else {
            alert('An error occurred while purchasing the persona.');
          }
        })
        .catch((error) => {
          console.error('Error purchasing persona:', error);
          if (error.response && error.response.data) {
            // Provide detailed error message from the response if available
            alert(`Failed to purchase persona. ${error.response.data.error || 'Unknown error'}`);
          } else {
            alert('Failed to purchase persona. You may have reached the stock limit.');
          }
        });
    }
  };

  return (
    <PageWrapper>
      {/* Left section with image */}
      <LeftSection />
      
      {/* Right section with filters and compendium */}
      <RightSection>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', color: "white" }}>
          <ArcanaFilter onFilterChange={handleArcanaFilterChange} />
          <SortBy onSortChange={handleSortByChange} />
        </div>
        <CompendiumWrapper>
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={filteredPersonas.map((persona) => persona.id)} strategy={verticalListSortingStrategy}>
              {filteredPersonas.map((persona) => (
                <SortableItem key={persona.id} id={persona.id}>
                  <CompendiumRow>
                    <div>{persona.name}</div>
                    <div>{persona.level}</div>
                    <div>{persona.arcana.name}</div>
                    <div>{persona.calculated_price}</div>
                  </CompendiumRow>
                </SortableItem>
              ))}
            </SortableContext>
            {/* Buy Section as a droppable area */}
            <DroppableBuySection id="buy-section">
              <p>Drag and drop a persona here to buy it!</p>
            </DroppableBuySection>
          </DndContext>
        </CompendiumWrapper>
      </RightSection>
    </PageWrapper>
  );
};

// Make each row a sortable item
const SortableItem = ({ id, children }) => {
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
      };
  
      return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
          {children}
        </div>
      );
    };
    // Droppable Buy Section component
const DroppableBuySection = ({ id, children }) => {
    const { setNodeRef, isOver } = useDroppable({
      id,
    });
  
    return (
      <BuySection ref={setNodeRef} style={{ backgroundColor: isOver ? '#b0e0e6' : '#fff' }}>
        {children}
      </BuySection>
    );
  };

export default Compendium;