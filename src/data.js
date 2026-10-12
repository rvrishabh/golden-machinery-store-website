export const BRAND = {
  name: 'Golden Machinery',
  tagline: 'Machinery works on our hand.',
  phones: ['+91 98370 70994', '+91 86500 00657'],
  whatsapp: '918650000657',
  email: 'mohakagarwal22@gmail.com',
  units: [
    { label: 'Unit 01', lines: ['7/12 Lan Gau Shala Pathwari', 'Agra, Uttar Pradesh 282004'] },
    { label: 'Unit 02', lines: ['7 Vidhya Puram, Rambagh', 'Agra, Uttar Pradesh 282004'] },
  ],
}

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'vbelt', label: 'V-Belt Pulleys' },
  { id: 'flat', label: 'Patta / Flat Belt' },
  { id: 'special', label: 'Specialty' },
]

// roll: image is shot face-on, so it can spin like a wheel while the rail scrolls
export const PRODUCTS = [
  {
    id: 'solid-v-belt',
    name: 'Solid V-Belt Pulley',
    category: 'vbelt',
    image: '/products/solid-v-belt.png',
    summary: 'Single-piece cast body with precision-turned multi-groove profile. Compact, rigid and built for high-torque motor drives.',
    features: ['One-piece cast construction', 'Multi-groove V profile', 'Bored & keyed to your shaft'],
    uses: ['Motor drives', 'Compressors', 'Pumps'],
  },
  {
    id: 'plain-v-belt',
    name: 'Plain V-Belt Pulley',
    category: 'vbelt',
    image: '/products/plain-v-belt.png',
    summary: 'The workhorse web-type V-belt pulley. Accurately matched grooves keep belts seated and running cool.',
    features: ['Web-type design', 'Matched groove angles', 'Statically balanced'],
    uses: ['General machinery', 'Fans & blowers', 'Gearbox inputs'],
  },
  {
    id: 'split-v-belt',
    name: 'Split V-Belt Pulley',
    category: 'vbelt',
    image: '/products/split-v-belt.png',
    roll: true,
    summary: 'Arm-type pulley in two halves that clamp onto the shaft. Install or replace without pulling bearings or couplings.',
    features: ['Two-piece bolted body', 'Arm-type for large diameters', 'Fast on-site replacement'],
    uses: ['Line shafts', 'Mills', 'Retrofits'],
  },
  {
    id: 'step-v-belt',
    name: 'Step V-Belt Pulley',
    category: 'vbelt',
    image: '/products/step-v-belt.png',
    summary: 'Stepped cone pulley with multiple pitch diameters, so one drive can deliver several speed ratios.',
    features: ['Multiple speed steps', 'Concentric machined steps', 'Supplied in matched pairs'],
    uses: ['Lathes', 'Drilling machines', 'Workshop drives'],
  },
  {
    id: 'bearing-v-belt',
    name: 'Bearing V-Belt Pulley',
    category: 'vbelt',
    image: '/products/bearing-v-belt.png',
    roll: true,
    summary: 'V-belt pulley with an integrated bearing seat for idler, jockey and free-running duties.',
    features: ['Machined bearing housing', 'Smooth free rotation', 'Ideal as belt tensioner'],
    uses: ['Idlers', 'Tensioners', 'Conveyors'],
  },
  {
    id: 'jutta-v-belt',
    name: 'Jutta V-Belt Pulley',
    category: 'vbelt',
    image: '/products/jutta-v-belt.png',
    summary: 'Wide-face, multi-groove heavy-duty pulley for high-power transmission in mills and crushers.',
    features: ['Heavy rim section', 'Wide multi-groove face', 'Deep, robust hub'],
    uses: ['Crushers', 'Rice & dal mills', 'Heavy drives'],
  },
  {
    id: 'crown-patta',
    name: 'Crown Patta Pulley',
    category: 'flat',
    image: '/products/crown-patta.png',
    roll: true,
    summary: 'Flat-belt pulley with a crowned face that keeps the belt tracking dead-centre at speed.',
    features: ['Crowned face for belt tracking', 'Curved spoke arms', 'Large diameters available'],
    uses: ['Flat-belt drives', 'Textile machinery', 'Agri equipment'],
  },
  {
    id: 'split-crown-patta',
    name: 'Split Crown Patta Pulley',
    category: 'flat',
    image: '/products/split-crown-patta.png',
    roll: true,
    summary: 'Two-piece crown patta pulley. Same belt tracking, mounted mid-shaft in minutes.',
    features: ['Split for easy mounting', 'Crowned face', 'Six-arm rigid body'],
    uses: ['Line shafts', 'Paper plants', 'Sugar plants'],
  },
  {
    id: 'solid-crown',
    name: 'Solid Crown Pulley',
    category: 'flat',
    image: '/products/solid-crown.png',
    summary: 'Solid-web crowned pulley for compact flat-belt drives where rigidity matters most.',
    features: ['Solid web', 'Crowned face', 'Minimal runout'],
    uses: ['Compact drives', 'Conveyors', 'Processing lines'],
  },
  {
    id: 'collar',
    name: 'Collar Pulley',
    category: 'flat',
    image: '/products/collar.png',
    summary: 'Flanged collar-type pulley that guides the belt and resists side-slip on demanding drives.',
    features: ['Flanged collar edge', 'Belt guidance', 'Machined running face'],
    uses: ['Guided drives', 'Material handling', 'Agri processing'],
  },
  {
    id: 'elevator',
    name: 'Elevator Pulley',
    category: 'special',
    image: '/products/elevator.png',
    summary: 'Cage-type wing pulley for bucket elevators and conveyors. Open slats shed material instead of trapping it.',
    features: ['Self-cleaning wing design', 'Reduces belt damage', 'Head & tail duty'],
    uses: ['Bucket elevators', 'Grain handling', 'Conveyors'],
  },
  {
    id: 'block-bearing',
    name: 'Block Bearing',
    category: 'special',
    image: '/products/block-bearing.png',
    summary: 'Cast plummer-block housings that carry and align the shaft. The quiet partner to every pulley we make.',
    features: ['Rigid cast housing', 'Split cap for servicing', 'Bolt-down base'],
    uses: ['Line shafts', 'Conveyors', 'Fans'],
  },
]

