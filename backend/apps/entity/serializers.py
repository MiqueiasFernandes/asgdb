from rest_framework import serializers
from apps.entity.models import *

def setId(data, field):
    data[field] = data[field].id

class OrganismSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organism
        fields = ['id', 'taxonomy', 'name', 'aka', 'lineage']

class OrganismBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organism
        fields = ['id', 'name']

class AnnotationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Annotation
        fields = ['id', 'entry', 'name', 'db', 'link']


class GeneSerializer(serializers.ModelSerializer):
    organism_id = serializers.PrimaryKeyRelatedField(queryset=Organism.objects)

    class Meta:
        model = Gene
        fields = ['id', 'gene_id', 'name', 'family', 'organism_id']
    
    def create(self, validated_data):
        setId(validated_data, 'organism_id')
        gene = Gene.objects.create(**validated_data)
        return gene

class ProteinSerializer(serializers.ModelSerializer):

    class Meta:
        model = Protein
        fields = ['id', 'protein_id', 'name', 'family', 'sequence']

class DomainSerializer(serializers.ModelSerializer):

    class Meta:
        model = Domain
        fields = ['id', 'start', 'end', 'description']

class ConditionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Condition
        fields = ['id', 'name', 'label', 'replicate', 'reference', 'ontology']

class ExpressionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Expression
        fields = ['id', 'count', 'RPKM', 'note']

class IsoformSerializer(serializers.ModelSerializer):

    class Meta:
        model = Isoform
        fields = ['id', 'isoform_id', 'splicing', 'psi']

class FeatureSerializer(serializers.ModelSerializer):

    class Meta:
        model = Feature
        fields = ['id', 'feature_id', 'name', 'contig', 'start', 'end', 'strand', 'feature', 'sequence']


 
