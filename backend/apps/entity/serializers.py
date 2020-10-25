from rest_framework import serializers
from apps.entity.models import *

class OrganismSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organism
        fields = ['id', 'taxonomy', 'name', 'aka', 'lineage']

class OrganismBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organism
        fields = ['id', 'name']


################## ANNOTATION

class AnnotationBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Annotation
        fields = ['id', 'entry']

class AnnotationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Annotation
        fields = ['id', 'entry', 'name', 'db', 'link']


################## GENE

class GeneBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Gene
        fields = ['id', 'gene_id']


class GeneSerializer(serializers.ModelSerializer):
    organism = OrganismBasicSerializer()
    annotations = AnnotationBasicSerializer(many=True)

    class Meta:
        model = Gene
        fields = ['id', 'gene_id', 'name', 'family', 'organism', 'annotations']


class GeneWriteSerializer(serializers.ModelSerializer):
    organism_id = serializers.PrimaryKeyRelatedField(queryset=Organism.objects)
    annotations = serializers.PrimaryKeyRelatedField(queryset=Annotation.objects, many=True)

    class Meta:
        model = Gene
        fields = ['id', 'gene_id', 'name', 'family', 'organism_id', 'annotations']
    
    def create(self, validated_data):
        validated_data['organism_id'] = validated_data['organism_id'].id
        annotations = validated_data['annotations']
        del validated_data['annotations']
        gene = Gene.objects.create(**validated_data)
        gene.annotations.set(annotations)
        return gene



################## PROTEIN

class ProteinBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Protein
        fields = ['id', 'protein_id']

class ProteinSerializer(serializers.ModelSerializer):

    class Meta:
        model = Protein
        fields = ['id', 'protein_id', 'name', 'family', 'sequence']


################## DOMAIN

class DomainSerializer(serializers.ModelSerializer):

    class Meta:
        model = Domain
        fields = ['id', 'start', 'end', 'description']




################## CONDITION

class ConditionBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Condition
        fields = ['id', 'name']

class ConditionSerializer(serializers.ModelSerializer):
    organism = OrganismBasicSerializer()

    class Meta:
        model = Condition
        fields = ['id', 'name', 'label', 'replicate', 'reference', 'ontology', 'organism']

class ConditionWriteSerializer(serializers.ModelSerializer):
    organism_id = serializers.PrimaryKeyRelatedField(queryset=Organism.objects)

    class Meta:
        model = Condition
        fields = ['id', 'name', 'label', 'replicate', 'reference', 'ontology', 'organism_id']
    
    def create(self, validated_data):
        validated_data['organism_id'] = validated_data['organism_id'].id
        return Condition.objects.create(**validated_data)



################## EXPRESSION      

class ExpressionBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Expression
        fields = ['id', 'note']

class ExpressionSerializer(serializers.ModelSerializer):
    condition = ConditionBasicSerializer()

    class Meta:
        model = Expression
        fields = ['id', 'count', 'RPKM', 'note', 'condition']

class ExpressionWriteSerializer(serializers.ModelSerializer):
    condition_id = serializers.PrimaryKeyRelatedField(queryset=Condition.objects)

    class Meta:
        model = Expression
        fields = ['id', 'count', 'RPKM', 'note', 'condition_id']
    
    def create(self, validated_data):
        validated_data['condition_id'] = validated_data['condition_id'].id
        return Expression.objects.create(**validated_data)

################## ISOFORM

class IsoformBasicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Isoform
        fields = ['id', 'isoform_id']

class IsoformSerializer(serializers.ModelSerializer):
    gene = GeneBasicSerializer()
    expression = ExpressionBasicSerializer()
    protein = ProteinBasicSerializer()
    annotations = AnnotationBasicSerializer(many=True)

    class Meta:
        model = Isoform
        fields = ['id', 'isoform_id', 'splicing', 'psi', 'gene', 'expression', 'protein', 'annotations']

class IsoformWriteSerializer(serializers.ModelSerializer):
    gene_id = serializers.PrimaryKeyRelatedField(queryset=Gene.objects)
    expression_id = serializers.PrimaryKeyRelatedField(queryset=Expression.objects)
    protein_id = serializers.PrimaryKeyRelatedField(queryset=Protein.objects)
    annotations = serializers.PrimaryKeyRelatedField(queryset=Annotation.objects, many=True)

    class Meta:
        model = Isoform
        fields = ['id', 'isoform_id', 'splicing', 'psi', 'gene_id', 'expression_id', 'protein_id', 'annotations']

    def create(self, validated_data):
        validated_data['gene_id'] = validated_data['gene_id'].id
        validated_data['expression_id'] = validated_data['expression_id'].id
        validated_data['protein_id'] = validated_data['protein_id'].id
        annotations = validated_data['annotations']
        del validated_data['annotations']
        isoform = Isoform.objects.create(**validated_data)
        isoform.annotations.set(annotations)
        return isoform


class FeatureSerializer(serializers.ModelSerializer):

    class Meta:
        model = Feature
        fields = ['id', 'feature_id', 'name', 'contig', 'start', 'end', 'strand', 'feature', 'sequence']


 
