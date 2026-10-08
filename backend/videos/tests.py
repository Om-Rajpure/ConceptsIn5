from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from videos.models import Category, SubCategory, Subject, Video, Note


class ComprehensiveAPITests(TestCase):
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
            description="Master relational database architecture and normalization."
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

    # ─── System Health & Discovery ───────────────────────────────────

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

    def test_public_subject_list(self):
        res = self.client.get('/api/public/subjects/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.json().get('results', res.json())
        self.assertTrue(len(results) >= 1)
        self.assertEqual(results[0]['slug'], "dbms")

    def test_public_video_list(self):
        res = self.client.get('/api/public/videos/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.json().get('results', res.json())
        self.assertTrue(len(results) >= 1)

    def test_public_video_detail(self):
        res = self.client.get(f'/api/public/videos/{self.video.id}/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.json()['title'], "Database Normalization 1NF to BCNF")

    def test_public_video_not_found(self):
        res = self.client.get('/api/public/videos/999999/')
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_public_notes_list(self):
        res = self.client.get('/api/public/notes/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.json().get('results', res.json())
        self.assertTrue(len(results) >= 1)

    def test_public_notes_filter_by_subject(self):
        res = self.client.get(f'/api/public/notes/?subject={self.subject.id}')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.json().get('results', res.json())
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['title'], "DBMS Normalization Cheat Sheet")

    # ─── Claude AI Concept Tutor ─────────────────────────────────────

    def test_concept_tutor_action_simplify(self):
        payload = {"video_id": self.video.id, "action_type": "simplify"}
        res = self.client.post('/api/ai/concept-tutor/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertTrue(data.get('success'))
        self.assertIn('answer', data['data'])
        self.assertIn('key_points', data['data'])

    def test_concept_tutor_action_example(self):
        payload = {"video_id": self.video.id, "action_type": "example"}
        res = self.client.post('/api/ai/concept-tutor/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertTrue(data.get('success'))
        self.assertIn('example', data['data'])

    def test_concept_tutor_action_exam_tip(self):
        payload = {"video_id": self.video.id, "action_type": "exam_tip"}
        res = self.client.post('/api/ai/concept-tutor/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertTrue(data.get('success'))
        self.assertIn('exam_tip', data['data'])

    def test_concept_tutor_action_compare(self):
        payload = {"video_id": self.video.id, "action_type": "compare"}
        res = self.client.post('/api/ai/concept-tutor/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertTrue(data.get('success'))
        self.assertIn('answer', data['data'])

    def test_concept_tutor_custom_question(self):
        payload = {
            "video_id": self.video.id,
            "question": "Why does 3NF require eliminating transitive dependencies?",
            "action_type": "custom"
        }
        res = self.client.post('/api/ai/concept-tutor/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertTrue(data.get('success'))
        self.assertIn('key_points', data['data'])

    def test_concept_tutor_with_note_id(self):
        payload = {"note_id": self.note.id, "action_type": "simplify"}
        res = self.client.post('/api/ai/concept-tutor/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertTrue(data.get('success'))

    def test_concept_tutor_with_subject_slug(self):
        payload = {"subject_slug": self.subject.slug, "action_type": "simplify"}
        res = self.client.post('/api/ai/concept-tutor/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertTrue(data.get('success'))

    def test_concept_tutor_empty_question_validation(self):
        payload = {"question": "", "action_type": "custom"}
        res = self.client.post('/api/ai/concept-tutor/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', res.json())

    def test_concept_tutor_long_question_sanitized(self):
        long_q = "Explain normalization " + ("really " * 120) + "well."
        payload = {"video_id": self.video.id, "question": long_q, "action_type": "custom"}
        res = self.client.post('/api/ai/concept-tutor/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.json().get('success'))

    def test_concept_tutor_invalid_video_id_graceful(self):
        payload = {"video_id": 999999, "action_type": "simplify"}
        res = self.client.post('/api/ai/concept-tutor/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.json().get('success'))

    # ─── Claude AI Quick Quiz ────────────────────────────────────────

    def test_quick_quiz_with_video_id(self):
        payload = {"video_id": self.video.id}
        res = self.client.post('/api/ai/quick-quiz/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertTrue(data.get('success'))
        self.assertIn('questions', data['data'])
        self.assertEqual(len(data['data']['questions']), 4)

    def test_quick_quiz_with_note_id(self):
        payload = {"note_id": self.note.id}
        res = self.client.post('/api/ai/quick-quiz/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertTrue(data.get('success'))
        self.assertIn('questions', data['data'])

    def test_quick_quiz_with_subject_slug(self):
        payload = {"subject_slug": self.subject.slug}
        res = self.client.post('/api/ai/quick-quiz/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertTrue(data.get('success'))

    def test_quick_quiz_invalid_id_graceful(self):
        payload = {"video_id": 999999}
        res = self.client.post('/api/ai/quick-quiz/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertTrue(data.get('success'))

    # ─── Security & Authorization ────────────────────────────────────

    def test_unauthenticated_admin_stats_rejected(self):
        res = self.client.get('/api/admin/stats/')
        self.assertIn(res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_unauthenticated_admin_video_post_rejected(self):
        res = self.client.post('/api/admin/videos/', {"title": "Malicious Video"})
        self.assertIn(res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    # ─── YouTube Utility Verification ────────────────────────────────

    def test_youtube_id_extraction_valid_formats(self):
        from videos.utils.youtube_utils import extract_video_id
        urls = [
            ("https://www.youtube.com/watch?v=rVTSqba7UWk", "rVTSqba7UWk"),
            ("https://youtu.be/rVTSqba7UWk", "rVTSqba7UWk"),
            ("https://www.youtube.com/embed/rVTSqba7UWk", "rVTSqba7UWk"),
            ("https://www.youtube.com/shorts/2_-boldmaFQ", "2_-boldmaFQ"),
        ]
        for url, expected_id in urls:
            self.assertEqual(extract_video_id(url), expected_id)

    def test_youtube_thumbnail_and_embed_generation(self):
        from videos.utils.youtube_utils import get_thumbnail, get_embed_url
        vid = "rVTSqba7UWk"
        self.assertEqual(get_thumbnail(vid), "https://img.youtube.com/vi/rVTSqba7UWk/maxresdefault.jpg")
        self.assertEqual(get_embed_url(vid), "https://www.youtube.com/embed/rVTSqba7UWk")

