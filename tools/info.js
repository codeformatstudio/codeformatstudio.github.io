// --- Language Quiz Feature ---
const quizBtn = document.createElement('button');
quizBtn.textContent = 'Guess the Language!';
quizBtn.style = 'position:fixed;bottom:90px;left:10px;z-index:1000;padding:7px 15px;background:#ff00cc;color:#fff;border:none;border-radius:5px;cursor:pointer;';
document.body.appendChild(quizBtn);

let quizActive = false;
let quizAnswer = '';
let quizChances = 3;

quizBtn.onclick = startQuiz;

function startQuiz() {
  if (quizActive) return;
  quizActive = true;
  quizChances = 3;
  quizBtn.disabled = true;
  quizBtn.textContent = 'Quiz Running...';
  // Pick a random language
  const keys = Object.keys(logoData);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  quizAnswer = logoData[randomKey].name;
  // Show only the logo and info, hide the name
  logoContainer.innerHTML = `
    <h2 style="color:white; margin-bottom: 20px;" class="logo-title">???</h2>
    <img src="${logoData[randomKey].logo_url}" alt="Logo" style="max-width:120px;max-height:120px;" />
    <div style="margin-top: 25px; font-size: 16px; text-align: left; max-width: 700px; margin-inline: auto; white-space: pre-line; color: white;">${logoData[randomKey].type ? 'Type: ' + logoData[randomKey].type + '<br>' : ''}${logoData[randomKey].year_created ? 'Year: ' + logoData[randomKey].year_created + '<br>' : ''}${logoData[randomKey].creator ? 'Creator: ' + logoData[randomKey].creator + '<br>' : ''}</div>
    <div id="quizMsg" style="margin-top:20px;color:#ff00cc;font-size:18px;"></div>
    <input id="quizInput" type="text" spellcheck="true" placeholder="Your guess..." style="margin-top:20px;padding:7px 15px;border-radius:5px;border:1px solid #00ffff;font-size:16px;" />
    <button id="quizSubmit" style="margin-right:515px;padding:7px 15px;border-radius:5px;background:#00ffff;color:#222;border:none;cursor:pointer;">Submit</button>
    <div id="quizChances" style="margin-top:10px;color:#00ffff;">Chances left: 3</div>
  `;
  logoContainer.style.display = 'block';
  document.getElementById('quizInput').focus();
  document.getElementById('quizSubmit').onclick = checkQuizAnswer;
  document.getElementById('quizInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') checkQuizAnswer();
  });
}

