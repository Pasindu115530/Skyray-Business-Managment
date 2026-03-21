<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class QuotationRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public $quotationData;

    public function __construct(array $quotationData)
    {
        $this->quotationData = $quotationData;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Quotation Request from ' . ($this->quotationData['contact']['fullName'] ?? 'Unknown'),
            replyTo: [$this->quotationData['contact']['email']],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.quotation-request',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
