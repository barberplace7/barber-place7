import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';

export async function GET() {
  try {
    const galleries = await prisma.galleryImage.findMany({
      orderBy: { position: 'asc' }
    });
    
    // Return array of image URLs for landing page
    const imageUrls = galleries.map(gallery => gallery.url);
    
    return NextResponse.json(imageUrls);
  } catch (error) {
    // Return default images if database fails
    const defaultImages = [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=400&fit=crop"
    ];
    
    return NextResponse.json(defaultImages);
  }
}