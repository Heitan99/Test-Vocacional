"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAssessmentStore } from "@/lib/store/assessment-store";
import { Button } from "@/components/ui/button";
import { ResultsSummary } from "@/components/results/results-summary";
import { CareerRecommendations } from "@/components/results/career-recommendations";
import { PersonalityProfile } from "@/components/results/personality-profile";
import { SkillsAnalysis } from "@/components/results/skills-analysis";
import { useRouter } from "next/navigation";


export default function ResultsPage() {
  const { results, isAssessmentComplete } = useAssessmentStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("summary");
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Verificar resultados y agregar debug
  useEffect(() => {
    let mounted = true;
    
    const checkResults = () => {
      console.log("🔍 Verificando resultados:", { 
        results: !!results, 
        isAssessmentComplete,
        resultsData: results
      });
      
      // Verificar localStorage como backup
      const completedFromStorage = localStorage.getItem('assessment-completed');
      const resultsFromStorage = localStorage.getItem('assessment-results');
      
      if (results) {
        console.log("✅ Resultados encontrados en store");
        console.log("- Primera carrera:", results.careerRecommendations?.[0]?.title);
        console.log("- Resumen:", results.summary?.substring(0, 50));
        
        if (mounted) {
          setIsLoading(false);
        }
      } else if (completedFromStorage && resultsFromStorage) {
        console.log("🔄 Recuperando resultados de localStorage");
        try {
          const parsedResults = JSON.parse(resultsFromStorage);
          console.log("- Datos recuperados:", parsedResults);
          
          if (mounted) {
            useAssessmentStore.getState().updateResults(parsedResults);
            setIsLoading(false);
          }
        } catch (error) {
          console.error("❌ Error al parsear resultados de localStorage:", error);
          if (mounted) {
            router.push("/assessment");
          }
        }
      } else {
        console.log("❌ No hay resultados, redirigiendo...");
        if (mounted) {
          router.push("/assessment");
        }
      }
    };
    
    // Esperar un momento para la hidratación
    const timeoutId = setTimeout(checkResults, 1000);
    
    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [results, isAssessmentComplete, router]);
  
  // Funciones para PDF y compartir
  const exportToPdf = async () => {
    try {
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;
      
      const resultsContainer = document.getElementById("results-container");
      if (!resultsContainer) {
        alert("No se pudo encontrar el contenido para exportar");
        return;
      }
      
      const canvas = await html2canvas(resultsContainer);
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.addImage(imgData, "PNG", imgX, 0, imgWidth * ratio, imgHeight * ratio);
      pdf.save("resultados-vocacionales.pdf");
    } catch (error) {
      console.error("Error al exportar a PDF:", error);
      alert("Ocurrió un error al generar el PDF.");
    }
  };
  
  const shareOnSocialMedia = (platform: string) => {
    const url = window.location.href;
    const text = "¡Acabo de completar mi evaluación vocacional!";
    
    let shareUrl = "";
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, "_blank", "width=600,height=400");
    setShowShareOptions(false);
  };
  
  const shareViaEmail = () => {
    const subject = "Mis resultados de evaluación vocacional";
    const body = `¡Hola! He completado mi evaluación vocacional.

Puedes ver mis resultados en: ${window.location.href}`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setShowShareOptions(false);
  };

  // Pantalla de carga SIMPLIFICADA
  if (isLoading) {
    return (
      <div className="container max-w-4xl py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Cargando resultados...</h1>
          <div className="mx-auto w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Si no hay resultados
  if (!results) {
    return (
      <div className="container max-w-4xl py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No hay resultados disponibles</h1>
          <p className="text-muted-foreground mb-6">
            Parece que no has completado una evaluación todavía.
          </p>
          <Link href="/assessment">
            <Button>Realizar Evaluación</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8" id="results-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Resultados de tu Evaluación Vocacional</h1>
        <p className="text-muted-foreground mb-4">
          Análisis basado en tus respuestas y preferencias
        </p>
        
        <div className="flex items-center justify-between">
          <div className="space-x-1">
            <Button
              variant={activeTab === "summary" ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveTab("summary")}
            >
              Resumen
            </Button>
            <Button
              variant={activeTab === "careers" ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveTab("careers")}
            >
              Carreras
            </Button>
            <Button
              variant={activeTab === "personality" ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveTab("personality")}
            >
              Personalidad
            </Button>
            <Button
              variant={activeTab === "skills" ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveTab("skills")}
            >
              Habilidades
            </Button>
          </div>
          
          <div className="flex items-center gap-2">            <Button 
              onClick={exportToPdf}
            >
              Exportar PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowShareOptions(!showShareOptions)}
            >
              Compartir
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Resetear el estado antes de navegar a nueva evaluación
                useAssessmentStore.getState().reset();
                router.push("/assessment");
              }}
            >
              Nueva Evaluación
            </Button>
          </div>
        </div>
        
        {showShareOptions && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium mb-2">Compartir resultados</h3>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={shareViaEmail}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4">
                  <path d="M1 3a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3zm1 0v.217l5.5 3.043L13 3.217V3H2zm0 1.435V12h11V4.435L7.5 7.565L2 4.435z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
                Correo
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => shareOnSocialMedia("twitter")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" fill="currentColor" />
                </svg>
                Twitter
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => shareOnSocialMedia("linkedin")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" fill="currentColor"/>
                </svg>
                LinkedIn
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Enlace copiado al portapapeles");
                  setShowShareOptions(false);
                }}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4">
                  <path d="M5 2V1H10V2H5ZM4.75 0C4.33579 0 4 0.335786 4 0.75V1H3.5C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V2.5C13 1.67157 12.3284 1 11.5 1H11V0.75C11 0.335786 10.6642 0 10.25 0H4.75ZM11 2V2.25C11 2.66421 10.6642 3 10.25 3H4.75C4.33579 3 4 2.66421 4 2.25V2H3.5C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V2.5C12 2.22386 11.7761 2 11.5 2H11Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
                Copiar enlace
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8">
        {activeTab === "summary" && results && (
          <ResultsSummary results={results} />
        )}
        
        {activeTab === "careers" && results && results.careerRecommendations && (
          <CareerRecommendations careers={results.careerRecommendations} />
        )}
        
        {activeTab === "personality" && results && results.personalityInsights && (
          <PersonalityProfile personality={results.personalityInsights} />
        )}
        
        {activeTab === "skills" && results && results.skillsAssessment && (
          <SkillsAnalysis skills={results.skillsAssessment} />
        )}
      </div>
    </div>
  );
}
