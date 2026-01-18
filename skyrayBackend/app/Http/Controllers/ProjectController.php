<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::orderBy('created_at', 'desc')->get();
        return response()->json($projects, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'client_name' => 'required|string|max:255',
            'status' => 'required|string|in:planning,in-progress,completed,on-hold',
            'start_date' => 'required|date',
            'budget' => 'required|numeric',
            'category' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imageUrl = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            
            // Ensure directory exists
            $path = public_path('projects');
            if(!File::exists($path)) {
                File::makeDirectory($path, 0755, true);
            }

            $image->move($path, $imageName);
            $imageUrl = url('projects/' . $imageName);
        }

        $project = Project::create([
            'title' => $request->title,
            'description' => $request->description,
            'client_name' => $request->client_name,
            'status' => $request->status,
            'start_date' => $request->start_date,
            'budget' => $request->budget,
            'category' => $request->category,
            'image_url' => $imageUrl,
        ]);

        return response()->json(['message' => 'Project created successfully', 'data' => $project], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        if ($project->image_url) {
            $filename = basename($project->image_url);
            $path = public_path('projects/' . $filename);
            if (File::exists($path)) {
                File::delete($path);
            }
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully'], 200);
    }
}
