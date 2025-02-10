import styled from 'styled-components';
import ReleaseButton from '../components/ReleaseButton';

const StockRowWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  gap: 20px;
  cursor: pointer;
  &:hover {
    background-color: #6d9ac7;
  
    
  }
`;



const StockRow = ({ persona, onClick, onRelease }) => {
  return (
    <StockRowWrapper onClick={() => onClick(persona)}>
      <div>
        <h3>{persona.name}</h3>
        <p>Arcana: {persona.arcana.name}</p>
        <p>Level: {persona.level}</p>
      </div>
      <ReleaseButton onClick={(e) => { e.stopPropagation(); onRelease(persona.id); }}>
        Release
      </ReleaseButton>
    </StockRowWrapper>
  );
};

export default StockRow;