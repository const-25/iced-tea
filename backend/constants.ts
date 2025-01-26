const RAW_VENUES_DEFINITIONS: {venueId: number, names: string[]}[] = [
  {venueId: 1, names: ['Basement 45', 'Basement45']},
  {venueId: 2, names: ['Bold Street Coffee']},
  {venueId: 3, names: ['Maple \u0026 THYME']},
  {venueId: 4, names: ['Sizzling Skillet']},
  {venueId: 5, names: ['The Bull']},
  {venueId: 6, names: ['The Eagle']},
  {venueId: 7, names: ['The Electric Bar', 'The ElectricBar']},
  {venueId: 8, names: ['The Garrison']},
  {venueId: 9, names: ['The Ivy']},
  {venueId: 10, names: ['The Kings Arms', 'The KingsArms']},
  {venueId: 11, names: ['The Red Lion', 'The RedLion']},
  {venueId: 12, names: ['The Rooftop']},
  {venueId: 13, names: ['The Rum Shack', 'The RumShack']},
  {venueId: 14, names: ['The Ship Inn', 'The ShipInn']},
  {venueId: 15, names: ['The Velvet Table', 'The VelvetTable']}
];

export const VENUES_DEFINITIONS: {venueId: number, names: string[]}[] = RAW_VENUES_DEFINITIONS.map(({venueId, names}) => ({
  venueId,
  names: (names.flatMap((name)=>{
    if (name.startsWith('The ')) return [name, name.slice(4)];
    return name;
  })),
}));

export const VENUES_SEED: {venueId: number, name: string}[] = RAW_VENUES_DEFINITIONS.map(({venueId, names}) => ({ venueId, name: names[0] }));
