// --- SHARED PRODUCT DIRECTORY DEFAULT DATA ---
const DEFAULT_PRODUCTS = [
  // Storage & Utility
  {
    id: 'su1',
    name: 'Vessels & Buckets',
    category: 'Storage & Utility',
    description: 'High-utility storage and water-carrying vessels designed for modern living. Features matte finishing and heavy load capacity.',
    badge: 'Curated Palette',
    variants: ['5L', '10L', '15L', '20L'],
    features: ['✓ Reinforced double-rim structure', '✓ Heavy duty load capacity', '✓ UV-stabilized virgin polymer', '✓ Sturdy matte-gold steel handle'],
    images: ['assets/products/bucket-1.webp', 'assets/products/bucket-2.webp', 'assets/products/bucket-3.webp']
  },
  {
    id: 'su2',
    name: 'Canister Storage',
    category: 'Storage & Utility',
    description: 'Airtight food-safe storage containers in multiple shapes for organizing kitchen shelf goods and pantry supplies.',
    badge: 'Airtight Seals',
    variants: ['Small', 'Medium', 'Large'],
    features: ['✓ Airtight locking lids', '✓ BPA-free food-safe acrylic', '✓ Stackable space-saving contours', '✓ Easy-to-clean polished body'],
    images: ['assets/products/storage-container-1.webp', 'assets/products/storage-container-2.webp', 'assets/products/storage-container-3.webp']
  },
  {
    id: 'su5',
    name: 'Apothecary Water Basins',
    category: 'Storage & Utility',
    description: 'Elevated laundry and utility basins with wide rolled handles for ease of use. Ideal for laundry rooms and linen storage.',
    badge: 'Wholesale Price',
    variants: ['Small', 'Medium', 'Large'],
    features: ['✓ Extra-thick impact-resistant walls', '✓ Reinforced ergonomic handle grips', '✓ Virgin food-grade polymer', '✓ Rigid stackable design'],
    images: ['assets/products/water-tub-1.webp', 'assets/products/water-tub-2.webp', 'assets/products/water-tub-3.webp']
  },
  // Kitchen & Dining
  {
    id: 'kd1',
    name: 'Minimalist Water Carafes',
    category: 'Kitchen & Dining',
    description: 'Slimline, glass-clear hydration bottles designed for refrigerators, office desks, and dining tables.',
    badge: 'BPA Free',
    variants: ['500ml', '750ml', '1L', '2L'],
    features: ['✓ Leakproof snap-seal cap', '✓ Impact-resistant clear walls', '✓ Ergonomic hand grip structure', '✓ Odorless & toxin-free PET'],
    images: ['assets/products/water-bottle-1.webp', 'assets/products/water-bottle-2.webp', 'assets/products/water-bottle-3.webp']
  },
  {
    id: 'kd2',
    name: 'Insulated Bento Boxes',
    category: 'Kitchen & Dining',
    description: 'Sleek double-walled bento containers featuring modern clasp locks. Keeps food fresh and warm.',
    badge: 'Travel Friendly',
    variants: ['Single Tier', '2-Tier', '3-Tier'],
    features: ['✓ Thermal insulation chambers', '✓ Microwave safe container base', '✓ Leakproof gold clip seals', '✓ Interior divider trays included'],
    images: ['assets/products/lunch-box-1.webp', 'assets/products/lunch-box-2.webp', 'assets/products/lunch-box-3.webp']
  },
  {
    id: 'kd3',
    name: 'Preservation Bread Bins',
    category: 'Kitchen & Dining',
    description: 'Countertop bread keepers with integrated ventilation and smooth sliding covers to preserve baked goods freshness.',
    badge: 'Premium Finish',
    variants: ['Standard', 'Large'],
    features: ['✓ Moisture-lock freshness seal', '✓ Easy-access silent slide lid', '✓ Durable food-grade housing', '✓ Non-slip rubber bottom pads'],
    images: ['assets/products/bread-box-1.webp', 'assets/products/bread-box-2.webp', 'assets/products/bread-box-3.webp']
  },
  {
    id: 'kd4',
    name: 'Melamine Dinnerware Plates',
    category: 'Kitchen & Dining',
    description: 'Lightweight, matte-finish dinner plates with a porcelain-smooth feel. Highly resistant to chips and scratches.',
    badge: 'Chip Resistant',
    variants: ['6-inch', '8-inch', '10-inch', '12-inch'],
    features: ['✓ Shatterproof melamine polymer', '✓ Scratch-resistant matte glaze', '✓ Dishwasher safe construction', '✓ Lead-free and non-toxic base'],
    images: ['assets/products/plates-1.webp', 'assets/products/plates-2.webp', 'assets/products/plates-3.webp']
  },
  {
    id: 'kd5',
    name: 'Textured Serving Trays',
    category: 'Kitchen & Dining',
    description: 'Anti-slip serving trays with tall borders and integrated gold carry handles. Perfect for morning tea or formal dinner hosting.',
    badge: 'Serve in Style',
    variants: ['Small', 'Medium', 'Large'],
    features: ['✓ Non-slip ribbed base texture', '✓ Raised edges to prevent spills', '✓ Heat resistant sturdy frame', '✓ Stackable for flat drawer storage'],
    images: ['assets/products/tray-1.webp', 'assets/products/tray-2.webp', 'assets/products/tray-3.webp']
  },
  {
    id: 'kd6',
    name: 'Citrus Manual Juicers',
    category: 'Kitchen & Dining',
    description: 'Heavy-duty manual press citrus juicers with high-yield squeeze cones and integrated seed strainers.',
    badge: 'Manual Press',
    variants: ['Manual Small', 'Manual Large'],
    features: ['✓ High-yield extraction cone', '✓ Integrated pulp & seed strainer', '✓ Easy-clean modular components', '✓ Non-drip counter pour spout'],
    images: ['assets/products/juicer-2.webp', 'assets/products/juicer-3.webp']
  },
  // Cleaning Essentials
  {
    id: 'ce1',
    name: 'Microfiber Spin Mops',
    category: 'Cleaning Essentials',
    description: 'Ergonomic spin mops with dual-chamber washing buckets for effortless floor care and dust removal.',
    badge: 'Best Seller',
    variants: ['Standard', 'Heavy Duty'],
    features: ['✓ 360-degree rotating mop head', '✓ Telescopic steel control handle', '✓ Super absorbent microfiber pads', '✓ Splash-guard dry spin chamber'],
    images: ['assets/products/cleaning-mop-1.webp', 'assets/products/cleaning-mop-2.webp', 'assets/products/cleaning-mop-3.webp']
  },
  {
    id: 'ce2',
    name: 'Angled Broom Sets',
    category: 'Cleaning Essentials',
    description: 'Soft-sweeping flared indoor brooms with lightweight handles for home and lifestyle spaces.',
    badge: 'Essential',
    variants: ['Soft Bristle', 'Hard Bristle'],
    features: ['✓ High-density synthetic bristles', '✓ Angled sweep head for corners', '✓ Comfort grip long-reach handle', '✓ Split-end bristles for micro-dust'],
    images: ['assets/products/broom-1.webp', 'assets/products/broom-2.webp', 'assets/products/broom-3.webp']
  },
  {
    id: 'ce3',
    name: 'Scrub Cleaning Brushes',
    category: 'Cleaning Essentials',
    description: 'Multi-surface utility cleaning brushes with contoured rubber grips and stiff wear-resistant fibers for heavy stains.',
    badge: 'Durable Grip',
    variants: ['Soft Grip', 'Hard Scrub'],
    features: ['✓ Hard-wearing synthetic scrub fibers', '✓ Ergonomic non-slip rubber grip', '✓ Integrated corner scraping edge', '✓ Hanging hole slot for dry hooks'],
    images: ['assets/products/cleaning-brush-1.webp', 'assets/products/cleaning-brush-2.webp', 'assets/products/cleaning-brush-3.webp']
  },
  {
    id: 'ce4',
    name: 'Sleek Toilet Brushes',
    category: 'Cleaning Essentials',
    description: 'Angled washroom brushes with matching drip-free ventilated caddies. Features dense anti-bacterial bristles.',
    badge: 'Minimalist Caddy',
    variants: ['Standard', 'Double-Sided'],
    features: ['✓ Angled under-rim scrub head', '✓ Low-profile standing floor caddy', '✓ High-stiffness scrubbing fibers', '✓ Ventilated base for rapid dry'],
    images: ['assets/products/washroom-brush-1.webp', 'assets/products/washroom-brush-2.webp', 'assets/products/washroom-brush-3.webp']
  },
  {
    id: 'ce5',
    name: 'Pedal Bin Dustbins',
    category: 'Cleaning Essentials',
    description: 'Hands-free foot pedal trash bins with silent soft-close lids. Includes removable inner liners for clean emptying.',
    badge: 'Soft Close',
    variants: ['10L', '20L', '30L'],
    features: ['✓ Silent-close dampened lid', '✓ Hands-free step pedal leverage', '✓ Removable inner bucket liner', '✓ Airtight closure locks odors in'],
    images: ['assets/products/dustbin-1.webp', 'assets/products/dustbin-2.webp', 'assets/products/dustbin-3.webp']
  },
  // Bathroom Accessories
  {
    id: 'ba1',
    name: 'Self-Draining Soap Dishes',
    category: 'Bathroom Accessories',
    description: 'Minimalist wall-mounted soap savers featuring drainage slots. Crafted in durable rustproof polymer.',
    badge: 'Wall Mount',
    variants: ['Wall-Mount', 'Suction Cup'],
    features: ['✓ Rapid-drainage slotted base', '✓ Damage-free adhesive backings', '✓ Rust-proof moisture-safe resin', '✓ Polished modern accent borders'],
    images: ['assets/products/soap-holder-1.webp', 'assets/products/soap-holder-2.webp', 'assets/products/soap-holder-3.webp']
  },
  {
    id: 'ba2',
    name: 'Travel Soap Cases',
    category: 'Bathroom Accessories',
    description: 'Watertight travel cases with snap locks and internal drainage grids to keep soap bars dry on the go.',
    badge: 'Travel Pack',
    variants: ['Standard Travel', 'Large Soap'],
    features: ['✓ Heavy-duty watertight snap lock', '✓ Dual-deck internal drainage grid', '✓ Compact impact-resistant structure', '✓ Rounded corners for neat packing'],
    images: ['assets/products/soap-case-1.webp', 'assets/products/soap-case-2.webp', 'assets/products/soap-case-3.webp']
  },
  {
    id: 'ba3',
    name: 'Toothbrush Organizers',
    category: 'Bathroom Accessories',
    description: 'Wall-mounted toothbrush organizers with integrated rinse tumblers and dustproof cover lids.',
    badge: 'Space Saver',
    variants: ['Standard', 'Family Pack'],
    features: ['✓ Multi-slot toothbrush holder head', '✓ Hinged dustproof protector cover', '✓ Heavy duty wall-mount tapeer', '✓ Bottom drainage drying vents'],
    images: ['assets/products/toothbrush-holder-1.webp', 'assets/products/toothbrush-holder-2.webp', 'assets/products/toothbrush-holder-3.webp']
  },
  {
    id: 'ba4',
    name: 'HD Vanity Mirrors',
    category: 'Bathroom Accessories',
    description: 'High-definition vanity mirrors with thin moisture-resistant frames. Provides clear, distortion-free reflection.',
    badge: 'HD Clarity',
    variants: ['Small Oval', 'Medium Rect', 'Large Deluxe'],
    features: ['✓ High-definition silver glass plate', '✓ Reinforced moisture-proof backing', '✓ Lightweight mounting bracket', '✓ Minimalist neutral bezel frame'],
    images: ['assets/products/mirror-1.webp', 'assets/products/mirror-2.webp', 'assets/products/mirror-3.webp']
  },
  // Home & Garden
  {
    id: 'hg1',
    name: 'Utility Step Stools',
    category: 'Home & Garden',
    description: 'Reinforced stackable sitting and step stools with anti-skid floor pads. Extremely sturdy structural ribbing.',
    badge: 'Heavy Load',
    variants: ['Small', 'Medium', 'Large'],
    features: ['✓ Anti-skid rubber feet caps', '✓ High-load structural internal ribs', '✓ Stackable space-saving design', '✓ Center finger-grip carry hole'],
    images: ['assets/products/plastic-stool-1.webp', 'assets/products/plastic-stool-2.webp', 'assets/products/plastic-stool-3.webp']
  },
  {
    id: 'hg2',
    name: 'Woven Outdoor Mats',
    category: 'Home & Garden',
    description: 'Weatherproof woven floor mats with classic neutral borders. Highly stain-resistant and easy to clean.',
    badge: 'All Weather',
    variants: ['4x6 ft', '6x9 ft'],
    features: ['✓ Washable polypropylene weave', '✓ Water & fade resistant coating', '✓ Elegant reversible pattern', '✓ Folds flat for compact storage'],
    images: ['assets/products/mat-1.webp', 'assets/products/mat-2.webp', 'assets/products/mat-3.webp']
  },
  {
    id: 'hg3',
    name: 'Natural Coir Door Mats',
    category: 'Home & Garden',
    description: 'Welcome door mats made from natural coir fibers with rubber backings. Perfect for scraping shoes clean.',
    badge: 'Welcome Accent',
    variants: ['Standard Door', 'Large Welcome'],
    features: ['✓ High-scrape natural coir fibers', '✓ Heavy non-slip rubberized backing', '✓ Dirt & moisture containment mesh', '✓ Fade-resistant typography detail'],
    images: ['assets/products/door-mat-1.webp', 'assets/products/door-mat-2.webp', 'assets/products/door-mat-3.webp']
  },
  {
    id: 'hg4',
    name: 'Terracotta Planter Pots',
    category: 'Home & Garden',
    description: 'Decorative terracotta-style garden planters with drainage saucers. Lightweight and crack-proof polymer.',
    badge: 'UV Protected',
    variants: ['Small', 'Medium', 'Large'],
    features: ['✓ Pre-drilled bottom drainage holes', '✓ Snap-on matching water saucers', '✓ UV-protected outdoor polymer', '✓ Rolled structural rim support'],
    images: ['assets/products/plastic-pot-1.webp', 'assets/products/plastic-pot-2.webp', 'assets/products/plastic-pot-3.webp']
  },
  {
    id: 'hg5',
    name: 'Modular Shoe Racks',
    category: 'Home & Garden',
    description: 'Multi-tier shoe storage organizers with breathable fabric covers. Snaps together easily without tools.',
    badge: 'Modular Space',
    variants: ['3-Tier', '4-Tier', '5-Tier'],
    features: ['✓ Modular snap-together assembly', '✓ Ventilated shelves for airflow', '✓ Lightweight reinforced alloy tubes', '✓ Dustproof rolling fabric cover'],
    images: ['assets/products/shoe-rack-1.webp', 'assets/products/shoe-rack-2.webp', 'assets/products/shoe-rack-3.webp']
  },
  {
    id: 'hg6',
    name: 'Slender Garden Water Cans',
    category: 'Home & Garden',
    description: 'Long-spout outdoor garden watering cans with dual ergonomic handles for balanced pouring and watering.',
    badge: 'Fine Spout',
    variants: ['5L', '10L'],
    features: ['✓ Extra long watering brass spout', '✓ Ergonomic dual-handle balance', '✓ UV-proof blow-molded polymer', '✓ Removable fine sprinkler rose head'],
    images: ['assets/products/water-can-1.webp', 'assets/products/water-can-2.webp', 'assets/products/water-can-3.webp']
  }
];
