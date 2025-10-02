# Email Worker

## Example

```bash
curl --request POST \
  "http://localhost:8787/cdn-cgi/handler/email?from=sender@example.com&to=recipient@example.com" \
  --header "Content-Type: text/plain" \
  --data-raw $'Received: from smtp.example.com (127.0.0.1)\r
        by cloudflare-email.com (unknown) id 4fwwffRXOpyR\r
        for <recipient@example.com>; Tue, 27 Aug 2024 15:50:20 +0000\r
From: "John" <sender@example.com>\r
Reply-To: sender@example.com\r
To: recipient@example.com\r
Subject: Testing Email Workers Local Dev\r
Content-Type: text/html; charset="windows-1252"\r
X-Mailer: Curl\r
Date: Tue, 27 Aug 2024 08:49:44 -0700\r
Message-ID: <6114391943504294873000@ZSH-GHOSTTY>\r
\r
Hi there'

```
