<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class QuotationAcknowledgementMail extends Mailable
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
            subject: 'We have received your quotation request - SkyRay Engineering Solutions',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.quotation-acknowledgement',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
