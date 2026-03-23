# AI-Debater

[Live Site](https://iDebate.xyz)

A web application for conducting human-vs-AI debates on diverse, auto-generated topics. Debates are turn-based and scored by an impartial AI judge.  
**Key highlight:** The platform uses the Hugging Face Inference API to generate arguments and judge debates, while all state, roles, and debate flow are orchestrated in the server logic.

---

## Features

- **Debate Generation**: Random debate topics are generated with prompt variety and surprise.
- **Multi-Round Debates**: Human and AI take turns across configurable number of rounds.
- **LLM Arguments**: Each AI move is generated via [Hugging Face Inference API](https://huggingface.co/inference-api) using models like Llama-3.
- **Difficulty Levels**: AI adapts its persona and argumentation style with custom instructions per difficulty.
- **Blind AI Judging**: At the end, the entire debate is scored (with feedback) by an impartial LLM-based judge who is blinded to which debater is human or AI.
- **JSON-Only Scoring**: The judge outputs machine-parseable JSON for round-by-round and overall results.
- **Full State Management**: All debate history, strategy, and feedback are tracked on the backend/server, and included in every AI prompt.

---

## Architecture

- **Stateful Orchestrator**: The server/script tracks the entire debate—history, participant roles, difficulty instructions, and strategies.
- **Hugging Face as Engine**: All AI “moves” (debate arguments, topic generation, judging) are sent as structured prompts to the Hugging Face Inference API.
- **Prompt Engineering**: Custom system messages ensure each LLM call “acts” in character (e.g., debater-for, debater-against, judge).
- **Streaming**: Argument generation is streamed from the API for fast/partial responses.
- **Identity Blinding**: For scoring, “Debater A” and “Debater B” are assigned randomly each debate.

---

## Example Debate Flow

1. **Topic Generation**:  
   A debate topic is retrieved/requested from Hugging Face LLM or is inputted by user and stored in state.
2. **Turn-based Rounds**:  
   Each round:
   - User submits an argument.
   - Backend collates **full debate history** and role/difficulty into the prompt.
   - Hugging Face LLM generates the AI’s response.
   - Backend stores both arguments and moves to next round.
3. **Judging**:
   - After max rounds, the backend submits the entire transcript (with blinded roles) to the LLM judge model.
   - Receives JSON with user and AI scores, summary, and actionable feedback.

---

## Technologies

- **Backend** – TypeScript, Node.js, Hugging Face Inference API, NextAuth, MySQL
- **Frontend** – Next.js/React

---

## Run Locally

1. **Clone & Install**
   ```bash
   git clone https://github.com/JCMlo02/AI-Debater.git
   cd AI-Debater
   npm install
   ```
2. **Add Hugging Face API Key**

   - Set `HF_ACCESS_TOKEN` in your `.env` or environment variables.

3. **Start Server**

   ```bash
   npm run dev
   ```

4. **Visit**  
   Open [http://localhost:3000](http://localhost:3000) and start debating!

---

## Agentic Design Note

While the LLM itself is stateless, the **agent-like behavior** arises from:

- Persistent state/history management by the orchestrator.
- Carefully engineered prompts that inject persona, side, difficulty, and strategic memory for the LLM each turn.
- Server logic could be extended to support agent adaptivity, planning, or strategies between rounds.

---

## Credits

- Built by [JCMlo02](https://github.com/JCMlo02)
- Powered by Hugging Face Inference API
