import os
import sys
import django
from django.db import transaction, connections
from django.core.management import call_command
from io import StringIO

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from videos.models import Category, SubCategory, Subject, Video, Note, Reel, FetchLog

def migrate_model(model_class, source_db='sqlite', target_db='default'):
    model_name = model_class.__name__
    print(f"\n=========================================")
    print(f"Migrating {model_name}...")
    print(f"=========================================")
    
    # Check if we can access the source db
    try:
        objects = list(model_class.objects.using(source_db).all())
    except Exception as e:
        print(f"Error reading {model_name} from {source_db}: {e}")
        return 0, 0, 0, 0
        
    total = len(objects)
    print(f"Found {total} records in {source_db}.")
    
    success_count = 0
    skipped_count = 0
    error_count = 0
    
    # We run in a transaction for the target database to ensure atomicity
    with transaction.atomic(using=target_db):
        for obj in objects:
            try:
                # Check if it already exists in target db
                if model_class.objects.using(target_db).filter(pk=obj.pk).exists():
                    # Update the target object with the source object's field values
                    # To avoid manual field assignment, we can save it with force_update=True
                    obj.save(using=target_db, force_update=True)
                    skipped_count += 1
                else:
                    # Save with force_insert=True to guarantee it is created with the exact primary key
                    obj.save(using=target_db, force_insert=True)
                    success_count += 1
            except Exception as e:
                print(f"Error migrating {model_name} pk={obj.pk}: {e}")
                error_count += 1
                
    print(f"Summary for {model_name}:")
    print(f"  - Total source: {total}")
    print(f"  - Successfully inserted: {success_count}")
    print(f"  - Successfully updated/skipped: {skipped_count}")
    print(f"  - Errors: {error_count}")
    
    return total, success_count, skipped_count, error_count

def reset_sequences(app_label, database='default'):
    print(f"\nResetting primary key sequences for app: '{app_label}'...")
    output = StringIO()
    try:
        call_command('sqlsequencereset', app_label, database=database, stdout=output)
        sql = output.getvalue()
        if sql:
            with connections[database].cursor() as cursor:
                cursor.execute(sql)
            print(f"Sequences reset successfully for app '{app_label}'.")
        else:
            print(f"No sequences found/needed to reset for app '{app_label}'.")
    except Exception as e:
        print(f"Error resetting sequences for '{app_label}': {e}")

def main():
    print("Starting SQLite to Neon PostgreSQL Migration...")
    
    # Check databases configured
    from django.conf import settings
    if 'sqlite' not in settings.DATABASES:
        print("Error: 'sqlite' database is not configured in settings.py.")
        print("Please check settings.py to ensure both 'default' (PostgreSQL) and 'sqlite' exist.")
        sys.exit(1)
        
    models_to_migrate = [
        User,
        Category,
        SubCategory,
        Subject,
        Video,
        Reel,
        Note,
        FetchLog
    ]
    
    stats = {}
    for model_class in models_to_migrate:
        name = model_class.__name__
        stats[name] = migrate_model(model_class, source_db='sqlite', target_db='default')
        
    print("\n=========================================")
    print("Resetting sequences in PostgreSQL...")
    print("=========================================")
    reset_sequences('auth')
    reset_sequences('videos')
    
    print("\n=========================================")
    print("Migration finished!")
    print("=========================================")
    for model_name, (total, success, skipped, errors) in stats.items():
        print(f"{model_name:<12} | Source: {total:<3} | Inserted: {success:<3} | Updated: {skipped:<3} | Errors: {errors:<3}")

if __name__ == '__main__':
    main()
