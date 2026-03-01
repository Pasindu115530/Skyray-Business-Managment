<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f4f4f7;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .email-header {
            background: linear-gradient(135deg, #8B1538, #D4AF37);
            padding: 30px 40px;
            text-align: center;
        }
        .email-header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 22px;
            font-weight: 600;
        }
        .email-header p {
            color: rgba(255,255,255,0.85);
            margin: 8px 0 0;
            font-size: 14px;
        }
        .email-body {
            padding: 30px 40px;
        }
        .field-group {
            margin-bottom: 20px;
            border-bottom: 1px solid #f0f0f0;
            padding-bottom: 16px;
        }
        .field-group:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        .field-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #8B1538;
            font-weight: 700;
            margin-bottom: 6px;
        }
        .field-value {
            font-size: 15px;
            color: #333333;
            line-height: 1.5;
        }
        .message-box {
            background-color: #f8f9fa;
            border-left: 4px solid #D4AF37;
            padding: 16px 20px;
            border-radius: 0 8px 8px 0;
            margin-top: 6px;
        }
        .email-footer {
            background-color: #f8f9fa;
            padding: 20px 40px;
            text-align: center;
            font-size: 12px;
            color: #999999;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>📩 New Contact Form Submission</h1>
            <p>Someone has reached out via your website</p>
        </div>

        <div class="email-body">
            <div class="field-group">
                <div class="field-label">Full Name</div>
                <div class="field-value">{{ $contactData['name'] }}</div>
            </div>

            <div class="field-group">
                <div class="field-label">Email Address</div>
                <div class="field-value"><a href="mailto:{{ $contactData['email'] }}" style="color: #8B1538; text-decoration: none;">{{ $contactData['email'] }}</a></div>
            </div>

            @if(!empty($contactData['phone']))
            <div class="field-group">
                <div class="field-label">Phone Number</div>
                <div class="field-value">{{ $contactData['phone'] }}</div>
            </div>
            @endif

            <div class="field-group">
                <div class="field-label">Subject</div>
                <div class="field-value">{{ $contactData['subject'] }}</div>
            </div>

            <div class="field-group">
                <div class="field-label">Message</div>
                <div class="message-box">
                    <div class="field-value">{!! nl2br(e($contactData['message'])) !!}</div>
                </div>
            </div>
        </div>

        <div class="email-footer">
            <p>This email was sent from the contact form on your website.<br>
            &copy; {{ date('Y') }} SkyRay Engineering Solutions. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
