"""
ConceptsIn5 Claude AI Service
Integrates with Anthropic Claude API (3.5 Haiku / Sonnet) to power:
1. Context-Grounded Concept Tutor (Socratic explanations, simplification, examples, exam tips)
2. Interactive Quick Quiz Generator (Diagnostic assessment based on verified notes)
Includes telemetry, token observability, strict grounding, and graceful fallbacks.
"""

import os
import json
import time
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

# System prompt defining the pedagogical persona and strict grounding rules
TUTOR_SYSTEM_PROMPT = """You are the ConceptsIn5 Concept Tutor — an expert AI engineering educator.
Your mission is to help engineering students deeply understand complex computer science, mathematics, and engineering concepts in 5 minutes or less.

Guiding Principles:
1. Clarity Over Fluff: Get straight to the intuition and technical mechanics without verbose throat-clearing.
2. Grounding: Prioritize the provided ConceptsIn5 module context (subject, topics, notes, summary). If answering beyond the module, clearly state it.
3. Structure: Use concise paragraphs, bullet points, and code/math snippets where helpful.
4. Tone: Encouraging, intellectually rigorous, modern, and practical.

Always respond in valid JSON matching this schema:
{
  "answer": "Clear markdown explanation answering the student's question",
  "key_points": ["Key point 1", "Key point 2", "Key point 3"],
  "example": "A concrete real-world engineering analogy or minimal code/math example",
  "exam_tip": "High-yield advice for university exams and technical interviews",
  "follow_up_questions": ["Suggested question 1", "Suggested question 2"]
}
"""

QUIZ_SYSTEM_PROMPT = """You are the ConceptsIn5 Diagnostic Engine.
Generate a high-yield, 4-question diagnostic quiz based on the provided technical learning material.

Rules:
- Questions 1 to 3 must be Multiple Choice Questions (MCQs) with exactly 4 options (A, B, C, D).
- Question 4 must be a short conceptual scenario question with an exemplary answer.
- Focus on core principles, common exam traps, and real engineering trade-offs.

Always respond in valid JSON matching this schema:
{
  "title": "Quiz title for this concept",
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "question": "Question text...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_index": 0,
      "explanation": "Why this option is correct and others are incorrect."
    },
    {
      "id": 2,
      "type": "mcq",
      "question": "Question text...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_index": 1,
      "explanation": "Detailed explanation..."
    },
    {
      "id": 3,
      "type": "mcq",
      "question": "Question text...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_index": 2,
      "explanation": "Detailed explanation..."
    },
    {
      "id": 4,
      "type": "conceptual",
      "question": "Scenario or practical engineering problem...",
      "model_answer": "Key points required in a complete answer.",
      "key_criteria": ["Criterion 1", "Criterion 2"]
    }
  ]
}
"""


def _get_anthropic_client():
    """Initializes and returns the Anthropic client with timeout if API key is present."""
    api_key = getattr(settings, 'ANTHROPIC_API_KEY', None) or os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        return None
    try:
        import anthropic
        # Set a reasonable 30-second timeout to prevent hung requests
        return anthropic.Anthropic(api_key=api_key, timeout=30.0)
    except Exception as e:
        logger.error(f"Failed to initialize Anthropic client: {e}")
        return None


def _clean_json_response(raw_text):
    """Safely extracts JSON from code fences or surrounding text."""
    text = raw_text.strip()
    if text.startswith("```json"):
        text = text.split("```json", 1)[1].rsplit("```", 1)[0].strip()
    elif text.startswith("```"):
        text = text.split("```", 1)[1].rsplit("```", 1)[0].strip()
    
    # Locate outer brackets if surrounded by extraneous text
    first_brace = text.find('{')
    last_brace = text.rfind('}')
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        text = text[first_brace:last_brace + 1]
        
    return json.loads(text)


