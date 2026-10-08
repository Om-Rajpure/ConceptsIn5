from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from videos.models import Category, SubCategory, Subject, Video, Note


class VideoAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name="Computer Science", slug="cs")
        self.subcategory = SubCategory.objects.create(
            name="Databases", slug="databases", category=self.category
        )
        self.subject = Subject.objects.create(
            name="Database Management Systems",
            slug="dbms",
            subcategory=self.subcategory,
            category=self.category,
            description="Master database concepts"
        )
        self.video = Video.objects.create(
            title="Database Normalization 1NF to BCNF",
            description="Learn 1NF, 2NF, 3NF, and BCNF with step-by-step examples.",
            subject=self.subject,
            duration="5:40",
            youtube_id="7V-L_8Z5_2U",
            youtube_url="https://www.youtube.com/watch?v=7V-L_8Z5_2U",
            important_topics="1NF, 2NF, 3NF, BCNF",
            topic_flow="1NF, 2NF, 3NF, BCNF",
            is_published=True
        )
        self.note = Note.objects.create(
            title="DBMS Normalization Cheat Sheet",
            content="1NF: Atomic attributes.\n2NF: No partial dependency.\n3NF: No transitive dependency.\nBCNF: Determinant is superkey.",
            video=self.video,
            subject=self.subject
        )

    def test_health_check(self):
        res = self.client.get('/api/health/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.json().get('status'), 'healthy')

    def test_public_category_list(self):
        res = self.client.get('/api/public/categories/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.json().get('results', res.json())
        self.assertTrue(len(results) >= 1)
        self.assertEqual(results[0]['name'], "Computer Science")

    def test_public_video_detail(self):
        res = self.client.get(f'/api/public/videos/{self.video.id}/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.json()['title'], "Database Normalization 1NF to BCNF")

    def test_concept_tutor_action_simplify(self):
        payload = {
            "video_id": self.video.id,
            "action_type": "simplify"
        }
        res = self.client.post('/api/ai/concept-tutor/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertTrue(data.get('success'))
        self.assertIn('data', data)
        self.assertIn('answer', data['data'])

    def test_concept_tutor_custom_question(self):
        payload = {
            "video_id": self.video.id,
            "question": "What is the difference between 3NF and BCNF?",
            "action_type": "custom"
        }
        res = self.client.post('/api/ai/concept-tutor/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertTrue(data.get('success'))
        self.assertIn('key_points', data['data'])

    def test_concept_tutor_empty_question_validation(self):
        payload = {
            "question": "",
            "action_type": "custom"
        }
        res = self.client.post('/api/ai/concept-tutor/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_quick_quiz_generation(self):
        payload = {
            "video_id": self.video.id
        }
        res = self.client.post('/api/ai/quick-quiz/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertTrue(data.get('success'))
        self.assertIn('questions', data['data'])
