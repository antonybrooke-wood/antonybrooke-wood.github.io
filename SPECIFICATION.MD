# Specification — Fun Five-Question Interactive Webpage

## 1. Overview
The webpage is an **interactive, animated quiz-like experience** containing **5 sequential questions**.  
- **Questions 1–4**: Yes/No questions with humorous responses to "No" and celebratory responses to "Yes".  
- **Question 5**: Free-text input (medium length), whose answer is submitted to a **Google Apps Script endpoint**.  
- **Final outcome**: A congratulatory banner encouraging the user to collect a stamp.  

The goal is to make the experience **fun, energetic, and brand-compliant** with animations, sounds, and playful UI behavior.

---

## 2. Question Flow

### Q1–Q4 (Yes/No)
- **"Yes" button**:
  - Triggers a short celebratory animation (e.g., fireworks, confetti burst, or animated “YES!” overlay).
  - Plays an uplifting sound effect (e.g., “Yes!” voice clip, chime, or fanfare).
  - After a **0.8–1.5 second delay**, transitions smoothly to the next question using:
    - Fade-out / fade-in
    - Slide left
    - Or brand-appropriate transition.
- **"No" button**:
  - Does **not** advance to the next question.
  - Triggers a humorous action:
    - Option 1: Button animates away from mouse pointer (dodging click).
    - Option 2: Button “shakes” or bounces out of position.
    - Option 3: Plays a comedic buzzer sound and flashes red.
  - Humor choice may be randomized between interactions.

- **Actual questions**
    - Q1: Can you use an international passport in the digital ID verification in Loanapp?
    - Q2: Can you recall a valuation you have ordered in Property Hub to instantly attach to Loanapp?
    - Q3: Can you get a LMI quote directly from the LMI providers in Loanapp?
    - Q4: Can you obtain verified income from Illion in Loanapp?


### Q5 (Free Text Input)
- Single multiline text box (approx. 3–5 visible lines) for medium-length answers.
- “Submit” button:
  - Sends the text via POST in JSON format:
    ```json
    { "text": "user's answer here" }
    ```
    to the preconfigured **Google Apps Script Web App URL**.
  - Displays loading animation during submission.
  - On success:
    - Plays celebratory sound (e.g., fanfare).
    - Shows an **animated banner** with:
      ```
      Congratulations! Please collect your stamp!
      ```
    - Banner should:
      - Animate into view (slide/fade/bounce).
      - Include small celebratory elements (confetti, sparkles, etc.).

- **Actual question**
    - Q5: What feature would you like to see in Loanapp?

---

## 3. Visual & Interactive Elements

### Animations
- Smooth transitions between questions (0.5–1.0 seconds).
- Button effects (hover scaling, bounce).
- Celebration animations (confetti, fireworks).
- Humorous "No" button avoidance or shake animations.

### Sounds
- Positive (“Yes”):  
  - Short celebratory audio clip (e.g., “Yes!” voiced, chime, fanfare).
- Negative (“No”):  
  - Buzzer or comedic sound effect.
- Final submission:  
  - Trumpet/fanfare or applause.

### Brand Guidelines Compliance
- All colors, fonts, and UI elements will adhere to provided **brand palette**, typography, and tone-of-voice.
- Animations should be playful but not distracting from primary content.
- Sound effects will be short (<2s) and not disruptive.
- Please refer to the Simpology Brand Guidelines for details on:
    - Logo Spacing
    - Typography rules
    - Using the logo on a white background
    - Colour rules
    - Backgrounds
    - Mockup rules
- The Simpology Brand Guidelines are in the sub-directory called materials and the file is called "simpology-brand-guidelines.md"
- The "materials" sub-folder also contains relevant:
    - Fonts: C:\src\simpology\simpology.marketing.mc-conference\materials\Font_Download_Here
    - Icons: C:\src\simpology\simpology.marketing.mc-conference\materials\Logos_Images_Gradients_and_Backgrounds\Icons
    - Backgrounds: C:\src\simpology\simpology.marketing.mc-conference\materials\Logos_Images_Gradients_and_Backgrounds\Decorative Gradients And Backgrounds
    - Logos: C:\src\simpology\simpology.marketing.mc-conference\materials\Logos_Images_Gradients_and_Backgrounds\Simpology Logos

---

## 4. Technical Specifications

### Front-End
- **HTML5 + CSS3 + Vanilla JavaScript** (no frameworks, no NPM).
- CSS animations and/or JavaScript-driven animations (e.g., `requestAnimationFrame` or `setTimeout`).
- Sound effects in standard formats (`.mp3` / `.ogg`).
- Responsive design for desktop/tablet/mobile.

### Data Handling
- First 4 question answers are **not recorded**.
- Question 5 answer is submitted via `fetch()` to:
  - **Google Apps Script Web App URL** (provided in config).
  - POST body is JSON with `"text"` field only.
  - Handle JSON success/failure responses.
- Please refer to this example HTML page (apps-script.html) which has the working form: 
    - Location C:\src\simpology\simpology.marketing.mc-conference\materials\apps-script.html

### Configuration
- All text (questions, messages) stored in a **JavaScript configuration object** for easy updates.
- Apps Script URL defined in a single variable at the top of the script.
- Sound effect and animation settings defined in config for easy modification.

---

## 5. States & User Feedback

| Step                  | Visual Feedback                              | Audio Feedback        | Transition         |
|-----------------------|----------------------------------------------|-----------------------|--------------------|
| Yes click (Q1–Q4)     | Fireworks/confetti + “YES!” overlay           | Positive clip         | After delay, next Q|
| No click (Q1–Q4)      | Button dodge/shake, red flash                 | Buzzer/comedy clip    | No transition      |
| Submit Q5 (sending)   | Loading spinner or pulsing “Sending…” text    | None                  | Wait for response  |
| Submit Q5 (success)   | “Congratulations! Please collect your stamp!” banner | Fanfare/applause     | Remains visible    |
| Submit Q5 (error)     | Error banner in red                           | Short alert tone      | Remains on Q5      |

---

## 6. Accessibility
- All buttons and form fields must be keyboard accessible.
- Sound effects should have toggle/mute option.
- Text contrast must meet WCAG AA standards.

---

## 7. Security
- No storage of Yes/No answers.
- Free-text answer sent only to Apps Script endpoint.

---

## 8. Deliverables
- HTML/CSS/JS static files (self-contained).
- Assets folder with sounds, animations, and images.
- Config file for:
  - Question text
  - Apps Script URL
  - Animation and sound options
