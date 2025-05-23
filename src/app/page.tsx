"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";



export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,var(--primary)/10%,transparent)]" />
        <div className="container flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
          <div className="flex-1 text-center lg:text-left space-y-6" data-motion="slideRight">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Descubre tu verdadera
              <span className="text-primary block mt-2">vocación profesional</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto lg:mx-0">
              Una evaluación interactiva potenciada por IA que te guiará hacia el camino profesional que mejor se adapte a tus habilidades e intereses.
            </p>            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/assessment" passHref>
                <Button size="lg" className="text-lg w-full sm:w-auto">
                  Comenzar Evaluación
                </Button>
              </Link>
              <Link href="#como-funciona" passHref>
                <Button variant="outline" size="lg" className="text-lg w-full sm:w-auto">
                  Cómo Funciona
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 relative" data-motion="slideLeft">
            <div className="relative h-[400px] w-full max-w-[500px] mx-auto">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/30 to-accent/20 rounded-2xl blur-3xl -z-10" />
              <div className="absolute inset-0 bg-card/80 backdrop-blur-sm rounded-2xl border shadow-xl">
                <div className="flex flex-col h-full p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-medium">Evaluación Vocacional</div>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                      <div className="w-3 h-3 rounded-full bg-accent"></div>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2">Descubre tu perfil profesional</div>
                      <div className="text-muted-foreground mb-6">
                        Responde preguntas interactivas diseñadas para identificar tus fortalezas
                      </div>
                      <div className="flex justify-center">
                        <div className="h-2 bg-muted rounded-full w-full max-w-[250px] mb-4">
                          <div className="h-2 bg-primary rounded-full w-[65%]"></div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">65% completado</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-muted/30" id="como-funciona">
        <div className="container">
          <div className="text-center mb-16" data-motion="slideUp">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Cómo Funciona</h2>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
              Nuestra plataforma utiliza tecnología avanzada para ofrecerte una experiencia de descubrimiento vocacional completamente personalizada
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl border shadow-sm" data-motion="fadeIn" data-motion-delay="100">
              <div className="w-14 h-14 bg-primary/10 flex items-center justify-center rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 2v4" />
                  <path d="M12 18v4" />
                  <path d="M4.93 4.93l2.83 2.83" />
                  <path d="M16.24 16.24l2.83 2.83" />
                  <path d="M2 12h4" />
                  <path d="M18 12h4" />
                  <path d="M4.93 19.07l2.83-2.83" />
                  <path d="M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Evaluación Interactiva</h3>
              <p className="text-muted-foreground">
                Responde a preguntas interactivas mediante arrastrar y soltar, deslizadores y tarjetas ordenables que hacen la experiencia amena y dinámica.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border shadow-sm" data-motion="fadeIn" data-motion-delay="200">
              <div className="w-14 h-14 bg-primary/10 flex items-center justify-center rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9c0 4.97 4.03 9 9 9" />
                  <path d="M12 3v8l4 2" />
                  <path d="M12 12v9" />
                  <path d="M12 21a9 9 0 0 0 9-9" />
                  <path d="M19 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Análisis en Tiempo Real</h3>
              <p className="text-muted-foreground">
                Nuestro motor de IA procesa tus respuestas para adaptar las siguientes preguntas, refinando la evaluación conforme avanzas.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border shadow-sm" data-motion="fadeIn" data-motion-delay="300">
              <div className="w-14 h-14 bg-primary/10 flex items-center justify-center rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m15 9-6 6" />
                  <path d="m9 9 6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Resultados Personalizados</h3>
              <p className="text-muted-foreground">
                Recibe recomendaciones de carreras, visualización de habilidades e intereses, y análisis de personalidad adaptados a ti.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="relative z-10 max-w-[600px] mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" data-motion="slideUp">
                ¿Listo para descubrir tu vocación?
              </h2>              <p className="text-lg mb-8 text-muted-foreground" data-motion="slideUp" data-motion-delay="100">
                Comienza tu viaje de descubrimiento vocacional hoy y desbloquea tu potencial profesional.
              </p>
              <Link href="/assessment" passHref>
                <Button size="lg" className="text-lg" data-motion="slideUp" data-motion-delay="200">
                  Iniciar Evaluación
                </Button>
              </Link>
            </div>
            <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_top_right,var(--primary)/10%,transparent_70%)]"></div>
            <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_bottom_left,var(--accent)/10%,transparent_70%)]"></div>
          </div>
        </div>
      </section>
    </>
  );
}
