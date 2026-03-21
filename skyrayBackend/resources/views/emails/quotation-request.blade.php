<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Quotation Request</title>
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
        .field-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #2563eb;
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
            border-left: 4px solid #3b82f6;
            padding: 16px 20px;
            border-radius: 0 8px 8px 0;
            margin-top: 6px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #ddd;
            font-size: 14px;
        }
        th {
            background-color: #f8f9fa;
            color: #333;
            font-weight: 600;
        }
        td {
            color: #555;
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
            <h1>📄 New Quotation Request</h1>
            <p>Someone has requested a quote from the website</p>
        </div>

        <div class="email-body">
            <h3 style="color: #333; margin-top: 0; margin-bottom: 20px;">Customer Details</h3>

            <div class="field-group">
                <div class="field-label">Full Name</div>
                <div class="field-value">{{ $quotationData['contact']['fullName'] }}</div>
            </div>

            <div class="field-group">
                <div class="field-label">Email Address</div>
                <div class="field-value"><a href="mailto:{{ $quotationData['contact']['email'] }}" style="color: #2563eb; text-decoration: none;">{{ $quotationData['contact']['email'] }}</a></div>
            </div>

            @if(!empty($quotationData['contact']['phone']))
            <div class="field-group">
                <div class="field-label">Phone Number</div>
                <div class="field-value">{{ $quotationData['contact']['phone'] }}</div>
            </div>
            @endif

            @if(!empty($quotationData['contact']['message']))
            <div class="field-group">
                <div class="field-label">Additional Message</div>
                <div class="message-box">
                    <div class="field-value">{!! nl2br(e($quotationData['contact']['message'])) !!}</div>
                </div>
            </div>
            @endif

            <h3 style="color: #333; margin-top: 30px; margin-bottom: 20px;">Requested Items</h3>

            @if(isset($quotationData['items']) && count($quotationData['items']) > 0)
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
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

        <div class="email-footer">
            <p>This email was sent from the quotation form on your website.<br>
            &copy; {{ date('Y') }} SkyRay Engineering Solutions. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
