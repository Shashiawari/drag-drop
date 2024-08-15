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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
      border-image: linear-gradient(to right, darkblue, darkorchid) 1;

`;

const CardText = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const ConnectionPoint = styled.div`
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: #000;
  border-radius: 50%;
  cursor: pointer;
  transform: translate(-50%, -50%);
  top: 50%;
  right: -5px;
`;

const ShowMoreButton = styled.button`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 10px;
  background-color: #3C3D37;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
      <CardText>{text.length > 7 ? `${text.substring(0, 2)}...` : text}</CardText>
      <ShowMoreButton onClick={() => onShowMore(text)}>
        Show More
      </ShowMoreButton>
      <ConnectionPoint onMouseDown={(e) => {
        e.stopPropagation(); // Prevent card drag start
        onClickConnectionPoint(id);
      }} />
    </CardContainer>
  );
}

export default DraggableCard;
