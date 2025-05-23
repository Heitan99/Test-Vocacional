"use client";

import React, { useState, useRef } from "react";
import { animate } from "motion";

interface DraggableItem {
  id: string;
  content: React.ReactNode;
}

interface DropZone {
  id: string;
  title: string;
  description?: string;
  acceptedIds?: string[];
}

interface DragAndDropProps {
  items: DraggableItem[];
  dropZones: DropZone[];
  onDrop: (itemId: string, zoneId: string) => void;
  className?: string;
}

export function DragAndDrop({
  items,
  dropZones,
  onDrop,
  className = "",
}: DragAndDropProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [itemPositions, setItemPositions] = useState<Record<string, { zoneId: string | null }>>({});
  const dragItemRef = useRef<HTMLDivElement | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = (
    e: React.PointerEvent<HTMLDivElement>,
    itemId: string
  ) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    
    // Calculate offset from where the user clicked to the top-left corner of the element
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    
    // Set the element being dragged
    setDraggingId(itemId);
    dragItemRef.current = element;
    
    // Add a dragging class to the element
    element.classList.add("dragging");
    
    // Capture pointer to make dragging smoother
    element.setPointerCapture(e.pointerId);
    
    // Add animation
    animate(
      element,
      { scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" },
      { duration: 0.2 }
    );
  };

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingId || !dragItemRef.current) return;
    
    const element = dragItemRef.current;
    
    // Position the element at the cursor position, accounting for the offset
    element.style.position = "fixed";
    element.style.left = `${e.clientX - dragOffset.x}px`;
    element.style.top = `${e.clientY - dragOffset.y}px`;
    element.style.zIndex = "50";
    element.style.pointerEvents = "none";
  };

  const handleDragEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingId || !dragItemRef.current) return;
    
    const element = dragItemRef.current;
    
    // Remove the pointer capture
    element.releasePointerCapture(e.pointerId);
    
    // Find if we're over a drop zone
    const dropZone = findDropZoneAtPosition(e.clientX, e.clientY);
    
    if (dropZone) {
      // If the drop zone accepts this item or doesn't have restrictions
      if (!dropZone.acceptedIds || dropZone.acceptedIds.includes(draggingId)) {
        // Update our state tracking
        setItemPositions(prev => ({
          ...prev,
          [draggingId]: { zoneId: dropZone.id }
        }));
        
        // Call onDrop callback
        onDrop(draggingId, dropZone.id);
        
        // Animate the item into the drop zone
        const dropZoneEl = document.getElementById(`drop-zone-${dropZone.id}`);
        
        if (dropZoneEl) {
          const rect = dropZoneEl.getBoundingClientRect();
          animate(
            element,
            { 
              x: rect.left + rect.width / 2 - element.offsetWidth / 2,
              y: rect.top + rect.height / 2 - element.offsetHeight / 2,
              scale: 1,
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            },
            { duration: 0.3 }
          );
        }
      } else {
        // If not accepted, animate back to original position
        resetDraggedElement(element);
      }
    } else {
      // Not over a drop zone, animate back to original position
      resetDraggedElement(element);
    }
    
    // Clean up
    element.classList.remove("dragging");
    setDraggingId(null);
    dragItemRef.current = null;
  };

  const resetDraggedElement = (element: HTMLElement) => {
    // Animate back to original position
    animate(
      element,
      { x: 0, y: 0, scale: 1, boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },
      { duration: 0.3 }
    ).finished.then(() => {
      element.style.position = "";
      element.style.left = "";
      element.style.top = "";
      element.style.zIndex = "";
      element.style.pointerEvents = "";
    });
  };

  const findDropZoneAtPosition = (x: number, y: number): DropZone | null => {
    for (const zone of dropZones) {
      const element = document.getElementById(`drop-zone-${zone.id}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom
        ) {
          return zone;
        }
      }
    }
    return null;
  };

  return (
    <div className={`flex flex-col md:flex-row gap-6 ${className}`}>
      <div className="flex flex-wrap gap-3 p-4 bg-background border rounded-lg flex-1">
        <h3 className="w-full text-lg font-medium mb-2">Elementos</h3>
        {items.map(item => {
          // Only show items that have not been placed in a zone
          const isPlaced = itemPositions[item.id]?.zoneId !== undefined && 
                           itemPositions[item.id]?.zoneId !== null;
          
          if (isPlaced) return null;
          
          return (
            <div
              key={item.id}
              className="p-3 bg-card border rounded-md shadow-sm cursor-grab touch-none"
              onPointerDown={(e) => handleDragStart(e, item.id)}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
            >
              {item.content}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {dropZones.map(zone => {
          // Get items that are in this zone
          const zoneItems = items.filter(
            item => itemPositions[item.id]?.zoneId === zone.id
          );
          
          return (
            <div
              id={`drop-zone-${zone.id}`}
              key={zone.id}
              className="flex flex-col p-4 bg-muted/30 border-2 border-dashed border-muted rounded-lg min-h-[150px] transition-colors hover:border-primary/50"
            >
              <h3 className="font-medium mb-1">{zone.title}</h3>
              {zone.description && (
                <p className="text-xs text-muted-foreground mb-3">{zone.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-auto">
                {zoneItems.map(item => (
                  <div
                    key={item.id}
                    className="p-3 bg-card border rounded-md shadow-sm cursor-grab"
                    onPointerDown={(e) => handleDragStart(e, item.id)}
                    onPointerMove={handleDragMove}
                    onPointerUp={handleDragEnd}
                    onPointerCancel={handleDragEnd}
                  >
                    {item.content}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