export const ADVANTAGES = [
  {
    title: 'Adherence to Standards',
    body: 'Every Golden pulley is manufactured in strict accordance with industry standards, for reliable, repeatable performance.',
  },
  {
    title: 'Precision Balance & Machining',
    body: 'Each pulley is meticulously balanced and precisely machined, so it runs smoothly and efficiently at speed.',
  },
  {
    title: 'Energy Efficiency',
    body: 'Accurately matched belts and grooves cut slip and losses, optimising power transmission and reducing energy use.',
  },
  {
    title: 'High-Quality Casting',
    body: 'We pour the best casting material available, giving every pulley a durable, robust foundation.',
  },
  {
    title: 'Minimal Runout & Wobble',
    body: 'Built to eliminate runout and wobble for stable operation, longer belt life and less wear across the drive.',
  },
]

export const INDUSTRIES = [
  { name: 'Chemical Industry', icon: 'FlaskConical' },
  { name: 'AHU Manufacturing', icon: 'Fan' },
  { name: 'Material Handling Equipment', icon: 'Forklift' },
  { name: 'Sugar Plants', icon: 'Sprout' },
  { name: 'Textile Industry', icon: 'Shirt' },
  { name: 'Dal & Rice Mill Plants', icon: 'Wheat' },
  { name: 'Crusher Industry', icon: 'Mountain' },
  { name: 'Paper Plant Industry', icon: 'ScrollText' },
  { name: 'Agri Processing Equipment', icon: 'Tractor' },
]

export const DIMENSIONS = [
  ['D', 'Outside diameter'],
  ['F', 'Face width'],
  ['L', 'Overall hub length'],
  ['L1', 'Hub length (bore side)'],
  ['L2', 'Hub projection'],
  ['HD', 'Hub diameter'],
  ['BORE', 'Shaft bore'],
]
