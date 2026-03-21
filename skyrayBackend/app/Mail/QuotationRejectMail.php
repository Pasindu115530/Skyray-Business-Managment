<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Quotation;

class QuotationRejectMail extends Mailable
{
    use Queueable, SerializesModels;

    public $quotation;

    public function __construct(Quotation $quotation)
    {
        $this->quotation = $quotation;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Update on your Quotation Request - SkyRay Engineering Solutions',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.quotation-reject',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
