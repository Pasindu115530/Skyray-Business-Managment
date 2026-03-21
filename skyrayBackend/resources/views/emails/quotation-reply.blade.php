<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Quotation from SkyRay</title>
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
            background: linear-gradient(135deg, #2563eb, #1e40af);
            padding: 40px;
            text-align: center;
        }
        .email-header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .email-body {
            padding: 35px 40px;
        }
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 24px;
        }
        .body-text {
            font-size: 15px;
            color: #555;
            line-height: 1.7;
            margin-bottom: 24px;
        }
        .highlight-box {
            background-color: #f0fdf4;
            border-left: 4px solid #22c55e;
            padding: 20px 24px;
            border-radius: 0 8px 8px 0;
            margin: 24px 0;
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
            color: #2563eb;
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
            <h1>Your Quotation is Ready! 📄</h1>
        </div>

        <div class="email-body">
            <p class="greeting">Dear <strong>{{ $quotation->customer_name }}</strong>,</p>

            <div class="body-text">
                {!! nl2br(e($customMessage)) !!}
            </div>

            @if($pdfPath)
            <div class="highlight-box">
                <h3 style="margin:0 0 8px; color:#166534; font-size:16px;">Attachment Included</h3>
                <p style="margin:0; color:#166534; font-size:14px;">We have attached a PDF copy of your formal quotation to this email.</p>
            </div>
            @endif

            <p class="body-text">
                If you would like to proceed with this order, or if you need any adjustments to the quote, please don't hesitate to reply directly to this email or contact us via phone.
            </p>

            <div class="contact-info">
                <p>📞 <a href="tel:+94766604800">+94 76 660 4800</a></p>
                <p>📧 <a href="mailto:info@sreng.lk">sales@sreng.lk</a></p>
                <p>📍 No. 32, Attanagalla Road, Veyangoda</p>
            </div>
        </div>

        <div class="email-footer">
            <p>&copy; {{ date('Y') }} SkyRay Engineering Solutions (Pvt) Ltd. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
