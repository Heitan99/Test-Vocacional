"use client";

import { useState, useEffect } from "react";
import { CardSort } from "@/components/ui/card-sort";

interface Card {
  id: string;
  content: React.ReactNode;
}

interface CardSortQuestionProps {
  cards: Card[];
  onResponse: (value: Card[]) => void;
  initialValue?: Card[];
}

export function CardSortQuestion({
  cards,
  onResponse,
  initialValue,
}: CardSortQuestionProps) {
  const [sortedCards, setSortedCards] = useState<Card[]>(() => {
    if (initialValue) {
      return initialValue;
    }
    return [...cards]; // Por defecto, el orden es el original
  });

  useEffect(() => {
    if (initialValue) {
      setSortedCards(initialValue);
    } else if (cards && cards.length > 0) {
      setSortedCards([...cards]);
    }
  }, [cards, initialValue]);

  const handleSortChange = (newSortedCards: Card[]) => {
    setSortedCards(newSortedCards);
    onResponse(newSortedCards);
  };

  return (
    <div className="py-4">
      <p className="mb-6 text-muted-foreground">
        Arrastra las tarjetas para ordenarlas según tu preferencia o importancia, 
        colocando las más importantes o prioritarias arriba.
      </p>
      
      <CardSort 
        cards={sortedCards} 
        onChange={handleSortChange}
        className="mt-6" 
      />
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Puedes seguir reordenando las tarjetas hasta que estés satisfecho con el orden.
      </div>
    </div>
  );
}
