<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;
use App\Models\Quotation;

class QuotationReplyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $quotation;
    public $customMessage;
    public $pdfPath;

    public function __construct(Quotation $quotation, string $customMessage, ?string $pdfPath)
    {
        $this->quotation = $quotation;
        $this->customMessage = $customMessage;
        $this->pdfPath = $pdfPath;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Quotation from SkyRay Engineering Solutions',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.quotation-reply',
        );
    }

    public function attachments(): array
    {
        $attachments = [];
        
        if ($this->pdfPath) {
            $attachments[] = Attachment::fromStorageDisk('public', $this->pdfPath)
                    ->as('Quotation_' . str_replace(' ', '_', $this->quotation->customer_name) . '.pdf')
                    ->withMime('application/pdf');
        }

        return $attachments;
    }
}
