import { FishingLocationPin } from '../types/fishing';

export const DEFAULT_FISHING_LOCATIONS: FishingLocationPin[] = [
  {
    id: 'Lake Temple',
    name: 'Lake Temple',
    category: 'Freshwater',
    x: 85,
    y: 20,
    spots: [
      {
        id: 'spot_1787400541784_zrix',
        x: 85,
        y: 20,
        label: 'Lake Temple Spot 1'
      }
    ],
    description: 'Freshwater lake located in the northeast by the Lake Temple.'
  },
  {
    id: 'Mine',
    name: 'Mine',
    category: 'Cave',
    x: 22,
    y: 22,
    spots: [
      {
        id: 'spot_1787400650665_z3fh',
        x: 22,
        y: 22,
        label: 'Mine Spot 1'
      }
    ],
    description: 'Underground pools within the Earth, Water, Wind, and Fire Mine caverns.'
  },
  {
    id: 'River Forest',
    name: 'River Forest',
    category: 'Freshwater',
    x: 29,
    y: 22,
    spots: [
      {
        id: 'spot_1787400672787_8nw2',
        x: 29,
        y: 22,
        label: 'River Forest Spot 1'
      },
      {
        id: 'spot_1787400676517_5zmx',
        x: 19,
        y: 29,
        label: 'River Forest Spot 2'
      }
    ],
    description: 'Freshwater river section flowing through the upper forest woodlands.'
  },
  {
    id: 'River Farm',
    name: 'River Farm',
    category: 'Freshwater',
    x: 49,
    y: 61,
    spots: [
      {
        id: 'spot_1787400734139_3gel',
        x: 49,
        y: 61,
        label: 'River Farm Spot 1'
      }
    ],
    description: 'Freshwater river running directly along your farm.'
  },
  {
    id: 'River Town',
    name: 'River Town',
    category: 'Freshwater',
    x: 67,
    y: 24,
    spots: [
      {
        id: 'spot_1787400749063_86z1',
        x: 67,
        y: 24,
        label: 'River Town Spot 1'
      },
      {
        id: 'spot_1787400751783_pjbd',
        x: 62,
        y: 16,
        label: 'River Town Spot 2'
      }
    ],
    description: 'Freshwater river sections flowing past Starlet Town.'
  },
  {
    id: 'Pond',
    name: 'Pond',
    category: 'Freshwater',
    x: 31,
    y: 70,
    spots: [
      {
        id: 'pond-farm',
        x: 31,
        y: 70,
        label: 'Farm Pond'
      },
      {
        id: 'pond-forest',
        x: 23,
        y: 46,
        label: 'Forest Pond'
      }
    ],
    description: 'Small stillwater ponds located on the farm and surrounding woodlands.'
  },
  {
    id: 'Rice Field',
    name: 'Rice Field',
    category: 'Freshwater',
    x: 41,
    y: 52,
    spots: [
      {
        id: 'rice-field-1',
        x: 41,
        y: 52,
        label: 'Farm Rice Terraces'
      }
    ],
    description: 'Flooded shallow crop paddies on the farm where specific fish dwell.'
  },
  {
    id: 'Estuary',
    name: 'Estuary',
    category: 'Freshwater',
    x: 37,
    y: 76,
    spots: [
      {
        id: 'spot_1787400759907_4vki',
        x: 37,
        y: 76,
        label: 'Estuary Spot 1'
      }
    ],
    description: 'Where the river flows into the ocean on the southern shore.'
  },
  {
    id: 'Ocean Dock',
    name: 'Ocean Dock',
    category: 'Ocean',
    x: 55,
    y: 86,
    spots: [
      {
        id: 'spot_1787400779105_uw20',
        x: 55,
        y: 86,
        label: 'Ocean Dock Spot 1'
      }
    ],
    description: 'Saltwater ocean fishing from the docks, piers, and harbor.'
  },
  {
    id: 'Ocean Beach',
    name: 'Ocean Beach',
    category: 'Ocean',
    x: 61,
    y: 77,
    spots: [
      {
        id: 'spot_1787400789124_mry8',
        x: 61,
        y: 77,
        label: 'Ocean Beach Spot 1'
      },
      {
        id: 'spot_1787400790468_fbsu',
        x: 80,
        y: 76,
        label: 'Ocean Beach Spot 2'
      }
    ],
    description: 'Saltwater ocean waters along the southern sandy beaches.'
  },
  {
    id: 'Lookout',
    name: 'Lookout',
    category: 'Ocean',
    x: 75,
    y: 57,
    spots: [
      {
        id: 'spot_1787400804404_9ev9',
        x: 75,
        y: 57,
        label: 'Lookout Spot 1'
      }
    ],
    description: 'Ocean coastline near the eastern cliffs and lookout.'
  },
  {
    id: 'Savannah',
    name: 'Savannah',
    category: 'Special',
    x: 74,
    y: 3,
    spots: [
      {
        id: 'spot_1787400820696_4np1',
        x: 74,
        y: 3,
        label: 'Savannah Spot 1'
      }
    ],
    description: 'Savannah waterholes and streams home to legendary king fish.'
  },
  {
    id: 'Deep Forest',
    name: 'Deep Forest',
    category: 'Special',
    x: 10,
    y: 50,
    spots: [
      {
        id: 'deep-forest-1',
        x: 10,
        y: 50,
        label: 'Deep Forest Spot 1'
      }
    ],
    description: 'Secluded streams and pools within the deep enchanted forest.'
  }
];

export const FISHING_LOCATIONS = DEFAULT_FISHING_LOCATIONS;
