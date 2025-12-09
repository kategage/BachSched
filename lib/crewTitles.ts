// Crew title assignment system - FRONT-END ONLY
// Deterministically assigns ocean-expedition themed titles based on crew member name

export const CREW_TITLES = [
  "Tide Navigator",
  "Coral Cartographer",
  "Reef Recon Officer",
  "Surface Support Specialist",
  "Current Whisperer",
  "Sea State Analyst",
  "Coastal Operations Lead",
  "Plankton Patrol",
  "Bay Watch Coordinator",
  "Deck Data Recorder",
  "Weather Window Watcher",
  "Wave Pattern Specialist",
  "Field Notes Captain",
  "Beach Landing Scout",
  "Marine Life Liaison",
  "Logbook Keeper",
  "Shoreline Safety Officer",
  "Snack & Morale Officer",
  "Sunscreen Quartermaster",
  "Celebration Steward"
];

/**
 * Deterministically assigns a crew title based on the crew member's name.
 * Uses simple hash function to ensure the same name always gets the same title.
 * NO backend modifications required - this is purely front-end.
 */
export function getCrewTitleForName(name: string): string {
  if (!name || name.trim().length === 0) {
    return "Awaiting Assignment";
  }

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash + name.charCodeAt(i)) % CREW_TITLES.length;
  }

  return CREW_TITLES[hash];
}
