from abc import ABC, abstractmethod
from typing import List, Dict, Any

class LLMProvider(ABC):
    @abstractmethod
    def generate_explanation(
        self,
        prompt: str,
        system_instruction: str,
        retrieved_evidence: List[Dict[str, Any]],
        matched_rules: List[Dict[str, Any]]
    ) -> str:
        """
        Generate source-grounded plain-language synthesis.
        Must NOT invent compliance rules or statutory requirements.
        """
        pass

class EmbeddingProvider(ABC):
    @abstractmethod
    def embed_text(self, text: str) -> List[float]:
        """
        Produce vector embedding with exactly EMBEDDING_DIMENSION (768).
        """
        pass

    @abstractmethod
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        pass
