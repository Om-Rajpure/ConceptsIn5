from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    icon = models.CharField(max_length=50, blank=True)
    background_image = models.ImageField(upload_to='categories/bg/', blank=True, null=True)
    description = models.TextField(blank=True)
    theme_color = models.CharField(max_length=20, blank=True) # Optional theme color
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

class SubCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    category = models.ForeignKey(Category, related_name='all_subcategories', on_delete=models.CASCADE)
    icon = models.CharField(max_length=50, blank=True)
    background_image = models.ImageField(upload_to='subcategories/bg/', blank=True, null=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.category.name} > {self.name}"

    class Meta:
        verbose_name_plural = "SubCategories"
        ordering = ['name']

class Subject(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, related_name='subjects_manual', on_delete=models.CASCADE, null=True, blank=True)
    subcategory = models.ForeignKey(SubCategory, related_name='subjects', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Video(models.Model):
    # ... (existing Video model remains unchanged)
    SOURCE_CHOICES = [
        ('youtube', 'YouTube'),
        ('instagram', 'Instagram'),
        ('linkedin', 'LinkedIn'),
    ]
    TYPE_CHOICES = [
        ('Theory', 'Theory'),
        ('Numerical', 'Numerical'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    youtube_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    video_url = models.URLField(max_length=500, blank=True, null=True) # For Instagram/LinkedIn
    youtube_url = models.URLField(max_length=500, blank=True, null=True)
    subject = models.ForeignKey(Subject, related_name='videos', on_delete=models.SET_NULL, null=True, blank=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='Theory')
    important_topics = models.TextField(blank=True, help_text="Comma separated topics")
    duration = models.CharField(max_length=20, blank=True)
    thumbnail = models.URLField(max_length=500, blank=True)
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='youtube')
    is_published = models.BooleanField(default=True)
    is_important = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    quick_summary = models.TextField(blank=True)
    roadmap = models.JSONField(default=list, blank=True)
    topic_flow = models.TextField(blank=True, help_text="Comma-separated topics (overrides description auto-generation)")

    fetch_from_youtube = models.BooleanField(default=False)
    youtube_url_input = models.URLField(max_length=500, blank=True, null=True)

    def save(self, *args, **kwargs):
        from services.ai_service import generate_summary
        from videos.utils.description_processor import process_description

        if not self.quick_summary and self.description:
            summary = generate_summary(self.description)
            if not summary:
                summary, _ = process_description(self.description)
            self.quick_summary = summary
        elif not self.quick_summary and not self.description:
            self.quick_summary = "No summary available"

        if self.topic_flow:
            topics = [topic.strip() for topic in self.topic_flow.split(",") if topic.strip()]
        elif self.description:
            _, topics = process_description(self.description)
        else:
            topics = []
        self.roadmap = topics

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['is_published']),
            models.Index(fields=['is_important']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['subject', 'is_published']),
        ]

class Reel(models.Model):
    title = models.CharField(max_length=200)
    video_url = models.URLField(max_length=500)
    description = models.TextField(blank=True)
    thumbnail = models.ImageField(upload_to='reels/thumbnails/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
        ]

class Note(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField(help_text="Rich text / markdown supported")
    pdf_file = models.FileField(upload_to='notes/pdfs/', blank=True, null=True)
    video = models.ForeignKey(Video, related_name='notes', on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, related_name='notes', on_delete=models.CASCADE)
    tags = models.CharField(max_length=255, blank=True, help_text="Comma-separated or JSON")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class FetchLog(models.Model):
    fetch_type = models.CharField(max_length=50, default='youtube')
    last_fetched_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, default='success')
    videos_added = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.fetch_type} - {self.created_at}"
