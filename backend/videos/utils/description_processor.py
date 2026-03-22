import re

def process_description(description):
    """
    Intelligently extracts a quick summary and a roadmap from a video description.
    """
    if not description:
        return "", []

    lines = description.split("\n")
    
    # 1. Clean Lines
    clean_lines = []
    for line in lines:
        l = line.strip()
        if not l:
            continue
        # Remove hashtags
        l = re.sub(r'#\w+', '', l).strip()
        # Remove links
        l = re.sub(r'https?://\S+', '', l).strip()
        
        if l:
            clean_lines.append(l)

    # 2. Extract Quick Summary
    # Take the first meaningful paragraph (at least 30 chars long)
    quick_summary = ""
    for line in clean_lines:
        if len(line) > 30:
            quick_summary = line
            break
    
    # 3. Extract Roadmap (Topics)
    # Look for bullet points, ticks, dashes, or numbered lists
    roadmap = []
    bullet_markers = ['✔', '•', '-', '–', '—', '*', '✅']
    
    for line in clean_lines:
        line_clean = line.strip()
        
        # Check if line starts with a bullet marker
        has_bullet = any(line_clean.startswith(m) for m in bullet_markers)
        
        # Check if line starts with a number followed by dot or bracket (e.g. 1. or 1))
        is_numbered = re.match(r'^\d+[\.\)]\s+', line_clean)
        
        # Also check for timestamp-like lines (e.g. 02:30 Topic Name)
        is_timestamp = re.match(r'^\d{1,2}:\d{2}\s+', line_clean)
        
        if has_bullet:
            # Remove bullet marker
            topic = line_clean
            for m in bullet_markers:
                if topic.startswith(m):
                    topic = topic[len(m):].strip()
                    break
            if topic:
                roadmap.append(topic)
        elif is_numbered:
            topic = re.sub(r'^\d+[\.\)]\s+', '', line_clean).strip()
            if topic:
                roadmap.append(topic)
        elif is_timestamp:
            topic = re.sub(r'^\d{1,2}:\d{2}\s+', '', line_clean).strip()
            if topic:
                roadmap.append(topic)
                
    return quick_summary, roadmap
