// app/api/sharedfiles/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import SharedFileModel from '@/lib/models/SharedFile';

// GET - Fetch all shared files
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Populate sender and receiver with doctor details
    const sharedFiles = await SharedFileModel.find()
      .populate('sender', 'name email specialty')
      .populate('receiver', 'name email specialty')
      .populate({
        path: 'sender',
        populate: { path: 'specialty', select: 'name' }
      })
      .populate({
        path: 'receiver',
        populate: { path: 'specialty', select: 'name' }
      })
      .sort({ createdAt: -1 }); // Most recent first
    
    return NextResponse.json(sharedFiles);
  } catch (error) {
    console.error('Error fetching shared files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shared files' },
      { status: 500 }
    );
  }
}

// POST - Create a new shared file
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { sender, receiver, fileName, fileUrl, description } = body;
    
    // Validation
    if (!sender || !receiver || !fileName || !fileUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: sender, receiver, fileName, fileUrl' },
        { status: 400 }
      );
    }
    
    // Create new shared file
    const newSharedFile = await SharedFileModel.create({
      sender,
      receiver,
      fileName,
      fileUrl,
      description: description || ''
    });
    
    // Populate before returning
    const populatedFile = await SharedFileModel.findById(newSharedFile._id)
      .populate('sender', 'name email specialty')
      .populate('receiver', 'name email specialty')
      .populate({
        path: 'sender',
        populate: { path: 'specialty', select: 'name' }
      })
      .populate({
        path: 'receiver',
        populate: { path: 'specialty', select: 'name' }
      });
    
    return NextResponse.json(populatedFile, { status: 201 });
  } catch (error) {
    console.error('Error creating shared file:', error);
    return NextResponse.json(
      { error: 'Failed to create shared file' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a shared file (optional, for cleanup)
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');
    
    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }
    
    const deletedFile = await SharedFileModel.findByIdAndDelete(fileId);
    
    if (!deletedFile) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'File deleted successfully',
      deletedFile 
    });
  } catch (error) {
    console.error('Error deleting shared file:', error);
    return NextResponse.json(
      { error: 'Failed to delete shared file' },
      { status: 500 }
    );
  }
}