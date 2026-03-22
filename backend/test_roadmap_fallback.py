import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from videos.models import Video
from videos.utils.description_processor import generate_roadmap

def test_fallback():
    # Test 1: Only Description
    v1 = Video.objects.create(
        title="Test 1",
        description="✔ Topic A\n✔ Topic B"
    )
    generate_roadmap(v1)
    v1.refresh_from_db()
    print(f"Test 1 (Only Desc) Roadmap: {v1.roadmap}")
    assert v1.roadmap == ["Topic A", "Topic B"]

    # Test 2: Only Topic Flow
    v2 = Video.objects.create(
        title="Test 2",
        topic_flow="Manual 1, Manual 2"
    )
    generate_roadmap(v2)
    v2.refresh_from_db()
    print(f"Test 2 (Only Flow) Roadmap: {v2.roadmap}")
    assert v2.roadmap == ["Manual 1", "Manual 2"]

    # Test 3: Both (Flow should win)
    v3 = Video.objects.create(
        title="Test 3",
        description="✔ Desc Topic",
        topic_flow="Flow Topic"
    )
    generate_roadmap(v3)
    v3.refresh_from_db()
    print(f"Test 3 (Both) Roadmap: {v3.roadmap}")
    assert v3.roadmap == ["Flow Topic"]

    # Cleanup
    v1.delete()
    v2.delete()
    v3.delete()
    print("\nAll tests passed!")

if __name__ == '__main__':
    test_fallback()
