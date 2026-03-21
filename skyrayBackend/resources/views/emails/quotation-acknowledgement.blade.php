<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Your Quotation Request</title>
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
            border-left: 4px solid #3b82f6;
            padding: 20px 24px;
            border-radius: 0 8px 8px 0;
            margin: 24px 0;
        }
        .summary-box h3 {
            margin: 0 0 12px;
            color: #2563eb;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            text-align: left;
            padding: 10px;
            border-bottom: 1px solid #eee;
            font-size: 14px;
        }
        th {
            background-color: #f1f5f9;
            color: #333;
            font-weight: 600;
            border-radius: 4px;
        }
        td {
            color: #555;
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
            <h1>Thank You! 📦</h1>
            <p>Your quotation request has been received</p>
        </div>

        <div class="email-body">
            <p class="greeting">Dear <strong>{{ $quotationData['contact']['fullName'] }}</strong>,</p>

            <p class="body-text">
                Thank you for requesting a quotation from <strong>SkyRay Engineering Solutions</strong>. This email is to confirm that we have received your request.
            </p>
            <p class="body-text">
                Our sales team is currently reviewing your requested items and requirements. We will prepare your customized quote and get back to you within <strong>1-2 business days</strong>.
            </p>

            <div class="summary-box">
                <h3>Requested Items</h3>
                @if(isset($quotationData['items']) && count($quotationData['items']) > 0)
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($quotationData['items'] as $item)
                            <tr>
                                <td>{{ $item['name'] }}</td>
                                <td>{{ $item['quantity'] }}</td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                @else
                    <p style="color: #777; font-size: 14px;">No items selected.</p>
                @endif
            </div>

            <p class="body-text">
                If you have any immediate questions or need to make changes to your request, please reply directly to this email or reach out to our team.
            </p>

            <div class="contact-info">
                <p>📞 <a href="tel:+94766604800">+94 76 660 4800</a></p>
                <p>📧 <a href="mailto:info@sreng.lk">sales@sreng.lk</a></p>
                <p>📍 No. 32, Attanagalla Road, Veyangoda</p>
            </div>
            
            <p class="body-text" style="text-align: center; font-size: 14px; color: #888;">
                We look forward to doing business with you!
            </p>
        </div>

        <div class="email-footer">
            <p>This is an automated response. Please do not reply to this email to add new items.<br>
            &copy; {{ date('Y') }} SkyRay Engineering Solutions (Pvt) Ltd. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
