"use client";

import { useState, useEffect } from "react";
import { DragAndDrop } from "@/components/ui/drag-and-drop";

interface Option {
  id: string;
  content: React.ReactNode;
}

interface DropZone {
  id: string;
  title: string;
  description?: string;
}

interface DragAndDropQuestionProps {
  options: Option[];
  onResponse: (value: Record<string, string[]>) => void;
  initialValue?: Record<string, string[]>;
}

export function DragAndDropQuestion({
  options,
  onResponse,
  initialValue,
}: DragAndDropQuestionProps) {
  // Crear zonas de soltar basadas en la naturaleza de la pregunta
  const [dropZones] = useState<DropZone[]>([
    { 
      id: "zone1", 
      title: "Me interesa mucho", 
      description: "Elementos que te resultan muy atractivos o con los que te identificas fuertemente" 
    },
    { 
      id: "zone2", 
      title: "Me interesa un poco", 
      description: "Elementos que te generan cierto interés o con los que te identificas parcialmente" 
    },
    { 
      id: "zone3", 
      title: "No me interesa", 
      description: "Elementos que no te interesan o con los que no te identificas" 
    },
  ]);

  // Estado para rastrear qué elementos están en qué zonas
  const [zoneContents, setZoneContents] = useState<Record<string, string[]>>(() => {
    if (initialValue) {
      return initialValue;
    }
    
    // Inicializar con todas las zonas vacías
    const initial: Record<string, string[]> = {};
    dropZones.forEach((zone) => {
      initial[zone.id] = [];
    });
    return initial;
  });

  // Manejar cuando se suelta un elemento en una zona
  const handleDrop = (itemId: string, zoneId: string) => {
    // Primero, eliminar el elemento de cualquier zona en la que pueda estar
    const updatedZoneContents = { ...zoneContents };
    
    dropZones.forEach((zone) => {
      updatedZoneContents[zone.id] = updatedZoneContents[zone.id]?.filter((id) => id !== itemId) || [];
    });
    
    // Luego, agregar el elemento a la nueva zona
    updatedZoneContents[zoneId] = [...(updatedZoneContents[zoneId] || []), itemId];
    
    setZoneContents(updatedZoneContents);
    onResponse(updatedZoneContents);
  };

  // Efecto para inicializar con el valor inicial si cambia
  useEffect(() => {
    if (initialValue) {
      setZoneContents(initialValue);
    }
  }, [initialValue]);

  return (
    <div className="py-4">
      <p className="mb-6 text-muted-foreground">
        Arrastra cada elemento a la zona que mejor represente tu nivel de interés o identificación.
      </p>
      
      <DragAndDrop
        items={options}
        dropZones={dropZones}
        onDrop={handleDrop}
        className="min-h-[400px]"
      />
    </div>
  );
}
