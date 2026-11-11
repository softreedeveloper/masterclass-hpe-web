import type { Lang } from "../i18n/ui";

// Simulador demostrativo: 6 preguntas de ejemplo (una por sesión), sin cifras ni fuentes de terceros.
// La pregunta 1 es la adaptación editorial de la diap. 19; las 6 son ejemplos de formato y NO son reactivos aprobados por HPE.
// Reemplazar por el banco validado cuando esté disponible.
export interface Pregunta {
   category: string;
   question: string;
   options: { text: string; correct: boolean }[];
   explanation: string;
}

export const quiz: Record<Lang, Pregunta[]> = {
   es: [
      {
         category: "Virtualización y TCO",
         question: "¿Qué debería analizar primero un integrador al evaluar una migración de virtualización?",
         options: [
            { text: "A · Costos y necesidades actuales del cliente", correct: true },
            { text: "B · Únicamente descuentos de renovación", correct: false },
            { text: "C · Aumentar hardware sin diagnóstico", correct: false },
         ],
         explanation: "El diagnóstico parte de los costos, necesidades y contexto de inversión del cliente antes de proponer alternativas.",
      },
      {
         category: "Nube empresarial y datos",
         question: "Al conversar sobre modernización con un cliente, ¿qué aporta más valor a la recomendación?",
         options: [
            { text: "A · Proponer la misma arquitectura para todos los clientes", correct: false },
            { text: "B · Relacionar la distribución de cargas con las prioridades y la flexibilidad que requiere el negocio", correct: true },
            { text: "C · Decidir solo con base en la preferencia tecnológica del equipo", correct: false },
         ],
         explanation: "La recomendación gana valor cuando conecta la nube híbrida y la ubicación de cargas con los objetivos del cliente.",
      },
      {
         category: "Estrategia de canales",
         question: "¿Qué caracteriza a un enfoque consultivo frente a uno transaccional?",
         options: [
            { text: "A · Acompañar al cliente durante su ciclo con diagnóstico, recomendaciones y alianzas", correct: true },
            { text: "B · Enfocarse solo en el precio de la cotización", correct: false },
            { text: "C · Presentar el catálogo completo de productos en cada reunión", correct: false },
         ],
         explanation: "El valor consultivo está en entender el contexto del cliente y acompañarlo, no solo en la venta puntual.",
      },
      {
         category: "Visión ejecutiva",
         question: "En una conversación con un equipo directivo, ¿qué conviene priorizar?",
         options: [
            { text: "A · El detalle de configuración de cada componente", correct: false },
            { text: "B · Una lista de especificaciones técnicas sin contexto", correct: false },
            { text: "C · El impacto de la decisión en la gobernanza, el riesgo y los objetivos del negocio", correct: true },
         ],
         explanation: "Los equipos directivos deciden sobre impacto, riesgo e inversión; la conversación debe partir de ahí.",
      },
      {
         category: "Servicios de datos y arquitectura",
         question: "Al dimensionar una solución de datos, ¿qué criterio fortalece la propuesta?",
         options: [
            { text: "A · Elegir la mayor capacidad disponible por si acaso", correct: false },
            { text: "B · Considerar el crecimiento de datos, la protección y la continuidad junto con su costo total", correct: true },
            { text: "C · Ignorar la protección de datos para reducir el costo inicial", correct: false },
         ],
         explanation: "Un dimensionamiento consultivo equilibra crecimiento, resiliencia y costo total de propiedad.",
      },
      {
         category: "Liderazgo comercial y cierre",
         question: "¿Qué hace más sólida una propuesta ejecutiva en una oportunidad compleja?",
         options: [
            { text: "A · Un caso de negocio sustentado en datos, con riesgos identificados y su mitigación", correct: true },
            { text: "B · Un descuento agresivo sin justificación", correct: false },
            { text: "C · Prometer resultados sin analizar la situación del cliente", correct: false },
         ],
         explanation: "Las propuestas ejecutivas se sostienen en datos, valor y una gestión clara de riesgos.",
      },
   ],
   en: [
      {
         category: "Virtualization and TCO",
         question: "What should an integrator analyze first when evaluating a virtualization migration?",
         options: [
            { text: "A · The client’s current costs and needs", correct: true },
            { text: "B · Renewal discounts only", correct: false },
            { text: "C · Adding hardware without a diagnosis", correct: false },
         ],
         explanation: "Diagnosis starts from the client’s costs, needs and investment context before proposing alternatives.",
      },
      {
         category: "Enterprise cloud and data",
         question: "When discussing modernization with a client, what adds the most value to the recommendation?",
         options: [
            { text: "A · Proposing the same architecture for every client", correct: false },
            { text: "B · Relating workload placement to the business’s priorities and need for flexibility", correct: true },
            { text: "C · Deciding based only on the team’s technology preference", correct: false },
         ],
         explanation: "A recommendation gains value when it connects hybrid cloud and workload placement with the client’s objectives.",
      },
      {
         category: "Channel strategy",
         question: "What characterizes a consultative approach compared with a transactional one?",
         options: [
            { text: "A · Supporting the client throughout their lifecycle with diagnosis, recommendations and alliances", correct: true },
            { text: "B · Focusing only on the quote price", correct: false },
            { text: "C · Presenting the full product catalog in every meeting", correct: false },
         ],
         explanation: "Consultative value lies in understanding the client’s context and supporting them, not just in a one-off sale.",
      },
      {
         category: "Executive vision",
         question: "In a conversation with an executive team, what should you prioritize?",
         options: [
            { text: "A · The configuration details of each component", correct: false },
            { text: "B · A list of technical specifications without context", correct: false },
            { text: "C · The impact of the decision on governance, risk and business objectives", correct: true },
         ],
         explanation: "Executive teams decide on impact, risk and investment; the conversation should start there.",
      },
      {
         category: "Data services and architecture",
         question: "When sizing a data solution, which criterion strengthens the proposal?",
         options: [
            { text: "A · Choosing the largest available capacity just in case", correct: false },
            { text: "B · Considering data growth, protection and continuity together with total cost", correct: true },
            { text: "C · Skipping data protection to lower the upfront cost", correct: false },
         ],
         explanation: "Consultative sizing balances growth, resilience and total cost of ownership.",
      },
      {
         category: "Sales leadership and closing",
         question: "What makes an executive proposal stronger in a complex opportunity?",
         options: [
            { text: "A · A data-backed business case with identified risks and how to mitigate them", correct: true },
            { text: "B · An aggressive discount with no justification", correct: false },
            { text: "C · Promising results without analyzing the client’s situation", correct: false },
         ],
         explanation: "Executive proposals rest on data, value and clear risk management.",
      },
   ],
};
