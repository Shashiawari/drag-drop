import React, { useState, useRef, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import DraggableCard from './DraggableCard';

const CanvasContainer = styled.div`
  width: 100vw;
  height: 300vh;
  overflow: scroll;
  position: relative;
  background-color: #f0f0f0;
`;

const CanvasOverlay = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none; 
`;

function Canvas() {
  const [cards, setCards] = useState([]);
  const [connections, setConnections] = useState([]); // Store connections
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCardDetails, setCurrentCardDetails] = useState('');
  const [cardText, setCardText] = useState(''); // State for input text
  const [draggingConnection, setDraggingConnection] = useState(null); // State for dragging connection
  const canvasRef = useRef(null);

  const handleShowMore = (text) => {
    setCurrentCardDetails(text);
    setIsModalOpen(true);
  };

  const addCard = () => {
    if (!cardText.trim()) return; // Prevent adding empty cards

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const cardWidth = 200; // Assuming a default card width
    const cardHeight = 150; // Assuming a default card height
    const centerX = (canvasWidth - cardWidth) / 2;
    const centerY = (canvasHeight - cardHeight) / 2;

    const newCard = {
      id: `card-${cards.length}`,
      text: cardText,
      position: { x: centerX, y: centerY },
    };

    setCards((prevCards) => [...prevCards, newCard]);
    setCardText(''); // Clear the input after adding
  };

  const moveCard = (id, newPosition) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, position: newPosition } : card
      )
    );
  };

  const drawConnections = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const cardPositions = cards.reduce((acc, card) => {
      acc[card.id] = card.position;
      return acc;
    }, {});

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous lines

    connections.forEach(([startId, endId]) => {
      const startPos = cardPositions[startId];
      const endPos = cardPositions[endId];
      if (startPos && endPos) {
        const startX = startPos.x + 200; // Position of the dot on the start card
        const startY = startPos.y + 75;
        const endX = endPos.x; // Position of the dot on the end card
        const endY = endPos.y + 75;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY); // Start of the line
        ctx.lineTo(endX, endY); // End of the line
        ctx.strokeStyle = '#ff0000'; // Line color
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }, [cards, connections]);

  const handleCardConnectionPointClick = (id) => {
    if (draggingConnection === null) {
      setDraggingConnection(id); // Start connection from this card
    } else {
      if (draggingConnection !== id) {
        // Connect the dragging card with the clicked card
        setConnections((prevConnections) => [
          ...prevConnections,
          [draggingConnection, id],
        ]);
        setDraggingConnection(null); // Reset connection
      }
    }
  };

  useEffect(() => {
    drawConnections();
  }, [cards, connections, drawConnections]); // Included drawConnections in dependency array

  return (
  
    <CanvasContainer>

      {cards.map((card) => (
        <DraggableCard
          key={card.id}
          id={card.id}
          text={card.text}
          position={card.position}
          onShowMore={() => handleShowMore(card.text)}
          moveCard={moveCard}
          onClickConnectionPoint={handleCardConnectionPointClick}
        />
      ))}
      <input 
        type="text" 
        className='input'
        value={cardText} 
        onChange={(e) => setCardText(e.target.value)} 
        placeholder="Enter card text"
        style={{ position: 'absolute', borderRadius:"10px",top: 10, left: 10, width: '200px', marginRight: '10px' , padding:"10px" }}
      />
      <button onClick={addCard} style={{ position: 'absolute', padding:"10px",backgroundColor:"#3C3D37",color:"white",borderRadius:"10px" ,top: 10, left: 250,outline:"0",border:"0" }}>Add Card</button>
      <CanvasOverlay ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Card Details"
        style={{
          content: {
            backgroundColor: 'white', // Modal background color
            height: '80%', // Modal height
            margin: 'auto', // Center the modal
            width: '50%', // Adjust width as needed
            borderRadius: '10px',
            padding: '20px'
          },
        }}
      >
        <h2>Card Details</h2>
        <p>{currentCardDetails}</p>
        <button onClick={() => setIsModalOpen(false)} style={{position:"absolute",top:"90%"}}>Close</button>
      </Modal>
    </CanvasContainer>
  );
}

export default Canvas;
