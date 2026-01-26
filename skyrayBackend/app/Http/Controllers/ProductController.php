<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::orderBy('created_at', 'desc');

        if ($request->has('category') && $request->category != 'All') {
             $query->where('category', $request->category);
        }

        $products = $query->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'category' => $product->category,
                'name' => $product->name,
                'description' => $product->description,
                'image_url' => $product->image_url,
                'specifications' => $product->specifications,
                'price' => $product->price,
                'stock' => $product->stock,
                'sku' => $product->sku,
                'datasheet_path' => $product->datasheet_path,
                'created_at' => $product->created_at,
            ];
        });
        return response()->json(['data' => $products], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category' => 'required|string',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'sku' => 'nullable|string|max:255',
            'category' => 'required|string',
            'category' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            'datasheet' => 'nullable|mimes:pdf|max:10240', // 10MB max for PDF
            'specifications' => 'nullable|string', // JSON or text
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imageUrl = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            
            $path = public_path('products');
            if(!File::exists($path)) {
                File::makeDirectory($path, 0755, true);
            }

            $image->move($path, $imageName);
            $imageUrl = 'products/' . $imageName;
        }

        $datasheetPath = null;
        if ($request->hasFile('datasheet')) {
            $file = $request->file('datasheet');
            $fileName = 'datasheet_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            $path = public_path('datasheets');
            if(!File::exists($path)) {
                File::makeDirectory($path, 0755, true);
            }

            $file->move($path, $fileName);
            $datasheetPath = 'datasheets/' . $fileName;
        }

        $product = Product::create([
            'category' => $request->category,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'sku' => $request->sku,
            'image_url' => $imageUrl,
            'datasheet_path' => $datasheetPath,
            'specifications' => $request->specifications,
        ]);

        return response()->json(['message' => 'Product created successfully', 'data' => $product], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'category' => 'sometimes|required|string',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'specifications' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('image')) {
            // Delete old image
            if ($product->image_url) {
                $filename = basename($product->image_url);
                $oldPath = public_path('products/' . $filename);
                if (File::exists($oldPath)) {
                    File::delete($oldPath);
                }
            }

            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $path = public_path('products');
            $image->move($path, $imageName);
            $product->image_url = 'products/' . $imageName;
        }

        $product->update($request->only(['category', 'name', 'description', 'price', 'stock', 'sku', 'specifications']));
        if ($request->hasFile('image')) { // Ensure image_url is saved if updated
             $product->save();
        }

        return response()->json(['message' => 'Product updated successfully', 'data' => $product], 200);
    }

    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        if ($product->image_url) {
            $filename = basename($product->image_url);
            $path = public_path('products/' . $filename);
            if (File::exists($path)) {
                File::delete($path);
            }
        }

        $product->delete();
        return response()->json(['message' => 'Product deleted successfully'], 200);
    }
}
