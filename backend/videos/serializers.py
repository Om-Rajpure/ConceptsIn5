from rest_framework import serializers
import re
import bleach
from .models import Category, SubCategory, Subject, Video, Note


# ─── Sanitization Utility ───────────────────────────────────────────
def clean_text(text):
    """Strip ALL HTML/script tags from text, returning only safe plaintext."""
    if not text:
        return text
    return bleach.clean(str(text), tags=[], attributes={}, strip=True).strip()


# ─── Note Serializer ────────────────────────────────────────────────
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'

    def validate_title(self, value):
        value = clean_text(value)
        if not value:
            raise serializers.ValidationError("Title cannot be empty.")
        if len(value) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters.")
        return value

    def validate_content(self, value):
        value = clean_text(value)
        if not value:
            raise serializers.ValidationError("Content cannot be empty.")
        if len(value) < 5:
            raise serializers.ValidationError("Content must be at least 5 characters.")
        return value

    def validate_tags(self, value):
        if value:
            value = clean_text(value)
        return value

    def validate(self, data):
        if not data.get('video') and not data.get('subject'):
            raise serializers.ValidationError(
                "A note must be linked to at least a video or a subject."
            )
        return data


# ─── Subject Serializer ─────────────────────────────────────────────
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

    def validate_name(self, value):
        value = clean_text(value)
        if not value:
            raise serializers.ValidationError("Subject name cannot be empty.")
        if len(value) < 2:
            raise serializers.ValidationError("Subject name must be at least 2 characters.")
        return value

    def validate_description(self, value):
        if value:
            value = clean_text(value)
        return value


# ─── Video Serializer ───────────────────────────────────────────────
class VideoSerializer(serializers.ModelSerializer):
    notes = NoteSerializer(many=True, read_only=True)

    class Meta:
        model = Video
        fields = '__all__'

    def validate_title(self, value):
        value = clean_text(value)
        if not value:
            raise serializers.ValidationError("Video title cannot be empty.")
        if len(value) < 3:
            raise serializers.ValidationError("Video title must be at least 3 characters.")
        return value

    def validate_description(self, value):
        if value:
            value = clean_text(value)
            if len(value) < 10:
                raise serializers.ValidationError("Description must be at least 10 characters.")
        return value

    def validate_youtube_id(self, value):
        if value and not re.match(r'^[a-zA-Z0-9_-]{11}$', value):
            raise serializers.ValidationError(
                "Invalid YouTube ID. Must be exactly 11 alphanumeric characters."
            )
        return value

    def validate_important_topics(self, value):
        if value:
            value = clean_text(value)
        return value

    def validate_topic_flow(self, value):
        if value:
            value = clean_text(value)
        return value

    def validate_quick_summary(self, value):
        if value:
            value = clean_text(value)
        return value


# ─── Public Video Serializer (Read-Only, no validation needed) ──────
class PublicVideoSerializer(serializers.ModelSerializer):
    notes = NoteSerializer(many=True, read_only=True)
    subject = SubjectSerializer(read_only=True)

    class Meta:
        model = Video
        fields = '__all__'


# ─── SubCategory Serializer ─────────────────────────────────────────
class SubCategorySerializer(serializers.ModelSerializer):
    subjects = SubjectSerializer(many=True, read_only=True)

    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'slug', 'category', 'subjects']

    def validate_name(self, value):
        value = clean_text(value)
        if not value:
            raise serializers.ValidationError("SubCategory name cannot be empty.")
        if len(value) < 2:
            raise serializers.ValidationError("SubCategory name must be at least 2 characters.")
        return value


# ─── Category Serializer ────────────────────────────────────────────
class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'subcategories']

    def validate_name(self, value):
        value = clean_text(value)
        if not value:
            raise serializers.ValidationError("Category name cannot be empty.")
        if len(value) < 2:
            raise serializers.ValidationError("Category name must be at least 2 characters.")
        return value
