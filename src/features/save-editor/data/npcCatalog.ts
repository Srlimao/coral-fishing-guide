export interface NpcEntry {
  id: string;
  name: string;
  romanceable: boolean;
  birthday?: string;
  portrait?: string;
}

export const CORAL_ISLAND_NPCS: NpcEntry[] = [
  // Romanceable Bachelorettes & Bachelors
  { id: 'Aaliyah', name: 'Aaliyah', romanceable: true },
  { id: 'Alice', name: 'Alice', romanceable: true },
  { id: 'Ben', name: 'Ben', romanceable: true },
  { id: 'Charles', name: 'Charles', romanceable: true },
  { id: 'Chaem', name: 'Chaem', romanceable: true },
  { id: 'Denali', name: 'Denali', romanceable: true },
  { id: 'Eva', name: 'Eva', romanceable: true },
  { id: 'Kenny', name: 'Kenny', romanceable: true },
  { id: 'Leah', name: 'Leah', romanceable: true },
  { id: 'Lily', name: 'Lily', romanceable: true },
  { id: 'Luke', name: 'Luke', romanceable: true },
  { id: 'Macy', name: 'Macy', romanceable: true },
  { id: 'Mark', name: 'Mark', romanceable: true },
  { id: 'Millie', name: 'Millie', romanceable: true },
  { id: 'Miranjani', name: 'Miranjani', romanceable: true },
  { id: 'Nina', name: 'Nina', romanceable: true },
  { id: 'Noah', name: 'Noah', romanceable: true },
  { id: 'Pablo', name: 'Pablo', romanceable: true },
  { id: 'Rafael', name: 'Rafael', romanceable: true },
  { id: 'Raj', name: 'Raj', romanceable: true },
  { id: 'Semeru', name: 'Semeru', romanceable: true },
  { id: 'Scott', name: 'Scott', romanceable: true },
  { id: 'Suki', name: 'Suki', romanceable: true },
  { id: 'Surya', name: 'Surya', romanceable: true },
  { id: 'Theo', name: 'Theo', romanceable: true },
  { id: 'Wakuu', name: 'Wakuu', romanceable: true },
  { id: 'Yuri', name: 'Yuri', romanceable: true },
  { id: 'Zarah', name: 'Zarah', romanceable: true },

  // Townies & Non-Romanceable
  { id: 'Anne', name: 'Anne', romanceable: false },
  { id: 'Archie', name: 'Archie', romanceable: false },
  { id: 'Betty', name: 'Betty', romanceable: false },
  { id: 'Bree', name: 'Bree', romanceable: false },
  { id: 'Connor', name: 'Connor', romanceable: false },
  { id: 'Dena', name: 'Dena', romanceable: false },
  { id: 'Dipper', name: 'Dipper', romanceable: false },
  { id: 'Emily', name: 'Emily', romanceable: false },
  { id: 'Emma', name: 'Emma', romanceable: false },
  { id: 'Erika', name: 'Erika', romanceable: false },
  { id: 'Frank', name: 'Frank', romanceable: false },
  { id: 'Goddess', name: 'Goddess', romanceable: false },
  { id: 'Jack', name: 'Jack', romanceable: false },
  { id: 'Jim', name: 'Jim', romanceable: false },
  { id: 'Jocelyn', name: 'Jocelyn', romanceable: false },
  { id: 'Kira', name: 'Kira', romanceable: false },
  { id: 'Ling', name: 'Ling', romanceable: false },
  { id: 'Oliver', name: 'Oliver', romanceable: false },
  { id: 'Paul', name: 'Paul', romanceable: false },
  { id: 'Raina', name: 'Raina', romanceable: false },
  { id: 'Randy', name: 'Randy', romanceable: false },
  { id: 'Sam', name: 'Sam', romanceable: false },
  { id: 'Sunny', name: 'Sunny', romanceable: false },
  { id: 'Takeba', name: 'Takeba', romanceable: false },
  { id: 'Walter', name: 'Walter', romanceable: false },
  { id: 'Zack', name: 'Zack', romanceable: false }
];
