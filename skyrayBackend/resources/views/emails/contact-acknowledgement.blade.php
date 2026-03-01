<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Contacting Us</title>
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
            padding: 40px;
            text-align: center;
        }
        .email-header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .email-header p {
            color: rgba(255,255,255,0.9);
            margin: 10px 0 0;
            font-size: 15px;
        }
        .email-body {
            padding: 35px 40px;
        }
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 16px;
        }
        .body-text {
            font-size: 15px;
            color: #555;
            line-height: 1.7;
            margin-bottom: 20px;
        }
        .summary-box {
            background-color: #f8f9fa;
            border-left: 4px solid #D4AF37;
            padding: 20px 24px;
            border-radius: 0 8px 8px 0;
            margin: 24px 0;
        }
        .summary-box h3 {
            margin: 0 0 12px;
            color: #8B1538;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .summary-box p {
            margin: 6px 0;
            font-size: 14px;
            color: #444;
        }
        .summary-box .label {
            font-weight: 700;
            color: #333;
        }
        .contact-info {
            background: linear-gradient(135deg, #f8f9fa, #eef0f2);
            padding: 24px;
            border-radius: 8px;
            margin: 24px 0;
            text-align: center;
        }
        .contact-info p {
            margin: 6px 0;
            font-size: 14px;
            color: #555;
        }
        .contact-info a {
            color: #8B1538;
            text-decoration: none;
            font-weight: 600;
        }
        .email-footer {
            background-color: #f8f9fa;
            padding: 24px 40px;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Thank You for Reaching Out! 🙏</h1>
            <p>We have received your message</p>
        </div>

        <div class="email-body">
            <p class="greeting">Dear <strong>{{ $contactData['name'] }}</strong>,</p>

            <p class="body-text">
                Thank you for contacting <strong>SkyRay Engineering Solutions</strong>. We have received your message and our team will review it shortly. We aim to respond within <strong>24 hours</strong> during business days.
            </p>

            <div class="summary-box">
                <h3>Your Message Summary</h3>
                <p><span class="label">Subject:</span> {{ $contactData['subject'] }}</p>
                <p><span class="label">Message:</span> {{ Str::limit($contactData['message'], 150) }}</p>
            </div>

            <p class="body-text">
                In the meantime, feel free to explore our services or reach out to us directly if your matter is urgent.
            </p>

            <div class="contact-info">
                <p>📞 <a href="tel:+94766604800">+94 76 660 4800</a></p>
                <p>📧 <a href="mailto:info@sreng.lk">info@sreng.lk</a></p>
                <p>📍 No. 32, Attanagalla Road, Veyangoda</p>
            </div>

            <p class="body-text" style="text-align: center; font-size: 14px; color: #888;">
                Stay connected with us — we look forward to serving you!
            </p>
        </div>

        <div class="email-footer">
            <p>This is an automated response. Please do not reply to this email.<br>
            &copy; {{ date('Y') }} SkyRay Engineering Solutions (Pvt) Ltd. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
