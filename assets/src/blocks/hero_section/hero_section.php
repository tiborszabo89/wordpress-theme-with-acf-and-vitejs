<section class="hero-block">
  <div>
    <h1>
      <?php the_sub_field('hero_title') ?? ""; ?>
    </h1>
  </div>
    <div><?php the_sub_field('hero_content') ?? "" ; ?></div>
</section>