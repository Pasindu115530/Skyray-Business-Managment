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
    url: 'https://sreng.lk/gallery/img_6881031d021666.54080826.jpg',
    category: 'Projects',
    title: 'Factory Automation Project',
    description: 'Complete automation system installation',
  },
  {
    id: 'proj-2',
    url: 'https://sreng.lk/gallery/img_6748ac7f689cf0.19747301.jpeg',
    category: 'Projects',
    title: 'Industrial Power Distribution',
    description: 'Large-scale power distribution system',
  },
  {
    id: 'proj-3',
    url: 'https://sreng.lk/gallery/img_674eec3ee52a97.12848932.jpg',
    category: 'Projects',
    title: 'Manufacturing Plant Upgrade',
    description: 'Complete electrical system modernization',
  }, 
 {
    id: 'proj-4',
    url: 'https://sreng.lk/gallery/img_674eec3ee52a97.12848932.jpg',
    category: 'Projects',
    title: 'Manufacturing Plant Upgrade',
    description: 'Complete electrical system modernization',
  },
  

];
