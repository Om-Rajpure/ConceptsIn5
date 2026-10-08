import logging

logger = logging.getLogger(__name__)

def generate_summary(description):
    """
    Extracts a concise 2-sentence summary from video descriptions using LSA,
    with graceful fallback to text slicing if sumy/nltk is not installed.
    """
    if not description:
        return ""
        
    try:
        from sumy.parsers.plaintext import PlaintextParser
        from sumy.nlp.tokenizers import Tokenizer
        from sumy.summarizers.lsa import LsaSummarizer
        import nltk

        # Ensure punkt is downloaded for tokenizer
        try:
            nltk.data.find('tokenizers/punkt_tab')
        except LookupError:
            try:
                nltk.download('punkt_tab', quiet=True)
            except Exception:
                pass
            
        parser = PlaintextParser.from_string(description, Tokenizer("english"))
        summarizer = LsaSummarizer()

        # Generate a 2-sentence summary
        summary_sentences = summarizer(parser.document, 2)
        summary = " ".join(str(sentence) for sentence in summary_sentences)
        return summary.strip()

    except ImportError:
        # Graceful fallback: return the first 2 sentences via basic string split
        sentences = [s.strip() for s in description.replace('\n', ' ').split('.') if s.strip()]
        return ". ".join(sentences[:2]) + ("." if sentences else "")
    except Exception as e:
        logger.error(f"Error generating summary: {e}", exc_info=True)
        sentences = [s.strip() for s in description.replace('\n', ' ').split('.') if s.strip()]
        return ". ".join(sentences[:2]) + ("." if sentences else "")
