from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer
import nltk

def generate_summary(description):
    if not description:
        return ""
        
    try:
        # Ensure punkt is downloaded for tokenizer
        try:
            nltk.data.find('tokenizers/punkt_tab')
        except LookupError:
            nltk.download('punkt_tab', quiet=True)
            
        parser = PlaintextParser.from_string(description, Tokenizer("english"))
        summarizer = LsaSummarizer()

        # Generate a 2-sentence summary
        summary_sentences = summarizer(parser.document, 2)
        summary = " ".join(str(sentence) for sentence in summary_sentences)

        return summary.strip()

    except Exception as e:
        print(f"Error generating summary: {e}")
        return ""
