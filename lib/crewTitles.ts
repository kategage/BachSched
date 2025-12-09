// Crew title assignment system
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
 * Uses a simple hash function to convert the name to an index.
 * The same name will always get the same title, ensuring consistency.
 *
 * @param name - The crew member's name
 * @returns A crew title from the CREW_TITLES array
 */
export function getCrewTitleForName(name: string): string {
  if (!name || name.trim().length === 0) {
    return "Awaiting Assignment";
  }

  // Simple hash function: sum character codes
  let hash = 0;
  const normalizedName = name.toLowerCase().trim();

  for (let i = 0; i < normalizedName.length; i++) {
    hash += normalizedName.charCodeAt(i);
  }

  // Use modulo to get an index within the array bounds
  const index = hash % CREW_TITLES.length;

  return CREW_TITLES[index];
}
