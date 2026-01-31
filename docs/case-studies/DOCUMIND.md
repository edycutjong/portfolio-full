# DocuMind AI — Case Study

## 🎯 Problem

Organizations and individuals with large document collections face a critical challenge: **finding specific information quickly**. Traditional keyword search fails because:

- Documents contain domain-specific terminology
- Information is scattered across multiple files
- Context is lost in simple text matching
- No way to ask natural language questions

**The real cost:** Hours wasted searching through PDFs instead of getting work done.

---

## 💡 Solution

Built **DocuMind AI** — an intelligent document Q&A system powered by Retrieval-Augmented Generation (RAG).

### Architecture Decisions

| Component | Choice | Why |
|-----------|--------|-----|
| **Vector DB** | Pinecone | Managed, scalable, sub-50ms queries |
| **LLM** | GPT-4o-mini | Best cost/performance ratio for Q&A |
| **Framework** | LangChain | Mature RAG tooling, document loaders |
| **API** | FastAPI | Async, auto-docs, Python ecosystem |

### How It Works

```
📄 Document → Chunk → Embed → Store (Pinecone)
                                    ↓
❓ Question → Embed → Search → Context → LLM → Answer + Citations
```

### Key Technical Decisions

1. **Semantic Chunking**: Split documents by meaning, not just character count
2. **Overlap Strategy**: 200-char overlap prevents losing context at chunk boundaries  
3. **Citation System**: Every answer includes source chunks for verification
4. **Streaming**: Responses stream token-by-token for perceived speed

---

## 📊 Results

| Metric | Value |
|--------|-------|
| Answer accuracy | 95%+ with citations |
| Response time | < 3 seconds average |
| File formats | PDF, DOCX, TXT |
| Deployment | Vercel serverless |

### Lessons Learned

- **Chunk size matters**: 1000 chars with 200 overlap was optimal
- **Prompt engineering**: Clear system prompts dramatically improve answer quality
- **Cost management**: GPT-4o-mini is 10x cheaper than GPT-4 with similar quality for Q&A

---

## 🔗 Links

- **Live API**: [documind-api.edycu.dev](https://documind-api.edycu.dev)
- **API Docs**: [/docs](https://documind-api.edycu.dev/docs)
- **Source Code**: [GitHub](https://github.com/edycutjong/portfolio-full/tree/main/apps/documind-api)
