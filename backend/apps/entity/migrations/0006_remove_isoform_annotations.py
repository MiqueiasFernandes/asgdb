# Generated by Django 3.1.2 on 2020-10-26 14:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('entity', '0005_auto_20201025_1552'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='isoform',
            name='annotations',
        ),
    ]
