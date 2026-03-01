<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $contactData = $request->only(['name', 'email', 'phone', 'subject', 'message']);

        try {
            $recipientEmail = config('mail.from.address');

            Mail::to($recipientEmail)->send(new ContactFormMail($contactData));

            return response()->json([
                'message' => 'Your message has been sent successfully. We will get back to you soon!'
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Contact form email failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to send message. Please try again later.'
            ], 500);
        }
    }
}
