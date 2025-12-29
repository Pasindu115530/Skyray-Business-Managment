export interface Product {
  id: string;
  name: string;
  category: string;
  specs: string;
  image: string;
  description: string;
}

export const productCategories = [
  {
    id: 'automation-equipment',
    title: 'Automation Equipment and Accessories',
    description: 'Complete range of industrial automation components and systems',
    icon: '⚙️',
  },
  {
    id: 'pneumatic-hydraulic',
    title: 'Pneumatic and Hydraulic Fittings and Accessories',
    description: 'High-quality fittings and components for fluid power systems',
    icon: '🔧',
  },
  {
    id: 'electrical-switchgears',
    title: 'Electrical Switchgears and Panel Accessories',
    description: 'Premium electrical distribution and control equipment',
    icon: '⚡',
  },
];

export const productsData: Product[] = [
  // Automation Equipment
  {
    id: 'plc-controller',
    name: 'Industrial PLC Controller',
    category: 'automation-equipment',
    specs: '32 I/O, Ethernet, Modbus RTU',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600',
    description: 'High-performance programmable logic controller for industrial automation',
  },
  {
    id: 'hmi-touchscreen',
    name: 'HMI Touchscreen Panel',
    category: 'automation-equipment',
    specs: '10.1" Color Display, IP65',
    image: 'https://images.unsplash.com/photo-1581092160607-ee67e0e62837?w=600',
    description: 'Advanced human-machine interface for system monitoring and control',
  },
  {
    id: 'servo-motor',
    name: 'Servo Motor Drive System',
    category: 'automation-equipment',
    specs: '3kW, 220V, Encoder Feedback',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600',
    description: 'Precision servo motor system with drive and feedback',
  },

  // Pneumatic and Hydraulic
  {
    id: 'pneumatic-valve',
    name: 'Pneumatic Solenoid Valve',
    category: 'pneumatic-hydraulic',
    specs: '5/2 Way, 24VDC, 0-10 bar',
    image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=600',
    description: 'High-quality solenoid valve for pneumatic control systems',
  },
  {
    id: 'air-cylinder',
    name: 'Pneumatic Air Cylinder',
    category: 'pneumatic-hydraulic',
    specs: 'Bore 63mm, Stroke 100mm',
    image: 'https://images.unsplash.com/photo-1581092160607-ee67e0e62837?w=600',
    description: 'Robust pneumatic cylinder for industrial applications',
  },
  {
    id: 'frl-unit',
    name: 'Air Preparation Unit (FRL)',
    category: 'pneumatic-hydraulic',
    specs: 'Filter, Regulator, Lubricator',
    image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=600',
    description: 'Complete air treatment system for pneumatic circuits',
  },

  // Electrical Switchgears
  {
    id: 'mccb-breaker',
    name: 'Molded Case Circuit Breaker',
    category: 'electrical-switchgears',
    specs: '250A, 3P, 415V, 50kA',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600',
    description: 'Heavy-duty circuit breaker for power distribution',
  },
  {
    id: 'contactor',
    name: 'Industrial Contactor',
    category: 'electrical-switchgears',
    specs: '100A, 3P+NO, 230VAC Coil',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600',
    description: 'Reliable electromagnetic contactor for motor control',
  },
  {
    id: 'panel-meter',
    name: 'Digital Panel Meter',
    category: 'electrical-switchgears',
    specs: 'Voltage, Current, Power, LCD',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600',
    description: 'Multi-function digital meter for electrical monitoring',
  },
];
