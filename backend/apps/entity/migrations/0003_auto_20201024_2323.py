# Generated by Django 3.1.2 on 2020-10-24 23:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('entity', '0002_auto_20201024_1851'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feature',
            name='gene',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='entity.gene'),
        ),
    ]
