<?php

namespace App\Http\Controllers;

use App\Mail\QuotationRequestMail;
use App\Mail\QuotationAcknowledgementMail;
use App\Mail\QuotationReplyMail;
use App\Mail\QuotationRejectMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

use App\Models\Quotation;

class QuotationController extends Controller
{
    public function index()
    {
        $quotations = Quotation::orderBy('created_at', 'desc')->get();
        return response()->json($quotations);
    }

    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'contact.fullName' => 'required|string|max:255',
            'contact.email' => 'required|email|max:255',
            'contact.phone' => 'required|string|max:50',
            'contact.message' => 'nullable|string|max:5000',
            'items' => 'required|array|min:1',
            'items.*.name' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $quotationData = $request->only(['contact', 'items']);

        // Save to Database
        $quotation = Quotation::create([
            'customer_name' => $quotationData['contact']['fullName'],
            'customer_email' => $quotationData['contact']['email'],
            'customer_phone' => $quotationData['contact']['phone'] ?? null,
            'message' => $quotationData['contact']['message'] ?? null,
            'item_details' => $quotationData['items'],
            'status' => 'pending'
        ]);

        // Add the quotation ID to the data passed to the email
        $quotationData['quotation_id'] = $quotation->id;

        try {
            $adminEmail = config('mail.from.address', 'info@sreng.lk');

            // 1. Send detailed request to Admin
            Mail::to($adminEmail)->send(new QuotationRequestMail($quotationData));

            // 2. Send acknowledgement to Customer
            Mail::to($quotationData['contact']['email'])->send(new QuotationAcknowledgementMail($quotationData));

            return response()->json([
                'message' => 'Your quotation request has been sent successfully. We will get back to you soon!',
                'quotation_id' => $quotation->id
            ], 200);

        } catch (\Exception $e) {
            Log::error('Quotation request email failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to send request email, but your request was saved. Please try again later.'
            ], 500);
        }
    }

    public function reply(Request $request, $id)
    {
        $quotation = Quotation::findOrFail($id);

        $request->validate([
            'message' => 'nullable|string',
            'pdf_file' => 'nullable|file|mimes:pdf|max:10240', // 10MB max
        ]);

        $customMessage = $request->input('message') ?: "Please find the requested quotation attached to this email. Feel free to reach out if you have any questions.";
        
        $pdfPath = null;
        if ($request->hasFile('pdf_file')) {
            $pdfPath = $request->file('pdf_file')->store('quotations', 'public');
        }

        try {
            Mail::to($quotation->customer_email)->send(new QuotationReplyMail($quotation, $customMessage, $pdfPath));

            $quotation->status = 'replied';
            $quotation->save();

            return response()->json(['message' => 'Quotation reply sent successfully.', 'quotation' => $quotation]);
        } catch (\Exception $e) {
            Log::error('Quotation reply failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to send reply.'], 500);
        }
    }

    public function reject(Request $request, $id)
    {
        $quotation = Quotation::findOrFail($id);

        try {
            Mail::to($quotation->customer_email)->send(new QuotationRejectMail($quotation));

            $quotation->status = 'rejected';
            $quotation->save();

            return response()->json(['message' => 'Quotation rejected.', 'quotation' => $quotation]);
        } catch (\Exception $e) {
            Log::error('Quotation reject failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to reject quotation.'], 500);
        }
    }
}
