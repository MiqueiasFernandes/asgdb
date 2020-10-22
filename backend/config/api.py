from rest_framework import routers
from apps.users.views import UserViewSet
from apps.entity.views import *

# Settings
api = routers.DefaultRouter()
api.trailing_slash = '/?'

# Users API
api.register(r'users', UserViewSet)

# Entity API
api.register(r'organism', OrganismViewSet) 
api.register(r'annotation', AnnotationViewSet) 
api.register(r'gene', GeneViewSet) 
api.register(r'protein', ProteinViewSet) 
api.register(r'domain', DomainViewSet) 
api.register(r'condition', ConditionViewSet) 
api.register(r'expression', ExpressionViewSet) 
api.register(r'isoform', IsoformViewSet) 
api.register(r'feature', FeatureViewSet)
