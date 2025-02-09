import styled from 'styled-components';
import StockRow from './StockRow';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 20px;
  align-items: flex-start;
  grid-auto-rows: minmax(100px, auto);
`;

const StockContainer = ({ personas, onClick, onRelease }) => {
  return (
    <Container>
      {personas.map((persona) => (
        <StockRow key={persona.id} persona={persona} onClick={onClick} onRelease={onRelease} />
      ))}
    </Container>
  );
};

export default StockContainer;