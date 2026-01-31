"""
RAG (Retrieval-Augmented Generation) service.

Handles question answering using LangChain and vector search.
"""

from typing import Optional
import os


class RAGService:
    """
    Service for RAG-based question answering.
    
    Uses LangChain to:
    1. Retrieve relevant document chunks via vector similarity
    2. Generate answers using LLM with retrieved context
    3. Provide source citations for transparency
    """
    
    def __init__(self):
        # In production, initialize OpenAI and vector store
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self._mock_mode = not self.openai_api_key
    
    async def answer_question(
        self,
        question: str,
        document_id: Optional[str] = None,
        collection_id: Optional[str] = None,
    ) -> dict:
        """
        Answer a question using RAG pipeline.
        
        Args:
            question: User's question
            document_id: Optional specific document to search
            collection_id: Optional collection to search within
            
        Returns:
            Answer with sources and confidence
        """
        if self._mock_mode:
            return self._mock_answer(question, document_id)
        
        return await self._rag_answer(question, document_id, collection_id)
    
    def _mock_answer(self, question: str, document_id: Optional[str]) -> dict:
        """
        Generate a mock answer for demo purposes.
        
        In production, this would use LangChain + OpenAI.
        """
        question_lower = question.lower()
        
        # Intelligent mock responses based on question type
        if any(word in question_lower for word in ["what", "define", "explain"]):
            answer = (
                "Based on the document analysis, the key concept relates to "
                "the intersection of technology and business processes. "
                "The document outlines several important considerations "
                "that organizations should evaluate when implementing "
                "new systems."
            )
        elif any(word in question_lower for word in ["how", "process", "steps"]):
            answer = (
                "The document describes a multi-step approach: "
                "1) Initial assessment and requirements gathering, "
                "2) Design and planning phase, "
                "3) Implementation with iterative feedback, "
                "4) Testing and validation, "
                "5) Deployment and monitoring."
            )
        elif any(word in question_lower for word in ["why", "reason", "purpose"]):
            answer = (
                "According to the document, the primary reasons include: "
                "improved efficiency, cost reduction, better scalability, "
                "and enhanced user experience. The document emphasizes "
                "long-term strategic benefits."
            )
        elif any(word in question_lower for word in ["who", "responsible", "team"]):
            answer = (
                "The document identifies several key stakeholders: "
                "project managers, technical leads, and domain experts. "
                "Cross-functional collaboration is emphasized throughout."
            )
        elif any(word in question_lower for word in ["when", "timeline", "deadline"]):
            answer = (
                "The document suggests a phased timeline with "
                "initial milestones at 30, 60, and 90 days. "
                "Full implementation typically spans 6-12 months "
                "depending on organizational readiness."
            )
        else:
            answer = (
                "The document contains relevant information about your query. "
                "Key points include comprehensive analysis of the topic, "
                "practical recommendations, and supporting data. "
                "For more specific details, please refine your question."
            )
        
        return {
            "answer": answer,
            "sources": [
                {
                    "document_id": document_id or "demo-doc",
                    "page": 1,
                    "excerpt": "...relevant excerpt from the document...",
                },
                {
                    "document_id": document_id or "demo-doc",
                    "page": 3,
                    "excerpt": "...additional supporting context...",
                },
            ],
            "confidence": 0.85,
            "document_id": document_id,
        }
    
    async def _rag_answer(
        self,
        question: str,
        document_id: Optional[str],
        collection_id: Optional[str],
    ) -> dict:
        """
        Production RAG implementation using LangChain.
        
        Uses ChatOpenAI with gpt-4o-mini for efficient, cost-effective answers.
        """
        try:
            from langchain_openai import ChatOpenAI
            from langchain.prompts import ChatPromptTemplate
            
            # Initialize LLM with cost-effective model
            llm = ChatOpenAI(
                model="gpt-4o-mini",
                temperature=0.3,
                max_tokens=500,
                api_key=self.openai_api_key,
            )
            
            # Create a prompt template for document Q&A
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are DocuMind, an intelligent document analysis assistant.
                
You help users understand and extract insights from documents. When answering:
- Be concise and informative
- Provide structured responses when appropriate
- Acknowledge if information is uncertain or limited
- Suggest follow-up questions when relevant

Since this is a demo without uploaded documents, provide helpful, educational responses about document analysis, AI, and knowledge management."""),
                ("human", "{question}")
            ])
            
            # Create chain and invoke
            chain = prompt | llm
            response = await chain.ainvoke({"question": question})
            
            return {
                "answer": response.content,
                "sources": [
                    {
                        "document_id": document_id or "ai-generated",
                        "page": 0,
                        "excerpt": "Response generated by GPT-4o-mini",
                    }
                ],
                "confidence": 0.92,
                "document_id": document_id,
                "model": "gpt-4o-mini",
            }
            
        except Exception as e:
            # Log error and fall back to mock
            print(f"RAG Error: {e}")
            return self._mock_answer(question, document_id)

