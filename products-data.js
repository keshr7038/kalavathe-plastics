// --- SHARED PRODUCT DIRECTORY DEFAULT DATA ---
const DEFAULT_PRODUCTS = [
  // Storage & Utility
  {
    id: 'su1',
    name: 'Buckets',
    category: 'Storage & Utility',
    description: 'Heavy duty plastic buckets, ideal for household chores and construction uses.',
    badge: 'Multiple Sizes Available',
    variants: ['5L', '10L', '15L', '20L'],
    features: ['✓ Reinforced rim', '✓ Heavy duty load capacity', '✓ UV-stabilized polymer', '✓ Sturdy metal handle'],
    images: ['assets/products/bucket-1.webp', 'assets/products/bucket-2.webp', 'assets/products/bucket-3.webp']
  },
  {
    id: 'su2',
    name: 'Storage Containers',
    category: 'Storage & Utility',
    description: 'Airtight food-safe storage containers in multiple shapes for organizing kitchen shelf goods.',
    badge: 'Popular Choice',
    variants: ['Small', 'Medium', 'Large'],
    features: ['✓ Airtight locking lids', '✓ BPA-free material', '✓ Stackable space-saving design', '✓ Easy-to-clean body'],
    images: ['assets/products/storage-container-1.webp', 'assets/products/storage-container-2.webp', 'assets/products/storage-container-3.webp']
  },

  {
    id: 'su5',
    name: 'Water Tubs',
    category: 'Storage & Utility',
    description: 'Heavy duty round plastic water tubs with sturdy handles, ideal for household use and water storage.',
    badge: 'Wholesale Product',
    variants: ['Small', 'Medium', 'Large'],
    features: ['✓ Heavy duty thick walls', '✓ Reinforced handle grips', '✓ Virgin food-grade polymer', '✓ Rigid stackable design'],
    images: ['assets/products/water-tub-1.webp', 'assets/products/water-tub-2.webp', 'assets/products/water-tub-3.webp']
  },
  // Kitchen & Dining
  {
    id: 'kd1',
    name: 'Water Bottles',
    category: 'Kitchen & Dining',
    description: 'Leakproof eco-friendly PET water bottles. Perfect for gyms, schools, and refrigerators.',
    badge: 'Best Seller',
    variants: ['500ml', '750ml', '1L', '2L'],
    features: ['✓ Leakproof snap cap', '✓ Virgin PET material', '✓ Ergonomic grip structure', '✓ Odorless & BPA-free'],
    images: ['assets/products/water-bottle-1.webp', 'assets/products/water-bottle-2.webp', 'assets/products/water-bottle-3.webp']
  },
  {
    id: 'kd2',
    name: 'Lunch Boxes',
    category: 'Kitchen & Dining',
    description: 'Multi-tier leakproof lunch boxes with thermal insulation compartments. Microwave safe.',
    badge: 'Popular Choice',
    variants: ['Single Tier', '2-Tier', '3-Tier'],
    features: ['✓ Thermal insulation', '✓ Microwave safe base', '✓ Leakproof clip seals', '✓ Divider trays included'],
    images: ['assets/products/lunch-box-1.webp', 'assets/products/lunch-box-2.webp', 'assets/products/lunch-box-3.webp']
  },
  {
    id: 'kd3',
    name: 'Bread Boxes',
    category: 'Kitchen & Dining',
    description: 'Countertop bread storage boxes with sliding lids to preserve baked goods freshness.',
    badge: 'Wholesale Product',
    variants: ['Standard', 'Large'],
    features: ['✓ Moisture-lock seal', '✓ Easy-access slide lid', '✓ Durable BPA-free poly', '✓ Non-slip bottom pads'],
    images: ['assets/products/bread-box-1.webp', 'assets/products/bread-box-2.webp', 'assets/products/bread-box-3.webp']
  },
  {
    id: 'kd4',
    name: 'Plates',
    category: 'Kitchen & Dining',
    description: 'Unbreakable lightweight polymer dining plates with a scratch-resistant matte finish.',
    badge: 'Bulk Orders Available',
    variants: ['6-inch', '8-inch', '10-inch', '12-inch'],
    features: ['✓ Unbreakable premium polymer', '✓ Scratch-resistant matte finish', '✓ Dishwasher safe base', '✓ Food-safe virgin plastic'],
    images: ['assets/products/plates-1.webp', 'assets/products/plates-2.webp', 'assets/products/plates-3.webp']
  },
  {
    id: 'kd5',
    name: 'Trays',
    category: 'Kitchen & Dining',
    description: 'Non-slip restaurant serving trays with ribbed bases and reinforced carry edges.',
    badge: 'Wholesale Product',
    variants: ['Small', 'Medium', 'Large'],
    features: ['✓ Non-slip ribbed base', '✓ Reinforced carry edges', '✓ Heat resistant polymer', '✓ Stackable for storage'],
    images: ['assets/products/tray-1.webp', 'assets/products/tray-2.webp', 'assets/products/tray-3.webp']
  },
  {
    id: 'kd6',
    name: 'Juicers',
    category: 'Kitchen & Dining',
    description: 'Manual press citrus juicers with high-yield squeeze cones and integrated seed strainers.',
    badge: 'Popular Choice',
    variants: ['Manual Small', 'Manual Large'],
    features: ['✓ High-yield press cone', '✓ Integrated seed strainer', '✓ Easy to clean parts', '✓ Non-drip pour spout'],
    images: ['assets/products/juicer-2.webp', 'assets/products/juicer-3.webp']
  },
  // Cleaning Essentials
  {
    id: 'ce1',
    name: 'Cleaning Mops',
    category: 'Cleaning Essentials',
    description: '360-degree rotating microfiber mops with telescopic steel handles for easy wet/dry floor scrub.',
    badge: 'Best Seller',
    variants: ['Standard', 'Heavy Duty'],
    features: ['✓ 360-degree rotating head', '✓ Telescopic steel handle', '✓ Super absorbent microfiber', '✓ Splash guard bucket fit'],
    images: ['assets/products/cleaning-mop-1.webp', 'assets/products/cleaning-mop-2.webp', 'assets/products/cleaning-mop-3.webp']
  },
  {
    id: 'ce2',
    name: 'Brooms',
    category: 'Cleaning Essentials',
    description: 'Heavy duty high-density bristle sweeping brooms with long handles for home and commercial cleaning.',
    badge: 'Wholesale Product',
    variants: ['Soft Bristle', 'Hard Bristle'],
    features: ['✓ High-density sweeps', '✓ Extra wide sweep head', '✓ Comfort grip long handle', '✓ Split-end bristles for dust'],
    images: ['assets/products/broom-1.webp', 'assets/products/broom-2.webp', 'assets/products/broom-3.webp']
  },
  {
    id: 'ce3',
    name: 'Cleaning Brushes',
    category: 'Cleaning Essentials',
    description: 'Ergonomic hand-held scrubbing brushes with stiff wear-resistant fibers for heavy-duty stains.',
    badge: 'Bulk Orders Available',
    variants: ['Soft Grip', 'Hard Scrub'],
    features: ['✓ Durable scrub bristles', '✓ Ergonomic hand grip', '✓ Wear-resistant fibers', '✓ Multi-surface suitable'],
    images: ['assets/products/cleaning-brush-1.webp', 'assets/products/cleaning-brush-2.webp', 'assets/products/cleaning-brush-3.webp']
  },
  {
    id: 'ce4',
    name: 'Washroom Brushes',
    category: 'Cleaning Essentials',
    description: 'Curved rim scrubber washroom brushes with floor storage containers. Anti-bacterial bristles.',
    badge: 'Popular Choice',
    variants: ['Standard', 'Double-Sided'],
    features: ['✓ Curved rim scrub head', '✓ Wall-mountable holder include', '✓ Heavy duty scrubbing fibers', '✓ Quick-dry ventilated cup'],
    images: ['assets/products/washroom-brush-1.webp', 'assets/products/washroom-brush-2.webp', 'assets/products/washroom-brush-3.webp']
  },
  {
    id: 'ce5',
    name: 'Dustbins',
    category: 'Cleaning Essentials',
    description: 'Hands-free foot pedal dustbins with odor-seal clamping lids. Includes removable inner buckets.',
    badge: 'Multiple Sizes Available',
    variants: ['10L', '20L', '30L'],
    features: ['✓ Hands-free foot pedal', '✓ Odor-seal clamping lid', '✓ Removable inner bucket', '✓ Heavy-duty pedal hinge'],
    images: ['assets/products/dustbin-1.webp', 'assets/products/dustbin-2.webp', 'assets/products/dustbin-3.webp']
  },
  // Bathroom Accessories
  {
    id: 'ba1',
    name: 'Soap Holders',
    category: 'Bathroom Accessories',
    description: 'Slotted self-draining wall soap holders with adhesive pads. Durable polymer body.',
    badge: 'Wholesale Product',
    variants: ['Wall-Mount', 'Suction Cup'],
    features: ['✓ Self-draining slotted base', '✓ Strong suction adhesion', '✓ Rust-proof ABS polymer', '✓ Sleek chrome accents'],
    images: ['assets/products/soap-holder-1.webp', 'assets/products/soap-holder-2.webp', 'assets/products/soap-holder-3.webp']
  },
  {
    id: 'ba2',
    name: 'Soap Cases',
    category: 'Bathroom Accessories',
    description: 'Travel soap cases with snaps and internal draining racks to keep soap bars dry on the go.',
    badge: 'Popular Choice',
    variants: ['Standard Travel', 'Large Soap'],
    features: ['✓ Tight snap travel lid', '✓ Double-deck dry tray', '✓ Compact heavy duty design', '✓ Rounded corners'],
    images: ['assets/products/soap-case-1.webp', 'assets/products/soap-case-2.webp', 'assets/products/soap-case-3.webp']
  },
  {
    id: 'ba3',
    name: 'Toothbrush Holders',
    category: 'Bathroom Accessories',
    description: 'Multi-slot toothbrush and paste holder wall shelf with dustproof cover lid.',
    badge: 'Wholesale Product',
    variants: ['Standard', 'Family Pack'],
    features: ['✓ Multi-slot organizer head', '✓ Dustproof protective lid', '✓ Wall-mount tape included', '✓ Drainage ventilation'],
    images: ['assets/products/toothbrush-holder-1.webp', 'assets/products/toothbrush-holder-2.webp', 'assets/products/toothbrush-holder-3.webp']
  },
  {
    id: 'ba4',
    name: 'Mirrors',
    category: 'Bathroom Accessories',
    description: 'HD distortion-free wall mirror with moisture-resistant backing frame. Oval and rectangular shapes.',
    badge: 'Best Seller',
    variants: ['Small Oval', 'Medium Rect', 'Large Deluxe'],
    features: ['✓ HD reflection plate', '✓ Reinforced wall frame', '✓ Damp-proof anti-fog backing', '✓ Lightweight mounting'],
    images: ['assets/products/mirror-1.webp', 'assets/products/mirror-2.webp', 'assets/products/mirror-3.webp']
  },
  // Home & Garden
  {
    id: 'hg1',
    name: 'Plastic Stools',
    category: 'Home & Garden',
    description: 'Compact stackable polymer stools with anti-skid bottom rubber pads. Supports high weight loads.',
    badge: 'Best Seller',
    variants: ['Small', 'Medium', 'Large'],
    features: ['✓ Anti-skid rubber base pads', '✓ Heavy load polymer ribbing', '✓ Stackable space-saving frame', '✓ Ventilation hole design'],
    images: ['assets/products/plastic-stool-1.webp', 'assets/products/plastic-stool-2.webp', 'assets/products/plastic-stool-3.webp']
  },
  {
    id: 'hg2',
    name: 'Mats',
    category: 'Home & Garden',
    description: 'Stain-resistant poly mat rolls, easy to clean. Perfect for floor seating and large events.',
    badge: 'Wholesale Product',
    variants: ['4x6 ft', '6x9 ft'],
    features: ['✓ Washable polypropylene weave', '✓ Water & stain resistant', '✓ Reversible elegant pattern', '✓ Lightweight folding design'],
    images: ['assets/products/mat-1.webp', 'assets/products/mat-2.webp', 'assets/products/mat-3.webp']
  },
  {
    id: 'hg3',
    name: 'Door Mats',
    category: 'Home & Garden',
    description: 'High-scraping coarse door mats with non-slip heavy-duty rubber backings for home entryways.',
    badge: 'Popular Choice',
    variants: ['Standard Door', 'Large Welcome'],
    features: ['✓ High-scrape coir design', '✓ Heavy duty rubber bottom', '✓ Mud & dust trapper mesh', '✓ Stain-proof poly fibers'],
    images: ['assets/products/door-mat-1.webp', 'assets/products/door-mat-2.webp', 'assets/products/door-mat-3.webp']
  },
  {
    id: 'hg4',
    name: 'Plastic Pots',
    category: 'Home & Garden',
    description: 'Lightweight crack-proof garden flower pots with bottom drainage and UV-resistant outdoor coating.',
    badge: 'Multiple Sizes Available',
    variants: ['Small', 'Medium', 'Large'],
    features: ['✓ Bottom drainage outlets', '✓ UV-resistant outdoor colors', '✓ Lightweight crack-proof body', '✓ Rolled rim carry support'],
    images: ['assets/products/plastic-pot-1.webp', 'assets/products/plastic-pot-2.webp', 'assets/products/plastic-pot-3.webp']
  },
  {
    id: 'hg5',
    name: 'Shoe Racks',
    category: 'Home & Garden',
    description: 'Washable modular shoe racks, easy assembly without tools. Open airflow frame.',
    badge: 'Bulk Orders Available',
    variants: ['3-Tier', '4-Tier', '5-Tier'],
    features: ['✓ Easy snap-together assembly', '✓ Washable ventilated shelves', '✓ Lightweight sturdy structure', '✓ Modular expandable layout'],
    images: ['assets/products/shoe-rack-1.webp', 'assets/products/shoe-rack-2.webp', 'assets/products/shoe-rack-3.webp']
  },
  {
    id: 'hg6',
    name: 'Water Cans',
    category: 'Home & Garden',
    description: 'Long-spout outdoor garden watering cans with dual ergonomic handles for balanced pouring.',
    badge: 'Popular Choice',
    variants: ['5L', '10L'],
    features: ['✓ Extra long watering spout', '✓ Ergonomic dual-handle grip', '✓ Heavy-duty blow-molded poly', '✓ Removable sprinkler rose rose'],
    images: ['assets/products/water-can-1.webp', 'assets/products/water-can-2.webp', 'assets/products/water-can-3.webp']
  }
];
