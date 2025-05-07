import { Question } from "../types";

export const questions: Question[] = [
  // --- HEXACO Traits (4 items each) ---
  // Honesty–Humility
  { id: "hh_1", text: "I rarely manipulate others to achieve my goals.", dimension: "Honesty-Humility" },
  { id: "hh_2", text: "I strongly value honesty, even if it's costly.", dimension: "Honesty-Humility" },
  { id: "hh_3", text: "I'm uncomfortable pretending to be something I'm not.", dimension: "Honesty-Humility" },
  { id: "hh_4", text: "I am modest about my achievements.", dimension: "Honesty-Humility" },

  // Emotionality
  { id: "emotionality_1", text: "I easily sense other people's emotions.", dimension: "Emotionality" },
  { id: "emotionality_2", text: "I frequently feel anxious or worried.", dimension: "Emotionality" },
  { id: "emotionality_3", text: "I deeply empathize with others' struggles.", dimension: "Emotionality" },
  { id: "emotionality_4", text: "I become emotional easily.", dimension: "Emotionality" },

  // Extraversion
  { id: "extraversion_1", text: "I feel energized by social activities.", dimension: "Extraversion" },
  { id: "extraversion_2", text: "I prefer being around people rather than alone.", dimension: "Extraversion" },
  { id: "extraversion_3", text: "I'm outgoing and sociable.", dimension: "Extraversion" },
  { id: "extraversion_4", text: "Social interactions make me feel good.", dimension: "Extraversion" },

  // Agreeableness
  { id: "agreeableness_1", text: "I usually forgive others quickly.", dimension: "Agreeableness" },
  { id: "agreeableness_2", text: "I find it easy to cooperate with others.", dimension: "Agreeableness" },
  { id: "agreeableness_3", text: "I avoid conflicts when possible.", dimension: "Agreeableness" },
  { id: "agreeableness_4", text: "I'm patient and understanding.", dimension: "Agreeableness" },

  // Conscientiousness
  { id: "conscientiousness_1", text: "I'm highly organized in daily life.", dimension: "Conscientiousness" },
  { id: "conscientiousness_2", text: "I plan my tasks carefully before starting.", dimension: "Conscientiousness" },
  { id: "conscientiousness_3", text: "I'm disciplined in achieving my goals.", dimension: "Conscientiousness" },
  { id: "conscientiousness_4", text: "I consistently complete tasks I start.", dimension: "Conscientiousness" },

  // Openness
  { id: "openness_1", text: "I'm fascinated by new ideas and innovations.", dimension: "Openness" },
  { id: "openness_2", text: "I actively seek out creative experiences.", dimension: "Openness" },
  { id: "openness_3", text: "I often think about abstract concepts.", dimension: "Openness" },
  { id: "openness_4", text: "I enjoy exploring unfamiliar places or topics.", dimension: "Openness" },

  // --- Cognitive Styles (4 items each) ---
  // Analytical Thinking
  { id: "analytical_1", text: "I trust my intuition more than detailed analysis.", dimension: "Analytical", reverse: true },
  { id: "analytical_2", text: "I carefully analyze situations before deciding.", dimension: "Analytical" },
  { id: "analytical_3", text: "I rely on logic more than gut feelings.", dimension: "Analytical" },
  { id: "analytical_4", text: "Creative ideas often guide my decisions.", dimension: "Analytical", reverse: true },

  // Pragmatic vs Idealistic
  { id: "pragmatic_1", text: "I value practical outcomes over ideals.", dimension: "Pragmatic" },
  { id: "pragmatic_2", text: "My decisions are grounded in reality, not dreams.", dimension: "Pragmatic" },
  { id: "pragmatic_3", text: "I prefer realism over idealism in most situations.", dimension: "Pragmatic" },
  { id: "pragmatic_4", text: "My values guide my actions more than practical results.", dimension: "Pragmatic", reverse: true },

  // Strategic vs Tactical
  { id: "strategic_1", text: "I think strategically and long-term.", dimension: "Strategic" },
  { id: "strategic_2", text: "I'm good at immediate problem-solving.", dimension: "Strategic", reverse: true },
  { id: "strategic_3", text: "I often plan years ahead.", dimension: "Strategic" },
  { id: "strategic_4", text: "I prefer quick and adaptable solutions.", dimension: "Strategic", reverse: true },

  // --- Motivational Drivers (by category) ---
  // Intrinsic Motivation
  { id: "intrinsic_autonomy", text: "I strongly value my independence and freedom.", dimension: "Intrinsic" },
  { id: "intrinsic_competence", text: "Feeling competent and skilled matters greatly to me.", dimension: "Intrinsic" },
  { id: "intrinsic_relatedness", text: "Having meaningful relationships motivates me.", dimension: "Intrinsic" },

  // Extrinsic Motivation
  { id: "extrinsic_recognition", text: "Recognition from others significantly motivates me.", dimension: "Extrinsic" },
  { id: "extrinsic_status", text: "Achieving status and success drives many of my decisions.", dimension: "Extrinsic" },
  { id: "extrinsic_security", text: "I highly value financial security.", dimension: "Extrinsic" },

  // Personal Values
  { id: "value_creativity", text: "Creativity and innovation are core parts of who I am.", dimension: "Values" },
  { id: "value_stability", text: "A stable, predictable life is essential to my happiness.", dimension: "Values" },
  { id: "value_adventure", text: "I actively seek adventure and excitement.", dimension: "Values" },
  { id: "value_community", text: "Community and relationships are central to my values.", dimension: "Values" },
  { id: "value_ethics", text: "Ethics and fairness guide most of my decisions.", dimension: "Values" },
  { id: "value_achievement", text: "Achievement and ambition strongly shape my life choices.", dimension: "Values" },

  // --- Contextual Adaptability (4 items) ---
  { id: "adaptability_1", text: "My personality changes easily depending on the situation.", dimension: "Adaptability" },
  { id: "adaptability_2", text: "I behave differently in different contexts to fit in.", dimension: "Adaptability" },
  { id: "adaptability_3", text: "People see me as consistent in most situations.", dimension: "Adaptability", reverse: true },
  { id: "adaptability_4", text: "I easily adjust to new environments.", dimension: "Adaptability" },
];
