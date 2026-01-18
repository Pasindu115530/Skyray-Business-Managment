<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class GalleryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $galleries = Gallery::orderBy('created_at', 'desc')->get();
        return response()->json($galleries, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            
            // Ensure directory exists
            $path = public_path('gallery');
            if(!File::exists($path)) {
                File::makeDirectory($path, 0755, true);
            }

            $image->move($path, $imageName);
            
            // Full URL for frontend
            $imageUrl = url('gallery/' . $imageName);

            $gallery = Gallery::create([
                'title' => $request->title,
                'description' => $request->description,
                'image_url' => $imageUrl,
                'category' => $request->category,
            ]);

            return response()->json(['message' => 'Image uploaded successfully', 'data' => $gallery], 201);
        }

        return response()->json(['message' => 'Image upload failed'], 500);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $gallery = Gallery::find($id);

        if (!$gallery) {
            return response()->json(['message' => 'Image not found'], 404);
        }

        // Extract filename from URL and delete from storage
        $filename = basename($gallery->image_url);
        $path = public_path('gallery/' . $filename);

        if (File::exists($path)) {
            File::delete($path);
        }

        $gallery->delete();

        return response()->json(['message' => 'Image deleted successfully'], 200);
    }
}
