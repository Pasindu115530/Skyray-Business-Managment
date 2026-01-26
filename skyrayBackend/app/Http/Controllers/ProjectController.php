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
        $projects = Project::orderBy('created_at', 'desc')->get()->map(function ($project) {
            return [
                'id' => $project->id,
                'title' => $project->title,
                'client' => $project->client_name,
                'description' => $project->description,
                'completion_date' => $project->start_date,
                'status' => $project->status,
                'category' => $project->category,
                'thumbnail_path' => $project->image_url,
                'created_at' => $project->created_at,
            ];
        });
        return response()->json(['data' => $projects], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Convert empty strings to null
        $request->merge([
            'completion_date' => $request->input('completion_date') === '' ? null : $request->input('completion_date'),
            'thumbnail' => $request->hasFile('thumbnail') ? $request->file('thumbnail') : null,
        ]);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'client' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'status' => 'required|string',
            'completion_date' => 'nullable|date',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // Increased max size to 5MB to match frontend hint
        ]);

        if ($validator->fails()) {
            \Illuminate\Support\Facades\Log::error('Project Validation Failed:', $validator->errors()->toArray());
            \Illuminate\Support\Facades\Log::info('Request Data:', $request->all());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imageUrl = null;
        if ($request->hasFile('thumbnail')) {
            $image = $request->file('thumbnail');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            
            // Ensure directory exists
            $path = public_path('storage/projects'); // Changed to storage/projects to match frontend expectation likely, or public/projects
            // Frontend src is `${backendUrl}/storage/${project.thumbnail_path}`
            // So we should put it in storage/app/public/projects and link it, or public/storage/projects
            // Let's stick to public/storage/projects for now if that's how it's set up, OR better yet:
            // Standard Laravel is storage/app/public linked to public/storage.
            // Let's safe-bet on public/projects for now and adjust return path, OR try to match the expected path.
            // Frontend explicitly uses /storage/.
            
            $destinationPath = public_path('storage/projects');
             if(!File::exists($destinationPath)) {
                File::makeDirectory($destinationPath, 0755, true);
            }

            $image->move($destinationPath, $imageName);
            $imageUrl = 'projects/' . $imageName; // Relative path for storage
        }

        $project = Project::create([
            'title' => $request->title,
            'description' => $request->description,
            'client_name' => $request->client,
            'status' => $request->status,
            'start_date' => $request->completion_date, // Mapping completion_date to start_date for now
            'image_url' => $imageUrl,
            'budget' => 0, // Default
            'category' => $request->category ?? 'General',
        ]);

        // Transform for frontend
        $projectData = [
            'id' => $project->id,
            'title' => $project->title,
            'client' => $project->client_name,
            'description' => $project->description,
            'completion_date' => $project->start_date,
            'status' => $project->status,
            'thumbnail_path' => $project->image_url,
        ];

        return response()->json(['message' => 'Project created successfully', 'data' => $projectData], 201);
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
