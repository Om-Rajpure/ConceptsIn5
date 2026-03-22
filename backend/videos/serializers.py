from rest_framework import serializers
from .models import Category, SubCategory, Subject, Video, Note

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class VideoSerializer(serializers.ModelSerializer):
    notes = NoteSerializer(many=True, read_only=True)
    
    class Meta:
        model = Video
        fields = '__all__'

class PublicVideoSerializer(serializers.ModelSerializer):
    notes = NoteSerializer(many=True, read_only=True)
    subject = SubjectSerializer(read_only=True)
    
    class Meta:
        model = Video
        fields = '__all__'

class SubCategorySerializer(serializers.ModelSerializer):
    subjects = SubjectSerializer(many=True, read_only=True)
    
    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'slug', 'category', 'subjects']

class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'subcategories']
