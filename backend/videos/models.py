from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class SubCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    category = models.ForeignKey(Category, related_name='subcategories', on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.category.name} > {self.name}"

    class Meta:
        verbose_name_plural = "SubCategories"

class Subject(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    subcategory = models.ForeignKey(SubCategory, related_name='subjects', on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Video(models.Model):
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

    # Extra control fields (not stored in DB but used in logic)
    # Actually, we might want to store them temporarily or handle them in the serializer/view
    # For simplicity, let's keep them as boolean/url in DB if we want to track intent
    fetch_from_youtube = models.BooleanField(default=False)
    youtube_url_input = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

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
