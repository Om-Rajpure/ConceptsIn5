import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from videos.models import Subject, Video

def verify():
    no_slug = Subject.objects.filter(slug='').count()
    no_subject = Video.objects.filter(subject__isnull=True).count()
    
    print(f"Subjects without slugs: {no_slug}")
    print(f"Videos without subjects: {no_subject}")
    
    if no_slug > 0:
        print("Fixing subjects without slugs...")
        for s in Subject.objects.filter(slug=''):
            s.save() # This triggers slug generation in the model's save method
            print(f"Generated slug for: {s.name} -> {s.slug}")

if __name__ == '__main__':
    verify()
