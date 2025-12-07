import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function GET() {
  try {
    const galleries = await prisma.galleryImage.findMany({
      orderBy: { position: 'asc' }
    });
    return NextResponse.json(galleries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const position = parseInt(formData.get('position') as string);

    if (!file || !position) {
      return NextResponse.json({ error: 'File and position required' }, { status: 400 });
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `gallery-slot-${position}-${Date.now()}.${fileExt}`;
    const fileBuffer = await file.arrayBuffer();
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('gallery-images')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('gallery-images')
      .getPublicUrl(fileName);

    // Check if position already exists
    const existingGallery = await prisma.galleryImage.findUnique({
      where: { position }
    });

    if (existingGallery) {
      // Delete old image from storage
      if (existingGallery.filename) {
        await supabase.storage
          .from('gallery-images')
          .remove([existingGallery.filename]);
      }

      // Update existing position
      const updatedGallery = await prisma.galleryImage.update({
        where: { position },
        data: {
          url: publicUrl,
          filename: fileName
        }
      });
      return NextResponse.json(updatedGallery);
    } else {
      // Create new position
      const newGallery = await prisma.galleryImage.create({
        data: {
          position,
          url: publicUrl,
          filename: fileName
        }
      });
      return NextResponse.json(newGallery);
    }
  } catch (error: any) {
    console.error('Gallery upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload image' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const position = parseInt(searchParams.get('position') || '');

    if (!position) {
      return NextResponse.json({ error: 'Position required' }, { status: 400 });
    }

    const gallery = await prisma.galleryImage.findUnique({
      where: { position }
    });

    if (!gallery) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
    }

    // Delete from storage
    if (gallery.filename) {
      await supabase.storage
        .from('gallery-images')
        .remove([gallery.filename]);
    }

    // Delete from database
    await prisma.galleryImage.delete({
      where: { position }
    });

    return NextResponse.json({ message: 'Gallery deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete gallery' }, { status: 500 });
  }
}