function checkQuizAnswer() {
  const userGuess = document.getElementById('quizInput').value.trim();
  const msgDiv = document.getElementById('quizMsg');
  if (!userGuess) {
    msgDiv.textContent = 'Please enter a guess!';
    return;
  }
  if (userGuess.toLowerCase() === quizAnswer.toLowerCase()) {
    msgDiv.textContent = '🎉 Correct! The language is ' + quizAnswer + '!';
    msgDiv.style.color = '#00ff99';
    quizActive = false;
    quizBtn.disabled = false;
    quizBtn.textContent = 'Guess the Language!';
    showQuizEndModal('You won! Replay or Exit?');
    return;
  } else {
    quizChances--;
    if (quizChances > 0) {
      msgDiv.textContent = '❌ Wrong! Try again.';
      msgDiv.style.color = '#ff5555';
      document.getElementById('quizChances').textContent = 'Chances left: ' + quizChances;
    } else {
      msgDiv.textContent = '💀 Out of chances! The answer was: ' + quizAnswer;
      msgDiv.style.color = '#ff5555';
      quizActive = false;
      quizBtn.disabled = false;
      quizBtn.textContent = 'Guess the Language!';
      showQuizEndModal('You lost! Replay or Exit?');
    }
  }

// Modal for replay/exit
function showQuizEndModal(message) {
  let modal = document.getElementById('quizEndModal');
  if (modal) modal.remove();
  modal = document.createElement('div');
  modal.id = 'quizEndModal';
  modal.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:2000;';
  modal.innerHTML = `
    <div style="background:#222;padding:40px 30px;border-radius:12px;text-align:center;max-width:90vw;">
      <div style="color:#00ffff;font-size:22px;margin-bottom:20px;">${message}</div>
      <button id="quizReplayBtn" style="margin:10px 20px;padding:10px 24px;background:#00ff99;color:#222;border:none;border-radius:6px;font-size:18px;cursor:pointer;">Replay</button>
      <button id="quizExitBtn" style="margin:10px 20px;padding:10px 24px;background:#ff0055;color:#fff;border:none;border-radius:6px;font-size:18px;cursor:pointer;">Exit</button>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('quizReplayBtn').onclick = () => {
    modal.remove();
    startQuiz();
  };
  document.getElementById('quizExitBtn').onclick = () => {
    modal.remove();
    generateLogo();
  };
}
}
const logoData = {
  "CSS": {
      name: "CSS", 
      year_created: 1996,
      reason_for_creation: "To enable the separation of presentation and content, including layout, colors, and fonts.",
      how_created: "Developed by Håkon Wium Lie and Bert Bos.",
      creator: "Håkon Wium Lie",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg",
      type: "a Style Sheet Language",
      speed_calculator: "body {\n background-color: #f0f0f0;\n color: #333;\n font-family: Arial, sans-serif;\n}\n\nh1 {\n color: #0077cc;\n text-align: center;\n}",
  },
  "HTML": {
      name: "HTML",
      year_created: 1993,
      reason_for_creation: "To create a standard markup language for documents designed to be displayed in a web browser.",
      how_created: "Developed by Tim Berners-Lee at CERN.",
      creator: "Tim Berners-Lee",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
      type: "a Markup Language",
      speed_calculator: "<!DOCTYPE html>\n<html>\n<head>\n <title>Document</title>\n</head>\n<body>\n <h1>Speed calculator</h1>\n<script></script>\n</body>\n</html>",
    },
    "Python": {
      name: "Python",
      year_created: 1991,
      reason_for_creation: "To create a readable, beginner-friendly, yet powerful general-purpose programming language.",
      how_created: "Designed by Guido van Rossum with influences from ABC language, focusing on code readability and simplicity.",
      creator: "Guido van Rossum",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
      type: "a Programming Language",
      speed_calculator: "import os\nos.system('clear')\nprint(\"Python\nThe Speed Calculator\n\")\ndistance = float(input(\"Enter The Distance In Meters: \"))\ntime = float(input(\"Enter The Time In Seconds: \"))\nspeedm_per_second = distance / time\nspeedm_per_hour = speedm_per_second * 3600\nspeedk_per_hour = speedm_per_hour / 1000\nspeedmi_per_hour = speedk_per_hour * 0.621371\nprint(\"Your Speed in Meters Per Second:\", speedm_per_second)\nprint(\"Your Speed in Kilometers Per Hour:\", speedk_per_hour)\nprint(\"Your Speed in Miles Per Hour:\", speedmi_per_hour)",
    },
    "JavaScript": {
      name: "JavaScript",
      year_created: 1995,
      reason_for_creation: "To add interactivity and dynamic behavior to web pages.",
      how_created: "Developed by Brendan Eich at Netscape in just 10 days, originally called Mocha.",
      creator: "Brendan Eich",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
      type: "a Programming Language",
      speed_calculator: "let distance = parseFloat(prompt(\"Enter The Distance In Meters:\"));\nlet time = parseFloat(prompt(\"Enter The Time In Seconds:\"));\nlet speedm_per_second = distance / time;\nlet speedm_per_hour = speedm_per_second * 3600;\nlet speedk_per_hour = speedm_per_hour / 1000;\nlet speedmi_per_hour = speedk_per_hour * 0.621371;\nalert(\"Your Speed in Meters Per Second: \" + speedm_per_second);\nalert(\"Your Speed in Kilometers Per Hour: \" + speedk_per_hour);\nalert(\"Your Speed in Miles Per Hour: \" + speedmi_per_hour);"    },
    "C++": {
      name: "C++",
      year_created: 1985,
      reason_for_creation: "To extend the C programming language with object-oriented features.",
      how_created: "Created as 'C with Classes' by Bjarne Stroustrup at Bell Labs.",
      creator: "Bjarne Stroustrup",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
      type: "a Programming Language",
      speed_calculator: "#include <iostream>\nusing namespace std;\n\nvoid calculateSpeed() {\n    float distance, time;\n    system(\"clear\");\n    cout << \"  C++\"\\nThe Speed Calculator\" << endl;\n    cout << \"Enter The Distance In Meters: \";\n    cin >> distance;\n    cout << \"Enter The Time In Seconds: \";\n    cin >> time;\n\n    if (time == 0) {\n        cout << \"Time cannot be zero! Division by zero error.\" << endl;\n        return;\n    }\n\n    float speedm_per_second = distance / time;\n    float speedm_per_hour = speedm_per_second * 3600;\n    float speedk_per_hour = speedm_per_hour / 1000;\n    float speedmi_per_hour = speedk_per_hour * 0.621371;\n\n    cout << \"Your Speed in Meters Per Second: \" << speedm_per_second << endl;\n    cout << \"Your Speed in Kilometers Per Hour: \" << speedk_per_hour << endl;\n    cout << \"Your Speed in Miles Per Hour: \" << speedmi_per_hour << endl;\n}\n\nint main() {\n    char choice;\n    do {\n        calculateSpeed();\n        cout << \"Do You Want To Calculate Again? (y/n): \";\n        cin >> choice;\n    } while (choice == 'y' || choice == 'Y');\n\n    cout << \"Thank You For Using The Speed Calculator!\" << endl;\n    return 0;\n}"


    },
    "PHP": {
      name: "PHP",
      year_created: 1995,
      reason_for_creation: "To create a server-side scripting language for web development.",
      how_created: "Originally created by Rasmus Lerdorf as Personal Home Page Tools, later renamed PHP: Hypertext Preprocessor.",
      creator: "Rasmus Lerdorf",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg",
      type: "a Scripting Language",
      speed_calculator: "<?php\nsystem('clear');\necho \"PHP\\nThe Speed Calculator\n\";\n$distance = floatval(readline(\"Enter The Distance In Meters: \"));\n$time = floatval(readline(\"Enter The Time In Seconds: \"));\n$speedm_per_second = $distance / $time;\n$speedm_per_hour = $speedm_per_second * 3600;\n$speedk_per_hour = $speedm_per_hour / 1000;\n$speedmi_per_hour = $speedk_per_hour * 0.621371;\necho \"Your Speed in Meters Per Second: \" . $speedm_per_second . \"/n\";\necho \"Your Speed in Kilometers Per Hour: \" . $speedk_per_hour . \"/n\";\necho \"Your Speed in Miles Per Hour: \" . $speedmi_per_hour . \"/n\";\n?>",
    },
    "Java": {
      name: "Java",
      year_created: 1995,
      reason_for_creation: "To create a portable, platform-independent programming language.",
      how_created: "Developed by James Gosling and team at Sun Microsystems, originally called Oak.",
      creator: "James Gosling",
      logo_url: "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "import java.util.Scanner;\n\npublic class SpeedCalculator {\n\n    public static void calculateSpeed(Scanner scanner) {\n        double distance, time;\n        System.out.print(\"\\033[H\\033[2J\"); System.out.flush();\n        System.out.println(\"  Java\\nThe Speed Calculator\\n\");\n        System.out.print(\"Enter The Distance In Meters: \");\n        distance = scanner.nextDouble();\n        System.out.print(\"Enter The Time In Seconds: \");\n        time = scanner.nextDouble();\n\n        if (time == 0) {\n            System.out.println(\"Time cannot be zero! Division by zero error.\");\n            return;\n        }\n\n        double speedm_per_second = distance / time;\n        double speedm_per_hour = speedm_per_second * 3600;\n        double speedk_per_hour = speedm_per_hour / 1000;\n        double speedmi_per_hour = speedk_per_hour * 0.621371;\n\n        System.out.println(\"Your Speed in Meters Per Second: \" + speedm_per_second);\n        System.out.println(\"Your Speed in Kilometers Per Hour: \" + speedk_per_hour);\n        System.out.println(\"Your Speed in Miles Per Hour: \" + speedmi_per_hour);\n    }\n\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        char choice;\n        do {\n            calculateSpeed(scanner);\n            System.out.print(\"Do You Want To Calculate Again? (y/n): \");\n            choice = scanner.next().charAt(0);\n        } while (choice == 'y' || choice == 'Y');\n        System.out.println(\"Thank You For Using The Speed Calculator!\");\n        scanner.close();\n    }\n}",
    },
    "SQL": {
      name: "SQL",
      year_created: 1974,
      reason_for_creation: "To manage and query relational databases.",
      how_created: "Developed by IBM researchers Donald D. Chamberlin and Raymond F. Boyce.",
      creator: "Donald D. Chamberlin & Raymond F. Boyce",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png",
      type: "an SQL Dialect",
      speed_calculator: "CREATE TABLE Authors (\n    AuthorID INT PRIMARY KEY,\n    FirstName VARCHAR(50),\n    LastName VARCHAR(50),\n    BirthYear INT\n);\n\nCREATE TABLE Books (\n    BookID INT PRIMARY KEY,\n    Title VARCHAR(100),\n    AuthorID INT,\n    PublishedYear INT,\n    Genre VARCHAR(50),\n    CopiesAvailable INT,\n    FOREIGN KEY (AuthorID) REFERENCES Authors(AuthorID)\n);\n\nCREATE TABLE Members (\n    MemberID INT PRIMARY KEY,\n    FirstName VARCHAR(50),\n    LastName VARCHAR(50),\n    JoinDate DATE\n);\n\nCREATE TABLE Loans (\n    LoanID INT PRIMARY KEY,\n    BookID INT,\n    MemberID INT,\n    LoanDate DATE,\n    ReturnDate DATE,\n    FOREIGN KEY (BookID) REFERENCES Books(BookID),\n    FOREIGN KEY (MemberID) REFERENCES Members(MemberID)\n);\n\nINSERT INTO Authors VALUES (1, 'George', 'Orwell', 1903);\nINSERT INTO Authors VALUES (2, 'Jane', 'Austen', 1775);\nINSERT INTO Authors VALUES (3, 'Mark', 'Twain', 1835);\n\nINSERT INTO Books VALUES (101, '1984', 1, 1949, 'Dystopian', 3);\nINSERT INTO Books VALUES (102, 'Animal Farm', 1, 1945, 'Political satire', 5);\nINSERT INTO Books VALUES (103, 'Pride and Prejudice', 2, 1813, 'Romance', 2);\nINSERT INTO Books VALUES (104, 'Adventures of Huckleberry Finn', 3, 1884, 'Adventure', 4);\n\nINSERT INTO Members VALUES (201, 'Alice', 'Johnson', '2022-01-15');\nINSERT INTO Members VALUES (202, 'Bob', 'Smith', '2023-03-22');\n\nINSERT INTO Loans VALUES (301, 101, 201, '2023-07-01', NULL);\nINSERT INTO Loans VALUES (302, 103, 202, '2023-07-10', '2023-07-20');\n\nSELECT b.Title, a.FirstName, a.LastName\nFROM Books b\nJOIN Authors a ON b.AuthorID = a.AuthorID;\n\nSELECT Genre, COUNT(*) AS NumberOfBooks\nFROM Books\nGROUP BY Genre;\n\nSELECT m.FirstName, m.LastName, b.Title, l.LoanDate\nFROM Loans l\nJOIN Members m ON l.MemberID = m.MemberID\nJOIN Books b ON l.BookID = b.BookID\nWHERE l.ReturnDate IS NULL;\n\nSELECT Title, CopiesAvailable\nFROM Books\nORDER BY CopiesAvailable DESC;",
    },
    "MySQL": {
      name: "MySQL",
      year_created: 1995,
      reason_for_creation: "To provide a fast, reliable, and easy-to-use relational database system.",
      how_created: "Developed by MySQL AB as an open-source, client-server database.",
      creator: "MySQL AB",
      logo_url: "https://upload.wikimedia.org/wikipedia/en/d/dd/MySQL_logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "TypeScript": {
      name: "TypeScript",
      year_created: 2012,
      reason_for_creation: "To add static typing to JavaScript and improve development tooling.",
      how_created: "Developed by Microsoft, designed as a superset of JavaScript.",
      creator: "Anders Hejlsberg",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg",
      type: "a Programming Language",
      speed_calculator: "import readline from 'readline';\n\nconst rl = readline.createInterface({\n  input: process.stdin,\n  output: process.stdout\n});\n\nfunction clearConsole() {\n  process.stdout.write('\\x1Bc');\n}\n\nfunction askQuestion(query: string): Promise<string> {\n  return new Promise(resolve => rl.question(query, resolve));\n}\n\nasync function main() {\n  clearConsole();\n  console.log(\"TypeScript\\n\");\n\n  const name = await askQuestion(\"Enter Your Full Name: \");\n  clearConsole();\n\n  const email = await askQuestion(\"Enter Your Email: \");\n  if (\n    email.indexOf('@') === -1 ||\n    email.indexOf('.') === -1 ||\n    email.length < 5 ||\n    email.length > 100 ||\n    /\\s/.test(email)\n  ) {\n    console.log(\"Invalid email format. Please enter a valid email.\");\n    rl.close();\n    process.exit(1);\n  }\n  console.log(\"Email is valid.\");\n  clearConsole();\n\n  const password = await askQuestion(\"Enter Your Password: \");\n  clearConsole();\n\n  const ageStr = await askQuestion(\"Enter Your Age: \");\n  const age = Number(ageStr);\n  if (isNaN(age) || age < 0) {\n    console.log(\"Age cannot be negative. Please enter a valid age.\");\n    rl.close();\n    process.exit(1);\n  } else if (age > 120) {\n    console.log(\"Age seems unrealistic. Please enter a valid age.\");\n    rl.close();\n    process.exit(1);\n  }\n  clearConsole();\n\n  const heightStr = await askQuestion(\"Enter Your Height (in meters): \");\n  const height = Number(heightStr);\n  clearConsole();\n\n  console.log(\"TypeScript\\n\");\n  console.log(Your Name Is: ${name});\n  console.log(Your Email Is: ${email});\n  console.log(Your Password Is: ${password});\n  console.log(Your Age Is: ${age} ${age <= 2 ? \"Year Old\" : \"Years Old\"});\n  console.log(Your Height Is: ${height} ${height <= 2 ? \"Meter\" : \"Meters\"});\n\n  rl.close();\n}\n\nmain();",
    },
    "Ruby": {
    name: "Ruby",
    year_created: 1995,
    reason_for_creation: "To create a simple, elegant scripting language focused on programmer happiness.",
    how_created: "Designed and developed by Yukihiro Matsumoto (“Matz”) in Japan.",
    creator: "Yukihiro Matsumoto",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/73/Ruby_logo.svg",
    type: "a Programming Language",
    speed_calculator: "#!/usr/bin/env ruby\n\ndef clear_console\n  system('clear') || system('cls')\nend\n\ndef ask_question(prompt)\n  print(prompt)\n  gets.chomp\nend\n\nclear_console\nputs \"Ruby\\n\\n\"\n\nname = ask_question(\"Enter Your Full Name: \")\nclear_console\n\nemail = ask_question(\"Enter Your Email: \")\nunless email.match?(/\\A[^@\\s]+@[^@\\s]+\\.[^@\\s]+\\z/) && email.length.between?(5, 100)\n  puts \"Invalid email format. Please enter a valid email.\"\n  exit 1\nend\nputs \"Email is valid.\"\nclear_console\n\npassword = ask_question(\"Enter Your Password: \")\nclear_console\n\nage_str = ask_question(\"Enter Your Age: \")\nage = age_str.to_i\nif age_str !~ /^\\d+$/ || age < 0 || age > 120\n  puts \"Please enter a valid age between 0 and 120.\"\n  exit 1\nend\nclear_console\n\nheight_str = ask_question(\"Enter Your Height (in meters): \")\nheight = height_str.to_f\nclear_console\n\nputs \"Ruby\\n\\n\"\nputs \"Your Name Is: #{name}\"\nputs \"Your Email Is: #{email}\"\nputs \"Your Password Is: #{password}\"\nputs \"Your Age Is: #{age} #{age <= 2 ? \\\"Year Old\\\" : \\\"Years Old\\\"}\"\nputs \"Your Height Is: #{height} #{height <= 2 ? \\\"Meter\\\" : \\\"Meters\\\"}\"\n"
    },
    "PostgreSQL": {
      name: "PostgreSQL",
      year_created: 1996,
      reason_for_creation: "To create an advanced, open-source object-relational database system.",
      how_created: "Developed at University of California, Berkeley as a successor to Ingres.",
      creator: "PostgreSQL Global Development Group",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg",
      type: "an SQL Dialect",
      speed_calculator: "-- PostgreSQL Speed Calculator User Info Table\n\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  full_name VARCHAR(100) NOT NULL,\n  email VARCHAR(100) NOT NULL UNIQUE,\n  password TEXT NOT NULL,\n  age INT CHECK (age >= 0 AND age <= 120),\n  height_meters NUMERIC(4,2) CHECK (height_meters >= 0.2 AND height_meters <= 3.0),\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- Trigger function to validate email format\nCREATE OR REPLACE FUNCTION validate_email()\nRETURNS TRIGGER AS $$\nBEGIN\n  IF NEW.email !~ '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$' THEN\n    RAISE EXCEPTION 'Invalid email format: %', NEW.email;\n  END IF;\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\n-- Apply the trigger\nCREATE TRIGGER trg_validate_email\nBEFORE INSERT OR UPDATE ON users\nFOR EACH ROW EXECUTE FUNCTION validate_email();\n\n-- Insert a valid user\nINSERT INTO users (full_name, email, password, age, height_meters)\nVALUES (\n  'Alice Johnson',\n  'alice@example.com',\n  'securepassword123',\n  29,\n  1.65\n);\n\n-- Try inserting an invalid email (uncomment to test error)\n-- INSERT INTO users (full_name, email, password, age, height_meters)\n-- VALUES ('Bob Test', 'invalid-email', 'pass', 25, 1.75);\n\n-- Query all users\nSELECT full_name, email, age, height_meters FROM users;",
    },
    "Swift": {
      name: "Swift",
      year_created: 2014,
      reason_for_creation: "To modernize and improve iOS and macOS app development.",
      how_created: "Developed by Apple as a replacement for Objective-C.",
      creator: "Apple Inc.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Swift_logo.svg",
      type: "a Programming Language",
      speed_calculator: "// Swift Speed Calculator: User Info Console App\n\nimport Foundation\n\nfunc readLineTrimmed(prompt: String) -> String {\n    print(prompt, terminator: \" \")\n    return readLine()?.trimmingCharacters(in: .whitespacesAndNewlines) ?? \"\"\n}\n\nfunc clearConsole() {\n    print(\"\\u{001B}[2J\")\n}\n\nclearConsole()\nprint(\"Swift\\n\")\n\nlet name = readLineTrimmed(prompt: \"Enter Your Full Name:\")\nclearConsole()\n\nlet email = readLineTrimmed(prompt: \"Enter Your Email:\")\nif !email.contains(\"@\") || !email.contains(\".\") || email.count < 5 || email.count > 100 {\n    print(\"Invalid email format. Please enter a valid email.\")\n    exit(1)\n}\nprint(\"Email is valid.\")\nclearConsole()\n\nlet password = readLineTrimmed(prompt: \"Enter Your Password:\")\nclearConsole()\n\nlet ageStr = readLineTrimmed(prompt: \"Enter Your Age:\")\nguard let age = Int(ageStr), age >= 0, age <= 120 else {\n    print(\"Invalid age. Age must be between 0 and 120.\")\n    exit(1)\n}\nclearConsole()\n\nlet heightStr = readLineTrimmed(prompt: \"Enter Your Height (in meters):\")\nguard let height = Double(heightStr), height >= 0.2, height <= 3.0 else {\n    print(\"Invalid height. Must be between 0.2 and 3.0 meters.\")\n    exit(1)\n}\nclearConsole()\n\nprint(\"Swift\\n\")\nprint(\"Your Name Is: \\(name)\")\nprint(\"Your Email Is: \\(email)\")\nprint(\"Your Password Is: \\(password)\")\nprint(\"Your Age Is: \\(age) \\(age <= 2 ? \"Year Old\" : \"Years Old\")\")\nprint(\"Your Height Is: \\(height) \\(height <= 2.0 ? \"Meter\" : \"Meters\")\")",
    },
    "Go": {
      name: "Go",
      year_created: 2009,
      reason_for_creation: "To create a simple, efficient, and concurrent programming language for modern systems.",
      how_created: "Developed at Google by Robert Griesemer, Rob Pike, and Ken Thompson.",
      creator: "Robert Griesemer, Rob Pike, Ken Thompson",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/05/Go_Logo_Blue.svg",
      type: "a Programming Language",
      speed_calculator: "// Go (Golang) Speed Calculator: User Info Console App\n\npackage main\n\nimport (\n\t\"bufio\"\n\t\"fmt\"\n\t\"os\"\n\t\"regexp\"\n\t\"strconv\"\n\t\"strings\"\n)\n\nfunc main() {\n\treader := bufio.NewReader(os.Stdin)\n\tclearConsole()\n\tfmt.Println(\"Go\\n\")\n\n\tfmt.Print(\"Enter Your Full Name: \")\n\tname, _ := reader.ReadString('\\n')\n\tname = strings.TrimSpace(name)\n\tclearConsole()\n\n\tfmt.Print(\"Enter Your Email: \")\n\temail, _ := reader.ReadString('\\n')\n\temail = strings.TrimSpace(email)\n\temailRegex := regexp.MustCompile(^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$)\n\tif !emailRegex.MatchString(email) || len(email) < 5 || len(email) > 100 {\n\t\tfmt.Println(\"Invalid email format. Please enter a valid email.\")\n\t\treturn\n\t}\n\tfmt.Println(\"Email is valid.\")\n\tclearConsole()\n\n\tfmt.Print(\"Enter Your Password: \")\n\tpassword, _ := reader.ReadString('\\n')\n\tpassword = strings.TrimSpace(password)\n\tclearConsole()\n\n\tfmt.Print(\"Enter Your Age: \")\n\tageStr, _ := reader.ReadString('\\n')\n\tageStr = strings.TrimSpace(ageStr)\n\tage, err := strconv.Atoi(ageStr)\n\tif err != nil || age < 0 || age > 120 {\n\t\tfmt.Println(\"Invalid age. Please enter a valid number between 0 and 120.\")\n\t\treturn\n\t}\n\tclearConsole()\n\n\tfmt.Print(\"Enter Your Height (in meters): \")\n\theightStr, _ := reader.ReadString('\\n')\n\theightStr = strings.TrimSpace(heightStr)\n\theight, err := strconv.ParseFloat(heightStr, 64)\n\tif err != nil || height < 0.2 || height > 3.0 {\n\t\tfmt.Println(\"Invalid height. Must be between 0.2 and 3.0 meters.\")\n\t\treturn\n\t}\n\tclearConsole()\n\n\tfmt.Println(\"Go\\n\")\n\tfmt.Println(\"Your Name Is:\", name)\n\tfmt.Println(\"Your Email Is:\", email)\n\tfmt.Println(\"Your Password Is:\", password)\n\tfmt.Printf(\"Your Age Is: %d %s\\n\", age, ternary(age <= 2, \"Year Old\", \"Years Old\"))\n\tfmt.Printf(\"Your Height Is: %.2f %s\\n\", height, ternaryFloat(height <= 2.0, \"Meter\", \"Meters\"))\n}\n\nfunc clearConsole() {\n\tfmt.Print(\"\\033[H\\033[2J\")\n}\n\nfunc ternary(cond bool, a, b string) string {\n\tif cond {\n\t\treturn a\n\t}\n\treturn b\n}\n\nfunc ternaryFloat(cond bool, a, b string) string {\n\tif cond {\n\t\treturn a\n\t}\n\treturn b\n}",
    },
    "Kotlin": {
      name: "Kotlin",
      year_created: 2011,
      reason_for_creation: "To provide a modern, concise, and safe alternative to Java for JVM and Android development.",
      how_created: "Developed by JetBrains.",
      creator: "JetBrains",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/74/Kotlin_Icon.png",
      type: "a Programming Language",
      speed_calculator: "// Kotlin Speed Calculator: User Info Console App\n\nfun clearConsole() {\n    print(\"\\u001b[H\\u001b[2J\")\n    System.out.flush()\n}\n\nfun main() {\n    val reader = System.in.bufferedReader()\n    clearConsole()\n    println(\"Kotlin\\n\")\n\n    print(\"Enter Your Full Name: \")\n    val name = reader.readLine().trim()\n    clearConsole()\n\n    print(\"Enter Your Email: \")\n    val email = reader.readLine().trim()\n    if (!email.contains(\"@\") || !email.contains(\".\") || email.length !in 5..100 || email.contains(\" \")) {\n        println(\"Invalid email format. Please enter a valid email.\")\n        return\n    }\n    println(\"Email is valid.\")\n    clearConsole()\n\n    print(\"Enter Your Password: \")\n    val password = reader.readLine().trim()\n    clearConsole()\n\n    print(\"Enter Your Age: \")\n    val ageStr = reader.readLine().trim()\n    val age = ageStr.toIntOrNull()\n    if (age == null || age < 0 || age > 120) {\n        println(\"Invalid age. Please enter a number between 0 and 120.\")\n        return\n    }\n    clearConsole()\n\n    print(\"Enter Your Height (in meters): \")\n    val heightStr = reader.readLine().trim()\n    val height = heightStr.toDoubleOrNull()\n    if (height == null || height < 0.2 || height > 3.0) {\n        println(\"Invalid height. Please enter a number between 0.2 and 3.0 meters.\")\n        return\n    }\n    clearConsole()\n\n    println(\"Kotlin\\n\")\n    println(\"Your Name Is: $name\")\n    println(\"Your Email Is: $email\")\n    println(\"Your Password Is: $password\")\n    println(\"Your Age Is: $age ${if (age <= 2) \"Year Old\" else \"Years Old\"}\")\n    println(\"Your Height Is: $height ${if (height <= 2.0) \"Meter\" else \"Meters\"}\")\n}",
    },
    "Scala": {
      name: "Scala",
      year_created: 2004,
      reason_for_creation: "To combine object-oriented and functional programming in a concise language on the JVM.",
      how_created: "Created by Martin Odersky.",
      creator: "Martin Odersky",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/39/Scala-full-color.svg",
      type: "a Programming Language",
      speed_calculator: "// Scala Speed Calculator: Console App\n\nimport scala.io.StdIn._\n\nobject ScalaSpeedCalculator {\n  def clearConsole(): Unit = {\n    print(\"\\u001b[H\\u001b[2J\")\n    Console.flush()\n  }\n\n  def main(args: Array[String]): Unit = {\n    clearConsole()\n    println(\"Scala\\n\")\n\n    print(\"Enter Your Full Name: \")\n    val name = readLine().trim\n    clearConsole()\n\n    print(\"Enter Your Email: \")\n    val email = readLine().trim\n    val validEmail = email.contains(\"@\") && email.contains(\".\") && email.length >= 5 && email.length <= 100 && !email.exists(_.isWhitespace)\n    if (!validEmail) {\n      println(\"Invalid email format. Please enter a valid email.\")\n      return\n    }\n    println(\"Email is valid.\")\n    clearConsole()\n\n    print(\"Enter Your Password: \")\n    val password = readLine().trim\n    clearConsole()\n\n    print(\"Enter Your Age: \")\n    val ageInput = readLine().trim\n    val age = try ageInput.toInt catch { case _: NumberFormatException => -1 }\n    if (age < 0 || age > 120) {\n      println(\"Invalid age. Must be between 0 and 120.\")\n      return\n    }\n    clearConsole()\n\n    print(\"Enter Your Height (in meters): \")\n    val heightInput = readLine().trim\n    val height = try heightInput.toDouble catch { case _: NumberFormatException => -1.0 }\n    if (height < 0.2 || height > 3.0) {\n      println(\"Invalid height. Must be between 0.2 and 3.0 meters.\")\n      return\n    }\n    clearConsole()\n\n    println(\"Scala\\n\")\n    println(s\"Your Name Is: $name\")\n    println(s\"Your Email Is: $email\")\n    println(s\"Your Password Is: $password\")\n    println(s\"Your Age Is: $age ${if (age <= 2) \"Year Old\" else \"Years Old\"}\")\n    println(f\"Your Height Is: $height%.2f ${if (height <= 2.0) \"Meter\" else \"Meters\"}\")\n  }\n}",
    },
    "Lua": {
      name: "Lua",
      year_created: 1993,
      reason_for_creation: "To provide a lightweight scripting language for embedded use.",
      how_created: "Developed by Roberto Ierusalimschy, Luiz Henrique de Figueiredo, and Waldemar Celes in Brazil.",
      creator: "Roberto Ierusalimschy, Luiz Henrique de Figueiredo, Waldemar Celes",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Lua-Logo.svg",
      type: "a Programming Language",
      speed_calculator: "-- Lua Speed Calculator: Console Input App\n\nfunction clear_console()\n  os.execute(\"clear\") or os.execute(\"cls\")\nend\n\nfunction read_input(prompt)\n  io.write(prompt)\n  return io.read(\"*l\")\nend\n\nclear_console()\nprint(\"Lua\\n\")\n\nlocal name = read_input(\"Enter Your Full Name: \")\nclear_console()\n\nlocal email = read_input(\"Enter Your Email: \")\nif not (email:find(\"@\") and email:find(\"%.\") and #email >= 5 and #email <= 100 and not email:find(\"%s\")) then\n  print(\"Invalid email format. Please enter a valid email.\")\n  os.exit()\nend\nprint(\"Email is valid.\")\nclear_console()\n\nlocal password = read_input(\"Enter Your Password: \")\nclear_console()\n\nlocal age_str = read_input(\"Enter Your Age: \")\nage = tonumber(age_str)\nif not age or age < 0 or age > 120 then\n  print(\"Invalid age. Please enter a number between 0 and 120.\")\n  os.exit()\nend\nclear_console()\n\nlocal height_str = read_input(\"Enter Your Height (in meters): \")\nlocal height = tonumber(height_str)\nif not height or height < 0.2 or height > 3.0 then\n  print(\"Invalid height. Please enter a number between 0.2 and 3.0 meters.\")\n  os.exit()\nend\nclear_console()\n\nprint(\"Lua\\n\")\nprint(\"Your Name Is: \" .. name)\nprint(\"Your Email Is: \" .. email)\nprint(\"Your Password Is: \" .. password)\nprint(\"Your Age Is: \" .. age .. (age <= 2 and \" Year Old\" or \" Years Old\"))\nprint(string.format(\"Your Height Is: %.2f %s\", height, height <= 2.0 and \"Meter\" or \"Meters\"))",
    },
    "Perl": {
      name: "Perl",
      year_created: 1987,
      reason_for_creation: "To make report processing easier and to provide powerful text manipulation.",
      how_created: "Created by Larry Wall as a general-purpose Unix scripting language.",
      creator: "Larry Wall",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Perl-logo.svg/2048px-Perl-logo.svg.png",
      type: "a Programming Language",
      speed_calculator: "# Perl Speed Calculator: Console App\n\nuse strict;\nuse warnings;\n\nsub clear_console {\n  system($^O eq 'MSWin32' ? 'cls' : 'clear');\n}\n\nsub ask_question {\n  my ($prompt) = @_;\n  print $prompt;\n  chomp(my $answer = <STDIN>);\n  return $answer;\n}\n\nclear_console();\nprint \"Perl\\n\\n\";\n\nmy $name = ask_question(\"Enter Your Full Name: \");\nclear_console();\n\nmy $email = ask_question(\"Enter Your Email: \");\nif ($email !~ /^[^\\s\\@]+\\@[^\\s\\@]+\\.[^\\s\\@]+$/ || length($email) < 5 || length($email) > 100) {\n  print \"Invalid email format. Please enter a valid email.\\n\";\n  exit;\n}\nprint \"Email is valid.\\n\";\nsleep 1;\nclear_console();\n\nmy $password = ask_question(\"Enter Your Password: \");\nclear_console();\n\nmy $age_str = ask_question(\"Enter Your Age: \");\nif ($age_str !~ /^\\d+$/ || $age_str < 0 || $age_str > 120) {\n  print \"Invalid age. Must be a number between 0 and 120.\\n\";\n  exit;\n}\nmy $age = int($age_str);\nclear_console();\n\nmy $height_str = ask_question(\"Enter Your Height (in meters): \");\nif ($height_str !~ /^\\d+(\\.\\d+)?$/ || $height_str < 0.2 || $height_str > 3.0) {\n  print \"Invalid height. Must be a number between 0.2 and 3.0 meters.\\n\";\n  exit;\n}\nmy $height = $height_str + 0.0;\nclear_console();\n\nprint \"Perl\\n\\n\";\nprint \"Your Name Is: $name\\n\";\nprint \"Your Email Is: $email\\n\";\nprint \"Your Password Is: $password\\n\";\nprint \"Your Age Is: $age \" . ($age <= 2 ? \"Year Old\" : \"Years Old\") . \"\\n\";\nprintf \"Your Height Is: %.2f %s\\n\", $height, ($height <= 2.0 ? \"Meter\" : \"Meters\");",
    },
    "R": {
      name: "R",
      year_created: 1993,
      reason_for_creation: "To provide a language for statistical computing and graphics.",
      how_created: "Created by Ross Ihaka and Robert Gentleman at the University of Auckland.",
      creator: "Ross Ihaka & Robert Gentleman",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/1b/R_logo.svg",
      type: "a Programming Language",
      speed_calculator: "# R Speed Calculator - Console Input App\n\nclear_console <- function() {\n  if (.Platform$OS.type == \"windows\") {\n    system(\"cls\")\n  } else {\n    system(\"clear\")\n  }\n}\n\nread_input <- function(prompt_text) {\n  cat(prompt_text)\n  return(trimws(readLines(\"stdin\", n = 1)))\n}\n\nclear_console()\ncat(\"R Language\\n\\n\")\n\nname <- read_input(\"Enter Your Full Name: \")\nclear_console()\n\nemail <- read_input(\"Enter Your Email: \")\nif (!grepl(\"@\", email) || !grepl(\"\\\\.\", email) || nchar(email) < 5 || nchar(email) > 100 || grepl(\"\\\\s\", email)) {\n  cat(\"Invalid email format. Please enter a valid email.\\n\")\n  quit(save = \"no\", status = 1)\n}\ncat(\"Email is valid.\\n\")\nSys.sleep(1)\nclear_console()\n\npassword <- read_input(\"Enter Your Password: \")\nclear_console()\n\nage_input <- read_input(\"Enter Your Age: \")\nage <- as.numeric(age_input)\nif (is.na(age) || age < 0) {\n  cat(\"Age cannot be negative. Please enter a valid age.\\n\")\n  quit(save = \"no\", status = 1)\n} else if (age > 120) {\n  cat(\"Age seems unrealistic. Please enter a valid age.\\n\")\n  quit(save = \"no\", status = 1)\n}\nclear_console()\n\nheight_input <- read_input(\"Enter Your Height (in meters): \")\nheight <- as.numeric(height_input)\nif (is.na(height) || height <= 0 || height > 3.0) {\n  cat(\"Invalid height. Please enter a number between 0.5 and 3.0 meters.\\n\")\n  quit(save = \"no\", status = 1)\n}\nclear_console()\n\ncat(\"R Language\\n\\n\")\ncat(\"Your Name Is: \", name, \"\\n\")\ncat(\"Your Email Is: \", email, \"\\n\")\ncat(\"Your Password Is: \", password, \"\\n\")\ncat(\"Your Age Is: \", age, ifelse(age <= 2, \" Year Old\\n\", \" Years Old\\n\"))\ncat(\"Your Height Is: \", height, ifelse(height <= 2, \" Meter\\n\", \" Meters\\n\"))",
    },
    "Dart": {
      name: "Dart",
      year_created: 2011,
      reason_for_creation: "To build structured, web and mobile applications.",
      how_created: "Developed by Google as an alternative to JavaScript.",
      creator: "Google",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Dart-logo.png",
      type: "a Programming Language",
      speed_calculator: "// Dart Speed Calculator - Console App\nimport 'dart:io';\n\nvoid clearConsole() {\n  if (Platform.isWindows) {\n    stdout.write(Process.runSync(\"cls\", [], runInShell: true).stdout);\n  } else {\n    stdout.write(Process.runSync(\"clear\", [], runInShell: true).stdout);\n  }\n}\n\nFuture<void> main() async {\n  clearConsole();\n  print(\"Dart Language\\n\");\n\n  stdout.write(\"Enter Your Full Name: \");\n  String? name = stdin.readLineSync();\n  clearConsole();\n\n  stdout.write(\"Enter Your Email: \");\n  String? email = stdin.readLineSync();\n  if (email == null || !email.contains('@') || !email.contains('.') || email.length < 5 || email.length > 100 || email.contains(' ')) {\n    print(\"Invalid email format. Please enter a valid email.\");\n    exit(1);\n  }\n  print(\"Email is valid.\");\n  sleep(Duration(seconds: 1));\n  clearConsole();\n\n  stdout.write(\"Enter Your Password: \");\n  String? password = stdin.readLineSync();\n  clearConsole();\n\n  stdout.write(\"Enter Your Age: \");\n  String? ageInput = stdin.readLineSync();\n  int? age = int.tryParse(ageInput ?? '');\n  if (age == null || age < 0) {\n    print(\"Age cannot be negative. Please enter a valid age.\");\n    exit(1);\n  } else if (age > 120) {\n    print(\"Age seems unrealistic. Please enter a valid age.\");\n    exit(1);\n  }\n  clearConsole();\n\n  stdout.write(\"Enter Your Height (in meters): \");\n  String? heightInput = stdin.readLineSync();\n  double? height = double.tryParse(heightInput ?? '');\n  if (height == null || height <= 0 || height > 3.0) {\n    print(\"Invalid height. Please enter a valid height in meters.\");\n    exit(1);\n  }\n  clearConsole();\n\n  print(\"Dart Language\\n\");\n  print(\"Your Name Is: \$name\");\n  print(\"Your Email Is: \$email\");\n  print(\"Your Password Is: \$password\");\n  print(\"Your Age Is: \$age \${age <= 2 ? 'Year Old' : 'Years Old'}\");\n  print(\"Your Height Is: \$height \${height <= 2 ? 'Meter' : 'Meters'}\");\n}",
    },
    "T-SQL": {
      name: "T-SQL",
      year_created: 1987,
      reason_for_creation: "To extend SQL with procedural programming and local variables for Microsoft SQL Server.",
      how_created: "Developed by Microsoft as an extension of SQL.",
      creator: "Microsoft",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/12/Microsoft_SQL_Server_Logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "PL/SQL": {
      name: "PL/SQL",
      year_created: 1995,
      reason_for_creation: "To add procedural programming and control structures to SQL for Oracle databases.",
      how_created: "Developed by Oracle Corporation.",
      creator: "Oracle Corporation",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/86/Oracle_logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "C": {
      name: "C",
      year_created: 1972,
      reason_for_creation: "To develop a general-purpose programming language that provides low-level memory access.",
      how_created: "Developed by Dennis Ritchie at Bell Labs.",
      creator: "Dennis Ritchie",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png",
      type: "a Programming Language",
      speed_calculator: "#include <stdio.h>\n#include <stdlib.h>\n\nvoid calculateSpeed() {\n    float distance, time;\n    system(\"clear\"); // Use \"cls\" on Windows\n\n    printf(\"  C Speed Calculator\\n\");\n    printf(\"-------------------------\\n\");\n\n    printf(\"Enter the distance in meters: \");\n    if (scanf(\"%f\", &distance) != 1 || distance < 0) {\n        printf(\"Invalid distance input.\\n\");\n        return;\n    }\n\n    printf(\"Enter the time in seconds: \");\n    if (scanf(\"%f\", &time) != 1 || time <= 0) {\n        printf(\"Time must be greater than zero to avoid division by zero.\\n\");\n        return;\n    }\n\n    float speed_mps = distance / time;\n    float speed_kph = (speed_mps * 3600) / 1000;\n    float speed_mph = speed_kph * 0.621371f;\n\n    printf(\"\\nYour Speed in Meters Per Second: %.2f m/s\\n\", speed_mps);\n    printf(\"Your Speed in Kilometers Per Hour: %.2f km/h\\n\", speed_kph);\n    printf(\"Your Speed in Miles Per Hour: %.2f mph\\n\", speed_mph);\n}\n\nint main() {\n    char choice;\n    do {\n        while (getchar() != '\\n'); // Clear input buffer\n        calculateSpeed();\n        printf(\"\\nDo you want to calculate again? (y/n): \");\n        scanf(\" %c\", &choice);\n    } while (choice == 'y' || choice == 'Y');\n\n    printf(\"\\nThank you for using the Speed Calculator!\\n\");\n    return 0;\n}",
    },
    "Objective-C": {
      name: "Objective-C",
      year_created: 1984,
      reason_for_creation: "To add object-oriented features to C.",
      how_created: "Developed by Brad Cox and Tom Love.",
      creator: "Brad Cox & Tom Love",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Objective-C_Logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "MATLAB": {
      name: "MATLAB",
      year_created: 1984,
      reason_for_creation: "To provide a high-level language and interactive environment for numerical computation.",
      how_created: "Developed by Cleve Moler.",
      creator: "Cleve Moler",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/21/Matlab_Logo.png",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Groovy": {
      name: "Groovy",
      year_created: 2003,
      reason_for_creation: "To create a dynamic language for the Java platform.",
      how_created: "Developed by James Strachan and others.",
      creator: "James Strachan",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Groovy-logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Haskell": {
      name: "Haskell",
      year_created: 1990,
      reason_for_creation: "To create a purely functional programming language.",
      how_created: "Designed by a committee of researchers.",
      creator: "Simon Peyton Jones et al.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Haskell-Logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Elixir": {
      name: "Elixir",
      year_created: 2011,
      reason_for_creation: "To provide a functional, concurrent language for scalable applications.",
      how_created: "Created by José Valim, runs on Erlang VM.",
      creator: "José Valim",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/44/Elixir_logo.png",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "F#": {
      name: "F#",
      year_created: 2005,
      reason_for_creation: "To provide functional programming on the .NET platform.",
      how_created: "Developed by Don Syme at Microsoft Research.",
      creator: "Don Syme",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/5/5d/F_Sharp_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Ada": {
      name: "Ada",
      year_created: 1980,
      reason_for_creation: "To create a strongly typed, modular language for embedded and real-time systems.",
      how_created: "Developed under contract to the U.S. Department of Defense.",
      creator: "Jean Ichbiah",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/00/Ada_Logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "COBOL": {
      name: "COBOL",
      year_created: 1959,
      reason_for_creation: "To create a language for business data processing.",
      how_created: "Developed by CODASYL committee.",
      creator: "CODASYL Committee",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Cobol_logo.png",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Fortran": {
      name: "Fortran",
      year_created: 1957,
      reason_for_creation: "To perform numeric and scientific computing.",
      how_created: "Developed by IBM.",
      creator: "John Backus and IBM team",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Fortran_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Shell": {
      name: "Shell",
      year_created: 1971,
      reason_for_creation: "To provide command-line scripting and automation for Unix systems.",
      how_created: "Created by Steve Bourne.",
      creator: "Steve Bourne",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/66/GNU_Bash_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Visual Basic":  {
      name: "Visual Basic",
      year_created: 1991,
      reason_for_creation: "To enable rapid application development with a graphical user interface.",
      how_created: "Developed by Microsoft.",
      creator: "Microsoft",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Visual_Basic_6.0_logo.png",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Rust": {
      name: "Rust",
      year_created: 2010,
      reason_for_creation: "To provide safe and fast system programming with concurrency support.",
      how_created: "Developed by Mozilla Research, led by Graydon Hoare.",
      creator: "Graydon Hoare",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Rust_programming_language_black_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Scratch": {
      name: "Scratch",
      year_created: 2007,
      reason_for_creation: "To teach programming to children using block-based visual programming.",
      how_created: "Developed by MIT Media Lab.",
      creator: "Mitchel Resnick and team",
      logo_url: "https://upload.wikimedia.org/wikipedia/en/7/7f/Scratch_Logo_2019.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Julia": {
      name: "Julia",
      year_created: 2012,
      reason_for_creation: "To provide a high-performance language for technical computing.",
      how_created: "Created by Jeff Bezanson, Stefan Karpinski, Viral B. Shah, and Alan Edelman.",
      creator: "Jeff Bezanson et al.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Julia_Programming_Language_Logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Delphi": {
      name: "Delphi",
      year_created: 1995,
      reason_for_creation: "To enable rapid application development with Object Pascal.",
      how_created: "Developed by Borland.",
      creator: "Borland",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Delphi_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "PowerShell": {
      name: "PowerShell",
      year_created: 2006,
      reason_for_creation: "To provide task automation and configuration management.",
      how_created: "Developed by Microsoft.",
      creator: "Microsoft",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/PowerShell_5.0_icon.png",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "VBScript": {
      name: "VBScript",
      year_created: 1996,
      reason_for_creation: "To provide scripting language for Microsoft environments.",
      how_created: "Developed by Microsoft as a subset of Visual Basic.",
      creator: "Microsoft",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/e/e7/VBScript_logo.png",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "ColdFusion": {
      name: "ColdFusion",
      year_created: 1995,
      reason_for_creation: "To simplify web application development.",
      how_created: "Developed by Allaire, later acquired by Adobe.",
      creator: "Allaire",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Adobe_ColdFusion_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "PL/I": {
      name: "PL/I",
      year_created: 1964,
      reason_for_creation: "To combine scientific, engineering, and business programming features.",
      how_created: "Developed by IBM.",
      creator: "IBM",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/f6/PL-I_Logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Ada 95": {
      name: "Ada 95",
      year_created: 1995,
      reason_for_creation: "To improve Ada with object-oriented programming and real-time capabilities.",
      how_created: "Revision of Ada language by Jean Ichbiah and team.",
      creator: "Jean Ichbiah",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/00/Ada_Logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "SAS": {
      name: "SAS",
      year_created: 1976,
      reason_for_creation: "To provide software for advanced analytics and data management.",
      how_created: "Developed by SAS Institute.",
      creator: "SAS Institute",
      logo_url: "https://upload.wikimedia.org/wikipedia/en/e/e7/SAS_Logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Assembly": {
      name: "Assembly",
      year_created: 1940,
      reason_for_creation: "To provide a low-level programming language for direct hardware manipulation.",
      how_created: "Developed as a symbolic representation of machine code.",
      creator: "Various early computer scientists",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Assembly_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "C#": {
      name: "C#",
      year_created: 2000,
      creator: "Microsoft",
      reason_for_creation: "To provide a modern, object-oriented language for developing on the .NET framework.",
      how_created: "Developed by Anders Hejlsberg and his team at Microsoft as part of the .NET initiative.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Csharp_Logo.png",
      type: "a Programming Language",
      speed_calculator: "using System;\nclass SpeedCalculator {\n    static void CalculateSpeed() {\n        float distance, time;\n        Console.Clear();\n        Console.WriteLine(\"  C# Speed Calculator\");\n        Console.Write(\"Enter The Distance In Meters: \");\n        distance = float.Parse(Console.ReadLine());\n        Console.Write(\"Enter The Time In Seconds: \");\n        time = float.Parse(Console.ReadLine());\n        if (time == 0) {\n            Console.WriteLine(\"Time cannot be zero! Division by zero error.\");\n            return;\n        }\n        float speedMPerSecond = distance / time;\n        float speedMPerHour = speedMPerSecond * 3600;\n        float speedKPerHour = speedMPerHour / 1000;\n        float speedMIPerHour = speedKPerHour * 0.621371f;\n        Console.WriteLine(\"Your Speed in Meters Per Second: \" + speedMPerSecond);\n        Console.WriteLine(\"Your Speed in Kilometers Per Hour: \" + speedKPerHour);\n        Console.WriteLine(\"Your Speed in Miles Per Hour: \" + speedMIPerHour);\n    }\n    static void Main(string[] args) {\n        char choice;\n        do {\n            CalculateSpeed();\n            Console.Write(\"Do You Want To Calculate Again? (y/n): \");\n            choice = char.Parse(Console.ReadLine());\n        } while (choice == 'y' || choice == 'Y');\n        Console.WriteLine(\"Thank You For Using The Speed Calculator!\");\n    }\n}",
    },

    "Tcl": {
      name: "Tcl",
      year_created: 1988,
      reason_for_creation: "To be an embeddable command language for tools.",
      how_created: "Developed by John Ousterhout as a reusable scripting language.",
      creator: "John Ousterhout",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/85/Tcl_logo.png",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Lisp": {
      name: "Lisp",
      year_created: 1958,
      reason_for_creation: "To support symbolic computation and artificial intelligence research.",
      how_created: "Developed at MIT by John McCarthy.",
      creator: "John McCarthy",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/0c/LISP_logo.png",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Scheme": {
      name: "Scheme",
      year_created: 1975,
      reason_for_creation: "To create a simpler dialect of Lisp with lexical scoping.",
      how_created: "Created by Guy L. Steele and Gerald Jay Sussman.",
      creator: "Steele & Sussman",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/39/Scheme_logo.png",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Prolog": {
      name: "Prolog",
      year_created: 1972,
      reason_for_creation: "To support logic programming and AI applications.",
      how_created: "Developed by Alain Colmerauer and Robert Kowalski.",
      creator: "Alain Colmerauer & Robert Kowalski",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Prolog-logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Erlang": {
      name: "Erlang",
      year_created: 1986,
      reason_for_creation: "To build scalable, fault-tolerant telecom systems.",
      how_created: "Created by Ericsson's computer science lab.",
      creator: "Joe Armstrong, Robert Virding, Mike Williams",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/5/59/Erlang_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "RPG": {
      name: "RPG",
      year_created: 1959,
      reason_for_creation: "To simplify business reporting on IBM systems.",
      how_created: "Developed by IBM for punch card programming.",
      creator: "IBM",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/3d/RPG_programming_language_logo.png",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Logo": {
      name: "Logo",
      year_created: 1967,
      reason_for_creation: "To teach programming concepts to children.",
      how_created: "Developed by Bolt, Beranek and Newman with turtle graphics.",
      creator: "Wally Feurzeig, Seymour Papert",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Logo-programming.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Smalltalk": {
      name: "Smalltalk",
      year_created: 1972,
      reason_for_creation: "To explore object-oriented programming for education and GUI development.",
      how_created: "Developed at Xerox PARC.",
      creator: "Alan Kay, Dan Ingalls, Adele Goldberg",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/38/Smalltalk_logo.png",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "ABAP": {
      name: "ABAP",
      year_created: 1983,
      reason_for_creation: "To enable application development on SAP systems.",
      how_created: "Created by SAP as a report generation language.",
      creator: "SAP SE",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/4f/ABAP_Logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Modula-2": {
      name: "Modula-2",
      year_created: 1978,
      reason_for_creation: "To support modular programming and systems programming.",
      how_created: "Designed by Niklaus Wirth as a successor to Pascal.",
      creator: "Niklaus Wirth",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Modula-2_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "D": {
      name: "D",
      year_created: 2001,
      reason_for_creation: "To be a modern systems language with C++-like syntax.",
      how_created: "Created by Walter Bright.",
      creator: "Walter Bright",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/4f/D_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "VHDL": {
      name: "VHDL",
      year_created: 1980,
      reason_for_creation: "To model and simulate digital hardware.",
      how_created: "Developed for the U.S. Department of Defense.",
      creator: "IEEE & DoD",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/9e/VHDL_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Verilog": {
      name: "Verilog",
      year_created: 1984,
      reason_for_creation: "To model hardware for simulation and synthesis.",
      how_created: "Created by Phil Moorby at Gateway Design Automation.",
      creator: "Phil Moorby",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Verilog_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "LiveScript": {
      name: "LiveScript",
      year_created: 1995,
      reason_for_creation: "Original name of JavaScript before standardization.",
      how_created: "Created at Netscape, later renamed to JavaScript.",
      creator: "Brendan Eich",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/d/d4/LiveScript_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Nim": {
      name: "Nim",
      year_created: 2008,
      reason_for_creation: "To offer performance like C with Python-like syntax.",
      how_created: "Developed by Andreas Rumpf.",
      creator: "Andreas Rumpf",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Nim-logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Crystal": {
      name: "Crystal",  
      year_created: 2014,
      reason_for_creation: "To be a compiled language with Ruby-like syntax.",
      how_created: "Developed by Ary Borenszweig, Juan Wajnerman, and others.",
      creator: "Manas Technology Solutions",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/98/Crystal_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "ReasonML": {
      name: "ReasonML",
      year_created: 2016,
      reason_for_creation: "To provide a more readable syntax for OCaml and React compatibility.",
      how_created: "Developed by Facebook.",
      creator: "Facebook",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/94/ReasonML_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "OCaml": {
      name: "OCaml",
      year_created: 1996,
      reason_for_creation: "To combine object-oriented and functional programming.",
      how_created: "Developed at INRIA.",
      creator: "Xavier Leroy et al.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Ocaml_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Zig": {
      name: "Zig",
      year_created: 2015,
      reason_for_creation: "To replace C with a safer, simpler alternative.",
      how_created: "Created by Andrew Kelley.",
      creator: "Andrew Kelley",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Zig-logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Bash": {
      name: "Bash",
      year_created: 1989,
      reason_for_creation: "To be a free software replacement for the Bourne shell.",
      how_created: "Developed for the GNU Project.",
      creator: "Brian Fox",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Bash_Logo_Colored.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "AWK": {
      name: "AWK",
      year_created: 1977,
      reason_for_creation: "To support text processing and reporting.",
      how_created: "Created by Alfred Aho, Peter Weinberger, and Brian Kernighan.",
      creator: "Aho, Weinberger, Kernighan",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/6c/AWK_programming_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Sed": {
      name: "Sed",
      year_created: 1974,
      reason_for_creation: "To perform stream editing of text.",
      how_created: "Developed at Bell Labs.",
      creator: "Lee E. McMahon",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Unix_sed_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Fish": {
      name: "Fish",
      year_created: 2005,
      reason_for_creation: "To create a user-friendly interactive shell.",
      how_created: "Designed to improve on Bash and other shells.",
      creator: "Axel Liljencrantz",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/00/Fish_shell_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Q#": {
      name: "Q#",
      year_created: 2017,
      reason_for_creation: "To enable quantum computing development on Microsoft's platform.",
      how_created: "Developed by Microsoft.",
      creator: "Microsoft",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Q_Sharp_Logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Hack": {
      name: "Hack",
      year_created: 2014,
      reason_for_creation: "To provide static typing for PHP.",
      how_created: "Developed by Facebook.",
      creator: "Facebook",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Hack_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "PureScript": {
      name: "PureScript",
      year_created: 2013,
      reason_for_creation: "To provide a strongly-typed functional language that compiles to JavaScript.",
      how_created: "Inspired by Haskell, designed for web development.",
      creator: "Phil Freeman",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/38/PureScript_logo.png",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Elm": {
      name: "Elm",
      year_created: 2012,
      reason_for_creation: "To create a functional language for front-end development with strong guarantees.",
      how_created: "Focused on simplicity, strong type system, and helpful error messages.",
      creator: "Evan Czaplicki",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Elm_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "F#": {
      name: "F#",
      year_created: 2005,
      reason_for_creation: "To bring functional programming to .NET.",
      how_created: "Based on OCaml with .NET integration.",
      creator: "Don Syme, Microsoft Research",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/5/5f/F_Sharp_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "COBOL": {
      name: "COBOL",
      year_created: 1959,
      reason_for_creation: "To support business data processing with an English-like syntax.",
      how_created: "Commissioned by the U.S. Department of Defense.",
      creator: "CODASYL Committee",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/0b/COBOL_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "B": {
      name: "B",
      year_created: 1969,
      reason_for_creation: "To create a simple language for system programming.",
      how_created: "Developed by Ken Thompson at Bell Labs.",
      creator: "Ken Thompson",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/3c/B_programming_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Assembly": {
      name: "Assembly",
      year_created: 1949,
      reason_for_creation: "To provide a low-level programming language for computers.",
      how_created: "Developed as a symbolic representation of machine code.",
      creator: "Various",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Assembly_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Binary": {
      name: "Binary",
      year_created: 1940,
      reason_for_creation: "To represent data in a format understood by computers.",
      how_created: "Developed as the fundamental language of computers using bits.",
      creator: "Early computer scientists",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Binary_code_logo.svg",
      type: "a Data Representation",
    },
    "WebAssembly": {
      name: "WebAssembly",
      year_created: 2015,
      reason_for_creation: "To enable high-performance applications on the web.",
      how_created: "Developed as a binary instruction format for a stack-based virtual machine.",
      creator: "W3C and Browser Vendors",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/4f/WebAssembly_logo.svg",
      type: "a Web Technology",
      speed_calculator: "",
    },
    "Fortran": {
      name: "Fortran",
      year_created: 1957,
      reason_for_creation: "To simplify programming of mathematical and scientific computations.",
      how_created: "Developed at IBM by a team led by John Backus.",
      creator: "John Backus and IBM",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/99/Fortran_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Groovy": {
      name: "Groovy",
      year_created: 2003,
      reason_for_creation: "To offer a dynamic language for the Java platform.",
      how_created: "Blended Python, Ruby, and Java features.",
      creator: "James Strachan",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/36/Groovy-logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Xojo": {
      name: "Xojo",
      year_created: 1997,
      reason_for_creation: "To create cross-platform apps using a modern version of BASIC.",
      how_created: "Evolved from REALbasic.",
      creator: "Xojo Inc.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Xojo_Logo_2013.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Vala": {
      name: "Vala",
      year_created: 2006,
      reason_for_creation: "To bring modern language features to GObject and GNOME development.",
      how_created: "Developed by Jürg Billeter.",
      creator: "GNOME Community",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Vala_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Idris": {
      name: "Idris",
      year_created: 2007,
      reason_for_creation: "To explore dependent types in practical programming.",
      how_created: "Developed as a research project.",
      creator: "Edwin Brady",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Idris_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Mercury": {
      name: "Mercury",
      year_created: 1995,
      reason_for_creation: "To create a pure logic programming language with strong types.",
      how_created: "Based on Prolog, with influences from Haskell.",
      creator: "Zoltan Somogyi",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Mercury_programming_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Chapel": {
      name: "Chapel",
      year_created: 2009,
      reason_for_creation: "To support productive parallel programming.",
      how_created: "Developed by Cray Inc. as part of the DARPA HPCS program.",
      creator: "Cray Inc.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Chapel_programming_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Agda": {
      name: "Agda",
      year_created: 2007,
      reason_for_creation: "To serve as a dependently typed functional programming language and proof assistant.",
      how_created: "Developed by the Department of Computer Science at Chalmers University.",
      creator: "Ulf Norell",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Agda_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Turing": {
      name: "Turing",
      year_created: 1982,
      reason_for_creation: "To teach structured programming in high schools and universities.",
      how_created: "Developed in Canada.",
      creator: "Ric Holt and James Cordy",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/19/Turing_programming_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "REBOL": {
      name: "REBOL",
      year_created: 1997,
      reason_for_creation: "To create a lightweight messaging and scripting language.",
      how_created: "Designed to be minimal and human-centric.",
      creator: "Carl Sassenrath",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/f0/REBOL_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Eiffel": {
      name: "Eiffel",
      year_created: 1985,
      reason_for_creation: "To support software engineering with design by contract.",
      how_created: "Developed with strong typing and OO features.",
      creator: "Bertrand Meyer",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Eiffel_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Julia": {
      name: "Julia",
      year_created: 2012,
      reason_for_creation: "To combine performance of C with usability of Python for scientific computing.",
      how_created: "Created by a team at MIT.",
      creator: "Jeff Bezanson, Stefan Karpinski, Viral B. Shah, Alan Edelman",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Julia_Programming_Language_Logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Ring": {
      name: "Ring",
      year_created: 2016,
      reason_for_creation: "To create a simple and flexible language for education and application development.",
      how_created: "Designed for natural language-like syntax and multi-paradigm support.",
      creator: "Mahmoud Fayed",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Ring_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "MoonScript": {
      name: "MoonScript",
      year_created: 2011,
      reason_for_creation: "To provide a cleaner syntax for Lua.",
      how_created: "Compiled to Lua, meant for better readability.",
      creator: "Leah Neukirchen",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/d/dc/MoonScript_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Red": {
      name: "Red",
      year_created: 2011,
      reason_for_creation: "To extend Rebol and support system programming.",
      how_created: "Created with cross-compilation in mind.",
      creator: "Nenad Rakocevic",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Red_programming_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Io": {
      name: "Io",
      year_created: 2002,
      reason_for_creation: "To explore prototype-based programming and concurrency.",
      how_created: "Minimalist language influenced by Smalltalk, Self, and Lisp.",
      creator: "Steve Dekorte",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Io_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "NATURAL": {
      name: "NATURAL",
      year_created: 1979,
      reason_for_creation: "To allow non-technical users to access data on IBM mainframes easily.",
      how_created: "Developed by Software AG for business users.",
      creator: "Software AG",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Natural_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Clarion": {
      name: "Clarion",
      year_created: 1986,
      reason_for_creation: "To rapidly create business applications with database access.",
      how_created: "Designed as a 4GL with code generation capabilities.",
      creator: "SoftVelocity",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Clarion_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Uniface": {
      name: "Uniface",
      year_created: 1984,
      reason_for_creation: "To develop enterprise apps using a model-driven approach.",
      how_created: "Supports multiple platforms and databases.",
      creator: "Uniface B.V.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/39/Uniface_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Datalog": {
      name: "Datalog",
      year_created: 1977,
      reason_for_creation: "To model logic programming with a database focus.",
      how_created: "Subset of Prolog with database semantics.",
      creator: "David Maier and others",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/40/Datalog_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "ClojureScript": {
      name: "ClojureScript",
      year_created: 2011,
      reason_for_creation: "To bring Clojure’s functional programming to JavaScript.",
      how_created: "Compiles to JavaScript from Clojure syntax.",
      creator: "David Nolen",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/6a/ClojureScript_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Racket": {
      name: "Racket",
      year_created: 1995,
      reason_for_creation: "To serve as a teaching and research platform in programming languages.",
      how_created: "Evolved from Scheme, with extensive tooling.",
      creator: "PLT Inc.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Racket-logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Elixir": {
      name: "Elixir",
      year_created: 2011,
      reason_for_creation: "To bring modern syntax and tooling to Erlang’s robust VM.",
      how_created: "Built on top of the Erlang VM (BEAM).",
      creator: "José Valim",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/44/Elixir_logo.png",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "J": {
      name: "J",
      year_created: 1990,
      reason_for_creation: "To improve upon APL with ASCII-friendly syntax.",
      how_created: "Designed for high-performance mathematical computing.",
      creator: "Kenneth E. Iverson and Roger Hui",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/29/J_programming_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "APL": {
      name: "APL",
      year_created: 1966,
      reason_for_creation: "To express algorithms concisely with a unique symbolic notation.",
      how_created: "Used special characters for array processing.",
      creator: "Kenneth E. Iverson",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/APL_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Hack": {
      name: "Hack",
      year_created: 2014,
      reason_for_creation: "To add static typing to PHP while maintaining compatibility.",
      how_created: "Developed by Facebook as part of the HHVM project.",
      creator: "Facebook",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/37/Hack_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Nim": {
      name: "Nim",
      year_created: 2008,
      reason_for_creation: "To combine performance, expressiveness, and safety in a compiled language.",
      how_created: "Uses Python-like syntax and compiles to C.",
      creator: "Andreas Rumpf",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Nim-logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Crystal": {
      name: "Crystal",
      year_created: 2014,
      reason_for_creation: "To offer the performance of C with the elegance of Ruby.",
      how_created: "Statically typed with Ruby-like syntax, compiles to native code.",
      creator: "Ary Borenszweig, Juan Wajnerman, Brian Cardiff",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Crystal_Programming_Language_Logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "ReasonML": {
      name: "ReasonML",
      year_created: 2016,
      reason_for_creation: "To make OCaml more accessible with JavaScript-friendly syntax.",
      how_created: "Built on OCaml with a new syntax and JS tools.",
      creator: "Jordan Walke (Facebook)",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/29/ReasonML_Logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "OCaml": {
      name: "OCaml",
      year_created: 1996,
      reason_for_creation: "To support functional, imperative, and object-oriented paradigms in one language.",
      how_created: "Extension of Caml language with OO features.",
      creator: "INRIA",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Ocaml_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Ada": {
      name: "Ada",
      year_created: 1980,
      reason_for_creation: "To standardize and modernize embedded systems programming for the U.S. military.",
      how_created: "Created through a competition by the Department of Defense.",
      creator: "Jean Ichbiah and team at CII Honeywell Bull",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Ada_lovelace_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Modula-2": {
      name: "Modula-2",
      year_created: 1978,
      reason_for_creation: "To improve on Pascal with support for modular programming.",
      how_created: "Created as a systems programming language.",
      creator: "Niklaus Wirth",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Modula-2_Logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "D": {
      name: "D",
      year_created: 2001,
      reason_for_creation: "To modernize C++ with simpler syntax and better safety.",
      how_created: "Built from scratch with C-style syntax and memory safety.",
      creator: "Walter Bright",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/4f/D_Programming_Language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Zig": {
      name: "Zig",
      year_created: 2016,
      reason_for_creation: "To replace C with a safer, more modern alternative for systems programming.",
      how_created: "Developed from scratch with no hidden control flow.",
      creator: "Andrew Kelley",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/20/Zig_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Nasal": {
      name: "Nasal",
      year_created: 2004,
      reason_for_creation: "To embed a scripting language in FlightGear flight simulator.",
      how_created: "Lightweight language designed for extensibility and scripting.",
      creator: "Curtis Olson",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Nasal_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "LiveScript": {
      name: "LiveScript",
      year_created: 2011,
      reason_for_creation: "To offer a more expressive, functional language compiling to JavaScript.",
      how_created: "Fork of CoffeeScript with more features.",
      creator: "George Zahariev",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/d/d0/LiveScript_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "CoffeeScript": {
      name: "CoffeeScript",
      year_created: 2009,
      reason_for_creation: "To make JavaScript more readable and Pythonic.",
      how_created: "Compiled into JavaScript with cleaner syntax.",
      creator: "Jeremy Ashkenas",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Coffeescript-logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Gosu": {
      name: "Gosu",
      year_created: 2009,
      reason_for_creation: "To simplify Java development with scripting and static typing.",
      how_created: "Blends scripting and static typing on the JVM.",
      creator: "Guidewire Software",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Gosu_programming_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Smalltalk": {
      name: "Smalltalk",
      year_created: 1972,
      reason_for_creation: "To pioneer object-oriented programming for educational use.",
      how_created: "Created at Xerox PARC for children and researchers.",
      creator: "Alan Kay, Dan Ingalls, Adele Goldberg",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Smalltalk_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Self": {
      name: "Self",
      year_created: 1987,
      reason_for_creation: "To explore prototype-based object-oriented programming.",
      how_created: "Developed at Stanford and Sun Microsystems.",
      creator: "David Ungar, Randall Smith",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Self_programming_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Io": {
      name: "Io",
      year_created: 2002,
      reason_for_creation: "To offer a minimalist, prototype-based language for concurrency.",
      how_created: "Combines ideas from Smalltalk, Lisp, and Self.",
      creator: "Steve Dekorte",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Io_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Tcl": {
      name: "Tcl",
      year_created: 1988,
      reason_for_creation: "To easily embed a scripting language in C applications.",
      how_created: "Interpreted command language with dynamic typing.",
      creator: "John Ousterhout",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Tcl_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Forth": {
      name: "Forth",
      year_created: 1970,
      reason_for_creation: "To control radio telescopes with a concise language and small footprint.",
      how_created: "Stack-based, postfix notation, minimal design.",
      creator: "Charles H. Moore",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/18/Forth_programming_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Falcon": {
      name: "Falcon",
      year_created: 2002,
      reason_for_creation: "To serve as a multi-paradigm scripting language.",
      how_created: "Combines procedural, OO, functional, and symbolic styles.",
      creator: "Giancarlo Niccolai",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/5/52/Falcon_programming_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Harbour": {
      name: "Harbour",
      year_created: 1999,
      reason_for_creation: "To modernize Clipper for modern platforms.",
      how_created: "Open-source project inspired by xBase.",
      creator: "Harbour Project Team",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Harbour_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Logtalk": {
      name: "Logtalk",
      year_created: 1998,
      reason_for_creation: "To bring object-oriented features to Prolog.",
      how_created: "Extends Prolog with OO programming concepts.",
      creator: "Paulo Moura",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Logtalk_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "ReScript": {
      name: "ReScript",
      year_created: 2020,
      reason_for_creation: "To provide a fast, strongly typed language for frontend development.",
      how_created: "Evolved from ReasonML and BuckleScript.",
      creator: "ReScript Association",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/61/ReScript_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Pony": {
      name: "Pony",
      year_created: 2015,
      reason_for_creation: "To create a safe, actor-model-based, high-performance language.",
      how_created: "Focus on correctness, safety, and concurrency.",
      creator: "Sylvan Clebsch",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/49/Pony_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Ballerina": {
      name: "Ballerina",
      year_created: 2017,
      reason_for_creation: "To simplify cloud-native and network services development.",
      how_created: "Focused on data movement and integration.",
      creator: "WSO2",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Ballerina_Logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Starlark": {
      name: "Starlark",
      year_created: 2014,
      reason_for_creation: "To configure builds for the Bazel build system.",
      how_created: "Subset of Python designed for sandboxing.",
      creator: "Google",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/47/Starlark_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "SourcePawn": {
      name: "SourcePawn",
      year_created: 2005,
      reason_for_creation: "To script Source engine mods and games.",
      how_created: "Scripting language used in game server plugins.",
      creator: "AlliedModders",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/68/SourcePawn_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Pawn": {
      name: "Pawn",
      year_created: 1998,
      reason_for_creation: "To serve as an embeddable scripting language with C-like syntax.",
      how_created: "Compact language for scripting embedded systems.",
      creator: "ITB CompuPhase",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/64/Pawn_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "PL/I": {
      name: "PL/I",
      year_created: 1964,
      reason_for_creation: "To unify scientific and business programming languages.",
      how_created: "Designed by IBM for mainframe development.",
      creator: "IBM",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/b/b0/PL-I_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "SPARK": {
      name: "SPARK",
      year_created: 1988,
      reason_for_creation: "To develop high-integrity software with provable correctness.",
      how_created: "Subset of Ada with formal specification.",
      creator: "Praxis",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/8f/SPARK_programming_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "GDScript": {
      name: "GDScript",
      year_created: 2014,
      reason_for_creation: "To provide a Python-like scripting language tailored for the Godot game engine.",
      how_created: "Designed by the Godot Engine team for ease of use in game dev.",
      creator: "Godot Engine contributors",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/35/Godot_Engine_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "AngelScript": {
      name: "AngelScript",
      year_created: 2003,
      reason_for_creation: "To embed a C++-like scripting language into applications.",
     how_created: "Designed for scripting in game engines and apps.",
      creator: "Andreas Jönsson",
      logo_url: "https://angelcode.com/angelscript/media/as_logo.png",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Haxe": {
      name: "Haxe",
      year_created: 2005,
      reason_for_creation: "To support cross-platform development with a single codebase.",
      how_created: "Compiled to multiple languages like JS, C++, Java.",
      creator: "Nicolas Cannasse",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/c/c1/HaxeLogo.png",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Idris": {
      name: "Idris",
      year_created: 2007,
      reason_for_creation: "To explore and use dependent types practically.",
      how_created: "Created as both a programming language and proof assistant.",
      creator: "Edwin Brady",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Idris_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Nix": {
      name: "Nix",
      year_created: 2003,
      reason_for_creation: "To define reproducible and declarative system configurations.",
      how_created: "Functional language for package management.",
      creator: "NixOS community",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nix-Logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Yacc": {
      name: "Yacc",
      year_created: 1973,
      reason_for_creation: "To generate parsers from grammar specifications.",
      how_created: "Developed by Stephen C. Johnson at Bell Labs.",
      creator: "Stephen C. Johnson",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Yacc_logo.png",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Lex": {
      name: "Lex",
      year_created: 1975,
      reason_for_creation: "To generate lexical analyzers from regex-like specifications.",
      how_created: "Developed at Bell Labs for compiler construction.",
      creator: "Mike Lesk and Eric Schmidt",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/33/Lex_logo.png",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Raku": {
      name: "Raku",
      year_created: 2010,
      reason_for_creation: "To modernize and refactor Perl 6 with improved features.",
      how_created: "Developed as a sister language to Perl 5.",
      creator: "Larry Wall et al.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Raku_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "Awk": {
      name: "Awk",
      year_created: 1977,
      reason_for_creation: "To support field-level text processing in Unix.",
      how_created: "Created by Aho, Weinberger, and Kernighan.",
      creator: "Alfred Aho, Peter Weinberger, Brian Kernighan",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/6c/AWK_programming_language_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "GAMS": {
      name: "GAMS",
      year_created: 1976,
      reason_for_creation: "To provide algebraic modeling for optimization problems.",
      how_created: "Designed as a special-purpose modeling language.",
      creator: "GAMS Development Corporation",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/8f/GAMS_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "PL/SQL": {
      name: "PL/SQL",
      year_created: 1995,
      reason_for_creation: "To bring procedural extensions to SQL for Oracle.",
      how_created: "Built by Oracle to support advanced scripting in DB.",
      creator: "Oracle",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/86/Oracle_logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "Transact-SQL": {
      name: "Transact-SQL",
      year_created: 1987,
      reason_for_creation: "To extend SQL with programming constructs for MS SQL Server.",
      how_created: "Developed by Microsoft for database scripting.",
      creator: "Microsoft",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/12/Microsoft_SQL_Server_Logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "PL/pgSQL": {
      name: "PL/pgSQL",
      year_created: 1997,
      reason_for_creation: "To add procedural features to PostgreSQL.",
      how_created: "Developed by PostgreSQL community.",
      creator: "PostgreSQL Global Development Group",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "T-SQL": {
      name: "T-SQL",
      year_created: 1987,
      reason_for_creation: "To extend SQL with procedural logic for Microsoft SQL Server.",
      how_created: "Created by Microsoft.",
      creator: "Microsoft",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/12/Microsoft_SQL_Server_Logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "MySQL": {
      name: "MySQL",
      year_created: 1995,
      reason_for_creation: "To provide open-source relational database management.",
      how_created: "Developed by MySQL AB.",
      creator: "MySQL AB",
      logo_url: "https://upload.wikimedia.org/wikipedia/en/d/dd/MySQL_logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "PL/SQL": {
      name: "PL/SQL",
      year_created: 1995,
      reason_for_creation: "To give Oracle DB procedural scripting capabilities.",
      how_created: "Created by Oracle Corporation.",
      creator: "Oracle",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/86/Oracle_logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "MariaDB": {
      name: "MariaDB",
      year_created: 2009,
      reason_for_creation: "To provide a community-driven, drop-in replacement for MySQL.",
      how_created: "Forked from MySQL by original MySQL developers.",
      creator: "Michael “Monty” Widenius",
      logo_url: "https://upload.wikimedia.org/wikipedia/en/3/30/MariaDB_logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "SQLite": {
      name: "SQLite",
      year_created: 2000,
      reason_for_creation: "To embed a serverless, self-contained relational DB engine.",
      how_created: "Developed by D. Richard Hipp.",
      creator: "D. Richard Hipp",
      logo_url: "https://upload.wikimedia.org/wikipedia/en/3/38/SQLite370.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "Firestore SQL": {
      name: "Firestore SQL",
      year_created: 2019,
      reason_for_creation: "To query Firestore documents using familiar SQL-like syntax.",
      how_created: "Implemented by Google in Firestore product.",
      creator: "Google",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Google_Cloud_Firestore_Logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "HiveQL": {
      name: "HiveQL",
      year_created: 2008,
      reason_for_creation: "To allow SQL-like queries on Hadoop data warehouse.",
      how_created: "Developed by Facebook as part of Hive.",
      creator: "Facebook",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/39/Apache_Hive_logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "Pig Latin": {
      name: "Pig Latin",
      year_created: 2008,
      reason_for_creation: "To simplify MapReduce jobs with a SQL-like language.",
      how_created: "Created by Yahoo! for Hadoop Pig.",
      creator: "Yahoo!",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Apache_Pig_logo.svg",
      type: "a Programming Language",
      speed_calculator: "",
    },
    "PL/V8": {
      name: "PL/V8",
      year_created: 2011,
      reason_for_creation: "To enable writing PostgreSQL functions in JavaScript.",
      how_created: "Integrates V8 engine into PostgreSQL.",
      creator: "V8 engine and Postgres contributors",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "Cassandra CQL": {
      name: "Cassandra CQL",
      year_created: 2010,
      reason_for_creation: "To query Cassandra NoSQL data using SQL-like syntax.",
      how_created: "Developed by Apache Cassandra community.",
      creator: "Apache Software Foundation",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/18/Apache_Cassandra_logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "Spark SQL": {
      name: "Spark SQL",
      year_created: 2014,
      reason_for_creation: "To query data within Apache Spark using SQL.",
      how_created: "Built as part of the Spark engine.",
      creator: "Apache Software Foundation",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Apache_Spark_logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "Presto SQL": {
      name: "Presto SQL",
      year_created: 2013,
      reason_for_creation: "To support distributed SQL querying on big data.",
      how_created: "Developed at Facebook.",
      creator: "Facebook",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/27/Presto_logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "Google BigQuery SQL": {
      name: "Google BigQuery SQL",
      year_created: 2010,
      reason_for_creation: "To query large datasets in Google’s data warehouse.",
      how_created: "Implemented by Google.",
      creator: "Google",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Google_BigQuery_logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "Redshift SQL": {
      name: "Redshift SQL",
      year_created: 2012,
      reason_for_creation: "To query data in AWS Redshift data warehouse.",
      how_created: "Developed by Amazon Web Services.",
      creator: "AWS",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/40/Redshift_logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "Snowflake SQL": {
      name: "Snowflake SQL",
      year_created: 2014,
      reason_for_creation: "To provide SQL querying in Snowflake cloud data platform.",
      how_created: "Developed by Snowflake Inc.",
      creator: "Snowflake Inc.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Snowflake_Logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "CockroachDB SQL": {
      name: "CockroachDB SQL",
      year_created: 2014,
      reason_for_creation: "To provide globally consistent, distributed SQL database.",
      how_created: "Developed by Cockroach Labs.",
      creator: "Cockroach Labs",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/a/a6/CockroachDB_logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "ClickHouse SQL": {
      name: "ClickHouse SQL",
      year_created: 2016,
      reason_for_creation: "To support real-time OLAP queries on large volumes of data.",
      how_created: "Developed by Yandex for high-speed analytics using columnar storage.",
      creator: "Yandex",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/f0/ClickHouse_Logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "DuckDB SQL": {
      name: "DuckDB SQL",
      year_created: 2019,
      reason_for_creation: "To provide in-process analytics with no external dependencies.",
      how_created: "Embedded SQL engine designed for analytical workloads.",
      creator: "Hannes Mühleisen and Mark Raasveldt",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/e/e2/DuckDB_Logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "Trino SQL": {
      name: "Trino SQL",
      year_created: 2020,
      reason_for_creation: "To continue PrestoSQL development after Presto split.",
      how_created: "Forked from PrestoDB to provide fast distributed SQL query engine.",
      creator: "Trino Software Foundation",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/93/Trino_Logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "VoltDB SQL": {
      name: "VoltDB SQL",
      year_created: 2010,
      reason_for_creation: "To provide high-throughput ACID-compliant in-memory databases.",
      how_created: "Derived from H-Store project at MIT.",
      creator: "Michael Stonebraker and team",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/e/e6/VoltDB_logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "H2 SQL": {
      name: "H2 SQL",
      year_created: 2005,
      reason_for_creation: "To provide a fast, lightweight Java-based database for development/testing.",
      how_created: "Developed in Java as an embedded SQL engine.",
      creator: "Thomas Mueller",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/7e/H2_Database_Logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "Firebird SQL": {
      name: "Firebird SQL",
      year_created: 2000,
      reason_for_creation: "To continue the development of the open-source InterBase database.",
      how_created: "Forked from Borland InterBase 6.0 open-source release.",
      creator: "Firebird Project",
      logo_url: "https://upload.wikimedia.org/wikipedia/en/e/e1/FirebirdSQL_logo.png",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "Informix SQL": {
      name: "Informix SQL",
      year_created: 1981,
      reason_for_creation: "To support business-critical relational database systems.",
      how_created: "Developed as a commercial SQL RDBMS, now owned by IBM.",
      creator: "Roger Sippl",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/b/b2/IBM_Informix_Logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "Ingres SQL": {
      name: "Ingres SQL",
      year_created: 1980,
      reason_for_creation: "To commercialize a research relational database from UC Berkeley.",
      how_created: "Developed from Ingres project under Michael Stonebraker.",
      creator: "Michael Stonebraker",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Ingres_logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "Sybase SQL": {
      name: "Sybase SQL",
      year_created: 1984,
      reason_for_creation: "To offer enterprise-level relational database systems.",
      how_created: "Developed as a proprietary SQL engine later acquired by SAP.",
      creator: "Sybase Inc.",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/f3/SAP_logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "Apache Derby SQL": {
      name: "Apache Derby SQL",
      year_created: 2004,
      reason_for_creation: "To provide a lightweight, fully functional, Java-based RDBMS.",
      how_created: "Originally developed by Cloudscape Inc., later open-sourced by IBM.",
      creator: "Apache Software Foundation",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Apache_Derby_logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "MonetDB SQL": {
      name: "MonetDB SQL",
      year_created: 2002,
      reason_for_creation: "To improve performance in read-heavy analytical queries using columnar storage.",
      how_created: "Created at Centrum Wiskunde & Informatica in the Netherlands.",
      creator: "Peter Boncz and team",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/65/MonetDB_logo.svg",
      type: "an SQL Dialect",
      speed_calculator: "",
    },
    "SQL:2003": {
      name: "SQL:2003",
      year_created: 2003,
      reason_for_creation: "To add XML, window functions, and sequence generators to SQL standard.",
      how_created: "Developed by ISO/IEC JTC 1 SC 32 as part of SQL standard evolution.",
      creator: "ISO/IEC",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/87/ISO_icon.svg",
      type: "an SQL Standard",
      speed_calculator: "",
    },
    "SQL:2008": {
      name: "SQL:2008",
      year_created: 2008,
      reason_for_creation: "To expand temporal databases and MERGE statements.",
      how_created: "Part of official SQL standard progression by ISO.",
      creator: "ISO/IEC",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/87/ISO_icon.svg",
      type: "an SQL Standard",
      speed_calculator: "",
    },
    "SQL:2011": {
      name: "SQL:2011",
      year_created: 2011,
      reason_for_creation: "To introduce temporal features and system-versioned tables.",
      how_created: "Refined from previous SQL standards for handling time-based data.",
      creator: "ISO/IEC",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/87/ISO_icon.svg",
      type: "an SQL Standard",
      speed_calculator: "",
    },
    "SQL:2016": {
      year_created: 2016,
      reason_for_creation: "To add JSON support, polymorphic table functions, and row pattern matching.",
      how_created: "Latest major SQL standard from ISO.",
      creator: "ISO/IEC",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/87/ISO_icon.svg",
      type: "an SQL Standard",
      speed_calculator: "",
    },
    "SQL:2019": {
      name: "SQL:2019",
      year_created: 2019,
      reason_for_creation: "To introduce new features like LISTAGG DISTINCT and standardized JSON improvements.",
      how_created: "Continued evolution of the SQL standard.",
      creator: "ISO/IEC",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/87/ISO_icon.svg",
      type: "an SQL Standard",
      speed_calculator: "",
    },
    "GraphQL": {
      name: "GraphQL",
      year_created: 2015,
      reason_for_creation: "To allow clients to define the structure of the response data.",
      how_created: "Developed at Facebook for efficient and flexible API data fetching.",
      creator: "Facebook",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/17/GraphQL_Logo.svg",
      type: "a Query Language",
      speed_calculator: "",
    },
    "Gremlin": {
      name: "Gremlin",
      year_created: 2009,
      reason_for_creation: "To query property graph data with a graph traversal language.",
      how_created: "Developed as part of Apache TinkerPop graph computing framework.",
      creator: "Marko Rodriguez",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/32/Apache_TinkerPop_Logo.svg",
      type: "a Query Language",
      speed_calculator: "",
    },
    "Cypher": {
      name: "Cypher",
      year_created: 2011,
      reason_for_creation: "To make querying graph databases intuitive and readable.",
      how_created: "Created for Neo4j as a SQL-like query language for graphs.",
      creator: "Neo4j",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Neo4j_logo.svg",
      type: "a Query Language",
      speed_calculator: "",
    },
    "SPARQL": {
      name: "SPARQL",
      year_created: 2008,
      reason_for_creation: "To query RDF data and semantic web data structures.",
      how_created: "Standardized by W3C as part of semantic web technologies.",
      creator: "W3C",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/a/a1/W3C_icon.svg",
      type: "a Query Language"
  },
  "Node.js": {
      name: "Node.js",
      year_created: 2009,
      reason_for_creation: "To provide a JavaScript runtime built on Chrome's V8 engine.",
      how_created: "Developed by Ryan Dahl and released as open-source.",
      creator: "Ryan Dahl",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
      type: "a Runtime Environment",
      speed_calculator: "const express = require('express');\nconst http = require('http');\nconst WebSocket = require('ws');\nconst path = require('path');\nconst app = express();\nconst server = http.createServer(app);\nconst wss = new WebSocket.Server({ server });\napp.use(express.static(path.join(__dirname, 'public')));\nwss.on('connection', (ws) => {\n  console.log('✅ Client connected');\n  ws.on('message', (msg) => {\n    console.log('📩 Received:', msg);\n    wss.clients.forEach(client => {\n      if (client !== ws && client.readyState === WebSocket.OPEN) {\n        client.send(msg);\n      }\n    });\n  });\n  ws.on('close', () => {\n    console.log('❌ Client disconnected');\n  });\n});\nconst PORT = 4000;\nserver.listen(PORT, () => {\n  console.log(🚀 Server running at http://localhost:${PORT});\n  console.log(🔌 WebSocket listening on ws://localhost:${PORT});\n  console.log(🌍 Use \"npx cloudflared tunnel --url http://localhost:${PORT}\" to expose it);\n});\n",
  },
  "BrainFuck": {
      name: "BrainFuck",
      year_created: 1993,
      reason_for_creation: "To create a minimalistic esoteric programming language.",
      how_created: "Designed by Urban Müller with only 8 commands.",
      creator: "Urban Müller",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Brainfuck_logo.svg",
      type: "an Esoteric Programming Language",
      speed_calculator: "",
    },
  "Cow": {
      name: "Cow",
      year_created: 2003,
      reason_for_creation: "To create a humorous, esoteric programming language.",
      how_created: "Designed by Sean Heber with cow-themed commands.",
      creator: "Sean Heber",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Cow_programming_language_logo.svg",
      type: "an Esoteric Programming Language"
    }, 
    "Electron.js": {
  name: "Electron.js",
  year_created: 2013,
  reason_for_creation: "To allow developers to build cross-platform desktop applications using web technologies (HTML, CSS, JavaScript).",
  how_created: "Created by Cheng Zhao at GitHub by combining Chromium and Node.js into a single runtime.",
  creator: "Cheng Zhao (at GitHub)",
  logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/91/Electron_Software_Framework_Logo.svg",
  type: "a Framework for Building Desktop Applications",
  speed_calculator: "const { app, BrowserWindow } = require('electron');\n\nlet win;\n\nfunction createWindow() {\n  win = new BrowserWindow({\n    width: 800,\n    height: 600,\n    webPreferences: {\n      nodeIntegration: true,\n      contextIsolation: false\n    }\n  });\n\n  win.loadFile('index.html');\n}\n\napp.whenReady().then(createWindow);\n\napp.on('window-all-closed', () => {\n  if (process.platform !== 'darwin') {\n    app.quit();\n  }\n});\n\napp.on('activate', () => {\n  if (BrowserWindow.getAllWindows().length === 0) {\n    createWindow();\n  }\n});",
}

    
      
};

// --- 10 New Features ---

// 1. Dark/Light Theme Toggle
const themeToggleBtn = document.createElement('button');
themeToggleBtn.textContent = 'Toggle Theme';
themeToggleBtn.style = 'position:fixed;bottom:10px;left:10px;z-index:1000;padding:7px 15px;background:#222;color:#00ffff;border:none;border-radius:5px;cursor:pointer;';
document.body.appendChild(themeToggleBtn);
let darkMode = true;
themeToggleBtn.onclick = () => {
  darkMode = !darkMode;
  document.body.style.background = darkMode ? '#111' : '#f5f5f5';
  document.body.style.color = darkMode ? '#fff' : '#222';
  // Update info text color
  document.querySelectorAll('#infoText').forEach(e => e.style.color = darkMode ? '#fff' : '#222');
  // Update code block color
  document.querySelectorAll('#codeOutput').forEach(e => {
    e.style.background = darkMode ? '#1e1e1e' : '#f5f5f5';
    e.style.color = darkMode ? '#fff' : '#222';
  });
  // Update quiz modal if present
  const modal = document.getElementById('quizEndModal');
  if (modal) {
    modal.querySelectorAll('div,button').forEach(e => {
      if (e.tagName === 'BUTTON') {
        e.style.background = darkMode ? (e.id === 'quizReplayBtn' ? '#00ff99' : '#ff0055') : (e.id === 'quizReplayBtn' ? '#00ff99' : '#ff0055');
        e.style.color = darkMode ? (e.id === 'quizReplayBtn' ? '#222' : '#fff') : (e.id === 'quizReplayBtn' ? '#222' : '#fff');
      } else {
        e.style.color = darkMode ? '#00ffff' : '#222';
      }
    });
  }
};

// 2. Random Language Button
const randomBtn = document.createElement('button');
randomBtn.textContent = 'Random Language';
randomBtn.style = 'position:fixed;bottom:50px;left:10px;z-index:1000;padding:7px 15px;background:#00ffff;color:#222;border:none;border-radius:5px;cursor:pointer;';
document.body.appendChild(randomBtn);
randomBtn.onclick = () => {
  const keys = Object.keys(logoData);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  input.value = logoData[randomKey].name;
  generateLogo();
};

// 3. Keyboard shortcut: Ctrl+R for random language
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key.toLowerCase() === 'r') {
    randomBtn.click();
  }
});

// 4. Keyboard shortcut: Ctrl+T for theme toggle
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key.toLowerCase() === 't') {
    themeToggleBtn.click();
  }
});

// 5. Show total number of languages
const langCountDiv = document.createElement('div');
langCountDiv.style = 'position:fixed;bottom:10px;right:10px;background:#222;color:#00ffff;padding:7px 15px;border-radius:5px;z-index:1000;font-size:15px;';
langCountDiv.textContent = 'Languages in DB: ' + Object.keys(logoData).length;
document.body.appendChild(langCountDiv);

// 6. Show last searched language
let lastSearched = '';
const lastSearchDiv = document.createElement('div');
lastSearchDiv.style = 'position:fixed;bottom:50px;right:10px;background:#222;color:#00ffff;padding:7px 15px;border-radius:5px;z-index:1000;font-size:15px;';
lastSearchDiv.textContent = 'Last Search: None';
document.body.appendChild(lastSearchDiv);
const origGenerateLogo = generateLogo;
generateLogo = function() {
  lastSearched = input.value;
  lastSearchDiv.textContent = 'Last Search: ' + lastSearched;
  origGenerateLogo();
};

// 7. Clear input on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    input.value = '';
    input.focus();
  }
});

// 8. Focus input on page click (not on buttons)

// 9. Show a welcome message on first load
if (!localStorage.getItem('langgen_welcome')) {
  setTimeout(() => {
    alert('Welcome to the Language Information Generator!\n Try searching or use the Random button.');
    localStorage.setItem('langgen_welcome', '1');
  }, 500);
}

// 10. Add a feedback link
const feedbackDiv = document.createElement('div');
feedbackDiv.style = 'position:fixed;bottom:90px;right:10px;background:#222;color:#00ffff;padding:7px 15px;border-radius:5px;z-index:1000;font-size:15px;';
feedbackDiv.innerHTML = '<a href="mailto:moaz96526@gmail.com?subject:A Feedback" style="color:#00ffff;text-decoration: none;">Send Feedback</a>';
document.body.appendChild(feedbackDiv);
window.onload = function() {
  input.focus();
  input.innerText = '';
};
const input = document.getElementById('langInput');
const logoContainer = document.getElementById('logoContainer');
const langList = document.getElementById("langList");

// Fill datalist with languages
Object.values(logoData).forEach(entry => {
  const option = document.createElement("option");
  option.value = entry.name;
  langList.appendChild(option);
});

document.addEventListener('DOMContentLoaded', function() {
  if (input) {
    input.value = '';
    input.focus();
  }
});
// Typewriter effect
function typeWriter(text, element, speed = 20, callback = null) {
  element.innerHTML = '';
  let i = 0;
  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    } else if (callback) {
      callback();
    }
  }
  typing();
}

// Hide results on typing
input.addEventListener("input", () => {
  logoContainer.style.display = 'none';
});

// Generate the logo, info, and code
function generateLogo() {
  const value = input.value.trim();
  // Case-insensitive lookup
  let langData = null;
  for (const key in logoData) {
    if (key.toLowerCase() === value.toLowerCase()) {
      langData = logoData[key];
      break;
    }
  }

  if (!value) {
    logoContainer.innerHTML = '<div class="msg">Please enter a language.</div>';
    logoContainer.style.display = 'block';
    return;
  }
  if (!langData) {
    logoContainer.innerHTML = '<div class="msg">Language not found in the database.</div>';
    logoContainer.style.display = 'block';
    return;
  }

  const descriptionText = `${langData.name} is ${langData.type} created in ${langData.year_created} by ${langData.creator}.\n\nIt was created ${langData.reason_for_creation}\n\nIt was ${langData.how_created}\n\n\n Here is a simple code in ${langData.name}: `;
  const codeText = langData.name + '\n\n\n\n' + (langData.speed_calculator || "No example code provided.");

  const html = `
    <h2 style="color:white; margin-bottom: 20px;" class="logo-title">${langData.name}</h2>
    <img src="${langData.logo_url}" alt="${langData.name} Logo Not Found" />
    <div id="infoText" style="margin-top: 25px; font-size: 16px; text-align: left; max-width: 700px; margin-inline: auto; white-space: pre-line; color: white;"></div>
    <div id="codeBlockWrapper" style="display: none; padding-top: 20px; text-align: left; max-width: 700px; margin-inline: auto;">
      <div style="background-color: #1e1e1e; color: white; padding: 15px; border-radius: 10px; overflow-x: auto;position: relative;">
              <button id="copyCodeBtn" style="position: sticky; top: 10px; right: 10px; padding: 5px 10px; background-color: #00ffff; color: black; border: none; border-radius: 5px; cursor: pointer;">Copy</button>
        <pre id="codeOutput" style="margin-top: 50px; padding-top: 5px; white-space: pre-wrap;"></pre>
      </div>
      `
;

  logoContainer.innerHTML = html;
  logoContainer.style.display = 'block';

  const infoDiv = document.getElementById('infoText');
  const codeBlockWrapper = document.getElementById('codeBlockWrapper');
  const codeOutput = document.getElementById('codeOutput');

  // Animate info
  typeWriter(descriptionText, infoDiv, 20, () => {
    codeBlockWrapper.style.display = 'block';
    // Animate code
    typeWriter(codeText, codeOutput, 5, () => {
      const copyBtn = document.getElementById('copyCodeBtn');
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(langData.speed_calculator || "No example code provided.").then(() => {
          copyBtn.textContent = 'Copied';
          setTimeout(() => copyBtn.textContent = 'Copy', 2000);
        });
      });

      // Scroll down after display
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 300);
    });
  });
}
input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        generateLogo();
        input.value = '';
        
    }
});
const label = document.querySelector('label');
const p = document.querySelector('p');
// 🌗 Dark/Light Mode Toggle with localStorage
// const toggleBtn = document.createElement('button');
// toggleBtn.id = 'toggleModeBtn';
// toggleBtn.style.position = 'absolute';
// toggleBtn.style.top = '20px';
// toggleBtn.style.right = '20px';
// toggleBtn.style.zIndex = '999';
// toggleBtn.style.padding = '10px 16px';
// toggleBtn.style.border = 'none';
// toggleBtn.style.borderRadius = '8px';
// toggleBtn.style.background = '#00ffff';
// toggleBtn.style.color = '#000';
// toggleBtn.style.cursor = 'pointer';
// document.body.appendChild(toggleBtn);

// let darkMode = true;

// // Load theme from localStorage
// if (localStorage.getItem('theme') === 'light') {
//   document.body.classList.add('light-mode');
//   darkMode = false;
//   toggleBtn.textContent = '☀️ Light Mode';
// } else {
//   toggleBtn.textContent = '🌙 Dark Mode';
// }

// // Toggle theme
// toggleBtn.addEventListener('click', () => {
//   darkMode = !darkMode;
//   document.body.classList.toggle('light-mode', !darkMode);
//   localStorage.setItem('theme', darkMode ? 'dark' : 'light');
//   toggleBtn.textContent = darkMode ? '🌙 Dark Mode' : '☀️ Light Mode';
// });
window.onload = () => {
  input.focus();
  input.innerHTML = '';
};
if (toggleBtn.innerHTML === '☀️ Light Mode'){
  document.body.style.color = '#000';
  descriptionText.style.color = '#000';
}
window.onload = function () {
  // Create container
  const rate = document.createElement('div');
  rate.className = 'factory';
  rate.style.position = 'fixed';
  rate.style.bottom = '20px';
  rate.style.right = '20px';
  rate.style.background = 'rgba(10, 25, 47, 0.95)';
  rate.style.padding = '20px';
  rate.style.borderRadius = '12px';
  rate.style.boxShadow = '0 0 10px #00e5ff88';
  rate.style.zIndex = '9999';

  const title = document.createElement('h3');
  title.textContent = '⭐ Rate Our Factory';
  title.style.marginBottom = '10px';
  title.style.color = '#66ffff';

  const stars = document.createElement('div');
  stars.className = 'stars';
  stars.dataset.factory = 'mainFactory';
  stars.innerHTML = '★★★★★';
  stars.style.fontSize = '24px';
  stars.style.cursor = 'pointer';
  stars.style.color = 'gray';

  rate.appendChild(title);
  rate.appendChild(stars);
  document.body.appendChild(rate);

  const socket = new WebSocket('ws://' + window.location.host);

  stars.addEventListener('mousemove', (e) => {
    const x = e.offsetX;
    const width = stars.clientWidth;
    const count = Math.ceil((x / width) * 5);
    highlightStars(stars, count);
  });

  stars.addEventListener('mouseleave', () => {
    highlightStars(stars, 0);
  });

  stars.addEventListener('click', (e) => {
    const x = e.offsetX;
    const width = stars.clientWidth;
    const starsCount = Math.ceil((x / width) * 5);
    const msg = JSON.stringify({ factoryId: 'mainFactory', stars: starsCount });
    socket.send(msg);
  });

  socket.addEventListener('message', (event) => {
    const { factoryId, stars: count } = JSON.parse(event.data);
    if (factoryId === 'mainFactory') {
      highlightStars(stars, count);
    }
  });

  function highlightStars(container, count) {
    container.innerHTML = '★★★★★'.split('').map((star, i) =>
      `<span style="color:${i < count ? 'gold' : 'gray'}">${star}</span>`
    ).join('');
  }
};
