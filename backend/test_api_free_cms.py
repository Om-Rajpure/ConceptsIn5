import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"
AUTH_URL = f"{BASE_URL}/auth/login/"
VIDEO_URL = f"{BASE_URL}/admin/videos/"

# Admin session
session = requests.Session()

def login():
    print("Logging in...")
    # Get initial CSRF token
    session.get(f"{BASE_URL}/auth/status/")
    csrftoken = session.cookies.get('csrftoken')
    
    headers = {'X-CSRFToken': csrftoken}
    resp = session.post(AUTH_URL, json={"username": "admin", "password": "admin123"}, headers=headers)
    
    if resp.status_code == 200:
        print("Login successful")
        session.headers.update({'X-CSRFToken': session.cookies.get('csrftoken')})
        return True
    print(f"Login failed: {resp.text}")
    return False

def test_manual_upload():
    print("\nTest 1: Manual Upload (No YouTube URL)")
    data = {
        "title": "Manual Theory Module",
        "description": "A purely manual video",
        "subject": 1, # Assuming DBMS exists with ID 1
        "type": "Theory",
        "duration": "10:00",
        "thumbnail": "https://example.com/thumb.jpg",
        "video_url": "https://example.com/video.mp4"
    }
    resp = session.post(VIDEO_URL, json=data)
    if resp.status_code == 201:
        print("PASS: Manual video created")
        return resp.json()['id']
    print(f"FAIL: {resp.text}")
    return None

def test_youtube_upload():
    print("\nTest 2: YouTube URL Upload (Auto-fill)")
    data = {
        "title": "YouTube Auto-fill Module",
        "description": "Testing local parsing",
        "subject": 1,
        "type": "Theory",
        "duration": "05:00",
        "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
    resp = session.post(VIDEO_URL, json=data)
    if resp.status_code == 201:
        result = resp.json()
        print("PASS: YouTube video created")
        print(f"youtube_id: {result['youtube_id']}")
        print(f"thumbnail: {result['thumbnail']}")
        print(f"video_url: {result['video_url']}")
        if result['youtube_id'] == "dQw4w9WgXcQ" and "img.youtube.com" in result['thumbnail']:
            print("VERIFIED: Local parsing worked")
            return result['id']
    print(f"FAIL: {resp.text}")
    return None

def test_invalid_url():
    print("\nTest 3: Invalid YouTube URL")
    data = {
        "title": "Invalid URL Test",
        "subject": 1,
        "youtube_url": "https://not-youtube.com/watch?v=123"
    }
    resp = session.post(VIDEO_URL, json=data)
    if resp.status_code == 400:
        print("PASS: Invalid URL rejected")
        return True
    print(f"FAIL: {resp.status_code} {resp.text}")
    return False

def test_duplicate():
    print("\nTest 4: Duplicate youtube_id")
    data = {
        "title": "Duplicate Test",
        "subject": 1,
        "youtube_url": "https://youtu.be/dQw4w9WgXcQ"
    }
    resp = session.post(VIDEO_URL, json=data)
    if resp.status_code == 400 and "youtube_id" in str(resp.json()):
        print("PASS: Duplicate prevented")
        return True
    print(f"FAIL: {resp.status_code} {resp.text}")
    return False

if __name__ == "__main__":
    if login():
        m_id = test_manual_upload()
        y_id = test_youtube_upload()
        test_invalid_url()
        test_duplicate()
        
        # Cleanup
        if m_id: session.delete(f"{VIDEO_URL}{m_id}/")
        if y_id: session.delete(f"{VIDEO_URL}{y_id}/")
