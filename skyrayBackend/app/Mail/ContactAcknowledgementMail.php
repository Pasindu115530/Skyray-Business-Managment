<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactAcknowledgementMail extends Mailable
{
    use Queueable, SerializesModels;

    public $contactData;

    public function __construct(array $contactData)
    {
        $this->contactData = $contactData;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Thank you for contacting SkyRay Engineering Solutions',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact-acknowledgement',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
