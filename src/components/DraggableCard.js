import React, { useRef } from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';

const CardContainer = styled(Rnd)`
  position: absolute;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ConnectionPoint = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #000;
  border-radius: 50%;
  cursor: pointer;
  transform: translate(-50%, -50%);
  top: 50%;
  right: -5px;
`;

function DraggableCard({ id, text, position, onShowMore, moveCard, onClickConnectionPoint }) {
  const cardRef = useRef(null);

  const handleDragStop = (e, d) => {
    moveCard(id, { x: d.x, y: d.y });
  };

  return (
    <CardContainer
      ref={cardRef}
      default={{
        x: position.x,
        y: position.y,
        width: 200,
        height: 150,
      }}
      onDragStop={handleDragStop}
      bounds="parent"
    >
      <div>{text.length > 20 ? `${text.substring(0, 20)}...` : text}</div>
      <button className='btr' onClick={() => onShowMore(text)}  style={{position:"absolute",top:"80%"}}  >Show More</button>
      <ConnectionPoint onMouseDown={(e) => {
        e.stopPropagation(); // Prevent card drag start
        onClickConnectionPoint(id);
      }} />
    </CardContainer>
  );
}

export default DraggableCard;
