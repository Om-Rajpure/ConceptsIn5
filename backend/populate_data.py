import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from videos.models import Category, SubCategory, Subject, Video, Note, Reel

def populate():
    print("=" * 60)
    print("SEEDING VERIFIED CONCEPTSIN5 YOUTUBE CONTENT")
    print("=" * 60)

    # 1. Categories
    cat_ai, _ = Category.objects.get_or_create(
        slug='ai-ml',
        defaults={
            'name': 'AI & Machine Learning',
            'description': 'Master Machine Learning algorithms, mathematical foundations, and real-world project architectures in 5 minutes.',
            'icon': 'Cpu'
        }
    )
    cat_cs, _ = Category.objects.get_or_create(
        slug='computer-science',
        defaults={
            'name': 'Computer Science Core',
            'description': 'Core engineering subjects: Database Management, Operating Systems, and Computer Networks.',
            'icon': 'Database'
        }
    )
    cat_web, _ = Category.objects.get_or_create(
        slug='web-dev',
        defaults={
            'name': 'Web Engineering',
            'description': 'Modern fullstack engineering, APIs, version control, and cloud deployments.',
            'icon': 'Globe'
        }
    )

    # 2. SubCategories
    sub_ml, _ = SubCategory.objects.get_or_create(
        slug='applied-ml',
        category=cat_ai,
        defaults={'name': 'Applied Machine Learning', 'description': 'Project architectures, recommendation systems, and data pipelines.'}
    )
    sub_supervised, _ = SubCategory.objects.get_or_create(
        slug='supervised-learning',
        category=cat_ai,
        defaults={'name': 'Supervised Learning', 'description': 'Regression, classification, loss functions, and optimization algorithms.'}
    )
    sub_dbms, _ = SubCategory.objects.get_or_create(
        slug='dbms-core',
        category=cat_cs,
        defaults={'name': 'Database Systems', 'description': 'Relational architecture, SQL optimization, ACID guarantees, and Cloud SQL.'}
    )

    # 3. Subjects
    subj_ml, _ = Subject.objects.get_or_create(
        slug='machine-learning',
        defaults={
            'name': 'Machine Learning',
            'category': cat_ai,
            'subcategory': sub_ml,
            'description': 'From foundational algorithms like Linear Regression to practical Movie Recommendation Systems.'
        }
    )
    subj_dbms, _ = Subject.objects.get_or_create(
        slug='dbms',
        defaults={
            'name': 'Database Management Systems',
            'category': cat_cs,
            'subcategory': sub_dbms,
            'description': 'Master relational database architecture, SQL query execution, and cloud storage.'
        }
    )

    # 4. Verified Full Learning Modules
    v1, _ = Video.objects.get_or_create(
        youtube_id='rVTSqba7UWk',
        defaults={
            'title': "Don't Just Build It, Understand It! Movie Recommendation System Explained | Python + ML",
            'description': "Complete line-by-line breakdown of a Movie Recommendation System project: Content-Based Filtering, Data Preprocessing, TF-IDF Vectorization, Cosine Similarity, and Streamlit deployment.",
            'subject': subj_ml,
            'video_url': 'https://www.youtube.com/watch?v=rVTSqba7UWk',
            'youtube_url': 'https://www.youtube.com/watch?v=rVTSqba7UWk',
            'duration': '12:45',
            'thumbnail': 'https://img.youtube.com/vi/rVTSqba7UWk/maxresdefault.jpg',
            'important_topics': 'Content-Based Filtering, TF-IDF Vectorization, Cosine Similarity, Streamlit UI, TMDB API',
            'topic_flow': 'Recommendation Overview, Content-Based Filtering, TF-IDF Math, Cosine Similarity, Streamlit App',
            'quick_summary': 'Content-based recommendation systems extract feature vectors from metadata using TF-IDF and compute pairwise cosine similarity scores to recommend the top N closest items to a user selection.',
            'is_published': True,
            'is_important': True,
            'is_verified': True,
            'type': 'Theory'
        }
    )

    v2, _ = Video.objects.get_or_create(
        youtube_id='2_-boldmaFQ',
        defaults={
            'title': 'Linear Regression in Machine Learning: Loss Function & Gradient Descent',
            'description': 'Learn how linear regression models continuous relationships, formulates the Mean Squared Error (MSE) cost function, and minimizes loss using gradient descent.',
            'subject': subj_ml,
            'video_url': 'https://www.youtube.com/watch?v=2_-boldmaFQ',
            'youtube_url': 'https://www.youtube.com/watch?v=2_-boldmaFQ',
            'duration': '4:50',
            'thumbnail': 'https://img.youtube.com/vi/2_-boldmaFQ/maxresdefault.jpg',
            'important_topics': 'Linear Hypothesis, MSE Cost Function, Gradient Descent, Learning Rate',
            'topic_flow': 'Problem Formulation, Hypothesis Function, Loss Calculation, Gradient Update',
            'quick_summary': 'Linear Regression finds the optimal line that minimizes the sum of squared differences between predicted values and actual observations using iterative gradient updates.',
            'is_published': True,
            'is_important': True,
            'is_verified': True,
            'type': 'Numerical'
        }
    )

    v3, _ = Video.objects.get_or_create(
        youtube_id='HiMaBCL-6Qg',
        defaults={
            'title': 'Ordinary Least Squares & Best Fit Line Calculation',
            'description': 'Master the mathematical derivation of the Ordinary Least Squares line of best fit, slope, intercept, and R-squared variance explanation.',
            'subject': subj_ml,
            'video_url': 'https://www.youtube.com/watch?v=HiMaBCL-6Qg',
            'youtube_url': 'https://www.youtube.com/watch?v=HiMaBCL-6Qg',
            'duration': '5:15',
            'thumbnail': 'https://img.youtube.com/vi/HiMaBCL-6Qg/maxresdefault.jpg',
            'important_topics': 'Sum of Squared Residuals, Analytical Slope and Intercept, Covariance and Variance, R-Squared',
            'topic_flow': 'Residual Definition, Minimizing Squared Residuals, Closed-Form Solution, Goodness of Fit',
            'quick_summary': 'Ordinary Least Squares analytically computes the optimal slope and intercept that minimizes the total residual sum of squares without requiring iterative optimization.',
            'is_published': True,
            'is_important': True,
            'is_verified': True,
            'type': 'Numerical'
        }
    )

    v4, _ = Video.objects.get_or_create(
        youtube_id='-Rs2pnuBJF4',
        defaults={
            'title': 'Categorical Data Types in ML: Nominal, Ordinal, and Binary Feature Encoding',
            'description': 'Understand the distinctions between nominal, ordinal, and binary categorical variables and choose the appropriate encoding technique (One-Hot vs Label Encoding).',
            'subject': subj_ml,
            'video_url': 'https://www.youtube.com/watch?v=-Rs2pnuBJF4',
            'youtube_url': 'https://www.youtube.com/watch?v=-Rs2pnuBJF4',
            'duration': '4:40',
            'thumbnail': 'https://img.youtube.com/vi/-Rs2pnuBJF4/maxresdefault.jpg',
            'important_topics': 'Nominal Data, Ordinal Data, Binary Features, One-Hot vs Label Encoding',
            'topic_flow': 'Categorical vs Numerical, Nominal Encoding, Ordinal Preservation, Dimensionality Trade-offs',
            'quick_summary': 'Different categorical data types require distinct preprocessing: ordinal features preserve ranking order, while nominal features use one-hot encoding to avoid false numerical relationships.',
            'is_published': True,
            'is_important': False,
            'is_verified': True,
            'type': 'Theory'
        }
    )

    v5, _ = Video.objects.get_or_create(
        youtube_id='SbTs57YD1CA',
        defaults={
            'title': 'Relational SQL & Cloud Database Fundamentals',
            'description': 'Understand the relational data model, ACID guarantees, SQL query execution, and managed Cloud SQL deployments.',
            'subject': subj_dbms,
            'video_url': 'https://www.youtube.com/watch?v=SbTs57YD1CA',
            'youtube_url': 'https://www.youtube.com/watch?v=SbTs57YD1CA',
            'duration': '5:10',
            'thumbnail': 'https://img.youtube.com/vi/SbTs57YD1CA/maxresdefault.jpg',
            'important_topics': 'Relational Tables, ACID Transactions, SQL Query Execution, Cloud SQL Architecture',
            'topic_flow': 'Relational Fundamentals, ACID Guarantees, SQL Indexing, Cloud Scaling',
            'quick_summary': 'Relational SQL databases enforce structured schemas and ACID transaction integrity, providing robust consistency guarantees for enterprise applications.',
            'is_published': True,
            'is_important': True,
            'is_verified': True,
            'type': 'Theory'
        }
    )

    # 5. Verified Notes
    Note.objects.get_or_create(
        video=v1,
        defaults={
            'title': 'Movie Recommendation System: TF-IDF & Cosine Similarity Guide',
            'subject': subj_ml,
            'tags': 'Machine Learning, Recommendation Systems, TF-IDF, Cosine Similarity, Python',
            'content': 'Content-Based Filtering converts metadata into TF-IDF vectors and computes pairwise Cosine Similarity: cos(theta) = (A . B) / (||A|| * ||B||).'
        }
    )

    Note.objects.get_or_create(
        video=v2,
        defaults={
            'title': 'Linear Regression: Cost Function & Gradient Descent Guide',
            'subject': subj_ml,
            'tags': 'Machine Learning, Linear Regression, Gradient Descent, Loss Functions',
            'content': 'Linear regression optimizes parameters theta by minimizing Mean Squared Error (MSE) through iterative gradient descent updates.'
        }
    )

    # 6. Verified Shorts / Quick Concept Reels
    verified_shorts = [
        ('Linear Regression in ML', 'https://www.youtube.com/shorts/2_-boldmaFQ', 'How linear regression models relationships and optimizes loss.'),
        ('How Best Fit Line is Calculated in Linear Regression', 'https://www.youtube.com/shorts/HiMaBCL-6Qg', 'Ordinary Least Squares analytical line of best fit derivation.'),
        ('Categorical Data Types: Nominal, Ordinal, Binary', 'https://www.youtube.com/shorts/-Rs2pnuBJF4', 'Encoding categorical features without introducing false numerical order.'),
        ('Machine Learning: Learning from Data', 'https://www.youtube.com/shorts/SKKJ9rC3dSg', 'Supervised vs Unsupervised learning core intuition.'),
        ('AI vs ML vs Deep Learning Hierarchy', 'https://www.youtube.com/shorts/5Ajp5oPinJs', 'Concentric hierarchy of modern artificial intelligence.'),
        ('SQL & Cloud Database Architectures', 'https://www.youtube.com/shorts/SbTs57YD1CA', 'Relational database fundamentals and managed Cloud SQL.'),
        ('Git Commit & Version Control for Developers', 'https://www.youtube.com/shorts/gQC91u6Sdt0', 'Essential version control practices for engineering projects.'),
    ]

    for title, url, desc in verified_shorts:
        Reel.objects.get_or_create(
            video_url=url,
            defaults={'title': title, 'description': desc}
        )

    print("[SUCCESS] Verified database content seeded successfully!")

if __name__ == '__main__':
    populate()
