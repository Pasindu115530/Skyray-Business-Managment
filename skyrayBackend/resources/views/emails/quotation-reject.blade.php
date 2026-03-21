<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update on your Quotation</title>
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
            background: linear-gradient(135deg, #1f2937, #374151);
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
        .rejection-box {
            background-color: #f8fafc;
            border-left: 4px solid #64748b;
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
            <h1>Quotation Status Update</h1>
        </div>

        <div class="email-body">
            <p class="greeting">Dear <strong>{{ $quotation->customer_name }}</strong>,</p>

            <div class="rejection-box">
                <p style="margin:0; color:#475569; font-size:15px; line-height: 1.6;">
                    Thank you for reaching out to SkyRay Engineering Solutions and requesting a quotation for our products. 
                    <br><br>
                    After carefully reviewing your requirement, we regret to inform you that we are unable to fulfill your exact request at this time. This could be due to item availability, minimum order constraints, or shipping limitations.
                </p>
            </div>

            <p class="body-text">
                Please feel free to reach out to us directly if you'd like to discuss alternative solutions or products we have in stock that might meet your needs. We truly appreciate your interest in our business.
            </p>

            <div class="contact-info">
                <p>📞 <a href="tel:+94766604800">+94 76 660 4800</a></p>
                <p>📧 <a href="mailto:info@sreng.lk">sales@sreng.lk</a></p>
                <p>📍 No. 32, Attanagalla Road, Veyangoda</p>
            </div>
            
            <p class="body-text" style="text-align: center; font-size: 14px; color: #888;">
                Thank you for understanding.<br>
                The SkyRay Team
            </p>
        </div>

        <div class="email-footer">
            <p>&copy; {{ date('Y') }} SkyRay Engineering Solutions (Pvt) Ltd. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
