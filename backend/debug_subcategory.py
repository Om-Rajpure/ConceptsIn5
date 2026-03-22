import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from videos.models import SubCategory, Category
from videos.serializers import SubCategorySerializer

def test_create():
    category = Category.objects.first()
    if not category:
        print("No category found")
        return
    
    data = {'name': 'Test SubCategory Debug', 'category': category.id}
    serializer = SubCategorySerializer(data=data)
    
    print(f"Data: {data}")
    if serializer.is_valid():
        print("Serializer is valid")
        obj = serializer.save()
        print(f"Object created: {obj.id}, {obj.name}, {obj.slug}")
    else:
        print(f"Serializer errors: {serializer.errors}")

if __name__ == '__main__':
    test_create()
