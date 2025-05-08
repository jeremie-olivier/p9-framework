export type Dimension =
  | "Honesty-Humility"
  | "Emotionality"
  | "Extraversion"
  | "Agreeableness"
  | "Conscientiousness"
  | "Openness"
  | "Adaptability";

export interface Centroid {
  dimension: Dimension;
  [slug: string]: number | string;
}

// Percentile scores for each archetype (0–100) based on HEXACO model (Ashton & Lee, 2007), Self-Determination Theory (Ryan & Deci, 2000), cognitive styles and motivation (Kruglanski et al., 2018; Cacioppo et al., 1996), and Big Five personality relevance (Costa & McCrae, 1992)
export const archetypeCentroids: Record<string, Centroid[]> = {
  visionary: [
    { dimension: "Openness", visionary: 90 }, // High openness reflects creativity and intellectual curiosity (Costa & McCrae, 1992)
    { dimension: "Extraversion", visionary: 80 }, // Elevated extraversion supports social engagement and assertiveness (Costa & McCrae, 1992)
    { dimension: "Conscientiousness", visionary: 40 }, // Moderate-low conscientiousness allows flexibility in innovative thinking (Ashton & Lee, 2007)
    { dimension: "Agreeableness", visionary: 50 }, // Balanced agreeableness facilitates collaboration without compromising vision (Ryan & Deci, 2000)
    { dimension: "Emotionality", visionary: 45 }, // Moderate emotionality relates to emotional regulation in challenging contexts (Ashton & Lee, 2007)
    { dimension: "Adaptability", visionary: 75 }, // High adaptability aligns with openness to change and cognitive flexibility (Kruglanski et al., 2018)
  ],
  innovator: [
    { dimension: "Openness", innovator: 88 }, // Strong openness supports novel idea generation (Costa & McCrae, 1992)
    { dimension: "Extraversion", innovator: 50 }, // Moderate extraversion balances social interaction and independent focus (Ryan & Deci, 2000)
    { dimension: "Conscientiousness", innovator: 85 }, // High conscientiousness reflects goal-directed persistence (Ashton & Lee, 2007)
    { dimension: "Agreeableness", innovator: 45 }, // Slightly lower agreeableness may facilitate critical evaluation (Costa & McCrae, 1992)
    { dimension: "Emotionality", innovator: 40 }, // Lower emotionality supports emotional stability in innovation processes (Ashton & Lee, 2007)
    { dimension: "Adaptability", innovator: 70 }, // Elevated adaptability encourages responsiveness to feedback (Kruglanski et al., 2018)
  ],
  commander: [
    { dimension: "Openness", commander: 55 }, // Moderate openness supports practical problem-solving (Costa & McCrae, 1992)
    { dimension: "Extraversion", commander: 90 }, // High extraversion underpins leadership and assertiveness (Ashton & Lee, 2007)
    { dimension: "Conscientiousness", commander: 92 }, // Very high conscientiousness reflects discipline and reliability (Costa & McCrae, 1992)
    { dimension: "Agreeableness", commander: 35 }, // Lower agreeableness may relate to decisiveness and task focus (Ryan & Deci, 2000)
    { dimension: "Emotionality", commander: 30 }, // Low emotionality supports emotional control in leadership (Ashton & Lee, 2007)
    { dimension: "Adaptability", commander: 60 }, // Moderate adaptability balances stability with flexibility (Kruglanski et al., 2018)
  ],
  influencer: [
    { dimension: "Openness", influencer: 65 }, // Moderate-high openness aids social creativity (Costa & McCrae, 1992)
    { dimension: "Extraversion", influencer: 88 }, // High extraversion facilitates social influence and communication (Ashton & Lee, 2007)
    { dimension: "Conscientiousness", influencer: 50 }, // Moderate conscientiousness allows spontaneity in social contexts (Ryan & Deci, 2000)
    { dimension: "Agreeableness", influencer: 90 }, // High agreeableness supports empathy and cooperation (Costa & McCrae, 1992)
    { dimension: "Emotionality", influencer: 80 }, // Elevated emotionality relates to sensitivity and emotional expressiveness (Ashton & Lee, 2007)
    { dimension: "Adaptability", influencer: 85 }, // High adaptability enables effective social adjustment (Kruglanski et al., 2018)
  ],
  strategist: [
    { dimension: "Openness", strategist: 70 }, // High openness supports abstract and strategic thinking (Costa & McCrae, 1992)
    { dimension: "Extraversion", strategist: 45 }, // Moderate-low extraversion favors introspective analysis (Ryan & Deci, 2000)
    { dimension: "Conscientiousness", strategist: 95 }, // Very high conscientiousness reflects planning and persistence (Ashton & Lee, 2007)
    { dimension: "Agreeableness", strategist: 50 }, // Balanced agreeableness allows objective decision-making (Costa & McCrae, 1992)
    { dimension: "Emotionality", strategist: 40 }, // Lower emotionality supports rational problem-solving (Ashton & Lee, 2007)
    { dimension: "Adaptability", strategist: 65 }, // Moderate adaptability facilitates adjustment to evolving strategies (Kruglanski et al., 2018)
  ],
  investigator: [
    { dimension: "Openness", investigator: 92 }, // Very high openness reflects curiosity and intellectual engagement (Costa & McCrae, 1992)
    { dimension: "Extraversion", investigator: 30 }, // Low extraversion favors solitary focus and introspection (Ryan & Deci, 2000)
    { dimension: "Conscientiousness", investigator: 75 }, // High conscientiousness supports thoroughness and reliability (Ashton & Lee, 2007)
    { dimension: "Agreeableness", investigator: 70 }, // Moderate-high agreeableness supports cooperative inquiry (Costa & McCrae, 1992)
    { dimension: "Emotionality", investigator: 55 }, // Moderate emotionality relates to sensitivity in information processing (Ashton & Lee, 2007)
    { dimension: "Adaptability", investigator: 50 }, // Balanced adaptability allows stable yet flexible cognition (Kruglanski et al., 2018)
  ],
  mediator: [
    { dimension: "Openness", mediator: 60 }, // Moderate openness supports empathy and understanding (Costa & McCrae, 1992)
    { dimension: "Extraversion", mediator: 55 }, // Moderate extraversion balances social engagement and reflection (Ryan & Deci, 2000)
    { dimension: "Conscientiousness", mediator: 65 }, // Moderate conscientiousness supports reliability with flexibility (Ashton & Lee, 2007)
    { dimension: "Agreeableness", mediator: 95 }, // Very high agreeableness reflects compassion and cooperation (Costa & McCrae, 1992)
    { dimension: "Emotionality", mediator: 88 }, // High emotionality relates to emotional sensitivity and empathy (Ashton & Lee, 2007)
    { dimension: "Adaptability", mediator: 80 }, // High adaptability facilitates conflict resolution and flexibility (Kruglanski et al., 2018)
  ],
  guardian: [
    { dimension: "Openness", guardian: 45 }, // Lower openness favors tradition and stability (Costa & McCrae, 1992)
    { dimension: "Extraversion", guardian: 40 }, // Lower extraversion supports reserved and cautious behavior (Ryan & Deci, 2000)
    { dimension: "Conscientiousness", guardian: 98 }, // Very high conscientiousness reflects dutifulness and reliability (Ashton & Lee, 2007)
    { dimension: "Agreeableness", guardian: 75 }, // High agreeableness supports loyalty and cooperation (Costa & McCrae, 1992)
    { dimension: "Emotionality", guardian: 50 }, // Moderate emotionality allows balanced emotional responsiveness (Ashton & Lee, 2007)
    { dimension: "Adaptability", guardian: 55 }, // Moderate adaptability maintains consistency with some flexibility (Kruglanski et al., 2018)
  ],
  integrator: [
    { dimension: "Openness", integrator: 65 }, // Moderate-high openness supports integrative thinking (Costa & McCrae, 1992)
    { dimension: "Extraversion", integrator: 65 }, // Moderate-high extraversion aids social integration (Ryan & Deci, 2000)
    { dimension: "Conscientiousness", integrator: 65 }, // Balanced conscientiousness supports dependability and adaptability (Ashton & Lee, 2007)
    { dimension: "Agreeableness", integrator: 65 }, // Moderate agreeableness facilitates cooperation (Costa & McCrae, 1992)
    { dimension: "Emotionality", integrator: 65 }, // Moderate emotionality supports emotional awareness and regulation (Ashton & Lee, 2007)
    { dimension: "Adaptability", integrator: 95 }, // Very high adaptability reflects strong cognitive and emotional flexibility (Kruglanski et al., 2018)
  ],
};
