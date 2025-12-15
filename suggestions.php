<?php
$success = "";
$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  // Sanitize and validate user input
  $name = htmlspecialchars(trim($_POST["Name"]));
  $email = filter_var(trim($_POST["Email"]), FILTER_VALIDATE_EMAIL);
  $time = htmlspecialchars(trim($_POST["Time"]));
  $date = htmlspecialchars(trim($_POST["Date"]));

  // Check if email is valid
  if (!$email) {
      $error = "Invalid email address.";
  } else {
      // Set email recipient and subject
      $to = "moaz96526@gmail.com";
      $subject = "New Suggestion from $name";

      // Build the message (HTML format)
      $message = "
      <html>
      <head>
        <title>New Suggestion</title>
      </head>
      <body>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Time:</strong> $time</p>
        <p><strong>Date:</strong> $date</p>
      </body>
      </html>
      ";

      // Headers
      $headers = "From: $email\r\n";
      $headers .= "Reply-To: $email\r\n";
      $headers .= "Content-Type: text/html; charset=UTF-8\r\n"; // Sending HTML email

      // Send the email and check the result
      if (mail($to, $subject, $message, $headers)) {
          $success = "Suggestion sent successfully!";
      } else {
          $error = "Failed to send suggestion.";
      }
  }
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      @import url("assets/Otribtion.css"); /* Reset & base */
      * {
        box-sizing: border-box;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      body,
      html {
        margin: 0;
        padding: 0;
        height: 100%;
        background: #0f0f20;
        font-family: "Orbitron", "Segoe UI", sans-serif;
        color: #00fff7;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
      }
      .container {
        animation: fadeIn 0.6s ease;
        background: #111122;
        border: 2px solid #00fff7;
        border-radius: 12px;
        padding: 2.5rem 2rem 3rem;
        width: 400px;
        box-shadow: 0 0 30px #00fff7;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      h1 {
        margin-bottom: 1.5rem;
        text-shadow: 0 0 12px #00fff7;
        font-weight: 700;
        letter-spacing: 1.5px;
      }
      label {
        font-weight: 600;
        margin-bottom: 0.5rem;
        display: block;
      }
      input[type="text"],
      input[type="email"],
      input[type="time"],
      input[type="date"] {
        width: 100%;
        padding: 0.6rem 1rem;
        font-size: 1rem;
        border-radius: 8px;
        border: 1.5px solid #00fff7;
        background: #0f0f20;
        color: #00fff7;
        margin-bottom: 1rem;
        box-shadow: 0 0 15px #00fff7 inset;
        cursor: pointer;
      }
      button {
        width: 100%;
        padding: 0.75rem 1rem;
        font-size: 1.1rem;
        background: #00fff7;
        border: none;
        color: #0f0f20;
        font-weight: 700;
        border-radius: 8px;
        cursor: pointer;
        box-shadow: 0 0 20px #00fff7;
        transition: background 0.3s ease;
      }
      button:hover {
        background: #00c6b6;
      }
      .note {
        font-size: 0.85rem;
        color: #0ff;
        margin: 1rem 0 1.5rem 0;
      }
      #result {
        width: 100%;
        margin-top: 1rem;
      }
      a {
        display: inline-block;
        margin-top: 0.75rem;
        color: #0ff;
        font-weight: 600;
        text-decoration: none;
        transition: color 0.3s ease;
      }
      a:hover {
        color: #00fff7;
        text-shadow: 0 0 8px #00fff7;
      }
    </style>
    <title>Suggestions</title>
  </head>
  <body>
    <div class="container">
      <h1>Suggestions</h1>

      <?php if (!empty($success)) : ?>
        <p style="color: #0f0;"><?= htmlspecialchars($success) ?></p>
        <script>
          document.getElementById('suggestions-form').style.display = 'none';
          setTimeout(() => {
            window.location.href = 'https://codeformatstudio.github.io'; // Redirect to GitHub page after 2 seconds
          }, 2000);
        </script>
      <?php elseif (!empty($error)) : ?>
        <p style="color: #f00;"><?= htmlspecialchars($error) ?></p>
      <?php endif; ?>

      <form method="post" id="suggestions-form">
        <input
          type="text"
          name="Name"
          id="name"
          required
          placeholder="Enter Your Name: "
        />
        <input
          type="email"
          name="Email"
          id="email"
          required
          placeholder="Enter Your Email: "
        />
        <input
          type="time"
          name="Time"
          id="time"
          required
          placeholder="Enter The Time: "
        />
        <input
          type="date"
          name="Date"
          id="date"
          required
          placeholder="Enter The Date: "
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  </body>
</html>
