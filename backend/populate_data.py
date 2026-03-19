import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from videos.models import Category, SubCategory, Subject, Video, Note

def populate():
    # Categories
    cat_sem, _ = Category.objects.get_or_create(name='Semester Subjects', slug='semester')
    cat_ai, _ = Category.objects.get_or_create(name='AI / ML', slug='ai-ml')
    cat_web, _ = Category.objects.get_or_create(name='Web Development', slug='web-dev')

    # SubCategories
    sub_cs, _ = SubCategory.objects.get_or_create(name='Computer Science', slug='cs', category=cat_sem)
    sub_neural, _ = SubCategory.objects.get_or_create(name='Neural Networks', slug='neural-networks', category=cat_ai)

    # Subjects
    subj_dbms, _ = Subject.objects.get_or_create(
        name='DBMS', 
        slug='dbms', 
        subcategory=sub_cs,
        description='Database Management Systems. Master SQL and NoSQL.'
    )
    
    subj_cnn, _ = Subject.objects.get_or_create(
        name='CNN', 
        slug='cnn', 
        subcategory=sub_neural,
        description='Convolutional Neural Networks for Image Recognition.'
    )

    # Videos
    v1, _ = Video.objects.get_or_create(
        title='Introduction to SQL',
        subject=subj_dbms,
        video_url='https://www.youtube.com/watch?v=HXV3zeQKqGY',
        youtube_id='HXV3zeQKqGY',
        duration='15',
        thumbnail='https://img.youtube.com/vi/HXV3zeQKqGY/maxresdefault.jpg',
        is_published=True,
        is_important=True
    )

    Note.objects.get_or_create(
        title='SQL Cheat Sheet',
        content='SELECT * FROM users WHERE active = 1;',
        video=v1,
        subject=subj_dbms,
        tags='SQL, Database'
    )

    print("Data populated successfully.")

if __name__ == '__main__':
    populate()
