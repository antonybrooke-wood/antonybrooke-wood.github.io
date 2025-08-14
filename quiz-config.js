// Simpology Conference Quiz Configuration
const QUIZ_CONFIG = {
  scriptUrl: "https://script.google.com/macros/s/AKfycbwedDWERxHg6cqxH1Z58oDWLFwNLP1uwXpfbxmM6iREDq9lJiOlmmYrIowYTvJzbi0a/exec", // Replace with your actual endpoint
  soundEnabled: true,
  questions: [
    {
      type: "yesno",
      text: "Can you use an international passport in the digital ID verification in Loanapp?"
    },
    {
      type: "yesno",
      text: "Can you recall a valuation you have ordered in Property Hub to instantly attach to Loanapp?"
    },
    {
      type: "yesno",
      text: "Can you get a LMI quote directly from the LMI providers in Loanapp?"
    },
    {
      type: "yesno",
      text: "Can you obtain verified income from Illion in Loanapp?"
    },
    {
      type: "text",
      text: "What feature would you like to see in Loanapp?"
    }
  ],
  messages: {
    final: "Congratulations! Please collect your stamp!",
    error: "Oops! Something went wrong. Please try again.",
    loading: "Sending..."
  },
  sounds: {
    yes: ["assets/sounds/yes1.mp3", "assets/sounds/yes2.mp3"],
    no: ["assets/sounds/no1.mp3", "assets/sounds/no2.mp3"],
    success: ["assets/sounds/success.mp3"],
    error: ["assets/sounds/error.mp3"]
  },
  animations: {
    yes: ["confetti", "fireworks", "yesOverlay"],
    no: ["dodge", "shake", "flashRed"],
    final: ["banner", "confetti"]
  }
};