def ask_concept_tutor(context_data, user_question, action_type="custom"):
    """
    Asks the Claude Concept Tutor a question grounded in the current learning context.
    
    :param context_data: dict containing title, subject_name, topics, summary, notes_content
    :param user_question: str, the question or prompt from the student
    :param action_type: str, e.g. "simplify", "example", "exam_tip", "compare", "custom"
    :return: dict with structured response and telemetry metadata
    """
    start_time = time.time()
    client = _get_anthropic_client()
    model = getattr(settings, 'ANTHROPIC_MODEL', 'claude-3-5-haiku-20241022')
    max_tokens = getattr(settings, 'ANTHROPIC_MAX_TOKENS', 1024)

    # Build grounded context block
    context_text = f"""
Module Title: {context_data.get('title', 'Unknown')}
Subject: {context_data.get('subject_name', 'Engineering')}
Topics Covered: {', '.join(context_data.get('topics', []))}
Quick Summary: {context_data.get('summary', '')}
Detailed Notes / Content:
{context_data.get('notes_content', 'No extra notes provided.')}
"""

    prompt = f"""
Student Question: {user_question}
Action Intent: {action_type}

Context:
{context_text}

Please provide your structured response in JSON format.
"""

    if not client:
        # High-quality offline/developer fallback response grounded in module data
        title = context_data.get('title', 'This Concept')
        summary = context_data.get('summary', 'Core engineering principle.')
        notes = context_data.get('notes_content', '')
        
        latency_ms = int((time.time() - start_time) * 1000)
        logger.info(f"[AI Telemetry] Concept Tutor (Offline) | Topic: '{title}' | Action: '{action_type}' | Latency: {latency_ms}ms")
        
        return {
            "answer": f"**{title}** focuses on {summary}\n\n{notes[:300]}...\n\n*(Note: Running in offline/development mode. Configure `ANTHROPIC_API_KEY` for live Claude 3.5 real-time answers.)*",
            "key_points": [
                f"Core mechanism of {title}",
                "Essential for semester exams and technical interviews",
                "Simplifies complex multi-step logic into 5-minute modular concepts"
            ],
            "example": f"Think of {title} as an optimized workflow that eliminates redundant computation or storage.",
            "exam_tip": f"Be prepared to define {title} clearly and write a 2-step schematic or proof on your exam sheet.",
            "follow_up_questions": [
                f"How does {title} compare to alternative approaches?",
                f"What is the most common mistake students make with {title}?"
            ],
            "model_used": "offline-grounded-engine",
            "latency_ms": latency_ms
        }

    try:
        response = client.messages.create(
            model=model,
            max_tokens=max_tokens,
            temperature=0.3,
            system=TUTOR_SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        raw_text = response.content[0].text.strip()
        data = _clean_json_response(raw_text)
        
        latency_ms = int((time.time() - start_time) * 1000)
        input_tokens = getattr(response.usage, 'input_tokens', 0)
        output_tokens = getattr(response.usage, 'output_tokens', 0)
        
        logger.info(
            f"[AI Telemetry] Concept Tutor Success | Model: {model} | Topic: '{context_data.get('title')}' | "
            f"Action: '{action_type}' | Tokens: {input_tokens}in/{output_tokens}out | Latency: {latency_ms}ms"
        )
        
        data['model_used'] = model
        data['latency_ms'] = latency_ms
        return data

    except json.JSONDecodeError:
        latency_ms = int((time.time() - start_time) * 1000)
        logger.warning(f"[AI Telemetry] Claude response not strict JSON. Fallback formatting applied.")
        return {
            "answer": raw_text,
            "key_points": [],
            "example": "",
            "exam_tip": "",
            "follow_up_questions": [],
            "model_used": model,
            "latency_ms": latency_ms
        }
    except Exception as e:
        latency_ms = int((time.time() - start_time) * 1000)
        logger.error(f"[AI Telemetry] Claude API error: {e} | Latency: {latency_ms}ms", exc_info=True)
        return {
            "answer": "The Concept Tutor is temporarily unavailable. Please try again in a few moments.",
            "key_points": [],
            "example": "",
            "exam_tip": "",
            "follow_up_questions": [],
            "error": "AI service temporarily unavailable.",
            "model_used": "error",
            "latency_ms": latency_ms
        }


def generate_quick_quiz(context_data):
    """
    Generates a 4-question diagnostic quiz grounded in the module context.
    """
    start_time = time.time()
    client = _get_anthropic_client()
    model = getattr(settings, 'ANTHROPIC_MODEL', 'claude-3-5-haiku-20241022')
    max_tokens = getattr(settings, 'ANTHROPIC_MAX_TOKENS', 1200)

    context_text = f"""
Module Title: {context_data.get('title', 'Unknown')}
Subject: {context_data.get('subject_name', 'Engineering')}
Topics Covered: {', '.join(context_data.get('topics', []))}
Quick Summary: {context_data.get('summary', '')}
Detailed Notes / Content:
{context_data.get('notes_content', 'No extra notes provided.')}
"""

    prompt = f"""
Generate a 4-question diagnostic quiz for this technical concept.

Context:
{context_text}

Respond ONLY in valid JSON.
"""

    if not client:
        title = context_data.get('title', 'Concept Assessment')
        latency_ms = int((time.time() - start_time) * 1000)
        logger.info(f"[AI Telemetry] Quick Quiz (Offline) | Topic: '{title}' | Latency: {latency_ms}ms")
        
        return {
            "title": f"Quick Check: {title}",
            "questions": [
                {
                    "id": 1,
                    "type": "mcq",
                    "question": f"What is the primary objective of {title}?",
                    "options": [
                        f"To eliminate unnecessary complexity and optimize structure",
                        "To increase latency and computation time",
                        "To duplicate data across multiple subsystems",
                        "None of the above"
                    ],
                    "correct_index": 0,
                    "explanation": f"{title} is specifically designed to streamline structure and eliminate redundancy."
                },
                {
                    "id": 2,
                    "type": "mcq",
                    "question": f"Which condition is essential when applying {title}?",
                    "options": [
                        "Random guessing",
                        "Strict preservation of dependencies and consistency",
                        "Ignoring edge cases",
                        "Unlimited memory allocation"
                    ],
                    "correct_index": 1,
                    "explanation": "Preserving core mathematical and functional dependencies is strictly required."
                },
                {
                    "id": 3,
                    "type": "mcq",
                    "question": "How is this concept evaluated in standard technical examinations?",
                    "options": [
                        "Only by memorizing definitions",
                        "Through step-by-step problem solving and edge case identification",
                        "It is never tested",
                        "Multiple choice only"
                    ],
                    "correct_index": 1,
                    "explanation": "Examiners focus on verifying your ability to apply the principle to unseen scenarios."
                },
                {
                    "id": 4,
                    "type": "conceptual",
                    "question": f"In 2 sentences, describe when you should NOT use {title}.",
                    "model_answer": f"Avoid {title} when the overhead of implementation exceeds the performance or maintainability benefits.",
                    "key_criteria": [
                        "Mention overhead vs benefit",
                        "Identify inappropriate simple scenarios"
                    ]
                }
            ],
            "model_used": "offline-diagnostic-engine",
            "latency_ms": latency_ms
        }

    try:
        response = client.messages.create(
            model=model,
            max_tokens=max_tokens,
            temperature=0.2,
            system=QUIZ_SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        raw_text = response.content[0].text.strip()
        data = _clean_json_response(raw_text)
        
        latency_ms = int((time.time() - start_time) * 1000)
        input_tokens = getattr(response.usage, 'input_tokens', 0)
        output_tokens = getattr(response.usage, 'output_tokens', 0)
        
        logger.info(
            f"[AI Telemetry] Quick Quiz Success | Model: {model} | Topic: '{context_data.get('title')}' | "
            f"Tokens: {input_tokens}in/{output_tokens}out | Latency: {latency_ms}ms"
        )
        
        data['model_used'] = model
        data['latency_ms'] = latency_ms
        return data

    except Exception as e:
        latency_ms = int((time.time() - start_time) * 1000)
        logger.error(f"[AI Telemetry] Claude API quiz error: {e} | Latency: {latency_ms}ms", exc_info=True)
        return {
            "title": f"Quiz: {context_data.get('title', 'Concept')}",
            "questions": [],
            "error": "Quiz generation is temporarily unavailable.",
            "model_used": "error",
            "latency_ms": latency_ms
        }
