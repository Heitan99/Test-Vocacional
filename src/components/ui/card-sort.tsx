"use client";

import React, { useState, useRef, useEffect } from "react";
import { animate } from "motion";

interface Card {
  id: string;
  content: React.ReactNode;
}

interface CardSortProps {
  cards: Card[];
  onChange: (sortedCards: Card[]) => void;
  className?: string;
}

export function CardSort({ cards: initialCards, onChange, className = "" }: CardSortProps) {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, cards.length);
  }, [cards]);

  // Set up card positions initially
  useEffect(() => {
    cards.forEach((_, index) => {
      if (cardRefs.current[index]) {
        positionCard(index);
      }
    });
  }, [cards]);

  const positionCard = (index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    animate(
        card,
        { transform: `translateY(${index * (card.offsetHeight + 10)}px) scale(${draggedIndex === index ? 1.05 : 1})` } as any,
        { duration: 0.3, ease: "easeOut" }
    );
  };

  const handleDragStart = (index: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    // Prevent default to avoid browser native drag
    e.preventDefault();
    
    // Set the card being dragged
    setIsDragging(true);
    setDraggedIndex(index);
    
    // Get the position where the user clicked within the card
    const card = cardRefs.current[index];
    if (!card) return;
    
    const initialY = e.clientY;
    const startY = parseInt(card.style.transform.match(/translateY\((\d+)px\)/) ? 
                           card.style.transform.match(/translateY\((\d+)px\)/)![1] : "0");
    
    // Add dragging styles
    card.classList.add("dragging");
    
    // Make card bigger
    animate(
      card,
      { scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", zIndex: 10 },
      { duration: 0.2 }
    );
    
    // Handle pointer move
    const handlePointerMove = (e: PointerEvent) => {
      if (draggedIndex === null) return;

      const currentY = e.clientY;
      const deltaY = currentY - initialY;
      
      // Move card with pointer
      animate(
        card,
        { y: startY + deltaY },
        { duration: 0.05 }
      );
      
      // Check if we should reorder
      checkForReorder(index, currentY);
    };
    
    const handlePointerUp = () => {
      if (draggedIndex === null) return;
      
      // Clean up
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      
      card.classList.remove("dragging");
      setIsDragging(false);
      
      // Animate back to correct position
      positionCard(draggedIndex);
      
      // Notify of change
      onChange(cards);
      
      setDraggedIndex(null);
    };
    
    // Add event listeners
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    
    // Capture pointer for smoother dragging
    card.setPointerCapture(e.pointerId);
  };

  const checkForReorder = (draggedIdx: number, pointerY: number) => {
    // Find the card we're hovering over
    const draggedCard = cardRefs.current[draggedIdx];
    if (!draggedCard) return;
    
    let newIndex = draggedIdx;
    
    // Check each card to see if we should swap
    cards.forEach((_, idx) => {
      if (idx !== draggedIdx) {
        const card = cardRefs.current[idx];
        if (!card) return;
        
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        
        // If pointer is above center of card and we're moving upward
        if (pointerY < cardCenter && idx < draggedIdx) {
          newIndex = idx;
        }
        // If pointer is below center of card and we're moving downward
        else if (pointerY > cardCenter && idx > draggedIdx) {
          newIndex = idx;
        }
      }
    });
    
    // If the index changed, update the order
    if (newIndex !== draggedIdx) {
      const newCards = [...cards];
      const [removed] = newCards.splice(draggedIdx, 1);
      newCards.splice(newIndex, 0, removed);
      
      setCards(newCards);
      setDraggedIndex(newIndex);
      
      // Reposition all cards
      setTimeout(() => {
        newCards.forEach((_, idx) => {
          if (idx !== newIndex) {
            positionCard(idx);
          }
        });
      }, 0);
    }
  };

  return (
    <div 
      className={`relative ${className}`}
      style={{ height: cards.length * (cardRefs.current[0]?.offsetHeight || 80) + (cards.length - 1) * 10 }}
    >
      {cards.map((card, index) => (
        <div
          key={card.id}
          ref={el => { cardRefs.current[index] = el; }}
          className={`absolute w-full p-4 bg-card border rounded-lg shadow-sm transition-shadow cursor-grab ${
            index === draggedIndex ? "shadow-lg" : ""
          }`}
          onPointerDown={handleDragStart(index)}
          style={{ touchAction: "none" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-muted rounded-md p-1 w-8 h-8 flex items-center justify-center">
              {index + 1}
            </div>
            <div className="flex-grow">{card.content}</div>
            <div className="flex-shrink-0 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="12" r="1" />
                <circle cx="9" cy="5" r="1" />
                <circle cx="9" cy="19" r="1" />
                <circle cx="15" cy="12" r="1" />
                <circle cx="15" cy="5" r="1" />
                <circle cx="15" cy="19" r="1" />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
