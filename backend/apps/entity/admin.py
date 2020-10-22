from django.contrib import admin

from apps.entity.models import *

# Register your models here.
admin.site.register(Organism) 
admin.site.register(Annotation) 
admin.site.register(Gene) 
admin.site.register(Protein) 
admin.site.register(Domain) 
admin.site.register(Condition) 
admin.site.register(Expression) 
admin.site.register(Isoform) 
admin.site.register(Feature)