export interface GalleryImage {
  id: string;
  url: string;
  category: string;
  title: string;
  description: string;
}

export const galleryData: GalleryImage[] = [
  // Projects
  {
    id: 'proj-1',
    url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200',
    category: 'Projects',
    title: 'Factory Automation Project',
    description: 'Complete automation system installation',
  },
  {
    id: 'proj-2',
    url: 'https://images.unsplash.com/photo-1581092160607-ee67e0e62837?w=1200',
    category: 'Projects',
    title: 'Industrial Power Distribution',
    description: 'Large-scale power distribution system',
  },
  {
    id: 'proj-3',
    url: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=1200',
    category: 'Projects',
    title: 'Manufacturing Plant Upgrade',
    description: 'Complete electrical system modernization',
  },
  
  // Panels
  {
    id: 'panel-1',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200',
    category: 'Panels',
    title: 'Motor Control Panel',
    description: 'Custom MCC panel with VFD drives',
  },
  {
    id: 'panel-2',
    url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200',
    category: 'Panels',
    title: 'Power Distribution Board',
    description: 'Main distribution panel 1000A',
  },
  {
    id: 'panel-3',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200',
    category: 'Panels',
    title: 'PLC Control Cabinet',
    description: 'Automation control panel with HMI',
  },

  // Automation
  {
    id: 'auto-1',
    url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200',
    category: 'Automation',
    title: 'SCADA System Implementation',
    description: 'Industrial SCADA control room setup',
  },
  {
    id: 'auto-2',
    url: 'https://images.unsplash.com/photo-1581092160607-ee67e0e62837?w=1200',
    category: 'Automation',
    title: 'Conveyor System Automation',
    description: 'Automated material handling system',
  },
  {
    id: 'auto-3',
    url: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=1200',
    category: 'Automation',
    title: 'Robotic Integration',
    description: 'Industrial robot installation',
  },

  // Training
  {
    id: 'train-1',
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200',
    category: 'Training',
    title: 'PLC Programming Workshop',
    description: 'Hands-on PLC training session',
  },
  {
    id: 'train-2',
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200',
    category: 'Training',
    title: 'Electrical Safety Course',
    description: 'Industrial safety training',
  },
  {
    id: 'train-3',
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200',
    category: 'Training',
    title: 'Automation Fundamentals',
    description: 'Basic automation training',
  },

  // Installations
  {
    id: 'install-1',
    url: 'https://images.unsplash.com/photo-1581092160607-ee67e0e62837?w=1200',
    category: 'Installations',
    title: 'Transformer Installation',
    description: '1000kVA transformer setup',
  },
  {
    id: 'install-2',
    url: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=1200',
    category: 'Installations',
    title: 'Cable Tray System',
    description: 'Industrial cable management',
  },
  {
    id: 'install-3',
    url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200',
    category: 'Installations',
    title: 'Lighting Protection System',
    description: 'Complete LPS installation',
  },
];
