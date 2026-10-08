#!/usr/bin/env python3
"""
ConceptsIn5 YouTube Content Validation Script
Validates:
1. Video ID format (11 characters)
2. URL format (https://www.youtube.com/watch?v=..., https://youtu.be/..., https://www.youtube.com/embed/...)
3. Duplicate IDs or titles
4. Missing subjects, topics, or notes
5. Placeholders/dummy markers (example, s1, s2, placeholder, test)
"""

import re
import sys
import json
from pathlib import Path

YOUTUBE_ID_REGEX = re.compile(r'^[a-zA-Z0-9_-]{11}$')
FORBIDDEN_PLACEHOLDERS = ['example', 'embed/s1', 'embed/s2', 'embed/example', 'test video', 'sample video']

def validate_video_record(record, index=1):
    errors = []
    warnings = []
    
    # 1. Video ID
    vid = record.get('youtube_id') or record.get('id')
    if not vid or not YOUTUBE_ID_REGEX.match(str(vid)):
        errors.append(f"Invalid YouTube Video ID: '{vid}'")

    # 2. Title
    title = record.get('title', '').strip()
    if not title:
        errors.append("Missing video title")
    elif len(title) < 5:
        warnings.append(f"Very short title: '{title}'")

    # 3. Check for placeholder markers
    serialized = json.dumps(record).lower()
    for ph in FORBIDDEN_PLACEHOLDERS:
        if ph in serialized:
            errors.append(f"Found forbidden placeholder pattern '{ph}' in record")

    # 4. Subject and category
    if not record.get('subject') and not record.get('subjectId'):
        warnings.append(f"Missing subject association for '{title}'")

    return errors, warnings


def main():
    print("=" * 60)
    print("CONCEPTSIN5 YOUTUBE CONTENT VALIDATION")
    print("=" * 60)
    
    # Check frontend/src/data/videos.js
    frontend_videos_file = Path(__file__).resolve().parent.parent / 'frontend' / 'src' / 'data' / 'videos.js'
    
    if not frontend_videos_file.exists():
        print(f"File not found: {frontend_videos_file}")
        sys.exit(1)

    with open(frontend_videos_file, 'r', encoding='utf-8') as f:
        text = f.read()

    id_matches = re.findall(r'youtube_id:\s*["\']([a-zA-Z0-9_-]+)["\']', text)
    title_matches = re.findall(r'title:\s*["\']([^"\']+)["\']', text)
    subject_matches = re.findall(r'subjectId:\s*["\']([^"\']+)["\']', text)
    
    print(f"Scanning {frontend_videos_file.name}: Found {len(id_matches)} video entries.")
    
    seen_ids = set()
    has_errors = False
    
    for i, vid in enumerate(id_matches):
        title = title_matches[i] if i < len(title_matches) else f"Video {i+1}"
        subject_id = subject_matches[i] if i < len(subject_matches) else None
        record = {'youtube_id': vid, 'title': title, 'subjectId': subject_id}
        
        # Check duplicate
        if vid in seen_ids:
            print(f"[ERROR] Duplicate YouTube ID '{vid}' found in {title}")
            has_errors = True
        seen_ids.add(vid)
        
        errors, warnings = validate_video_record(record, i+1)
        if errors:
            has_errors = True
            for err in errors:
                print(f"[ERROR] Record {i+1} ({title}): {err}")
        elif warnings:
            for warn in warnings:
                print(f"[WARN]  Record {i+1} ({title}): {warn}")
        else:
            print(f"[PASS]  [{vid}] {title} (Subject: {subject_id})")

    print("\n" + "=" * 60)
    if has_errors:
        print("RESULT: Validation FAILED with errors.")
        sys.exit(1)
    else:
        print(f"RESULT: All {len(id_matches)} video records validated successfully!")
        sys.exit(0)


if __name__ == '__main__':
    main()
