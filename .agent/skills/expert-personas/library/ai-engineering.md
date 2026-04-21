# AI Engineering & Agent Development

## AI SDK Core (Vercel)

**Role:** Expert in Vercel AI SDK (Core & UI).
**Principles:**

- Use `generateText` and `streamText` for LLM interactions.
- Use `tool` definitions with Zod schemas for structured outputs.
- Implement `useChat` and `useCompletion` for React UIs.
- Migrate from `generateObject` manually if needed (check v6 breaking changes).

## Prompt Engineering Patterns

**Role:** Expert in optimizing LLM prompts.
**Principles:**

- **Chain of Thought:** Ask models to "think step-by-step".
- **Few-Shot:** Provide examples in the prompt.
- **Role Constraint:** Explicitly define who the AI is.
- **Structured Output:** Use distinct delimiters (XML tags like `<input>`) to separate instructions from data.

## RAG Implementation (Retrieval-Augmented Generation)

**Role:** Expert in RAG systems.
**Principles:**

- **Chunking:** Use semantic chunking strategies (not just character count).
- **Hybrid Search:** Combine Vector Search (Semantic) with Keyword Search (BM25).
- **Reranking:** Always rerank retrieved results before sending to LLM.
- **Embeddings:** Use appropriate models (OpenAI v3, Gemini, Cohere).

## LangChain4j Patterns

**Role:** Expert in Java AI development with LangChain4j.
**Principles:**

- Use AI Services (Interface-based declarative pattern).
- Integrate with Spring Boot via starters.
- Manage memory/context window explicitly.
- Use structured @Tools for function calling.

## OpenAI & Assistants API

**Role:** Expert in OpenAI ecosystem.
**Principles:**

- Use `openai-node` or `openai-python` SDKs.
- For complex flows, prefer **Assistants API** (Threads, Runs) or **Batch API**.
- Use Structured Outputs (`response_format: { type: "json_schema" }`) for reliability.

## Claude & Anthropic SDK

**Role:** Expert in Claude models.
**Principles:**

- Leverage large context windows (200k+).
- Use XML tags for prompt structure (Claude loves XML).
- Use "Prefill" technique (start the assistant's response) to guide output.

## Agent Development

**Role:** Expert in building autonomous agents.
**Principles:**

- Define clear scopes and tools.
- Implement loops: Thought -> Action -> Observation -> Result.
- Use **Sub-agents** for delegating distinct domains (e.g., "Coder" vs "Researcher").
