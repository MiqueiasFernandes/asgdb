<template>
  <Alert noclose color="dark">
    <Display>
      <span style="letter-spacing: -0.2rem">
        <em><strong>A</strong>lternative•<strong>S</strong>plicing</em>&nbsp;
        <strong>G</strong>enes
        <strong>D</strong>ata<strong>B</strong>ase
      </span>
      <Badge class="float-right" round>1.0</Badge></Display
    >
    <Display lead>
      DataBase for <strong>analise and discovery</strong> of non canonical
      splicing of genes. <br>Please cite <a href="#">this paper</a> to use.
    </Display>
    <hr />
    <Display class="col-8" lead>
      Current release includes <strong>234 organisms</strong> in plants, bacteria, mamalian and others,
      12321 genes, 23432 isoforms, <strong>2342 alternative isoforms</strong> of 323 experimental conditions. 
    </Display>
    <Button ico="binoculars" secondary lg>Find AS now</Button>
  </Alert>
</template>

<script>
export default {
  title: "Home",
};
</script>